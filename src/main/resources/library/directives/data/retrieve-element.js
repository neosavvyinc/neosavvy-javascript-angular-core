Neosavvy.AngularCore.Directives
    .directive('nsRetrieveElement',
    function () {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var property = attrs.nsRetrieveElement;
                if (Neosavvy.Core.Utils.StringUtils.isBlank(attrs.nsRetrieveElement)) {
                    throw "You must specify a property or function to retrive and element with ns-retrieve-element!";
                }
                property = property.replace(/\(.*\)|\(\)/g, "");
                var prop = Neosavvy.Core.Utils.MapUtils.highPerformanceGet(scope, property);
                if (typeof prop === "function") {
                    prop(element);
                } else {
                    Neosavvy.Core.Utils.MapUtils.applyTo(scope, property, element);
                }
            }
        }
    });