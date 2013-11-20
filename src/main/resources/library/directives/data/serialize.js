Neosavvy.AngularCore.Directives
    .directive('nsSerialize', ['$injector',
        function ($injector) {
            return {
                restrict: 'EA',
                scope: false,
                link: function (scope, element, attrs) {
                    if (attrs.data === undefined) {
                        throw "You must provide a data attribute for the nsSerialize directive!";
                    }
                    if (attrs.property === undefined) {
                        throw "nsSerialize requires a property to place the data into!";
                    }
                    var data = JSON.parse(attrs.data);
                    var item = attrs.inject ? $injector.get(attrs.inject) : scope;
                    var property = Neosavvy.Core.Utils.MapUtils.highPerformanceGet(item, attrs.property.replace(/\(.*\)/g, ""));
                    if (typeof property === 'function') {
                        property.call(property, data);
                    } else {
                        Neosavvy.Core.Utils.MapUtils.applyTo(item, attrs.property, data);
                    }
                    if (attrs.clean !== "false" && attrs.clean !== "0") {
                        element.removeAttr("data");
                    }
                }
            }
        }]);