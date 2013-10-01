describe("nsLogicalIf", function () {
    var filter, $parse;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.filters']);

        inject(function ($injector) {
            $parse = $injector.get('$parse');
            filter = $injector.get('$filter')('nsLogicalIf');
        });
    });

    it("Should play nice with true", function () {
        expect(filter(true, 5, 10)).toEqual(5);
    });

    it("Should play nice with false", function () {
        expect(filter(false, 5, 10)).toEqual(10);
    });

    it("Should play nice with a parsed input expression", function () {
        expect(filter($parse('5 < 6')(), "TRUE VALUE", "FALSE VALUE")).toEqual("TRUE VALUE");
    });

    it("Should play nice with other parsed input expressions", function () {
        expect(filter($parse('"Hello" === "OtherHello"')(), "TRUE VALUE", "FALSE VALUE")).toEqual("FALSE VALUE");
    });
});