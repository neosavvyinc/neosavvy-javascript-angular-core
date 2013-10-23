describe("nsNumericClamp", function () {
    var filter;

    beforeEach(function () {
        module.apply(module, Neosavvy.AngularCore.Dependencies);
        inject(function ($injector) {
            filter = $injector.get('$filter')('nsNumericClamp');
        });
    });

    it("Should pass through undefined strings", function () {
        expect(filter(undefined, 0, 27)).toBeUndefined();
    });

    it("Should pass through any string that is not a number", function () {
        expect(filter("Some Dudes Name 66", 55, 89)).toEqual("Some Dudes Name 66");
    });

    it("Should work with just a min", function () {
        expect(filter(19, 18)).toEqual(19);
        expect(filter(15, 22)).toEqual(22);
        expect(filter(-3, -2.2)).toEqual(-2.2);
    });

    it("Should work with just a max if the min is null or undefined", function () {
        expect(filter(300, undefined, 400)).toEqual(300);
        expect(filter(17.56, null, 17.5)).toEqual(17.5);
        expect(filter(-1.1, null, -1.2)).toEqual(-1.2);
    });

    it("Should work with both a min and a max", function () {
        expect(filter(0, 10, 20)).toEqual(10);
        expect(filter(117, 10.5, 10.5)).toEqual(10.5);
    });

    it("Should throw an error when given an impossible clamp", function () {
        expect(function () {
            filter(18, 19, 17);
        }).toThrow();
    });
});