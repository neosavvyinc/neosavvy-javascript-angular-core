describe('nsEvent directives', function () {

    var compile,
        rootScope;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.directives']);

        inject(function($compile, $rootScope) {
            compile = $compile;
            rootScope = $rootScope;  
        });
    });


    describe('sad path', function () {

        it('should throw an error if not enough parameters are passed in', function () {
            var template = '<div ns-event=""></div>';

            function errorHandler () {
                rootScope.$apply(function() {
                    compile(template)(rootScope);
                });
            }

            expect(errorHandler).toThrow('Specify an event and handler in order to use the ns-event directive!');
        });

    });

    describe('happy path', function () {
        describe('nsEvent params === 2', function () {

            var scope;

            beforeEach(function () {
                scope = rootScope.$new();
            });

            it('should call the element\'s bind method', function () {

                spyOn(angular.element.prototype, 'bind').andCallThrough();

                scope.event1 = "eventOneName";
                scope.event1Handler = function() {
                    return "event1 handled";
                }

                var template = '<div ns-event="{{event1}}, event1Handler"></div>',
                    compiledElem;

                scope.$apply(function() {
                    compiledElem = compile(template)(scope);
                });

                expect(angular.element.prototype.bind).toHaveBeenCalled();

            });

            it('should call bindFirst if high priority is specified', function () {

                spyOn(angular.element.prototype, 'bindFirst').andCallThrough();

                scope.event1 = "eventOneName";
                scope.event1Handler = function() {
                    return "event1 handled";
                }

                var template = '<div ns-event="{{event1}}, event1Handler" ns-event-high-priority="true"></div>',
                    compiledElem;

                scope.$apply(function() {
                    compiledElem = compile(template)(scope);
                });

                expect(angular.element.prototype.bindFirst).toHaveBeenCalled();
            });

            it('should call the handler', function () {

                scope.event = "eventName";
                scope.eventHandler = function() {
                    return "event handler";
                }

                spyOn(scope, 'eventHandler').andCallThrough();

                var template = '<div ns-event="{{event}}, eventHandler"></div>',
                    compiledElem;

                scope.$apply(function() {
                    compiledElem = compile(template)(scope);
                });

                expect(scope.eventHandler).not.toHaveBeenCalled();
                
                compiledElem.triggerHandler('eventName');

                expect(scope.eventHandler).toHaveBeenCalled();

            });

            it("Should be able to read a value off of a parent scope, in case it is not available on the current scope", function () {
                var called = 0;
                var myScope = rootScope.$new();
                myScope.someHandlerOnParent = function() {
                    called++;
                };

                var isolateScope = myScope.$new(true);
                var compiled = compile(angular.element('<div ns-event="click, someHandlerOnParent"></div>'))(isolateScope);
                isolateScope.$digest();

                //Should call the function on the parent scope
                expect(called).toEqual(0);
                compiled.click();
                isolateScope.$digest();
                expect(called).toEqual(1);
            });

            it("Should throw an errow when the handler is not found on the scope chain", function () {
                var compiled = compile(angular.element('<div ns-event="click, someNonExistentHandler"></div>'))(scope);
                scope.$digest();

                expect(function () {
                    compiled.click();
                    scope.$digest();
                }).toThrow();
            });

        });

        describe('nsEvent params > 2', function () {
            var scope;

            beforeEach(function () {
                scope = rootScope.$new();
            });

            it('should  /* does things /*', function () {

                scope.eventOne = "eventNameOne";
                scope.eventTwo = "eventNameTwo";
                scope.eventHandlerOne = function() {
                    return "event handler one";
                }
                scope.eventHandlerTwo = function() {
                    return "event handler two";
                }

                spyOn(scope, 'eventHandlerOne').andCallThrough();
                spyOn(scope, 'eventHandlerTwo').andCallThrough();

                var template = '<div ns-event="{{eventOne}}, {{eventTwo}}, eventHandlerOne, eventHandlerTwo"></div>',
                    compiledElem;

                scope.$apply(function() {
                    compiledElem = compile(template)(scope);
                });
            });

            it("Should be able to use a bindFirst with multiple elements", function () {
                var called = 0;
                var otherHandlerCalled = 0;
                scope.handlerOnScope = function () {
                    called++;
                };
                var handlerNotOnScope = function() {
                    otherHandlerCalled++;
                };
                var template = '<div class="my-div" ns-event="click, handlerOnScope, i, .clickable-class" ns-event-high-priority="true">' +
                    '<i></i>' +
                    '<span class="clickable-class"></span>' +
                    '<span class="other-class"></span>' +
                    '</div>';
                var compiled = compile(angular.element(template))(scope);

                //Should not call when clicking actual element
                expect(called).toEqual(0);
                compiled.click
                scope.$digest();
                expect(called).toEqual(0);

                //Should call when clicking <i>
                compiled.find('i').click();
                scope.$digest();
                expect(called).toEqual(1);

                //Should call when clicking .other-class
                expect(called).toEqual(1);
                compiled.find('.clickable-class').click();
                expect(called).toEqual(2);

                //Should not fire for the other-class child
                compiled.find('.other-class').click();
                expect(called).toEqual(2);
            });
        });
        
        
    });
    
    
});

