describe("nsDateFormatToUnix", function () {
    var filter;

    beforeEach(function () {
        this.addMatchers(NeosavvyTest.Matchers);
    });
    beforeEach(function () {
        module.apply(this, Neosavvy.AngularCore.Dependencies);
        inject(function ($injector) {
            filter = $injector.get('$filter')('nsDateFormatToUnix');
        });
    });

    it("Should return undefined if the input is", function () {
        expect(filter(undefined)).toBeUndefined();
    });

    it("Should return null if the input is", function () {
        expect(filter(null)).toBeNull();
    });

    it("Should return a blank string if the input is", function () {
        expect(filter("")).toEqual("");
    });

    it("Should return a formatted date without a format specified", function () {
        expect(filter('2010-10-20')).toEqual(1287547200);
    });

    it("Should throw an error if moment doesn't understand the input", function() {
        expect(function () {
            filter("gobblygook");
        }).toThrow();
    })

    it("Should be able to specify a format", function () {
        expect(filter('10-10;2009', 'DD-MM;YYYY')).toEqual(1255147200);
    });

    it("Should return values of all digits", function () {
        expect(filter('2010-10-20')).toBeTypeOf('number');
    });

    it("Should return values with length 10", function () {
        expect(String(filter("2010")).length).toEqual(10);
    });
});