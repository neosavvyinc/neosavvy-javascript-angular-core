describe("nsAnalyticsFactory", function () {
    var $$injector,
        $rootScope,
        $scope,
        $compile,
        controller,
        directive,
        analyticsFactory,
        simpleControllerHtml = '<div ng-controller="view.controllers.TestController as ctrl">' +
            '<a class="b" ng-click="ctrl.someMethodB()">Text</a>' +
            '<span class="c" ng-click="someMethodC()"></span>' +
            '</div>',
        el,
        log,
        callBackSpy,
        myNsAnalyticsFactoryProvider;

    beforeEach(function () {
        callBackSpy = jasmine.createSpyObj('callBackSpy', ['callBack1', 'callBack2', 'callBack3']);
        angular.module('testcontrollers', []).config([
            'nsAnalyticsFactoryProvider',
            function (nsAnalyticsFactoryProvider) {
                myNsAnalyticsFactoryProvider = nsAnalyticsFactoryProvider;
                //Should throw an error when provided a config that is undefined
                expect(function () {
                    nsAnalyticsFactoryProvider.config(undefined);
                }).toThrow();

                //Should throw an error when provided a config that is null
                expect(function () {
                    nsAnalyticsFactoryProvider.config(null);
                }).toThrow();

                //Should throw an error when provided a config that is not an object
                expect(function () {
                    nsAnalyticsFactoryProvider.config([]);
                }).toThrow();

                //Should throw an error when the config does not contain a callback property
                expect(function () {
                    nsAnalyticsFactoryProvider.config({});
                }).toThrow();

                //Should be able to define a single tracking method
                nsAnalyticsFactoryProvider.config({callBack: function (name, options) {
                    //This is a callback body
                }});

                //Should be able to define two or more tracking methods
                nsAnalyticsFactoryProvider.config({callBack: [
                    callBackSpy.callBack1,
                    callBackSpy.callBack2,
                    callBackSpy.callBack3
                ]});
            }
        ]);
        angular.module('testcontrollers').value('testValues', {
            vValue: 0,
            staticValue: {
                name: "Something Static"
            }
        });
        angular.module('testcontrollers').factory('testManager', function () {
            var aValue = 0;
            return {
                incrementAValue: function () {
                    aValue++;
                },
                getAValue: function () {
                    return aValue;
                }
            };
        });
        angular.module('testcontrollers').controller('view.controllers.TestController',
            ['$scope', 'testManager', 'testValues', function ($scope, testManager, testValues) {
                var ctrl = this;

                //Methods
                this.aRun = 0;
                this.someMethodA = function () {
                    ctrl.aRun++;
                };
                $scope.bRun = 0;
                this.someMethodB = function () {
                    $scope.bRun++;
                };
                this.cRun = 0;
                $scope.someMethodC = function () {
                    ctrl.cRun++;
                };
                $scope.dRun = 0;
                $scope.someMethodD = function () {
                    $scope.dRun++;
                };

                //Watchers
                $scope.someWatchedProperty = 0;
                $scope.testManager = testManager;
                $scope.testValues = testValues;

                $scope.someWatchedPropertyWatcherRun = 0;
                $scope.$watch('someWatchedProperty', function (val) {
                    $scope.someWatchedPropertyWatcherRun++;
                });

                $scope.testValuesRun = 0;
                $scope.$watch('testValues.vValue', function (val) {
                    $scope.testValuesRun++;
                });

                $scope.managerWatchRun = 0;
                $scope.$watch('testManager.getAValue()', function (val) {
                    $scope.managerWatchRun++;
                });

                //Events
                $scope.eventOfTheCenturyRun = 0;
                $scope.$on("theEventOfTheCentury", function (e, data) {
                    $scope.eventOfTheCenturyRun++;
                });

                //Other random variables for testing
                this.firstName = "Mike Howard";
                this.office = "Office Depot";
                this.title = "Doctor";
                this.countries = {
                    home: "US",
                    away: "Denmark"
                };

                $scope.favoriteDirector = "Orson Wells";
                $scope.industry = "Hollywood";
                $scope.movies = {
                    oldest: {name: "Citizen Kane", rating: "PG"},
                    funniest: {name: "Groundhog Day"}
                };
                $scope.myTeam = "Orioles";
                $scope.myCity = "Baltimore";
            }]);
    });

    beforeEach(function () {
        module.apply(module, Neosavvy.AngularCore.Dependencies.concat('testcontrollers'));

        inject(function ($injector, $controller) {
            $$injector = $injector;
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $compile = $injector.get('$compile');
            el = $compile(angular.element(simpleControllerHtml))($scope);
            analyticsFactory = $injector.get('nsAnalyticsFactory');
        });

        log = [];

        $('body').append(el);
        $rootScope.$digest();
    });

    afterEach(function () {
        $('body').empty();
    });

    describe("method performance", function () {
        var myScope;
        var elapsedTime = function (fn) {
            var start = new Date().getTime();
            fn();
            return new Date().getTime() - start;
        };

        beforeEach(function () {
            //Because it is applied to the directive, it is the first child scope
            myScope = $scope.$$childHead;
        });

        /**
         * 400 ms is the threshold, because that is how long it takes to call the analytics callback as it is.
         */
        describe("$scope", function () {
            it("Should maintain a consistent deviation threshhold with no dynamic arguments", function () {
                var withoutTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD();
                    }
                });
                var options = {
                    someMethodD: {name: "Some Method D!", options: {age: 55, color: "Green"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0);
                var withTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD();
                    }
                });
                console.log("NO TRACKING: " + withoutTracking);
                console.log("TRACKING: " + withTracking);
                expect(withTracking - withoutTracking).toBeLessThan(400);
            });

            it("Should maintain a consistent threshold with function arguments", function () {
                var withoutTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD(87);
                    }
                });
                var options = {
                    someMethodD: {name: "Some Method D!", options: {age: "{{arguments[0]}}", color: "Green"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0);
                var withTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD(87);
                    }
                });
                console.log("NO TRACKING: " + withoutTracking);
                console.log("TRACKING: " + withTracking);
                expect(withTracking - withoutTracking).toBeLessThan(400);
            });

            it("Should maintain a consistent threshold with $scope arguments", function () {
                myScope.valueThatIsImportant = "Charlie!";
                var withoutTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD(87);
                    }
                });
                var options = {
                    someMethodD: {name: "Some Method D!", options: {firstName: "{{$scope.valueThatIsImportant}}", color: "Green"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0);
                var withTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD(87);
                    }
                });
                console.log("NO TRACKING: " + withoutTracking);
                console.log("TRACKING: " + withTracking);
                expect(withTracking - withoutTracking).toBeLessThan(400);
            });

            it("Should maintain a consistent threshold with $controller arugments", function () {
                myScope['ctrl'].valueThatIsImportant = "George!";
                var withoutTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD(87);
                    }
                });
                var options = {
                    someMethodD: {name: "Some Method D!", options: {firstName: "{{$controller.valueThatIsImportant}}", color: "Green"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0);
                var withTracking = elapsedTime(function() {
                    for (var i = 0; i < 10000; i++) {
                        myScope.someMethodD(87);
                    }
                });
                console.log("NO TRACKING: " + withoutTracking);
                console.log("TRACKING: " + withTracking);
                expect(withTracking - withoutTracking).toBeLessThan(400);
            });
        });

        describe("$controller", function () {
            it("Should maintain a consistent deviation threshhold", function () {

            });
        });

        describe("watchers", function () {
            it("Should maintain a consistent deviation threshhold", function () {

            });
        });

        describe("listeners", function () {
            it("Should maintain a consistent deviation threshhold", function () {

            });
        });
    });
});