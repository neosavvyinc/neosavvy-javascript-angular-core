Neosavvy.AngularCore.Directives
    .directive('nsAnalyticsHook',
    function () {
        return {
            restrict: 'A',
            priority: 1000,
            link: function (scope, element, attrs) {
                if (Neosavvy.Core.Utils.StringUtils.isBlank(attrs.nsAnalyticsHook)) {
                    throw "You must provide a name for your analytics hook.";
                }
                var ar = attrs.nsAnalyticsHook.split(",");
                var fnName = ar[0].trim();
                var event = "click";
                if (ar.length > 1) {
                    event = ar[1].trim();
                }
                var propArgs = [];
                if (ar.length > 2) {
                    for (var i = 2; i < ar.length; i++) {
                        propArgs.push(ar[i].trim());
                    }
                }
                scope[fnName] = scope[fnName] || new Function();
                element.bind(event, function () {
                    scope.$apply(function () {
                        scope[fnName].apply(this, _.map(propArgs, function (arg) {
                            return Neosavvy.Core.Utils.MapUtils.highPerformanceGet(scope, arg);
                        }));
                    });
                })
            }
        }
    });