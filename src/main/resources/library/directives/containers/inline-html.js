Neosavvy.AngularCore.Directives
    .directive('nsInlineHtml',
        ['$compile',
            function ($compile) {
                return {
                    restrict:'ECA',
                    template:'<div></div>',
                    replace:true,
                    scope:false,
                    link:function (scope, element, attrs) {
                        var dereg, watchStatement = function (val) {
                            if (val) {
                                var thing = $compile(element.replaceWith(val))(scope);
                                dereg();
                            }
                        };

                        if (attrs.nsInlineHtml !== undefined) {
                            dereg = attrs.$observe('nsInlineHtml', watchStatement);
                        } else if (attrs.value !== undefined) {
                            dereg = attrs.$observe('value', watchStatement);
                        } else {
                            throw 'You must provide an html nsInlineHtml or value on the scope in order to bind inline html!';
                        }
                    }
                }
            }]);
