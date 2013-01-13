'use strict';

var body = $('body');

var simpleHtml = '';

describe("Tooltip directive", function () {
    var scope, $compile;

    beforeEach(module('moe.directives'));

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        $compile = $compile;

        //Define scope variables below, ex. scope.name = "Tom";
    }));

    afterEach(function () {
        body.empty();
    });

    it('should compile the directive', function () {
        expect(body.find('div').length).toBe(0);

        var mock = $compile(simpleHtml)(scope);

        expect(mock).not.toBeNull();
    });
});
