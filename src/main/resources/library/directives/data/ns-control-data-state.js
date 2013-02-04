'use strict'

/* Control Data, Neosavvy Inc.
 */

Neosavvy
    .Directives
    .directive('nsControlDataState', ['$injector',
    function ($injector) {
        return {
            restrict:'E',
            scope:{
                stateValue: "@",
                include: "@",
                exclude: "@"
            },
            compile:function (tElement, tAttrs) {
                console.log('Compiled');
                return function (scope, element, attrs) {
                    console.log("Linked");
                };
            }
        }
    }]);