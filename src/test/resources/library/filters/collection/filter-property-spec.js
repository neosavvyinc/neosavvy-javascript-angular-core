describe("nsCollectionFilterProperty", function () {
    var filter;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.filters']);
        inject(function ($injector) {
            filter = $injector.get('$filter')("nsCollectionFilterProperty");
        })
    });

    it("Should return undefined or null if the collection is", function () {
        expect(filter(undefined)).toBeUndefined();
        expect(filter(null)).toBeNull();
    });

    it("Should return an empty collection if the collection is", function () {
        expect(filter([])).toEqual([]);
    });

    it("Should match items in the collection to the value if the property is undefined or null", function () {
        expect(filter([5, 6, 7, "tom", 5], null, 5)).toEqual([5, 5]);
    });

    it("Should play nice with single properties", function () {
        expect(filter([
            {color: 5},
            {color: 6},
            {name: 7},
            {color: "tom"},
            {color: 5}
        ], "color", 5)).toEqual([
            {color: 5},
            {color: 5}
        ]);
    });

    it("Should play nice with dot properties", function () {
        expect(filter([
            {color: 5},
            {color: {wind: 6}},
            {name: 7},
            {color: "tom"},
            {color: {wind: 5}}
        ], "color.wind", 5)).toEqual([
            {color: {wind: 5}}
        ]);
    });

    it("Should return the original collection in the case of a null value", function () {
        expect(filter([
            {color: 5},
            {color: {wind: null, name: "Troy"}},
            {name: 7},
            {color: "tom"},
            {color: {wind: 5}}
        ], "color.wind", null)).toEqual([
            {color: 5},
            {color: {wind: null, name: "Troy"}},
            {name: 7},
            {color: "tom"},
            {color: {wind: 5}}
        ]);
    });
});