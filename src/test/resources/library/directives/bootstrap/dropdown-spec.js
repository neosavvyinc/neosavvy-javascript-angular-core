ddescribe("nsBootstrapDropdown", function () {
    var $rootScope,
        $scope,
        $compile,
        directiveScope,
        el,
        elWithLabelField,
        $body = $('body'),
        simpleHtml = '<ns-bootstrap-dropdown items="myItems"></ns-bootstrap-dropdown>',
        labelFieldHtml = '<ns-bootstrap-dropdown items="myItems" label-field="age"></ns-bootstrap-dropdown>';

    beforeEach(function () {
        module.apply(this, Neosavvy.AngularCore.Dependencies);

        inject(function ($injector, _$compile_) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $scope.myItems = [];
            el = $compile(angular.element(simpleHtml))($scope);
            elWithLabelField = $compile(angular.element(labelFieldHtml))($scope);
        });

        $body.append(el);
        $body.append(elWithLabelField);
        $rootScope.$digest();
    });

    afterEach(function () {
        $body.empty();
    });

    it("Should list out the items in the dropdown without a labelField", function () {
        $scope.myItems = ["Glen Danzig", "Jerry Only", "Bobby Steele"];
        $scope.$digest();
        var elements = el.find('ul').find('a');
        for (var i = 0; i < elements.length; i++) {
            expect(elements[i].innerText).toEqual($scope.myItems[i]);
        }
    });

    it("Should be able to list out the items int the dropdown with a labelField", function () {
        el = $compile(angular.element(labelFieldHtml))($scope);
        $scope.myItems = [{name: "Tony", age: 47}, {name: "Steve", age: 89}];
        $scope.$digest();
        var elements = el.find('ul').find('a');
        for (var i = 0; i < elements.length; i++) {
            expect(elements[i].innerText).toEqual(String($scope.myItems[i].age));
        }
    });
});