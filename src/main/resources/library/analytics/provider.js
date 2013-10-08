(function (window, angular) {
    var controllers = {};

    function NsAnalyticsFactoryProvider() {
        this.$get = ['$injector', '$rootScope', function ($injector, $rootScope) {

            function _track(name, options, log) {
                if (log) {
                    log.push(JSON.stringify({name: name, options: options}));
                }
            }

            function _applyMethodTracking(item, methods, log) {
                if (item && methods) {
                    //Methods
                    for (var thing in item) {
                        //Methods
                        if (methods[thing] && typeof item[thing] === 'function' && thing !== 'constructor') {
                            var tracking = methods[thing];
                            var copy = angular.copy(item[thing]);
                            item[thing] = function () {
                                copy.apply(copy, arguments);
                                _track(tracking.name, tracking.options, log);
                            };
                        }
                    }

                }
            }

            function _applyWatcherTracking(scope, watches, log) {
                if (scope && scope.$$watchers && scope.$$watchers.length && watches) {
                    _.forEach(scope.$$watchers, function(watcher) {
                        if (watches[watcher.exp]) {
                            var tracking = watches[watcher.exp];
                            var copy = watcher.fn;
                            watcher.fn = function() {
                                copy.apply(copy, arguments);
                                _track(tracking.name, tracking.options, log);
                            };
                        }
                    });
                }
            }

            function _applyEventTracking(scope, listeners, log) {
                if (scope && scope.$$listeners && listeners) {
                    for (var eventStack in scope.$$listeners) {
                        if (listeners[eventStack] && scope.$$listeners[eventStack].length) {
                            var tracking = listeners[eventStack];
                            for (var i = 0; i < scope.$$listeners[eventStack].length; i++) {
                                var copy = scope.$$listeners[eventStack][i];
                                scope.$$listeners[eventStack][i] = function() {
                                    copy.apply(copy, arguments);
                                    _track(tracking.name, tracking.options, log);
                                };
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
                        _applyMethodTracking(myControllers[i].instance, methods, log);
                        //Watchers and listeners can be applied to a controller scope
                        _applyMethodTracking(myControllers[i].scope, methods, log);
                        _applyWatcherTracking(myControllers[i].scope, watches, log);
                        _applyEventTracking(myControllers[i].scope, listeners, log);
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