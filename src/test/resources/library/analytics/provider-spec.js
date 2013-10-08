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
        callBackSpy;

    beforeEach(function () {
        callBackSpy = jasmine.createSpyObj('callBackSpy', ['callBack1', 'callBack2', 'callBack3']);
        angular.module('testcontrollers', []).config([
            'nsAnalyticsFactoryProvider',
            function (nsAnalyticsFactoryProvider) {
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

    describe("controllers", function () {
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
        });

        xdescribe("injected .value", function () {
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
                expect(log).toContain(JSON.stringify({name: "Some 1 Method C!", options: {person: "Mr. Something Static", industry: "Sports"}}));
            });

            it("Should be able to pass them in a controller method", function () {

            });

            it("Should be able to pass them in a watcher", function () {

            });

            it("Should be able to pass them in an event listener", function () {

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
    });

    describe("directives", function () {
        //Will hold for a later release
    });

    describe("factories", function () {
        //Will hold for a later release
    });
});