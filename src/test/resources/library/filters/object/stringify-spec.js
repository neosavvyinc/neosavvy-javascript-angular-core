describe("nsStringify", function () {
    var filter;

    beforeEach(function () {
        module.apply(this, Neosavvy.AngularCore.Dependencies);
        inject(function ($injector) {
            filter = $injector.get('$filter')('nsStringify');
        });
    });

    it("Should return undefined if object is undefined", function () {
        expect(filter(undefined)).toBeUndefined();
    });

    it("Should return null if the object is null", function () {
        expect(filter(null)).toBeNull();
    });

    it("Should return a blank string if the object is a blank string", function () {
        expect(filter("")).toEqual("");
    });

    it("Should return a stringified empty object", function () {
        expect(filter({})).toEqual(JSON.stringify({}));
    });

    it("Should return a stringified non empty object", function () {
        expect(filter({name: 'Georgie', age: 92})).toEqual(JSON.stringify({name: 'Georgie', age: 92}));
    });
});