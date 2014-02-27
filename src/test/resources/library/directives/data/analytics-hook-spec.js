describe("nsAnalyticsHook", function () {
    var $rootScope,
        $scope,
        $compile,
        el,
        $body = $('body'),
        simpleHtml = '<input ns-analytics-hook="onContinue, keyup">My Label</input>',
        defaultHtml = '<a ns-analytics-hook="onContinueB">My Label</a>',
        multiArgumentHtml = '<span ns-analytics-hook="onContinueC, click, something, somethingElse.with.nest">My Span</span>';

    beforeEach(function () {
        module.apply(module, Neosavvy.AngularCore.Dependencies);

        inject(function ($injector, _$compile_) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $compile = _$compile_;
        });
    });

    afterEach(function () {
        $body.empty();
    });

    it("Should throw an error if no name for the hook is provided", function () {
        expect(function () {
            $compile('<button ns-analytics-hook>Greet</button>')($scope);
            $scope.$digest();
        }).toThrow();
    });

    describe("specify event", function () {
        beforeEach(function () {
            el = $compile(angular.element(simpleHtml))($scope);
            $body.append(el);
            $rootScope.$digest();

            if ($scope.onContinue) {
                $scope.onContinue = jasmine.createSpy("onContinue");
            }
        });

        it("Should be able to specify an event", function () {
            el.trigger('keyup')
            $scope.$digest();
            expect($scope.onContinue).toHaveBeenCalledWith();
        });

        it("Should create the dummy method on the scope", function () {
            expect($scope.onContinue).toBeDefined();
            expect(typeof $scope.onContinue).toEqual('function');
        });
    });

    describe("default", function () {
        beforeEach(function () {
            el = $compile(angular.element(defaultHtml))($scope);
            $body.append(el);
            $rootScope.$digest();

            if ($scope.onContinueB) {
                $scope.onContinueB = jasmine.createSpy("onContinueB");
            }
        });

        it("Should create the dummy method on the scope", function () {
            el.trigger('click')
            $scope.$digest();
            expect($scope.onContinueB).toHaveBeenCalledWith();
        });

        it("Should be able to use the click event by default", function () {
            expect($scope.onContinueB).toBeDefined();
            expect(typeof $scope.onContinueB).toEqual('function');
        });
    });

    describe("additional arguments", function () {

        beforeEach(function () {
            el = $compile(angular.element(multiArgumentHtml))($scope);
            $body.append(el);
            $rootScope.$digest();

            $scope.onContinueC = jasmine.createSpy("onContinueC");

            //Set properties on $scope
            $scope.something = 55;
            $scope.somethingElse = {with: {nest: 89}};
        });

        it("Should send up any additional arguments from the scope", function () {
            el.trigger('click');
            $scope.$digest();
            expect($scope.onContinueC).toHaveBeenCalledWith(55, 89);
        });

    });
});