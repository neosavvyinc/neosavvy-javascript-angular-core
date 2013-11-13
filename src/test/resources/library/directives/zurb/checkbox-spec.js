ddescribe("nsZurbCheckbox", function () {
    var $rootScope,
        $scope,
        $compile,
        isolateScope,
        onClickSpy,
        el,
        $body = $('body'),
        simpleHtml = '<ns-zurb-checkbox label="I Agree to This!" ' +
            'on-click="onClickCheckBox(value)" ng-model="scopeBooleanValue" ' +
            'id="main-man"></ns-zurb-checkbox>';

    beforeEach(function () {
        module.apply(module, Neosavvy.AngularCore.Dependencies);

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');

            $scope = $rootScope.$new();
            $scope.scopeBooleanValue = false;
            onClickSpy = jasmine.createSpy("onClick");
            $scope.onClickCheckBox = function(value) {
                onClickSpy(value);
            };

            el = $compile(angular.element(simpleHtml))($scope);
            isolateScope = $scope.$$childHead;
        });

        $body.append(el);
        $scope.$digest();
    });

    afterEach(function() {
        $body.empty();
    });

    function zurbClick() {
        $('span.checkbox').addClass("checked");
        $('span.checkbox').click();
        $scope.$digest();
    }

    it("Should compile the element and add it to the dom", function () {
        expect($body.find('#main-man-checkbox').length).toEqual(1);
    });

    describe("Initialization", function () {
        it("Should set the isolateScope.id based on the attr.id", function () {
            expect(isolateScope.id).toEqual("main-man");
        });

        it("Should automatically choose a uuid for the scope.id if an id is not defined", function () {
            $compile(angular.element('<ns-zurb-checkbox label="I Agree to This!" ng-model="scopeBooleanValue"></ns-zurb-checkbox>'))($scope);
            var myIsolateScope = $scope.$$childTail;
            $scope.$digest();
            expect(myIsolateScope.id).toBeDefined();
            expect(myIsolateScope.id).not.toEqual("");
        });
    });

    describe("Action Handlers", function () {
        it("Should toggle the modelValue based on the class assigned to the span", function () {
            expect($scope.scopeBooleanValue).toBeFalsy();
            zurbClick();
            expect($scope.scopeBooleanValue).toBeTruthy();
        });

        it("Should not call the public onClick method if it is not defined", function () {
            $scope.onClickCheckBox = null;
            $scope.$digest();
            zurbClick();
            expect(onClickSpy).not.toHaveBeenCalled();
        });

        it("Should call the public onClick method when it is defined", function () {
            zurbClick();
            expect(onClickSpy).toHaveBeenCalledWith(true);
        });
    });

    describe("Watchers", function () {
        it("Should set the checkbox to checked class when the value is true", function () {
            expect($('span.checkbox').hasClass('checked')).toBeFalsy();
            $scope.scopeBooleanValue = true;
            $scope.$digest();
            expect($('span.checkbox').hasClass('checked')).toBeTruthy();
        });

        it("Should remove the checkbox checked class when the value is false", function () {
            $('span.checkbox').addClass('checked');
            $scope.scopeBooleanValue = true;
            $scope.$digest();
            $scope.scopeBooleanValue = false;
            $scope.$digest();
            expect($('span.checkbox').hasClass('checked')).toBeFalsy();
        });
    });
});