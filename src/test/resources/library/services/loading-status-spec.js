describe('nsLoadingStatusService', function () {
    var hbLoadingStatusService;

    beforeEach (function () {
        module.apply(module, Neosavvy.AngularCore.Dependencies);

        inject (function($injector) {
            hbLoadingStatusService = $injector.get('nsLoadingStatusService');
        });
    });

    describe('initial state', function () {
        it('should set registeredIndicators to an empty object', function () {
            expect(hbLoadingStatusService.registeredIndicators).toEqual({});
        });

        it('should define the wrapService method', function () {
            expect(typeof hbLoadingStatusService.wrapService).toEqual('function');
        });
    });

    describe('the wrapService method', function () {

        it('should throw an error if a valid indicator is not provided', function () {
             expect(function () {
                hbLoadingStatusService.wrapService(angular.noop);
             }).toThrow('a valid identifier was not provided, did you forget to include one?');
        });

        it('should return a function', function () {
            var testFn = function () {};
            var result = hbLoadingStatusService.wrapService(testFn, 'testIndicator');
            expect(typeof result).toEqual('function');
        });

        it('should call the passed in function', function () {
            var testFn = jasmine.createSpy('test spy').andReturn({finally: angular.noop});
            var result = hbLoadingStatusService.wrapService(testFn, 'testIndicator');
            expect(testFn).not.toHaveBeenCalled();
            result();
            expect(testFn).toHaveBeenCalled();
        });

        it('should set the provided indicator status to true INITIALLY upon calling the returned function', function () {

            var testFn = function () { return { finally: angular.noop } };
            hbLoadingStatusService.wrapService(testFn, 'testIndicator')();
            expect(hbLoadingStatusService.registeredIndicators['testIndicator']).toBe(true);
        });

        it('should set the provided indicator status to false FINALLY upon calling the returned function', function () {

            var testFn = function () { return { finally: function (fn) { fn();} } };
            hbLoadingStatusService.wrapService(testFn, 'testIndicator')();
            expect(hbLoadingStatusService.registeredIndicators['testIndicator']).toBe(false);
        });
    });

});

