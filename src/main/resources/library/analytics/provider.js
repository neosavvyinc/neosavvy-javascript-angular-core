(function (window, angular) {
    var controllers = {};
    var newInstantiatedController;

    function NsAnalyticsFactoryProvider() {
        var config = {delay: 1000};
        var ALL_SCOPE_REGEX = /{{\$scope\..*?}}/g,
            SCOPE_REPLACE_REGEX = /({{\$scope\.|}})/g,
            ALL_CONTROLLER_REGEX = /{{\$controller\..*?}}/g,
            CONTROLLER_REPLACE_REGEX = /({{\$controller\.|}})/g,
            ALL_ARGS_REGEX = /{{arguments\[\d\]}}/g;

        this.config = function (options) {
            if (options && typeof options === 'object' && options.callBack) {
                config = _.merge(config, options);
            } else {
                throw "nsAnalytics needs a config object with a callback defined as a single function or an array.";
            }
        };

        this.$get = ['$injector', '$rootScope', function ($injector, $rootScope) {
            var CONTROLLER_DESIGNATION = '$controller',
                SCOPE_DESIGNATION = '$scope',
                DESIGNATION_TO_PROPERTIES = {'$controller': 'instance', '$scope': 'scope'},
                hashedTrackingStrings = {};

            function _track(item, uniqueId, parentArguments, log) {
                //Name, Options: $scope, $controller, and arguments[x] variables
                var tracking = JSON.parse(hashedTrackingStrings[uniqueId].
                    replace(ALL_SCOPE_REGEX,function (match) {
                        return Neosavvy.Core.Utils.MapUtils.highPerformanceGet(item.scope, match.replace(SCOPE_REPLACE_REGEX, ""));
                    }).
                    replace(ALL_CONTROLLER_REGEX,function (match) {
                        return Neosavvy.Core.Utils.MapUtils.highPerformanceGet(item.instance, match.replace(CONTROLLER_REPLACE_REGEX, ""));
                    }).
                    replace(ALL_ARGS_REGEX, function (match) {
                        return parentArguments[parseInt(match.match(/\d/)[0])];
                    }));

                if (config.callBack) {
                    if (_.isArray(config.callBack)) {
                        for (var i = 0; i < config.callBack.length; i++) {
                            config.callBack[i](tracking.name, tracking.options);
                        }
                    } else {
                        config.callBack(tracking.name, tracking.options);
                    }
                }

                if (log) {
                    log.push(JSON.stringify({name: tracking.name, options: tracking.options}));
                }
            }

            function _chooseTrackingDelay(item, tracking, parentArguments, delay, log) {
                if (delay <= 0) {
                    _track(item, tracking, parentArguments, log);
                } else {
                    setTimeout(function () {
                        _track(item, tracking, parentArguments, log);
                    }, delay);
                }
            }

            function _applyMethodTracking(item, designation, methods, delay, log) {
                if (item && methods) {
                    var particularItem = item[DESIGNATION_TO_PROPERTIES[designation]];
                    if (particularItem) {
                        for (var thing in particularItem) {
                            //Methods
                            if (methods[thing] && typeof particularItem[thing] === 'function' && thing !== 'constructor') {
                                var uniqueId = uuid.v1();
                                hashedTrackingStrings[uniqueId] = JSON.stringify(methods[thing]);
                                var copy = angular.copy(particularItem[thing]);
                                particularItem[thing] = function () {
                                    copy.apply(copy, arguments);
                                    _chooseTrackingDelay(item, uniqueId, arguments, delay, log);
                                };
                            }
                        }
                    }
                }
            }

            function _applyWatcherTracking(item, designation, watches, delay, log) {
                if (item && watches) {
                    var scope = item[DESIGNATION_TO_PROPERTIES[designation]];
                    if (scope) {
                        if (scope && scope.$$watchers && scope.$$watchers.length) {
                            _.forEach(scope.$$watchers, function (watcher) {
                                if (watches[watcher.exp]) {
                                    var uniqueId = uuid.v1();
                                    hashedTrackingStrings[uniqueId] = JSON.stringify(watches[watcher.exp]);
                                    var copy = watcher.fn;
                                    watcher.fn = function () {
                                        copy.apply(copy, arguments);
                                        _chooseTrackingDelay(item, uniqueId, arguments, delay, log);
                                    };
                                }
                            });
                        }
                    }
                }
            }

            function _applyEventTracking(item, designation, listeners, delay, log) {
                if (item && listeners) {
                    var scope = item[DESIGNATION_TO_PROPERTIES[designation]];
                    if (scope && scope.$$listeners) {
                        for (var eventStack in scope.$$listeners) {
                            if (listeners[eventStack] && scope.$$listeners[eventStack].length) {
                                var uniqueId = uuid.v1();
                                hashedTrackingStrings[uniqueId] = JSON.stringify(listeners[eventStack]);
                                for (var i = 0; i < scope.$$listeners[eventStack].length; i++) {
                                    var copy = scope.$$listeners[eventStack][i];
                                    scope.$$listeners[eventStack][i] = function () {
                                        copy.apply(copy, arguments);
                                        _chooseTrackingDelay(item, uniqueId, arguments, delay, log);
                                    };
                                }
                            }
                        }
                    }
                }
            }

            function _applyAllTracking(item, methods, watches, listeners, delay, log) {
                //Watchers and listeners cannot be applied to a controller instance
                _applyMethodTracking(item, CONTROLLER_DESIGNATION, methods, delay, log);
                //Watchers and listeners can be applied to a controller scope
                _applyMethodTracking(item, SCOPE_DESIGNATION, methods, delay, log);
                _applyWatcherTracking(item, SCOPE_DESIGNATION, watches, delay, log);
                _applyEventTracking(item, SCOPE_DESIGNATION, listeners, delay, log);
            }

            var instantiatedAnalytics = {};

            function nsAnalyticsFactory(injectedName, methods, watches, listeners, delay, log) {
                var myControllers = controllers[injectedName];
                delay = delay || delay === 0 ? delay : config.delay;
                if (newInstantiatedController) {
                    if (instantiatedAnalytics[injectedName] && instantiatedAnalytics[injectedName].length) {
                        for (var i = 0; i < instantiatedAnalytics[injectedName].length; i++) {
                            var args = instantiatedAnalytics[injectedName][i];
                            _applyAllTracking(newInstantiatedController, args.methods, args.watches, args.listeners, args.delay, args.log);
                        }
                    }
                }
                else if (myControllers && myControllers.length) {
                    for (var i = 0; i < myControllers.length; i++) {
                        _applyAllTracking(myControllers[i], methods, watches, listeners, delay, log);
                    }
                    if (methods || watches || listeners) {
                        //Newly instantiated controllers, getting them up to speed
                        instantiatedAnalytics[injectedName] = instantiatedAnalytics[injectedName] || [];
                        instantiatedAnalytics[injectedName].push({methods: methods, watches: watches, listeners: listeners, delay: delay, log: log});
                    }
                }
            }

            //Always clear this out after a run
            newInstantiatedController = null;

            return nsAnalyticsFactory;
        }];
    }

    function ngControllerDirective(nsAnalyticsFactory) {
        var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        return {
            scope: false,
            priority: -100,
            require: 'ngController',
            link: function (scope, element, attrs, ctrl) {
                //matches[1] is the controller name matches[3] is the name in the DOM
                var matches = attrs.ngController.match(CNTRL_REG);
                var name = matches[1];
                controllers[name] = controllers[name] || [];
                controllers[name].push({scope: scope, instance: ctrl});

                //Get the new controller up to speed
                newInstantiatedController = {scope: scope, instance: ctrl};
                nsAnalyticsFactory(name);
                newInstantiatedController = null;
            }
        }
    }

    angular.module('neosavvy.angularcore.analytics').provider('nsAnalyticsFactory', NsAnalyticsFactoryProvider);
    angular.module('neosavvy.angularcore.analytics').directive('ngController', ['nsAnalyticsFactory', ngControllerDirective]);
})(window, window.angular);