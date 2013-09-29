describe("nsServiceExtensions", function () {
    var extensions, $httpSpy, $httpSuccessSpy, $httpErrorSpy;

    beforeEach(function() {
        module.apply(module, ['neosavvy.angularcore.services']);

        inject(function($injector, $provide) {
            var provide = $injector.get('$provide');
            provide.provider('$http', function() {
                $httpErrorSpy = jasmine.createSpy();
                $httpSuccessSpy = jasmine.createSpy().andReturn({error:$httpErrorSpy});
                $httpSpy = jasmine.createSpy().andReturn({success: $httpSuccessSpy});
                this.$get = function() {
                    return $httpSpy;
                };
            });
            extensions = $injector.get('nsServiceExtensions');
        });
    });

    describe("request", function () {
        it("Should throw an error when params are passed in without a method specified", function () {

        });

        it("Should throw an error when params are passed in without a url", function () {

        });
    });

    describe("xhr", function () {
        it("Should throw an error when params are passed in without a method specified", function () {

        });

        it("Should throw an error when params are passed in without a url", function () {

        });
    });
});