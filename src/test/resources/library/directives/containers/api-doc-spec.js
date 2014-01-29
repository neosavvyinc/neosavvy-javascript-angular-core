ddescribe("nsApiDoc", function () {
    var $rootScope,
        $scope,
        $http,
        el,
        $body = $('body'),
        simpleHtml = '<ns-api-doc endpoint="myEndpoint">' +
            '<label class="path" ng-bind="myEndpoint.path"></label>' +
            '<label class="method" ng-bind="myEndpoint.method"></label>' +
            '<label class="param" ng-repeat="(key, value) in myEndpoint.params">{{key + ": " + value}}</label>' +
            '<p ng-bind="myEndpoint.payload"></p>' +
            '</ns-api-doc>';

    describe("valid case", function () {
        beforeEach(function () {
            module.apply(module, Neosavvy.AngularCore.Dependencies.concat(function ($provide) {
                $http = jasmine.createSpy('$http').andReturn({then: function (fn) {
                    fn({name: 'Api Response Valid!'});
                }});
                $provide.value('$http', $http);
            }));

            inject(function ($injector, $compile) {
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();

                $scope.myEndpoint = {
                    "name": "Create Reading",
                    "path": "/neosavvyapi/readings/create",
                    "method": "POST",
                    "params": {"food": "Cheese", "q": "someRandomQuery"},
                    "payload": {
                        "site_id": "8",
                        "class_id": "5",
                        "asset_unique_identifier": "25OR624XYQG",
                        "date_time": 1390612469,
                        "field_log": {"Name": "Charlie Watts"},
                        "reading": {"Methane": String(parseInt(Math.random() * 100)),
                            "Carbon Dioxide": String(parseInt(Math.random() * 100)),
                            "Oxygen": String(parseInt(Math.random() * 100)),
                            "Pressure": String(parseInt(Math.random() * 100))}
                    }
                };

                el = $compile(angular.element(simpleHtml))($scope);
            });

            $body.append(el);
            $rootScope.$digest();
        });

        afterEach(function () {
            $body.empty();
        });

        it("Should bind down the path on scope", function () {
            expect(el.find('.path').text()).toEqual("/neosavvyapi/readings/create");
        });

        it("Should bind down the method on the scope", function () {
            expect(el.find('.method').text()).toEqual("POST");
        });

        it("Should list out params for the params", function () {
            expect(el.find('.param').length).toEqual(2);
            expect($(el.find('.param')[0]).text()).toEqual("food: Cheese");
            expect($(el.find('.param')[1]).text()).toEqual("q: someRandomQuery");
        });
    });

    describe("fail case", function () {
        beforeEach(function () {
            module.apply(module, Neosavvy.AngularCore.Dependencies.concat(function ($provide) {
                $http = jasmine.createSpy('$http').andReturn();
                $provide.value('$http', $http);
            }));

            inject(function ($injector, $compile) {
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();

                $scope.myEndpoint = {
                    "name": "Create Reading",
                    "path": "/neosavvyapi/readings/create",
                    "method": "POST",
                    "payload": {
                        "site_id": "8",
                        "class_id": "5",
                        "asset_unique_identifier": "25OR624XYQG",
                        "date_time": 1390612469,
                        "field_log": {"Name": "Charlie Watts"},
                        "reading": {"Methane": String(parseInt(Math.random() * 100)),
                            "Carbon Dioxide": String(parseInt(Math.random() * 100)),
                            "Oxygen": String(parseInt(Math.random() * 100)),
                            "Pressure": String(parseInt(Math.random() * 100))}
                    }
                };

                el = $compile(angular.element(simpleHtml))($scope);
            });

            $body.append(el);
            $rootScope.$digest();
        });

        afterEach(function () {
            $body.empty();
        });
    });
});