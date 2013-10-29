describe("nsControllers", function () {
    var nsControllers,
        simpleHtmlA = '<div id="my-controller" ng-controller="TestController"></div>',
        simpleHtmlB = '<div ng-controller="OtherTestController as OTCtrl"></div>',
        simpleHtmlC = '<p id="your-controller" ng-controller="TestController as TCtrl"></p>',
        $scopeA, $scopeB, $scopeC, elA, elB, elC, $compile, $rootScope;

    beforeEach(function () {
        angular.module('testcontrollers', []).controller('TestController',
            ['$scope', function ($scope) {
                this.testInstanceMethod = function () {

                };

                $scope.testValue = 88;
            }]);

        angular.module('testcontrollers').controller('OtherTestController',
            ['$scope', function ($scope) {
                $scope.testScopeMethod = function () {

                };

                this.testValue = "Mike!";
            }]);

        module.apply(module, ['testcontrollers'].concat(Neosavvy.AngularCore.Dependencies));

        inject(function ($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            nsControllers = $injector.get('nsControllers');
            $scopeA = $rootScope.$new();
            $scopeB = $rootScope.$new();
            $scopeC = $rootScope.$new();
        });

    });

    describe("Dom Controllers", function () {

        beforeEach(function() {
            elA = $compile(angular.element(simpleHtmlA))($scopeA);
            elB = $compile(angular.element(simpleHtmlB))($scopeB);
            elC = $compile(angular.element(simpleHtmlC))($scopeC);

            $('body').append(elA);
            $('body').append(elB);
            $('body').append(elC);
            $rootScope.$digest();
        });

        describe("get", function () {
            it("Should return all the controllers when called with no arguments", function () {
                expect(_.keys(nsControllers.get()).length).toEqual(2);
                expect(nsControllers.get()['TestController']).toBeDefined();
                expect(nsControllers.get()['TestController'].length).toEqual(2);

                for (var i = 0; i < nsControllers.get()['TestController'].length; i++) {
                    var obj = nsControllers.get()['TestController'][i];
                    expect(obj.instance).toBeDefined();
                    expect(obj.scope).toBeDefined();
                    expect(obj.instance.testInstanceMethod).toBeDefined();
                    expect(typeof obj.instance.testInstanceMethod).toEqual('function');
                    expect(obj.scope.testValue).toEqual(88);
                }

                expect(nsControllers.get()['OtherTestController']).toBeDefined();
                expect(nsControllers.get()['OtherTestController'].length).toEqual(1);

                for (var i = 0; i < nsControllers.get()['OtherTestController'].length; i++) {
                    var obj = nsControllers.get()['OtherTestController'][i];
                    expect(obj.instance).toBeDefined();
                    expect(obj.scope).toBeDefined();
                    expect(obj.scope.testScopeMethod).toBeDefined();
                    expect(typeof obj.scope.testScopeMethod).toEqual("function");
                    expect(obj.instance.testValue).toEqual("Mike!");
                }
            });

            it("Should throw an error when called with an invalid controller name", function () {
                expect(function () {
                    nsControllers.get('NotAnotherControllerName');
                }).toThrow();
            });

            it("Should return the array of controllers with a certain name when called with a valid name", function () {
                expect(nsControllers.get("TestController").length).toEqual(2);

                for (var i = 0; i < nsControllers.get("TestController").length; i++) {
                    var obj = nsControllers.get("TestController")[i];
                    expect(obj.instance).toBeDefined();
                    expect(obj.scope).toBeDefined();
                    expect(obj.instance.testInstanceMethod).toBeDefined();
                    expect(typeof obj.instance.testInstanceMethod).toEqual('function');
                    expect(obj.scope.testValue).toEqual(88);
                }
            });
        });

        describe("getById", function () {
            it("Should return a controller defined with the specified id", function () {
                var obj = nsControllers.getById('TestController', 'my-controller');
                expect(obj.instance).toBeDefined();
                expect(obj.scope).toBeDefined();
                expect(obj.id).toEqual('my-controller');
                expect(obj.instance.testInstanceMethod).toBeDefined();
                expect(typeof obj.instance.testInstanceMethod).toEqual('function');
                expect(obj.scope.testValue).toEqual(88);
            });

            it("Should throw an error if called with an id that has not been instantiated", function () {
                expect(function () {
                    nsControllers.getById('TestController', 'not-my-controller');
                }).toThrow();
            });

            it("Should throw an error if called with no arguments", function () {
                expect(function () {
                    nsControllers.getById();
                }).toThrow();
            });
        });

        describe("getByScope", function () {

            it("Should return the controller with the specified scope if passed in a scope object", function () {
                var obj = nsControllers.getByScope($scopeB.$$childHead);
                expect(obj.instance).toBeDefined();
                expect(obj.scope).toBeDefined();
                expect(obj.scope.testScopeMethod).toBeDefined();
                expect(typeof obj.scope.testScopeMethod).toEqual("function");
                expect(obj.instance.testValue).toEqual("Mike!");
            });

            it("Should return the controller with the $id if passed in a id object", function () {
                var obj = nsControllers.getByScope($scopeC.$$childHead.$id);
                expect(obj.instance).toBeDefined();
                expect(obj.scope).toBeDefined();
                expect(obj.instance.testInstanceMethod).toBeDefined();
                expect(typeof obj.instance.testInstanceMethod).toEqual('function');
                expect(obj.scope.testValue).toEqual(88);
            });

            it("Should throw an error when passed a scope that does not live on a controller", function () {
                expect(function () {
                    nsControllers.getByScope("90HJ++");
                }).toThrow();
            });

            it("Should throw an error when passed nothing", function () {
                expect(function () {
                    nsControllers.getByScope();
                }).toThrow();
            });
        });

        describe("getLast", function () {
            it("Should return the last instantiated controller", function () {
                var obj = nsControllers.getLast();
                expect(obj.instance).toBeDefined();
                expect(obj.scope).toBeDefined();
                expect(obj.instance.testInstanceMethod).toBeDefined();
                expect(typeof obj.instance.testInstanceMethod).toEqual('function');
                expect(obj.scope.testValue).toEqual(88);
                expect(obj.scope.TCtrl).toEqual(obj.instance);
            });

            it("Should put a name key in the hash for the new instantiated controller", function () {
                var obj = nsControllers.getLast();
                expect(obj.name).toEqual("TestController");
            });
        });

        afterEach(function () {
            $('body').empty();
        });
    });

});