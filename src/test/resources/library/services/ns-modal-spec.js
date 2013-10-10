describe('nsModal service', function () {

    var nsModal,
        rootScope,
        $document,
        httpBackend,
        templateCache;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.services']);

        inject(function($injector, $rootScope, $httpBackend) {
            nsModal = $injector.get('nsModal');
            rootScope = $rootScope;
            $document = $injector.get('$document');
            templateCache = $injector.get('$templateCache');
            httpBackend = $httpBackend;
        });
    });

    it('should define the nsModal factory', function () {
        expect(nsModal).toBeDefined();
    });

    describe('nsModal.open', function () {
        it('should be defined as a function', function () {
            expect(nsModal.open).toBeDefined();
            expect(typeof nsModal.open).toEqual('function');
        });

        it('should accept 3 parameters', function () {
            var openToString = nsModal.open.toString();
            var regex = /function.*?\(([\s\S]*?)\)/;
            var params = openToString.match(regex)[1].split(',');

            expect(params.length).toEqual(3);
            expect(params[0]).toEqual('scope');
            expect(params[1]).toEqual('templateUrl');
            expect(params[2]).toEqual('closeCallback');
        });

        it('should throw an error if a valid scope is not passed in', function () {
            var myScope;

            function errorWrapper () {
                nsModal.open(myScope, 'template.html');
            }
            
            myScope = undefined
            expect(errorWrapper).toThrow('missing scope parameter');

            myScope = null;
            expect(errorWrapper).toThrow('missing scope parameter');

            myScope = 'myString';
            expect(errorWrapper).toThrow('missing scope parameter');
        });

        it('should throw an error if a valid templateUrl is not passed in', function () {
            var templateUrl;

            function errorWrapper () {
                nsModal.open(rootScope, templateUrl)
            }

            templateUrl = undefined;
            expect(errorWrapper).toThrow('missing template parameter');

            templateUrl = null;
            expect(errorWrapper).toThrow('missing template parameter');

            templateUrl = {};
            expect(errorWrapper).toThrow('missing template parameter');
        });

        describe('opening the modal', function () {
            beforeEach(function () {
                $document.find('.modal-backdrop').remove();
                $document.find('.modal-overlay').remove();
                templateCache.put('myTemplate.html', angular.element('<div>myTemplate</div>'));
            });

            it('should append the backdrop to the DOM', function () {

                expect($document.find('.modal-backdrop').length).toEqual(0);
                expect($document.find('.modal-overlay').length).toEqual(0);

                nsModal.open(rootScope, 'myTemplate.html');

                expect($document.find('.modal-backdrop').length).toEqual(1);
            });

            it('should append the template to the DOM', function () {

                expect($document.find('.modal-backdrop').length).toEqual(0);
                expect($document.find('.modal-overlay').length).toEqual(0);

                nsModal.open(rootScope, 'myTemplate.html');

                rootScope.$apply();
                    
                expect($document.find('.modal-overlay').length).toEqual(1);
            });
        });
        

    });
    
    describe('nsModal.close', function () {
        it('should be defined as a function', function () {
            expect(nsModal.close).toBeDefined();
            expect(typeof nsModal.close).toEqual('function');

        });

        describe('closing the modal', function () {

            beforeEach(function () {
                $document.find('.modal-backdrop').remove();
                $document.find('.modal-overlay').remove();
                templateCache.put('myTemplate.html', angular.element('<div>myTemplate</div>'));
            });

            it('should remove the modal from the page', function () {

                expect($document.find('.modal-backdrop').length).toEqual(0);

                nsModal.open(rootScope, 'myTemplate.html');
                rootScope.$apply();

                expect($document.find('.modal-backdrop').length).toEqual(1);

                nsModal.close();
                rootScope.$apply();

                expect($document.find('.modal-backdrop').length).toEqual(0);
                    
            });

            it('should call the close callback', function () {
                expect($document.find('.modal-backdrop').length).toEqual(0);

                var spyFn = jasmine.createSpy('myFn');

                nsModal.open(rootScope, 'myTemplate.html', spyFn);
                rootScope.$apply();

                expect($document.find('.modal-backdrop').length).toEqual(1);

                nsModal.close();
                rootScope.$apply();

                expect(spyFn).toHaveBeenCalled();
            });
        });
        
    });
    
});

