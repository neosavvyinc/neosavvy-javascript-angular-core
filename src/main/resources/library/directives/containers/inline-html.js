Neosavvy.AngularCore.Directives
    .directive('nsInlineHtml',
    ['$compile',
        function ($compile) {
            return {
                restrict:'E',
                template:'<div></div>',
                replace:true,
                scope:false,
                link:function (scope, element, attrs) {
                    var value = attrs.value || false;
                    if (!value) {
                        throw "You must provide an html value on the scope in order to bind inline html!";
                    }
                    var dereg = scope.$watch(value, function (value) {
                        if (value) {
                            element.replaceWith($compile(angular.element(value))(scope));
                            dereg();
                        }
                    });
                }
            }
        }]);