/**
 * @ngdoc directive
 * @name neosavvy.angularcore.directives.directive:nsStaticInclude
 * @description A way to include an external template without creating new scopes, using demand loading, or on a timeout.
 * @restrict E
 * @example
 *
 * This will render out the template by making the request via http or $templateCache. It will completely replace the prior div, inline.
 * <pre>
 * <ns-static-include src="some/path/to/my/template.html"></ns-static-include>
 * </pre>
 *
 * This will wait for 1000 ms before making the request and then completing the render cycle of the template.
 * <pre>
 * <ns-static-include src="some/path/to/my/template.html" wait-for="1000"></ns-static-include>
 * </pre>
 *
 * This will wait till the someFlag property on scope is returning true in an if statement (true, 1, not null, not false).
 * Like the wait-for property, it will wait to make the template call and render until the flag is flipped.
 * <pre>
 * <ns-static-include src="some/path/to/my/template.html" watch-wait-for="someFlag"></ns-static-include>
 * </pre>
 */
Neosavvy.AngularCore.Directives
    .directive('nsStaticInclude',
    ['$http', '$templateCache', '$compile',
        function ($http, $templateCache, $compile) {
            return {
                restrict:'E',
                template:'<div></div>',
                replace:true,
                scope:false,
                compile:function (tElement, tAttrs) {
                    if (_.isEmpty(tAttrs.src)) {
                        throw "You must pass in a source to render a Neosavvy static include directive.";
                    }

                    var waitFor = tAttrs.waitFor,
                        watchWaitFor = tAttrs.watchWaitFor,
                        waitForRender = tAttrs.waitForRender,
                        watchWaitForRender = tAttrs.watchWaitForRender;

                    //If there are no 'waiting' indicators, warm up the cache, by requesting the template
                    if (_.isEmpty(waitFor) && _.isEmpty(watchWaitFor)) {
                        $http.get(tAttrs.src, {cache:$templateCache});
                        if (!_.isEmpty(watchWaitForRender)) {
                            watchWaitFor = watchWaitForRender;
                        } else if (!_.isEmpty(waitForRender)) {
                            waitFor = waitForRender;
                        }
                    }

                    //Return link function
                    return function (scope, element, attrs) {
                        var replace = function (result) {
                            element.replaceWith($compile(angular.element(result.data))(scope));
                        };
                        var dereg, request = function (val) {
                            $http.get(attrs.src, {cache:$templateCache}).then(replace);
                            if (dereg) {
                                dereg();
                            }
                        };

                        if (!_.isEmpty(watchWaitFor)) {
                            dereg = scope.$watch(watchWaitFor, function(val) {
                                 if(angular.isDefined(val)) {
                                      request();
                                 }
                                 
                            });
                        }
                        else if (!_.isEmpty(waitFor) && parseFloat(waitFor) > 0) {
                            setTimeout(request, parseFloat(waitFor));
                        } else {
                            request();
                        }

                    };
                }
            }
        }]);
