describe("nsCollectionFilterProperties", function () {
    var filter;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.filters']);
        inject(function ($injector) {
            filter = $injector.get('$filter')("nsCollectionFilterProperties");
        })
    });

    it("Should return undefined or null if the collection is undefined or null", function () {
        expect(filter(undefined)).toBeUndefined();
        expect(filter(null)).toBeNull();
    });

    it("Should return an empty collection if the collection is an empty array", function () {
        expect(filter([])).toEqual([]);
    });

    it("Should filter out the intersection of two simple arrays", function () {
        var result = filter([5, 6, 7, 8, 5], null, [5,6])
        expect(result).toEqual([5, 6, 5]);
    });

    it("Should filter out the intersection of two non-trivial arrays based on a property name", function() {
        var result = filter([{name:'adam', value:1},{name:'trevor', value:2},{name:'chris',value:3}],
            "name",
            ["adam", "chris"]);

        expect(result).toEqual([{name:'adam', value:1},{name:'chris',value:3}]);
    })

});