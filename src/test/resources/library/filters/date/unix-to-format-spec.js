describe("nsDateUnixToFormat", function () {
    var filter;

    beforeEach(function () {
        module.apply(this, Neosavvy.AngularCore.Dependencies);
        inject(function ($injector) {
            filter = $injector.get('$filter')('nsDateUnixToFormat');
        });
    });

    it("Should return undefined when passed undefined", function () {
        expect(filter(undefined)).toBeUndefined();
    });

    it("Should return null when passed null", function () {
        expect(filter(null)).toBeNull();
    });

    it("Should return a blank string when passed a blank string", function () {
        expect(filter("")).toEqual("");
    });

    it("Should throw an error when passed an invalid epoch time", function () {
        expect(function () {
            filter("Steve");
        }).toThrow();
    });

    it("Should return the MMMM Do, YYYY format by default", function () {
        expect(filter("1353542400")).toEqual(moment.unix("1353542400").utc().format("MMMM Do, YYYY"));
    });

    it("Should allow the input to specify a custom format", function () {
        expect(filter("1390176000", "ddd, hA")).toEqual(moment.unix("1390176000").utc().format("ddd, hA"));
    });

});