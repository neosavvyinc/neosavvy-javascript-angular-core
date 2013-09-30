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
                        if (!attrs.hasOwnProperty('value')) {
                            throw 'You must provide an html value on the scope in order to bind inline html!';
                        } else {
                            var dereg = attrs.$observe('value', function (val) {
                              if (val) {
                                  var thing = $compile(element.replaceWith(val))(scope);
                                  dereg();
                              }
                              
                            });
                        }
                        
                    }
                }
            }]);
