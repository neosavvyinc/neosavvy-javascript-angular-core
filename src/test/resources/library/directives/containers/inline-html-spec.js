describe('nsInlineHtml directive', function () {

    beforeEach(function() {
        module.apply(module, ['neosavvy.angularcore.directives']);
    });

    describe('sad path', function() {

        it('should throw an error if the value attribute is not set', inject(function($compile, $rootScope) {

            function errorWrapper () {
                $compile(angular.element('<ns-inline-html></ns-inline-html>'))($rootScope);
                $rootScope.$apply();
            }

            expect(errorWrapper).toThrow('You must provide an html value on the scope in order to bind inline html!');
        }));
    });

    describe('happy path', function() {

        var replaceWith = '<p>TACOS</p>',
            rootScope,
            compile,
            compiledElem;
        
        beforeEach(function() {
        
            inject(function($compile, $rootScope) {
                rootScope = $rootScope;
                rootScope.val = replaceWith;

                rootScope.$apply(function() {
                    compiledElem = $compile('<ns-inline-html value="{{val}}"></ns-inline-html>')(rootScope);
                });
            });
        });

        it('should replace the element with the expected text', function () {
            expect(compiledElem[0].attributes.class.value).toEqual('ng-scope');
            expect(compiledElem[0].attributes.value.value).toEqual(replaceWith);
        });

    });

});

