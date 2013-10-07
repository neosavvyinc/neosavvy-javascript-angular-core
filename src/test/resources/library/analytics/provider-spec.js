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

    beforeEach(function() {
        angular.module('testcontrollers', []).controller('view.controllers.TestController',
            ['$scope', function ($scope) {
                var ctrl = this;
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

    afterEach(function() {
        $('body').empty();
    });

    ddescribe("controllers", function () {
        var myScope;
        beforeEach(function() {
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

        });

        it("Should attach analytics to the specified event handlers on the $scope", function () {

        });
    });

    describe("directives", function () {

    });

    describe("factories", function () {

    });
});