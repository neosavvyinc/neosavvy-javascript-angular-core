ddescribe("nsAnalyticsFactory", function () {
    var $rootScope,
        $scope,
        controller,
        directive,
        analyticsFactory,
        simpleControllerHtml = '<div ng-controller="view.controllers.TestController as ctrl">' +
            '<a class="b" ng-click="ctrl.someMethodB()">Text</a>' +
            '<span class="c" ng-click="someMethodC()"></span>' +
            '</div>',
        el,
        log;

    beforeEach(function () {
        angular.module('testcontrollers', []).value('testValues', {
            vValue: 0
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
                $scope.favoriteDirector = "Orson Wells";
                $scope.industry = "Hollywood";
                $scope.movies = {
                    oldest: {name: "Citizen Kane", rating: "PG"}
                };
            }]);
    });

    beforeEach(function () {
        module.apply(module, Neosavvy.AngularCore.Dependencies.concat('testcontrollers'));

        inject(function ($injector, $controller, $compile) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
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

    ddescribe("controllers", function () {
        var myScope;
        beforeEach(function () {
            //Because it is applied to the directive, it is the first child scope
            myScope = $scope.$$childHead;
        });

        it("Should attach analytics to specified methods on the controller itself", function () {
            var options = {
                someMethodB: {name: "Some Method B!", options: {age: 55, color: "Green"}}
            };
            //Create the watching for the analytics
            analyticsFactory('view.controllers.TestController', options, null, null, log);
            expect(myScope.bRun).toEqual(0);

            //Click in the dom
            $('.b').click();
            myScope.$digest();
            expect(myScope.bRun).toEqual(1);
            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify(options.someMethodB));
        });

        it("Should attach analytics to the specified methods on the $scope", function () {
            var options = {
                someMethodC: {name: "Some Method C!", options: {age: 85, color: "Yellow"}}
            };
            analyticsFactory('view.controllers.TestController', options, null, null, log);

            expect(myScope['ctrl'].cRun).toEqual(0);

            //Click in the dom
            $('.c').click();
            myScope.$digest();
            expect(myScope['ctrl'].cRun).toEqual(1);
            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify(options.someMethodC));
        });

        it("Should attach analytics to the specified watchers on the $scope", function () {
            var options = {
                someWatchedProperty: {name: "Some Watched Property!", options: {team: "Cubs", city: "St. Louis"}}
            };
            analyticsFactory('view.controllers.TestController', null, options, null, log);

            expect(myScope.someWatchedProperty).toEqual(0);
            expect(myScope.someWatchedPropertyWatcherRun).toEqual(1);

            //Increment
            myScope.someWatchedProperty++;
            myScope.$digest();

            expect(myScope.someWatchedProperty).toEqual(1);
            expect(myScope.someWatchedPropertyWatcherRun).toEqual(2);
            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "Some Watched Property!", options: {team: "Cubs", city: "St. Louis"}}));
        });

        it("Should play nice with dot property watchers", function () {
            var options = {
                'testValues.vValue': {name: "The object, with the property", options: {team: "Bucks", city: "Milwaukee"}}
            };
            analyticsFactory('view.controllers.TestController', null, options, null, log);

            expect(myScope.testValues.vValue).toEqual(0);
            expect(myScope.testValuesRun).toEqual(1);

            //Increment
            myScope.testValues.vValue++;
            myScope.$digest();

            expect(myScope.testValues.vValue).toEqual(1);
            expect(myScope.testValuesRun).toEqual(2);
            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "The object, with the property", options: {team: "Bucks", city: "Milwaukee"}}));
        });

        it("Should play nice with method watchers", function () {
            var options = {
                'testManager.getAValue()': {name: "Some value getter", options: {team: "Astros", city: "Dallas"}}
            };
            analyticsFactory('view.controllers.TestController', null, options, null, log);

            expect(myScope.testManager.getAValue()).toEqual(0);
            expect(myScope.managerWatchRun).toEqual(1);

            myScope.testManager.incrementAValue();
            myScope.$digest();

            expect(myScope.testManager.getAValue()).toEqual(1);
            expect(myScope.managerWatchRun).toEqual(2);
            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "Some value getter", options: {team: "Astros", city: "Dallas"}}));
        });

        it("Should attach analytics to the specified event handlers on the $scope", function () {
            var options = {
                'theEventOfTheCentury': {name: "My Event!", options: {make: "Ford", model: "Explorer"}}
            };
            analyticsFactory('view.controllers.TestController', null, null, options, log);

            expect(myScope.eventOfTheCenturyRun).toEqual(0);

            //Broadcast
            $rootScope.$broadcast("theEventOfTheCentury");
            $rootScope.$digest();

            expect(myScope.eventOfTheCenturyRun).toEqual(1);
            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "My Event!", options: {make: "Ford", model: "Explorer"}}));
        });

        describe("$scope variables", function () {
            it("Should be able to pass them in a $scope method", function () {
                var options = {
                    someMethodC: {name: "Some Method C!", options: {person: "{{$scope.favoriteDirector}}", industry: "{{$scope.industry}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, log);

                expect(myScope['ctrl'].cRun).toEqual(0);

                //Click in the dom
                $('.c').click();
                myScope.$digest();
                expect(myScope['ctrl'].cRun).toEqual(1);
                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Method C!", options: {person: "Orson Wells", industry: "Hollywood"}}));
            });

            it("Should be able to pass them in a controller method", function () {
                var options = {
                    someMethodB: {name: "Some Method B, with {{$scope.movies.oldest.name}}!", options: {color: "b&w", rating: "{{$scope.movies.oldest.rating}}" }}
                };
                //Create the watching for the analytics
                analyticsFactory('view.controllers.TestController', options, null, null, log);
                expect(myScope.bRun).toEqual(0);

                //Click in the dom
                $('.b').click();
                myScope.$digest();
                expect(myScope.bRun).toEqual(1);
                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Method B, with Citizen Kane!", options: {color: "b&w", rating: "PG" }}));
            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

            });
        });

        describe("controller variables", function () {
            it("Should be able to pass them in a $scope method", function () {

            });

            it("Should be able to pass them in a controller method", function () {

            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

            });
        });

        describe("arguments", function () {
            it("Should be able to pass them in a $scope method", function () {

            });

            it("Should be able to pass them in a controller method", function () {

            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

            });
        });

        describe("injected .value", function () {
            it("Should be able to pass them in a $scope method", function () {

            });

            it("Should be able to pass them in a controller method", function () {

            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

            });
        });

        describe("injected .factory", function () {
            it("Should be able to pass them in a $scope method", function () {

            });

            it("Should be able to pass them in a controller method", function () {

            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

            });
        });

        describe("combination", function () {
            it("Should be able to pass them in a $scope method", function () {

            });

            it("Should be able to pass them in a controller method", function () {

            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

            });
        });

        it("Should support a delay for tracking events", function () {

        });
    });

    describe("directives", function () {
        //Will hold for a later release
    });

    describe("factories", function () {
        //Will hold for a later release
    });

    describe("config", function () {
        it("Should be able to define a single tracking method", function () {

        });

        it("Should be able to define two or more tracking methods", function () {

        });

        it("Should be able to set a default delay in the config", function () {

        });
    });
});