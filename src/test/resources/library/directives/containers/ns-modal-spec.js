describe('nsModal directive', function () {
    var $rootScope,
        $compile,
        nsModal,
        serviceMock;

    serviceMock = {
        open: function () { },
        close: function () { },
        callback: function () { }
    };

    beforeEach (function () {
        module.apply(module, ['neosavvy.angularcore.services', 'neosavvy.angularcore.directives']);

        module(function ($provide) {
            $provide.value('nsModal', serviceMock);
        });

        inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_; 
        });

        for (var name in serviceMock) {
            spyOn(serviceMock, name);
        };
    });

    describe('error handling', function () {
        var errorWrapper,
            template;

        beforeEach(function () {
            var scope = $rootScope.$new();
            errorWrapper =  function () {
                $compile(template)(scope);
                scope.$apply();
            }
        });

        it('should throw an error if an open handler is not provided', function () {
            template = angular.element('<ns-modal></ns-modal>');
            expect(errorWrapper).toThrow('an open handler was not specified');
        });

        it('should not throw an error if an open handler is provided', function () {
             template = angular.element('<ns-modal open="someHanlder"></ns-modal>');
             expect(errorWrapper).not.toThrow('an open handler was not specified');
        });
    });

    describe('the open handler', function () {
        var scope,
            template;

        beforeEach(function () {
            scope = $rootScope.$new();
            template = angular.element('<ns-modal open="openHandler" close="closeHandler">myModal</ns-modal>') 
            $compile(template)(scope);
            scope.$apply();
        });

        it('should call the modalService open method', function () {
            scope.openHandler();
            expect(serviceMock.open).toHaveBeenCalled();
        });

        it('should call the modalService close method', function () {
            scope.closeHandler();
            expect(serviceMock.close).toHaveBeenCalled();
        });
    });

    describe('isTooltip', function () {
        var scope,
            template;

        beforeEach(function () {
            scope = $rootScope.$new();
            template = angular.element('<ns-modal open="openHandler" close="closeHandler" is-tooltip="true">myModal</ns-modal>') 
            $compile(template)(scope);
            scope.$apply();
        });

        iit('should position the tooltip', function () {
            spyOn(element, 'css');
            scope.openHandler();
            expect(element.css).toHaveBeenCalledWith('position', 'absolute');
            expect(element.css).toHaveBeenCalledWith('top', jasmine.any(Number));
            expect(element.css).toHaveBeenCalledWith('left', jasmine.any(Number));
        });
    });
    

    describe('EVENTS', function () {
        var scope,
            template;

        beforeEach (function () {
            scope = $rootScope.$new();
            template = angular.element('<ns-modal open="openHandler" close="closeHandler">myModal</ns-modal>');
            $compile(template)(scope);
            scope.$apply();
        });

        it('should close the modal on route change', function () {
            scope.$broadcast('$routeChangeStart');
            expect(serviceMock.close).toHaveBeenCalled();
        });
    });
    
});

