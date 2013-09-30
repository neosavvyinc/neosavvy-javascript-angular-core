describe('ngModelOnBlur directive', function () {

    var compile,
        rootScope,
        scope;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.directives']);

        inject(function($compile, $rootScope) {
            compile = $compile;
            rootScope = $rootScope;
        });

        scope = rootScope.$new();
    });

    describe('incompatible elements', function() {
    
        beforeEach(function () {
            
            scope.thing = true;
            spyOn(angular.element.prototype, 'bind');
        });

        it('should return with no action if the type is a radio button', function () {
            var templ = '<input type="radio" ns-model-on-blur ng-model="thing"></input>';

            scope.$apply(function() {
                compile(templ)(scope);
            });

            expect(angular.element.prototype.bind).not.toHaveBeenCalled();
        });

        it('should return with no action if the type is a checkbox', function () {
            var templ = '<input type="checkbox" ns-model-on-blur ng-model="thing"></input>';

            scope.$apply(function() {
                compile(templ)(scope);
            });

            expect(angular.element.prototype.bind).not.toHaveBeenCalled();

        });
    });

    describe('triggering blure', function () {
        it('should  /* does things /*', function () {

            var templ = '<input type="text" ns-model-on-blur ng-model="thing"></input>',
                compiledElem;
            scope.thing = undefined;

            scope.$apply(function() {
                compiledElem = compile(templ)(scope);
            });

            compiledElem[0].value = 'TEXT';

            expect(scope.thing).toEqual(undefined);

            compiledElem.triggerHandler('blur');

            expect(scope.thing).toEqual('TEXT');
            
        });
    });
    
});

