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

            xit('should call bindFirst if high priority is specified', function () {

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

        });

        xdescribe('nsEvent params > 2', function () {
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
        });
        
        
    });
    
    
});

