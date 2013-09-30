describe('nsStaticInclude directive', function() {
    
    var rootScope,
        compile,
        template,
        httpBackend,
        http;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.directives']);

        inject(function($compile, $rootScope, $httpBackend, $http) {
            rootScope = $rootScope;
            compile = $compile;  
            httpBackend = $httpBackend;
            http = $http;
        });
    });

    describe('compile-time', function () {
        describe('error conditions', function() {
                
            function errorWrapper(templ) {

                rootScope.$apply(function() {
                    compile(template)(rootScope);
                });
            }

            it('should throw an error if the src attribute is not included', function () {

                template = angular.element('<ns-static-include></ns-static-include>');
                expect(errorWrapper).toThrow('You must pass in a source to render a Neosavvy static include directive.');
            });

            it('should not throw an error if the src attribute is included', function() {
                // set up mock backend
                httpBackend.when('GET', 'test.html').respond('<div></div>');

                template = angular.element('<ns-static-include src="test.html"></ns-static-include>');
                expect(errorWrapper).not.toThrow();
            });
        });

        describe('waitFor', function () {
            it('should not make $http get request if waitFor is defined and the period has not elapsed', function () {

                spyOn(http, 'get').andCallThrough();

                template = angular.element('<ns-static-include src="test.html" wait-for="1000"></ns-static-include>');

                rootScope.$apply(function() {
                    compile(template)(rootScope);
                });

                expect(http.get).not.toHaveBeenCalled();
            });

            it('should make the $http get request after the allotted time', function () {
                httpBackend.when('GET', 'test.html').respond('<div></div>');
                spyOn(http, 'get').andCallThrough();
                jasmine.Clock.useMock();

                template = angular.element('<ns-static-include src="test.html" wait-for="1000"></ns-static-include>');

                rootScope.$apply(function() {
                    compile(template)(rootScope);
                });

                expect(http.get).not.toHaveBeenCalled();
                jasmine.Clock.tick(1000);
                expect(http.get).toHaveBeenCalled();

            });
        });

        describe('watchWaitFor', function () {
            beforeEach(function() {
                httpBackend.expectGET('test.html').respond('<div>TEMPLATE</div>');
                spyOn(http, 'get').andCallThrough();
            });

            it('should not make the http request until watchWaitFor has been resolved', function () {

                template = angular.element('<ns-static-include src="test.html" watch-wait-for="thing"></ns-static-include>');
                rootScope.thing = undefined;

                rootScope.$apply(function() {
                    compile(template)(rootScope);
                });

                expect(http.get).not.toHaveBeenCalled();
                rootScope.thing = "testVal";

                rootScope.$apply();
                httpBackend.flush();
                expect(http.get).toHaveBeenCalled();
            });

        });

    });
    




});
