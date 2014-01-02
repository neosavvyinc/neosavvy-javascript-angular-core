describe("nsRetrieveElement", function () {
    var $rootScope,
        $scope,
        $compile,
        el,
        localElement,
        $body = $('body'),
        simpleHtml = '<input class="my-special-element" ns-retrieve-element="someObject.someProp">',
        fnAHtml = '<p class="my-fn-special-element" ns-retrieve-element="someOtherFn"></p>',
        fnBHtml = '<p class="my-fn-special-element" ns-retrieve-element="someOtherFn()"></p>',
        otherFnHtml = '<p class="my-fn-special-element" ns-retrieve-element="someObject.someFn(element)"></p>';

    beforeEach(function () {
        module.apply(this, Neosavvy.AngularCore.Dependencies);

        inject(function ($injector, _$compile_) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $scope.someOtherFn = jasmine.createSpy();
            $scope.someObject = {
                someProp: null,
                someFn: jasmine.createSpy()
            };
            $compile = _$compile_;
            el = $compile(angular.element(simpleHtml))($scope);
        });

        $body.append(el);
        $rootScope.$digest();
    });

    it("Should thow an error if the element is compiled without a property on the nsRetrieveElement", function () {
        expect(function () {
            $compile(angular.element('<a ns-retrieve-element>Hello</a>'))($scope);
        }).toThrow();
    });

    it("Should throw an error when asked to apply a dot property whose structure does not exist", function () {
        expect(function () {
            $compile(angular.element('<a ns-retrieve-element="doesNotExist.otherProperty">Hello</a>'))($scope);
        }).toThrow();
    });

    it("Should use a function as a setter when it is not written in function notation", function () {
        el = $compile(angular.element(fnAHtml))($scope);
        $body.append(el);
        expect($scope.someOtherFn).toHaveBeenCalled();
    });

    it("Should use a function as a setter without any arguments in the param", function () {
        el = $compile(angular.element(fnBHtml))($scope);
        $body.append(el);
        expect($scope.someOtherFn).toHaveBeenCalled();
    });

    it("Should use a function as a setter with arguments (they are ignored, essentially)", function () {
        el = $compile(angular.element(otherFnHtml))($scope);
        $body.append(el);
        expect($scope.someObject.someFn).toHaveBeenCalled();
    });

    it("Should be able to set the property on scope", function () {
        expect($scope.someObject.someProp[0]).toEqual(el[0]);
    });

    afterEach(function () {
        $body.empty();
    });
});