describe("nsBootstrapDropdown", function () {
    var $rootScope,
        $scope,
        $compile,
        directiveScope,
        el,
        elWithLabelField,
        $body = $('body'),
        simpleHtml = '<ns-bootstrap-dropdown items="myItems" selected-item="mySelectedItem" link-class="shorty"></ns-bootstrap-dropdown>',
        labelFieldHtml = '<ns-bootstrap-dropdown items="myItems" label-field="age"></ns-bootstrap-dropdown>',
        disabledHtml = '<ns-bootstrap-dropdown items="myItems" disabled="1"></ns-bootstrap-dropdown>',
        disabledOtherHtml = '<ns-bootstrap-dropdown items="myItems" disabled="true"></ns-bootstrap-dropdown>';

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

        $scope.myItems = ["Glen Danzig", "Jerry Only", "Bobby Steele"];
        $scope.mySelectedItem = null;
        $scope.$digest();
    });

    afterEach(function () {
        $body.empty();
    });

    it("Should list out the items in the dropdown without a labelField", function () {
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

    it("Should set the element as the selected item when it is clicked within the dropdown", function () {
        var elements = el.find('ul').find('li');
        $(elements[1]).trigger("click");
        $scope.$digest();
        var toggle = el.find('.dropdown-toggle')[0];

        //Expectations
        expect($scope.mySelectedItem).toEqual("Jerry Only");
        expect(toggle.innerText).toEqual("Jerry Only");
    });

    it("Should set the attrs.innerLinkClass to the link at the base", function () {
        expect(el.find('.dropdown-toggle').hasClass('shorty')).toBeTruthy();
    });

    it("Should set scope._disabled if the disabled value is set to 1", function () {
        el = $compile(angular.element(disabledHtml))($scope);
        $scope.$digest();
        var toggle = el.find('.dropdown-toggle');
        expect(toggle.data('toggle')).toEqual('');
    });

    it("Should set scope._disabled if disabled value is set to true", function () {
        el = $compile(angular.element(disabledOtherHtml))($scope);
        $scope.$digest();
        var toggle = el.find('.dropdown-toggle');
        expect(toggle.data('toggle')).toEqual('');
    });
});