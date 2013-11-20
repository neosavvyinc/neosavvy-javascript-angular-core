ddescribe("nsSerialize", function () {
    var $rootScope,
        $scope,
        $compile,
        el,
        testValue,
        testFactory,
        $body = $('body'),
        simpleHtml = '<ns-serialize data="[{&quot;name&quot;:&quot;Mike&quot;},{&quot;name&quot;:&quot;George&quot;},{&quot;name&quot;:&quot;Skippy&quot;}]" property="myData.someData"></ns-serialize>',
        simpleMethodHtml = '<ns-serialize data="[{&quot;name&quot;:&quot;Mike&quot;},{&quot;name&quot;:&quot;George&quot;},{&quot;name&quot;:&quot;Skippy&quot;}]" property="myMethod(someData)"></ns-serialize>',
        simpleHtmlCleanFalse = '<ns-serialize data="[{&quot;name&quot;:&quot;Mike&quot;},{&quot;name&quot;:&quot;George&quot;},{&quot;name&quot;:&quot;Skippy&quot;}]" property="myData.someData" clean="false"></ns-serialize>',
        valHtml = '<ns-serialize inject="testValue" data="[{&quot;name&quot;:&quot;Tom&quot;},{&quot;name&quot;:&quot;Jerry&quot;},{&quot;name&quot;:&quot;Skippy&quot;}]" property="myData.someData"></ns-serialize>',
        factoryPropHtml = '<ns-serialize inject="testFactory" data="[{&quot;name&quot;:&quot;Tom&quot;},{&quot;name&quot;:&quot;Jerry&quot;},{&quot;name&quot;:&quot;Skippy&quot;}]" property="someProp"></ns-serialize>',
        factoryMethodHtml = '<ns-serialize inject="testFactory" data="[{&quot;name&quot;:&quot;Tom&quot;},{&quot;name&quot;:&quot;Jerry&quot;},{&quot;name&quot;:&quot;Skippy&quot;}]" property="callThisMethod()"></ns-serialize>',
        factoryArgMethodHtml = '<ns-serialize inject="testFactory" data="[{&quot;name&quot;:&quot;Tom&quot;},{&quot;name&quot;:&quot;Jerry&quot;},{&quot;name&quot;:&quot;Skippy&quot;}]" property="callThisMethod(data)"></ns-serialize>';

    beforeEach(function () {
        var m = angular.module('test', []);
        m.value('testValue', {
            myData: {
                someData: null
            }
        });
        m.factory('testFactory', function () {
            var myData = null;
            return {
                someProp: null,
                callThisMethod: function (data) {
                    if (arguments.length > 0) {
                        myData = data;
                    }
                    return myData;
                }
            };
        });

        module.apply(module, ["test"].concat(Neosavvy.AngularCore.Dependencies));

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $scope.myData = {someData: null};
            $scope.myMethod = jasmine.createSpy();
            $compile = $injector.get('$compile');
            testValue = $injector.get('testValue');
            testFactory = $injector.get('testFactory');
        });
    });

    it("Should throw an error if compiled without a data attribute", function () {
        expect(function () {
            $compile(angular.element('<ns-serialize property="george"></ns-serialize>'))($scope);
        }).toThrow();
    });

    it("Should throw an error if compiled without a property attribute", function () {
        expect(function () {
            $compile(angular.element('<ns-serialize data="{"name": "Dave"}"></ns-serialize>'))($scope);
        }).toThrow();
    });

    it("Should be able to put the value in the scope", function () {
        el = $compile(angular.element(simpleHtml))($scope);
        $body.append(el);
        $rootScope.$digest();
        expect($scope.myData.someData).toEqual([{name:"Mike"},{name:"George"},{name:"Skippy"}]);
        expect(el.attr("data")).toBeUndefined();
    });

    it("Should be able to call a method on the scope", function () {
        el = $compile(angular.element(simpleMethodHtml))($scope);
        $body.append(el);
        $rootScope.$digest();
        expect($scope.myMethod).toHaveBeenCalledWith([
            {name: "Mike"},
            {name: "George"},
            {name: "Skippy"}
        ]);
        expect(el.attr("data")).toBeUndefined();
    });

    it("Should be able to keep the directive from cleaning the attribute", function () {
        el = $compile(angular.element(simpleHtmlCleanFalse))($scope);
        $body.append(el);
        $rootScope.$digest();
        expect(el.attr("data")).toEqual(JSON.stringify([{name:"Mike"},{name:"George"},{name:"Skippy"}]));
    });

    it("Should be able to put the value in an injected value", function () {
        expect(testValue.myData.someData).toBeNull();
        el = $compile(angular.element(valHtml))($scope);
        $body.append(el);
        $rootScope.$digest();
        expect(testValue.myData.someData).toEqual([{name:"Tom"},{name:"Jerry"},{name:"Skippy"}]);
        expect(el.attr("data")).toBeUndefined();
    });

    it("Should be able to put the value in a factory", function () {
        expect(testFactory.someProp).toBeNull();
        el = $compile(angular.element(factoryPropHtml))($scope);
        $body.append(el);
        $rootScope.$digest();
        expect(testFactory.someProp).toEqual([{name:"Tom"},{name:"Jerry"},{name:"Skippy"}]);
        expect(el.attr("data")).toBeUndefined();
    });

    it("Should be able to apply the value as the first argument to a factory function", function () {
        expect(testFactory.callThisMethod()).toBeNull();
        el = $compile(angular.element(factoryMethodHtml))($scope);
        $body.append(el);
        $rootScope.$digest();
        expect(testFactory.callThisMethod()).toEqual([{name:"Tom"},{name:"Jerry"},{name:"Skippy"}]);
        expect(el.attr("data")).toBeUndefined();
    });

    it("Should be able to apply the value to the first argument of a factory function with an argument listed in the method", function () {
        expect(testFactory.callThisMethod()).toBeNull();
        el = $compile(angular.element(factoryArgMethodHtml))($scope);
        $body.append(el);
        $rootScope.$digest();
        expect(testFactory.callThisMethod()).toEqual([{name:"Tom"},{name:"Jerry"},{name:"Skippy"}]);
        expect(el.attr("data")).toBeUndefined();
    });

    afterEach(function () {
        $body.empty();
    });
});