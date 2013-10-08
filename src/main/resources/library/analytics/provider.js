(function (window, angular) {
    var controllers = {};
    var newInstantiatedController;

    function NsAnalyticsFactoryProvider() {
        var config = {delay: 1000};

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
                DESIGNATION_TO_PROPERTIES = {'$controller': 'instance', '$scope': 'scope'};

            var _regexFromDesignation = memoize(function (designation) {
                return new RegExp("{{" + designation.replace(/\$/g, "\\$") + "\..*}}", "g");
            });

            var _dRegexFromDesignation = memoize(function (designation) {
                return new RegExp("(" + designation.replace(/\$/g, "\\$") + "\.|{{|}})", "g");
            });

            function _track(item, name, options, parentArguments, log) {
                _.forEach(DESIGNATION_TO_PROPERTIES, function (val, key) {
                    var re = _regexFromDesignation(key);
                    var dre = _dRegexFromDesignation(key);
                    var are = /{{arguments\[\d\]}}/;

                    //Name, $scope & $controller variables
                    var match = String(name).match(re);
                    if (match && match.length) {
                        for (var i = 0; i < match.length; i++) {
                            name = name.replace(re, Neosavvy.Core.Utils.MapUtils.get(item[val], match[i].replace(dre, "")));
                        }
                    }
                    //Name, arugment variables
                    match = String(name).match(are);
                    if (match && match.length) {
                        for (var i = 0; i < match.length; i++) {
                            var argIndex = parseInt(match[i].replace(/({{arguments\[|\]}})/g, ""));
                            name = name.replace(match[i], parentArguments[argIndex]);
                        }
                    }

                    //Options
                    _.forEach(options, function (subVal, subKey) {
                        var match = String(subVal).match(re);
                        if (match && match.length) {
                            for (var i = 0; i < match.length; i++) {
                                options[subKey] = String(subVal).replace(match[i], Neosavvy.Core.Utils.MapUtils.get(item[val], match[i].replace(dre, "")));
                            }
                        }
                        match = String(subVal).match(are);
                        if (match && match.length) {
                            for (var i = 0; i < match.length; i++) {
                                var argIndex = parseInt(match[i].replace(/({{arguments\[|\]}})/g, ""));
                                options[subKey] = String(subVal).replace(match[i], parentArguments[argIndex]);
                            }
                        }
                    });
                });

                if (config.callBack) {
                    if (_.isArray(config.callBack)) {
                        _.forEach(config.callBack, function (callBack) {
                            callBack(name, options);
                        });
                    } else {
                        config.callBack(name, options);
                    }
                }

                if (log) {
                    log.push(JSON.stringify({name: name, options: options}));
                }
            }

            function _chooseTrackingDelay(item, name, options, parentArguments, delay, log) {
                if (delay <= 0) {
                    _track(item, name, options, parentArguments, log);
                } else {
                    setTimeout(function () {
                        _track(item, name, options, parentArguments, log);
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
                                var tracking = methods[thing];
                                var copy = angular.copy(particularItem[thing]);
                                particularItem[thing] = function () {
                                    copy.apply(copy, arguments);
                                    _chooseTrackingDelay(item, tracking.name, tracking.options, arguments, delay, log);
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
                                    var tracking = watches[watcher.exp];
                                    var copy = watcher.fn;
                                    watcher.fn = function () {
                                        copy.apply(copy, arguments);
                                        _chooseTrackingDelay(item, tracking.name, tracking.options, arguments, delay, log);
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
                                var tracking = listeners[eventStack];
                                for (var i = 0; i < scope.$$listeners[eventStack].length; i++) {
                                    var copy = scope.$$listeners[eventStack][i];
                                    scope.$$listeners[eventStack][i] = function () {
                                        copy.apply(copy, arguments);
                                        _chooseTrackingDelay(item, tracking.name, tracking.options, arguments, delay, log);
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