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
                src: "="
            },
            compile:function (tElement, tAttrs, transclude) {
                var data;
                if (!tAttrs.src && tAttrs.injectSrc) {

                }

                return function (scope, element, attrs) {

                };
            }
        }
    }]);