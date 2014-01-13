describe('nsModal service', function () {

    var nsModal,
        rootScope,
        $document,
        $http,
        templateCache;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.services']);

        inject(function($injector, $rootScope, _$http_) {
            nsModal = $injector.get('nsModal');
            rootScope = $rootScope;
            $document = $injector.get('$document');
            $http = _$http_;
            templateCache = $injector.get('$templateCache');
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
            expect(params[1]).toEqual('template');
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

        it('should throw an error if the template parameter is not a string or object', function () {
            expect(function () {
                nsModal.open(rootScope, true);
            }).toThrow();
        });

        it('should throw an error if a valid template is not passed in', function () {
            var template;

            function errorWrapper () {
                nsModal.open(rootScope, template)
            }

            template = undefined;
            expect(errorWrapper).toThrow('missing template parameter');

            template = null;
            expect(errorWrapper).toThrow('missing template parameter');
        });

        describe('opening the modal', function () {
            var $timeout;
            beforeEach(function () {
                $document.find('.modal-backdrop').remove();
                $document.find('.modal-overlay').remove();
                inject(function (_$timeout_) {
                    $timeout = _$timeout_;
                });
            });

            it('should add an ng-include for a template if the template url is passed in', function () {
                 var httpSpy = spyOn($http, 'get').andReturn({success: function () {
                     return { error: function  () { }};
                 }});

                 nsModal.open(rootScope, '1/2/3/fake/path.html');
                 rootScope.$digest();
                 expect(httpSpy).toHaveBeenCalledWith('1/2/3/fake/path.html', { cache: templateCache });
            });

            it('should append the backdrop to the DOM', function () {

                expect($document.find('.modal-backdrop').length).toEqual(0);
                expect($document.find('.modal-overlay').length).toEqual(0);

                nsModal.open(rootScope, angular.element('<div>myTemplate.html</div>'));
                $timeout.flush();
                expect($document.find('.modal-backdrop').length).toEqual(1);
            });

            it('should append the template to the DOM', function () {

                expect($document.find('.modal-backdrop').length).toEqual(0);
                expect($document.find('.modal-overlay').length).toEqual(0);

                nsModal.open(rootScope, angular.element('<div>myTemplate.html</div>'));

                rootScope.$apply();
                $timeout.flush(); 
                expect($document.find('.modal-overlay').length).toEqual(1);
            });
        });

    });

    describe('nsModal.close', function () {
        var $timeout;
        it('should be defined as a function', function () {
            expect(nsModal.close).toBeDefined();
            expect(typeof nsModal.close).toEqual('function');

        });

        describe('closing the modal', function () {

            beforeEach(function () {
                $document.find('.modal-backdrop').remove();
                $document.find('.modal-overlay').remove();
                inject(function (_$timeout_) {
                    $timeout = _$timeout_;
                });
            });

            it('should remove the modal from the page', function () {

                expect($document.find('.modal-backdrop').length).toEqual(0);

                nsModal.open(rootScope, angular.element('<div>myTemplate.html</div>'));
                rootScope.$apply();
                $timeout.flush();
                expect($document.find('.modal-backdrop').length).toEqual(1);

                nsModal.close();
                rootScope.$apply();
                $timeout.flush();
                expect($document.find('.modal-backdrop').length).toEqual(0);
            });

            it('should call the close callback', function () {
                expect($document.find('.modal-backdrop').length).toEqual(0);

                var spyFn = jasmine.createSpy('myFn');

                nsModal.open(rootScope, angular.element('myTemplate.html'), spyFn);
                rootScope.$apply();
                $timeout.flush();

                expect($document.find('.modal-backdrop').length).toEqual(1);

                nsModal.close();
                rootScope.$apply();
                $timeout.flush();

                expect(spyFn).toHaveBeenCalled();
            });

            it('should not call the close callback if modal is not open', function () {
                expect($document.find('.modal-backdrop').length).toEqual(0);

                var spyFn = jasmine.createSpy('myFn');

                nsModal.close();
                rootScope.$apply();

                expect(spyFn).not.toHaveBeenCalled();
            });
        });
    });
});

