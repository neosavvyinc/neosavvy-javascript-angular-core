(function (window, angular) {
    var controllers = {};

    function NsAnalyticsFactoryProvider() {
        this.$get = ['$injector', '$rootScope', function ($injector, $rootScope) {

            function _track(name, options, log) {
                console.log("Tracking event " + name + " called!");
                if (log) {
                    log.push(JSON.stringify({name: name, options: options}));
                }
            }

            function _applyTracking(item, methods, watches, listeners, log) {
                if (item) {
                    for (var thing in item) {
                        if (methods[thing] && typeof item[thing] === 'function' && thing !== 'constructor') {
                            var tracking = methods[thing];
                            var copy = angular.copy(item[thing]);
                            item[thing] = function () {
                                copy.apply(copy, arguments);
                                _track(tracking.name, tracking.options, log);
                            };
                            console.log("AFTER METHOD " + item[thing]);
                        }
                    }
                }
            }

            function nsAnalyticsFactory(injectedName, methods, watches, listeners, log) {
                var myControllers = controllers[injectedName];
                if (myControllers && myControllers.length) {
                    for (var i = 0; i < myControllers.length; i++) {
                        _applyTracking(myControllers[i].instance, methods, watches, listeners, log);
                        _applyTracking(myControllers[i].scope, methods, watches, listeners, log);
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