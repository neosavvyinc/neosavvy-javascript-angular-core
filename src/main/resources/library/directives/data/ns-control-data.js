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
            },
            compile:function (tElement, tAttrs) {
                var data;
                if (tAttrs.src) {

                } else if (tAttrs.injectSrc) {

                }

                return function (scope, element, attrs) {

                };
            }
        }
    }]);