describe("jQuery.bind-first", function () {
    var $body = $('body'),
        $myButton,
        normalBindingCalled = 0,
        firstBindingCalled = 0,
        order = 0,
        standardBindFirstHandler = function (e) {
            order++;
            firstBindingCalled = order;
        },
        ordered = function (expression) {
            normalBindingCalled = 0;
            firstBindingCalled = 0;
            order = 0;
            expression();
        };

    beforeEach(function () {
        $body.append('<button id="my-button"></button>');
        $myButton = $body.find('#my-button');
    });

    afterEach(function () {
        $body.remove('#my-button');
        normalBindingCalled = 0;
        firstBindingCalled = 0;
        order = 0;
    });

    it("Should append my-button to the dom", function () {
        expect($body.find('#my-button').length).toEqual(1);
    });

    describe("bind", function () {

        beforeEach(function() {
            $myButton.bind('click', function (e) {
                order++;
                normalBindingCalled = order;
            });
        });

        it("Should be able to use bindFirst to move an event forward before another", function () {
            expect(normalBindingCalled).toEqual(0);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(0);
            expect(normalBindingCalled).toEqual(1);
            expect(order).toEqual(1);


            $myButton.bindFirst('click', standardBindFirstHandler);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(1);
            expect(normalBindingCalled).toEqual(2);

            //Try again
            $myButton.click();
            expect(firstBindingCalled).toEqual(3);
            expect(normalBindingCalled).toEqual(4);
        });

        afterEach(function() {
            $myButton.unbind();
        });
    });

    describe("delegate", function () {
        beforeEach(function() {
            $(document).delegate('body #my-button', 'click keypress', function (e) {
                order++;
                normalBindingCalled = order;
            });
        });

        it("Should be able to use delegateFirst to move an event forward before another", function () {
            expect(normalBindingCalled).toEqual(0);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(0);
            expect(normalBindingCalled).toEqual(1);
            expect(order).toEqual(1);


            $body.delegateFirst('button', 'click keypress', standardBindFirstHandler);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(1);
            expect(normalBindingCalled).toEqual(2);

            //Try again
            $myButton.click();
            expect(firstBindingCalled).toEqual(3);
            expect(normalBindingCalled).toEqual(4);

        });

        afterEach(function() {
            $body.undelegate();
            $(document).undelegate();
        });
    });

    describe("live", function () {
        beforeEach(function() {
            $(document).delegate('body #my-button', 'click keypress', function (e) {
                order++;
                normalBindingCalled = order;
            });
        });

        it("Should be able to use liveFirst to move an event forward before another", function () {
            expect(normalBindingCalled).toEqual(0);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(0);
            expect(normalBindingCalled).toEqual(1);
            expect(order).toEqual(1);


            $myButton.liveFirst('click', standardBindFirstHandler);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(1);
            expect(normalBindingCalled).toEqual(2);

            //Try again
            $myButton.click();
            expect(firstBindingCalled).toEqual(3);
            expect(normalBindingCalled).toEqual(4);
        });

        afterEach(function() {
            $(document).undelegate();
        });
    });

    describe("on", function () {
        beforeEach(function() {
           $myButton.on('click', function (e) {
               order++;
               normalBindingCalled = order;
           });
        });

        it("Should be able to use onFirst to move an event forward before another", function () {
            expect(normalBindingCalled).toEqual(0);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(0);
            expect(normalBindingCalled).toEqual(1);
            expect(order).toEqual(1);


            $myButton.onFirst('click', standardBindFirstHandler);
            ordered(function () {
                $myButton.click();
            });
            expect(firstBindingCalled).toEqual(1);
            expect(normalBindingCalled).toEqual(2);

            //Try again
            $myButton.click();
            expect(firstBindingCalled).toEqual(3);
            expect(normalBindingCalled).toEqual(4);
        });

        afterEach(function() {
            $myButton.off();
        });
    });

});