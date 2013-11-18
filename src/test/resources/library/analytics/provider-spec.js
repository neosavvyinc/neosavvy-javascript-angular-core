describe("nsAnalytics", function () {
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
            'nsAnalyticsProvider',
            function (nsAnalyticsProvider) {
                myNsAnalyticsFactoryProvider = nsAnalyticsProvider;
                //Should throw an error when provided a config that is undefined
                expect(function () {
                    nsAnalyticsProvider.config(undefined);
                }).toThrow();

                //Should throw an error when provided a config that is null
                expect(function () {
                    nsAnalyticsProvider.config(null);
                }).toThrow();

                //Should throw an error when provided a config that is not an object
                expect(function () {
                    nsAnalyticsProvider.config([]);
                }).toThrow();

                //Should throw an error when the config does not contain a callback property
                expect(function () {
                    nsAnalyticsProvider.config({});
                }).toThrow();

                //Should be able to define a single tracking method
                nsAnalyticsProvider.config({callBack: function (name, options) {
                    //This is a callback body
                }});

                //Should be able to define two or more tracking methods
                nsAnalyticsProvider.config({callBack: [
                    callBackSpy.callBack1,
                    callBackSpy.callBack2,
                    callBackSpy.callBack3
                ]});
            }
        ]);
        angular.module('testcontrollers').value('testValues', {
            vValue: 0,
            staticValue: {
                name: "Something Static",
                age: 89
            }
        });
        angular.module('testcontrollers').value('otherTestValues', {
            team: {
                name: "Browns",
                color: "Purple"
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

                $scope.eRun = 0;
                $scope.someMethodE = function (plans, evil, good) {
                    $scope.eRun++;
                };

                this.fRun = 0;
                this.someMethodF = function (grapes, green, red) {
                    ctrl.fRun++;
                };

                //Watchers
                $scope.someWatchedProperty = 0;
                $scope.testManager = testManager;
                $scope.testValues = testValues;

                $scope.someWatchedPropertyWatcherRun = 0;
                $scope.$watch('someWatchedProperty', function (val, oldVal) {
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

                $scope.someExposedProperty = 0;
                $scope.exposedWatcher = function (copper, silver, gold) {
                };
                $scope.$watch('someExposedProperty', $scope.exposedWatcher);

                //Events
                $scope.eventOfTheCenturyRun = 0;
                $scope.eventOfTheCenturyListener = function (e, data) {
                    $scope.eventOfTheCenturyRun++;
                };
                $scope.$on("theEventOfTheCentury", $scope.eventOfTheCenturyListener);
                $scope.eventOfTheMonthRun = 0;
                $scope.$on("theEventOfTheMonth", function (e, data) {
                    $scope.eventOfTheMonthRun++;
                });
                $scope.eventOfTheDayRun = 0;
                $scope.$on("theEventOfTheDay", function (e, data) {
                    $scope.eventOfTheDayRun++;
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
            analyticsFactory = $injector.get('nsAnalytics');
        });

        log = [];

        $('body').append(el);
        $rootScope.$digest();
    });

    afterEach(function () {
        $('body').empty();
    });

    describe("controllers", function () {
        var myScope;
        beforeEach(function () {
            //Because it is applied to the directive, it is the first child scope
            myScope = $scope.$$childHead;
        });

        it("Should retain the signature of the existing controller method", function () {
            var options = {
                someMethodE: {name: "Some Method E!", options: {age: 83, color: "Purple"}}
            };
            var toString = myScope.someMethodE.toString();
            var stringConstructor = String(myScope.someMethodE);
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);
            expect(myScope.someMethodE.toString()).toEqual(toString);
            expect(String(myScope.someMethodE)).toEqual(stringConstructor);
        });

        it("Should retain the signature of the existing controller $scope method", function () {
            var options = {
                someMethodF: {name: "Some Method E!", options: {age: 83, color: "Purple"}}
            };
            var toString = myScope['ctrl'].someMethodF.toString();
            var stringConstructor = String(myScope['ctrl'].someMethodF);
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);
            expect(myScope['ctrl'].someMethodF.toString()).toEqual(toString);
            expect(String(myScope['ctrl'].someMethodF)).toEqual(stringConstructor);
        });

        it("Should retain the signature of the existing watcher method", function () {
            var options = {
                someExposedProperty: {name: "Some Exposed Property!", options: {team: "Brewers", city: "Milwaukee"}}
            };
            var toString = myScope.exposedWatcher.toString();
            var stringConstructor = String(myScope.exposedWatcher);
            analyticsFactory('view.controllers.TestController', null, options, null, 0, log);
            expect(myScope.exposedWatcher.toString()).toEqual(toString);
            expect(String(myScope.exposedWatcher)).toEqual(stringConstructor);
        });

        it("Should retain the signature of the existing event handler", function () {
            var options = {
                theEventOfTheCentury: {name: "My Main Event!", options: {color: "brown"}}
            };
            var toString = myScope.eventOfTheCenturyListener.toString();
            var stringConstructor = String(myScope.eventOfTheCenturyListener);
            analyticsFactory('view.controllers.TestController', null, null, options, 0, log);
            expect(myScope.eventOfTheCenturyListener.toString()).toEqual(toString);
            expect(String(myScope.eventOfTheCenturyListener)).toEqual(stringConstructor);
        });

        it("Should attach analytics to specified methods on the controller itself", function () {
            var options = {
                someMethodB: {name: "Some Method B!", options: {age: 55, color: "Green"}}
            };
            //Create the watching for the analytics
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);
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
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

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
            analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

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
            analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

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
            analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

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
            analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

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
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                expect(myScope['ctrl'].cRun).toEqual(0);

                //Click in the dom
                $('.c').click();
                myScope.$digest();
                expect(myScope['ctrl'].cRun).toEqual(1);
                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Method C!", options: {person: "Orson Wells", industry: "Hollywood"}}));
            });

            it("Should be able to pass them in two $scope methods", function () {
                var options = {
                    someMethodC: {name: "Some Method C!", options: {person: "{{$scope.favoriteDirector}}", industry: "{{$scope.industry}}"}},
                    someMethodD: {name: "Some Method D!", options: {guy: "{{$scope.favoriteDirector}}", business: "{{$scope.industry}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                expect(myScope['ctrl'].cRun).toEqual(0);

                //Click in the dom
                $('.c').click();
                myScope.$digest();
                expect(myScope['ctrl'].cRun).toEqual(1);
                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Method C!", options: {person: "Orson Wells", industry: "Hollywood"}}));

                myScope.someMethodD();
                myScope.$digest();
                expect(myScope.dRun).toEqual(1);
                expect(log.length).toEqual(2);
                expect(log).toContain(JSON.stringify({name: "Some Method D!", options: {guy: "Orson Wells", business: "Hollywood"}}));
            });

            it("Should be able to pass them in a controller method", function () {
                var options = {
                    someMethodB: {name: "Some Method B, with {{$scope.movies.oldest.name}}!", options: {color: "b&w", rating: "{{$scope.movies.oldest.rating}}" }}
                };
                //Create the watching for the analytics
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                $('.b').click();
                myScope.$digest();
                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Method B, with Citizen Kane!", options: {color: "b&w", rating: "PG" }}));
            });

            it("Should be able to pass them in a watcher", function () {
                var options = {
                    someWatchedProperty: {name: "Some Watched Property!", options: {team: "{{$scope.myTeam}}", city: "{{$scope.myCity}}"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                //Increment
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Watched Property!", options: {team: "Orioles", city: "Baltimore"}}));
            });

            it("Should be able to pass them in two watchers", function () {
                var options = {
                    someWatchedProperty: {name: "Some Watched Property!", options: {team: "{{$scope.myTeam}}", city: "{{$scope.myCity}}"}},
                    'testValues.vValue': {name: "Some Other Watched Property!", options: {sportingTeam: "{{$scope.myTeam}}", village: "{{$scope.myCity}}"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                //Increment
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Watched Property!", options: {team: "Orioles", city: "Baltimore"}}));

                myScope.testValues.vValue++;
                myScope.$digest();

                expect(log.length).toEqual(2);
                expect(log).toContain(JSON.stringify({name: "Some Other Watched Property!", options: {sportingTeam: "Orioles", village: "Baltimore"}}));
            });

            it("Should be able to pass them in an event listener", function () {
                var options = {
                    'theEventOfTheCentury': {name: "My Event with {{$scope.movies.funniest.name}}!", options: {make: "Ford", model: "Explorer"}}
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event with Groundhog Day!", options: {make: "Ford", model: "Explorer"}}));
            });

            it("Should be able to deal with three event listeners", function () {
                var options = {
                    'theEventOfTheCentury': {name: "My Event with {{$scope.movies.funniest.name}}!", options: {make: "Ford", model: "Explorer"}},
                    'theEventOfTheMonth': {name: "My 2nd Event with {{$scope.movies.funniest.name}}!", options: {make: "GM", model: "Jimmy"}},
                    'theEventOfTheDay': {name: "My 3rd Event with {{$scope.movies.oldest.name}}!", options: {make: "Mercedes", model: "Sprinter"}}
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event with Groundhog Day!", options: {make: "Ford", model: "Explorer"}}));
                expect(myScope.eventOfTheCenturyRun).toEqual(1);

                $rootScope.$broadcast("theEventOfTheMonth");
                $rootScope.$digest();

                expect(log.length).toEqual(2);
                expect(log).toContain(JSON.stringify({name: "My 2nd Event with Groundhog Day!", options: {make: "GM", model: "Jimmy"}}));
                expect(myScope.eventOfTheMonthRun).toEqual(1);

                $rootScope.$broadcast("theEventOfTheDay");
                $rootScope.$digest();

                expect(log.length).toEqual(3);
                expect(log).toContain(JSON.stringify({name: "My 3rd Event with Citizen Kane!", options: {make: "Mercedes", model: "Sprinter"}}));
                expect(myScope.eventOfTheDayRun).toEqual(1);
            });
        });

        describe("$controller variables", function () {
            it("Should be able to pass them in a $scope method", function () {
                var options = {
                    someMethodC: {name: "Some {{$controller.title}} Method C!", options: {person: "{{$controller.firstName}}", industry: "{{$controller.office}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                $('.c').click();
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Doctor Method C!", options: {person: "Mike Howard", industry: "Office Depot"}}));
            });

            it("Should be able to pass them in a controller method", function () {
                var options = {
                    someMethodB: {name: "Some Method B, with {{$controller.firstName}}!", options: {color: "b&w", rating: "{{$controller.countries.home}}" }}
                };
                //Create the watching for the analytics
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                $('.b').click();
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Method B, with Mike Howard!", options: {color: "b&w", rating: "US" }}));
            });

            it("Should be able to pass them in a watcher", function () {
                var options = {
                    someWatchedProperty: {name: "Some Watched Property!", options: {team: "{{$controller.office}}", city: "{{$controller.firstName}}"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                //Increment
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Watched Property!", options: {team: "Office Depot", city: "Mike Howard"}}));
            });

            it("Should be able to pass them in an event listener", function () {
                var options = {
                    'theEventOfTheCentury': {name: "My Event with {{$controller.countries.away}}!", options: {make: "Ford", model: "Explorer"}}
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event with Denmark!", options: {make: "Ford", model: "Explorer"}}));
            });
        });

        describe("arguments", function () {
            it("Should be able to pass them in a $scope method", function () {
                var options = {
                    someMethodC: {name: "Some {{arguments[0]}} Method C!", options: {person: "This Dude", industry: "{{arguments[1]}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some 555 Method C!", options: {person: "This Dude", industry: "Leeeroy Jenkins!"}}));
            });

            it("Should be able to pass them in a controller method", function () {
                var options = {
                    someMethodB: {name: "Some Method B, with {{arguments[2]}}!", options: {color: "b&w", rating: "{{arguments[3]}}" }}
                };
                //Create the watching for the analytics
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope['ctrl'].someMethodB("schwan", "doo", "two and heif", "scheven");
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Method B, with two and heif!", options: {color: "b&w", rating: "scheven" }}));
            });

            it("Should be able to pass them in a watcher", function () {
                var options = {
                    someWatchedProperty: {name: "Some {{arguments[0]}} Property!", options: {team: "{{arguments[1]}} do something", city: "Boise"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                //Increment
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);

                //Exhibits newValue and oldValue
                expect(log).toContain(JSON.stringify({name: "Some 1 Property!", options: {team: "0 do something", city: "Boise"}}));
            });

            it("Should be able to pass them in an event listener", function () {
                var options = {
                    'theEventOfTheCentury': {name: "My Event with {{arguments[1]}}!", options: {make: "{{arguments[1]}}", model: "Explorer"}}
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                $rootScope.$broadcast("theEventOfTheCentury", "someOtherString");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event with someOtherString!", options: {make: "someOtherString", model: "Explorer"}}));
            });

            it("Should be able to deal with two event listeners", function () {
                var options = {
                    'theEventOfTheCentury': {name: "My Event with {{arguments[1]}}!", options: {make: "{{arguments[1]}}", model: "Explorer"}}
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                $rootScope.$broadcast("theEventOfTheCentury", "someOtherString");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event with someOtherString!", options: {make: "someOtherString", model: "Explorer"}}));
            });
        });

        describe("injected .value", function () {
            //Going to support this in a later release
            it("Should be able to pass them in a $scope method", function () {
                var options = {
                    someMethodC: {name: "Some {{testValues#vValue}} Method C!", options: {person: "Mr. {{testValues#staticValue.name}}", industry: "Sports"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope.someMethodC();
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some 0 Method C!", options: {person: "Mr. Something Static", industry: "Sports"}}));
            });

            it("Should be able to pass them in a controller method", function () {
                var options = {
                    someMethodA: {name: "Some {{testValues#staticValue.name}} Method A!", options: {dude: "Mr. {{testValues#staticValue.age}}", business: "Sports"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope['ctrl'].someMethodA();
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Something Static Method A!", options: {dude: "Mr. 89", business: "Sports"}}));
            });

            it("Should be able to pass them in a watcher", function () {
                var options = {
                    someWatchedProperty: {name: "Some {{otherTestValues#team.color}} Property P!", options: {man: "Mr. {{testValues#staticValue.age}}", business: "Sports"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                //Click in the dom
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Purple Property P!", options: {man: "Mr. 89", business: "Sports"}}));
            });

            it("Should be able to pass them in an event listener", function () {
                var options = {
                    theEventOfTheMonth: {name: "Some {{otherTestValues#team.name}} Property P!", options: {man: "Mr. Finch", business: "{{testValues#staticValue.name}}"}}
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Click in the dom
                $rootScope.$broadcast('theEventOfTheMonth');
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Browns Property P!", options: {man: "Mr. Finch", business: "Something Static"}}));
            });

            it("Should throw an error if provided and invalid name for an injected value", function () {
                var options = {
                    someMethodC: {name: "Some {{testValuesNOTREAL#vValue}} Method C!", options: {person: "Mr. {{testValues#staticValue.name}}", industry: "Sports"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                expect(function () {
                    myScope.someMethodC();
                    myScope.$digest();
                }).toThrow();
            });
        });

        xdescribe("injected .factory", function () {
            //Going to support this in a later release
            it("Should be able to pass them in a $scope method", function () {

            });

            it("Should be able to pass them in a controller method", function () {

            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

            });
        });

        describe("conditions", function () {

            it("Should be able to handle $scope based conditions", function () {
                var options = {
                    someMethodC: {
                        condition: "$scope.myTeam === 'Jaguars'",
                        name: "Some {{$scope.movies.oldest.rating}} Method C!",
                        options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope.myTeam = 'Jaguars';
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {person: "Mike Howard", industry: "Leeeroy Jenkins!"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
            });

            it("Should be able handle numeric conditions", function () {
                var options = {
                    someWatchedProperty: {
                        condition: "$scope.movies.count >= 15",
                        name: "Some Watched Property!",
                        options: {team: "Cubs", city: "St. Louis"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                expect(myScope.someWatchedProperty).toEqual(0);
                expect(myScope.someWatchedPropertyWatcherRun).toEqual(1);

                //Increment
                myScope.movies.count = 14;
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                //Change Condition Here
                myScope.movies.count = 15;
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Watched Property!", options: {team: "Cubs", city: "St. Louis"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
            });

            it("Should be able to handle boolean conditions", function () {
                var options = {
                    'theEventOfTheCentury': {
                        condition: "$scope.someFlag && $scope.someOtherFlag",
                        name: "My Event!",
                        options: {make: "Ford", model: "Explorer"}
                    }
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                myScope.someFlag = true;
                myScope.someOtherFlag = false;
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(0);

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope.someFlag = false;
                myScope.someOtherFlag = true;
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(0);

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope.someFlag = true;
                myScope.someOtherFlag = true;
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event!", options: {make: "Ford", model: "Explorer"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
            });

            it("Should be able to handle !== null conditions", function () {
                var options = {
                    someMethodC: {
                        condition: "$scope.myTeam !== null",
                        name: "Some {{$scope.movies.oldest.rating}} Method C!",
                        options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope.myTeam = null;
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(log.length).toEqual(0);
                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope.myTeam = 'Jaguars';
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {person: "Mike Howard", industry: "Leeeroy Jenkins!"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
            });

            it("Should be able to handle !== undefined conditions", function () {
                var options = {
                    someMethodC: {
                        condition: "$scope.myTeam !== undefined",
                        name: "Some {{$scope.movies.oldest.rating}} Method C!",
                        options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope.myTeam = undefined;
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(log.length).toEqual(0);
                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope.myTeam = 'Jaguars';
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {person: "Mike Howard", industry: "Leeeroy Jenkins!"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
            });

            it("Should be able to handle more complex conditions", function () {
                var options = {
                    someWatchedProperty: {
                        condition: "(5 * $controller.numberProp) > ($scope.myVar.inner % 7) && $scope.movies.count < -90",
                        name: "Some Watched Property!",
                        options: {team: "Cubs", city: "St. Louis"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                myScope['ctrl'].numberProp = 0;
                myScope.myVar = {inner: 13};
                myScope.movies.count = -87;

                //Increment
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                //Change Condition Here
                myScope.movies.count = -90.5;
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope['ctrl'].numberProp = 2;
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Watched Property!", options: {team: "Cubs", city: "St. Louis"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
            });

            it("Should be able to handle conditions without spaces", function () {
                var options = {
                    someWatchedProperty: {
                        condition: "(5*$controller.numberProp)>($scope.myVar.inner%7)&&$scope.movies.count<-90",
                        name: "Some Watched Property!",
                        options: {team: "Cubs", city: "St. Louis"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                myScope['ctrl'].numberProp = 0;
                myScope.myVar = {inner: 13};
                myScope.movies.count = -87;

                //Increment
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                //Change Condition Here
                myScope.movies.count = -90.5;
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope['ctrl'].numberProp = 2;
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Watched Property!", options: {team: "Cubs", city: "St. Louis"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some Watched Property!", {team: "Cubs", city: "St. Louis"});
            });

            it("Should be able to handle controller based conditions", function () {
                var options = {
                    'theEventOfTheCentury': {
                        condition: "$controller.myAge === 19",
                        name: "My Event!",
                        options: {make: "Ford", model: "Explorer"}
                    }
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                myScope['ctrl'].myAge = 18;
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(0);

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope['ctrl'].myAge = 19;
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event!", options: {make: "Ford", model: "Explorer"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
            });

            it("Should be able to handle global injected variable based conditions", function () {
                var options = {
                    'theEventOfTheCentury': {
                        condition: "testValues#vValue >= 5",
                        name: "My Event!",
                        options: {make: "Ford", model: "Explorer"}
                    }
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                myScope.testValues.vValue = 4;
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(0);

                expect(callBackSpy.callBack1).not.toHaveBeenCalled();
                expect(callBackSpy.callBack2).not.toHaveBeenCalled();
                expect(callBackSpy.callBack3).not.toHaveBeenCalled();

                myScope.testValues.vValue = 5;
                $rootScope.$broadcast("theEventOfTheCentury");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Event!", options: {make: "Ford", model: "Explorer"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("My Event!", {make: "Ford", model: "Explorer"});
            });
        });

        describe("combination", function () {
            it("Should be able to pass them in a $scope method", function () {
                var options = {
                    someMethodC: {name: "Some {{$scope.movies.oldest.rating}} Method C!", options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
                };
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {person: "Mike Howard", industry: "Leeeroy Jenkins!"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
            });

            it("Should be able to pass them in a controller method", function () {
                var options = {
                    someMethodB: {name: "Some {{$scope.myTeam}} B, with {{arguments[3]}}!", options: {color: "b&w", rating: "{{$controller.countries.away}}" }}
                };
                //Create the watching for the analytics
                analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

                //Click in the dom
                myScope['ctrl'].someMethodB("schwan", "doo", "two and heif", "scheven");
                myScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some Orioles B, with scheven!", options: {color: "b&w", rating: "Denmark" }}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some Orioles B, with scheven!", {color: "b&w", rating: "Denmark" });
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some Orioles B, with scheven!", {color: "b&w", rating: "Denmark" });
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some Orioles B, with scheven!", {color: "b&w", rating: "Denmark" });
            });

            it("Should be able to pass them in a watcher", function () {
                var options = {
                    someWatchedProperty: {name: "Some {{arguments[1]}} Property!", options: {team: "{{$controller.office}}", city: "The town of {{$scope.favoriteDirector}}"}}
                };
                analyticsFactory('view.controllers.TestController', null, options, null, 0, log);

                //Increment
                myScope.someWatchedProperty++;
                myScope.$digest();

                expect(log.length).toEqual(1);

                //Exhibits newValue and oldValue
                expect(log).toContain(JSON.stringify({name: "Some 0 Property!", options: {team: "Office Depot", city: "The town of Orson Wells"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some 0 Property!", {team: "Office Depot", city: "The town of Orson Wells"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some 0 Property!", {team: "Office Depot", city: "The town of Orson Wells"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some 0 Property!", {team: "Office Depot", city: "The town of Orson Wells"});
            });

            it("Should be able to pass them in an event listener", function () {
                var options = {
                    'theEventOfTheCentury': {name: "My {{$scope.industry}} with {{$controller.countries.home}}!", options: {make: "{{arguments[1]}}", model: "Explorer"}}
                };
                analyticsFactory('view.controllers.TestController', null, null, options, 0, log);

                //Broadcast
                $rootScope.$broadcast("theEventOfTheCentury", "LEEROY JENKINS MF!");
                $rootScope.$digest();

                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "My Hollywood with US!", options: {make: "LEEROY JENKINS MF!", model: "Explorer"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("My Hollywood with US!", {make: "LEEROY JENKINS MF!", model: "Explorer"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("My Hollywood with US!", {make: "LEEROY JENKINS MF!", model: "Explorer"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("My Hollywood with US!", {make: "LEEROY JENKINS MF!", model: "Explorer"});
            });
        });

        it("Should support a delay for tracking events", function () {
            var options = {
                someMethodC: {name: "Some {{$scope.movies.oldest.rating}} Method C!", options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
            };
            analyticsFactory('view.controllers.TestController', options, null, null, 1000, log);

            //Click in the dom
            runs(function () {
                myScope.someMethodC(555, "Leeeroy Jenkins!");
                myScope.$digest();
            });

            waits(2000);

            runs(function () {
                expect(log.length).toEqual(1);
                expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {person: "Mike Howard", industry: "Leeeroy Jenkins!"}}));
                expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
                expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Leeeroy Jenkins!"});
            });
        });

        it("Should be able to add tracking to controllers of the same name after the tracking is declared", function () {
            var options = {
                someMethodC: {name: "Some {{$scope.movies.oldest.rating}} Method C!", options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
            };
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);
            var newHtml = '<div ng-controller="view.controllers.TestController as ctrl"></div>';
            var newEl = $compile(angular.element(newHtml))(myScope);
            $('body').append(newEl);
            myScope.$digest();

            var newScope = myScope.$$childHead;
            newScope.movies.oldest.rating = "R"
            newScope['ctrl'].firstName = "Richard Nixon";
            newScope.someMethodC("Unused Argument", "Used Argument");
            newScope.$digest();

            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "Some R Method C!", options: {person: "Richard Nixon", industry: "Used Argument"}}));
            expect(callBackSpy.callBack1).toHaveBeenCalledWith("Some R Method C!", {person: "Richard Nixon", industry: "Used Argument"});
            expect(callBackSpy.callBack2).toHaveBeenCalledWith("Some R Method C!", {person: "Richard Nixon", industry: "Used Argument"});
            expect(callBackSpy.callBack3).toHaveBeenCalledWith("Some R Method C!", {person: "Richard Nixon", industry: "Used Argument"});
        });

        it("Should be able to play nice with a single callBack defined in the config", function () {
            var options = {
                someMethodC: {name: "Some {{$scope.movies.oldest.rating}} Method C!", options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
            };
            var mySpy = jasmine.createSpy();
            myNsAnalyticsFactoryProvider.config({callBack: mySpy});
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

            myScope.someMethodC("Star Wars", "Star Trek");
            myScope.$digest();

            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {person: "Mike Howard", industry: "Star Trek"}}));
            expect(mySpy).toHaveBeenCalledWith("Some PG Method C!", {person: "Mike Howard", industry: "Star Trek"});
        });

        it("Should be able to play nice with baseOptions defined in the config", function () {
            var options = {
                someMethodC: {name: "Some {{$scope.movies.oldest.rating}} Method C!", options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}"}}
            };
            var mySpy = jasmine.createSpy();
            myNsAnalyticsFactoryProvider.config(
                {baseOptions: {
                    name: "Terrence",
                    facility: "Tank Engine",
                    bestFriend: "Trevor"
                },
                    callBack: mySpy});
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

            myScope.someMethodC("Star Wars", "Star Trek");
            myScope.$digest();

            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {name: "Terrence",
                facility: "Tank Engine",
                bestFriend: "Trevor",
                person: "Mike Howard",
                industry: "Star Trek"}}));
            expect(mySpy).toHaveBeenCalledWith("Some PG Method C!", {name: "Terrence",
                facility: "Tank Engine",
                bestFriend: "Trevor",
                person: "Mike Howard",
                industry: "Star Trek"});
        });

        it("Should be able to play nice with overwriting base options", function () {
            var options = {
                someMethodC: {name: "Some {{$scope.movies.oldest.rating}} Method C!", options: {person: "{{$controller.firstName}}", industry: "{{arguments[1]}}", facility: "Dump Truck"}}
            };
            var mySpy = jasmine.createSpy();
            myNsAnalyticsFactoryProvider.config(
                {baseOptions: {
                    name: "Terrence",
                    facility: "Tank Engine",
                    bestFriend: "Trevor"
                },
                    callBack: mySpy});
            analyticsFactory('view.controllers.TestController', options, null, null, 0, log);

            myScope.someMethodC("Star Wars", "Star Trek");
            myScope.$digest();

            expect(log.length).toEqual(1);
            expect(log).toContain(JSON.stringify({name: "Some PG Method C!", options: {name: "Terrence",
                facility: "Dump Truck",
                bestFriend: "Trevor",
                person: "Mike Howard",
                industry: "Star Trek"}}));
            expect(mySpy).toHaveBeenCalledWith("Some PG Method C!", {name: "Terrence",
                facility: "Dump Truck",
                bestFriend: "Trevor",
                person: "Mike Howard",
                industry: "Star Trek"});
        });
    });

    describe("directives", function () {
        //Will hold for a later release
    });

    describe("factories", function () {
        //Will hold for a later release
    });
});