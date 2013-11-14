describe("nsRequiredIfShown", function () {
    var $rootScope,
        $scope,
        el,
        ngModelController,
        $body = $('body'),
        simpleHtml = '<form name="myForm"><input class="my-input" ng-model="myViewModel"' +
            ' ng-show="myShowFlag" ns-required-if-shown test-controller></form>';

    beforeEach(function () {
        angular.module('test', []).directive('testController', function () {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {
                    ngModelController = ctrl;
                }
            };
        });

        module.apply(module, ['test'].concat(Neosavvy.AngularCore.Dependencies));

        inject(function ($injector, $compile) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $scope.myViewModel = '';
            $scope.myShowFlag = true;
            el = $compile(angular.element(simpleHtml))($scope);
        });

        $body.append(el);
        $rootScope.$digest();
    });

    afterEach(function () {
        $body.empty();
    });

    it("The setViewValue method should set the $modelValue to undefined when the element is blank", function () {
        expect(ngModelController.$modelValue).toEqual('');
        ngModelController.$setViewValue('');
        expect(ngModelController.$modelValue).toBeUndefined();
    });

    it("Should mark the input valid (regardless of contents) when it is not displayed", function () {
        el.hide();
        expect(ngModelController.$modelValue).toEqual('');
        ngModelController.$setViewValue('  ');
        expect(ngModelController.$modelValue).toEqual('  ');
        el.show();
    });

    it("Should mark a blank space as invalid when it is shown", function () {
        expect(ngModelController.$modelValue).toEqual('');
        ngModelController.$setViewValue('  ');
        expect(ngModelController.$modelValue).toBeUndefined();
    });

    it("Should mark a number as valid", function () {
        expect(ngModelController.$modelValue).toEqual('');
        ngModelController.$setViewValue(67);
        expect(ngModelController.$modelValue).toEqual(67);
    });
});