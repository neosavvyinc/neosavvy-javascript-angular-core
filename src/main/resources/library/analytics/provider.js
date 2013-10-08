(function (window, angular) {
    var controllers = {};

    function NsAnalyticsFactoryProvider() {
        this.$get = ['$injector', '$rootScope', function ($injector, $rootScope) {
            var CONTROLLER_DESIGNATION = '$controller',
                SCOPE_DESIGNATION = '$scope',
                DESIGNATION_TO_PROPERTIES = {'$controller': 'instance', '$scope': 'scope'};

            var _regexFromDesignation = memoize(function(designation) {
                return new RegExp("{{" + designation.replace(/\$/g, "\\$") + "\..*}}", "g");
            });

            var _dRegexFromDesignation = memoize(function (designation) {
                return new RegExp("(" + designation.replace(/\$/g, "\\$") + "\.|{{|}})", "g");
            });

            function _track(item, name, options, parentArguments, log) {
                _.forEach(DESIGNATION_TO_PROPERTIES, function(val, key) {
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

                //Tracking methods called here

                if (log) {
                    log.push(JSON.stringify({name: name, options: options}));
                }
            }

            function _applyMethodTracking(item, designation, methods, log) {
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
                                    _track(item, tracking.name, tracking.options, arguments, log);
                                };
                            }
                        }
                    }
                }
            }

            function _applyWatcherTracking(item, designation, watches, log) {
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
                                        _track(item, tracking.name, tracking.options, arguments, log);
                                    };
                                }
                            });
                        }
                    }
                }
            }

            function _applyEventTracking(item, designation, listeners, log) {
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
                                        _track(item, tracking.name, tracking.options, arguments, log);
                                    };
                                }
                            }
                        }
                    }
                }
            }

            function nsAnalyticsFactory(injectedName, methods, watches, listeners, log) {
                var myControllers = controllers[injectedName];
                if (myControllers && myControllers.length) {
                    for (var i = 0; i < myControllers.length; i++) {
                        //Watchers and listeners cannot be applied to a controller instance
                        _applyMethodTracking(myControllers[i], CONTROLLER_DESIGNATION, methods, log);
                        //Watchers and listeners can be applied to a controller scope
                        _applyMethodTracking(myControllers[i], SCOPE_DESIGNATION, methods, log);
                        _applyWatcherTracking(myControllers[i], SCOPE_DESIGNATION, watches, log);
                        _applyEventTracking(myControllers[i], SCOPE_DESIGNATION, listeners, log);
                    }
                }
            }

            return nsAnalyticsFactory;
        }];
    }

    function ngControllerDirective() {
        var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        return {
            scope: false,
            priority: -100,
            require: 'ngController',
            link: function (scope, element, attrs, ctrl) {
                //matches[1] is the controller name matches[3] is the name in the DOM
                var matches = attrs.ngController.match(CNTRL_REG);
                controllers[matches[1]] = controllers[matches[1]] || [];
                controllers[matches[1]].push({scope: scope, instance: ctrl});
            }
        }
    }

    angular.module('neosavvy.angularcore.analytics').provider('nsAnalyticsFactory', NsAnalyticsFactoryProvider);
    angular.module('neosavvy.angularcore.analytics').directive('ngController', ngControllerDirective);
})(window, window.angular);