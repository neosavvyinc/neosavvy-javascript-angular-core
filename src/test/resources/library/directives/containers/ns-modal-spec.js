describe('nsModal directive', function () {
    var $rootScope,
        $compile,
        $controller,
        controller,
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

        inject(function (_$rootScope_, _$compile_, _$controller_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_; 
            $controller = _$controller_;
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

    describe('nsModalCtrl#isTooltip', function () {
        var elementSpy;

        beforeEach(function () {
            scope = $rootScope.$new();
            controller = $controller('nsModalCtrl', { $scope: scope });
            scope.$apply();

            elementSpy = {
                css: jasmine.createSpy('css spy')
            };
        });

        it('should set css position, top, and left properties of the tooltip', function () {
            controller.positionTooltip(undefined, elementSpy)
            expect(elementSpy.css).toHaveBeenCalledWith('position', 'absolute');
            expect(elementSpy.css).toHaveBeenCalledWith('top', undefined);
            expect(elementSpy.css).toHaveBeenCalledWith('left', undefined);
        });

        it('should return the positioned element', function () {
            var res = controller.positionTooltip(undefined, elementSpy);
            expect(res).toEqual(elementSpy);
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

