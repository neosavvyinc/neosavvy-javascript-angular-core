ddescribe('nsInlineHtml directive', function () {
    var $compile,
        $rootScope,
        compiledElem,
        elementHtml = '<ns-inline-html value="{{val}}"></ns-inline-html>',
        attributeHtml = '<div ns-inline-html value="{{val}}"></div>',
        attributeOtherHtml = '<div ns-inline-html="{{val}}"></p>';

    beforeEach(function () {
        module.apply(this, ['neosavvy.angularcore.directives']);

        inject(function (_$compile_, _$rootScope_) {
            $rootScope = _$rootScope_.$new();
            $compile = _$compile_;
        });
    });

    describe('happy path as element', function () {

        var replaceWith = '<p>TACOS</p>';

        it('should replace the element with the expected text', function () {
            compiledElem = $compile(angular.element(elementHtml))($rootScope);
            $rootScope.val = replaceWith;
            $rootScope.$digest();

            expect(compiledElem[0].attributes.class.value).toEqual('ng-scope');
            expect(compiledElem[0].attributes.value.value).toEqual(replaceWith);
        });

    });

    describe('happy path as attribute', function () {
        var replaceWith = '<p>TACOS Attribute</p>';

        beforeEach(function () {
            $rootScope.val = replaceWith;
        });

        it('should replace the element with the expected text', function () {
            compiledElem = $compile(angular.element(attributeHtml))($rootScope);
            $rootScope.$digest();

            expect(compiledElem[0].attributes.class.value).toEqual('ng-scope');
            expect(compiledElem[0].attributes.value.value).toEqual(replaceWith);
        });

        it("Should also play nice when the value is just applied to the actual attribute", function () {
            compiledElem = $compile(angular.element(attributeOtherHtml))($rootScope);
            $rootScope.$digest();

            expect(compiledElem[0].attributes.class.value).toEqual('ng-scope');
            expect(compiledElem[0].attributes.value.value).toEqual(replaceWith);
        });
    });


    describe('sad path', function () {

        it('should throw an error if the value attribute is not set', function () {

            expect(function () {
                $compile(angular.element('<ns-inline-html></ns-inline-html>'))($rootScope);
                $rootScope.$apply();
            }).toThrow('You must provide an html nsInlineHtml or value on the scope in order to bind inline html!');

        });
    });


});

