'use strict'

/* Control Data, Neosavvy Inc.
 */

Neosavvy
    .Directives
    .directive('nsControlData', ['$injector',
    function ($injector) {
        return {
            restrict:'E',
            scope:{
                stateObject: "=",
                stateProperty: "@"
            },
            compile:function (tElement, tAttrs, transclude) {
                var data;
                if (!tAttrs.src && tAttrs.injectSrc) {

                }

                return function (scope, element, attrs) {
                    console.log("Linked");
                };
            }
        }
    }]);