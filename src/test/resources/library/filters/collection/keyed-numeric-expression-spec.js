describe("nsCollectionKeyedNumericExpression", function () {
    var filter;

    beforeEach(function () {
        module.apply(this, ['neosavvy.angularcore.filters']);

        inject(function ($filter) {
            filter = $filter('nsCollectionKeyedNumericExpression');
        });
    });

    it('Should return an empty array when no data is passed', function () {
        expect(filter()).toEqual([]);
    });

    it('Should return an empty array if no expressions to properties are passed', function () {
        expect(filter([25, 67, 34])).toEqual([25, 67, 34]);
    });

    it("Should be able to filter on a single expression index", function () {
        expect(filter([
            {age: 62},
            {age: 68},
            {age: 90},
            {age: 14}
        ], {age: ">= 63"})).toEqual([
                {age: 68},
                {age: 90}
            ]);
    });

    it("Should be able to filter on a nested expression key", function () {
        expect(filter([
            {age: {yesterday: {tomorrow: 62}} },
            {age: {yesterday: {tomorrow: 18}} },
            {age: {yesterday: {tomorrow: 90}} },
            {age: {yesterday: {tomorrow: 68}} }
        ], {age: ">= 63"}, 'age.yesterday.tomorrow')).toEqual([
                {age: {yesterday: {tomorrow: 90}} },
                {age: {yesterday: {tomorrow: 68}} }
            ]);
    });

    it("Should play nice with string based values", function () {
        expect(filter([
            {time: "5"},
            {time: "6"},
            {time: "9"}
        ], {time: "=9"})).toEqual([
                {time: "9"}
            ]);
    });

    it("Should play nice with single equals", function () {
        expect(filter([
            {time: "5"},
            {time: 0},
            {time: 9}
        ], {time: "=9"})).toEqual([
                {time: 9}
            ]);
    });

    it("Should play nice with greater than", function () {
        expect(filter([
            {time: "5"},
            {time: 0},
            {time: 9}
        ], {time: ">4"})).toEqual([
                {time: "5"},
                {time: 9}
            ]);
    });

    it("Should play nice with less than", function () {
        expect(filter([
            {time: "5"},
            {time: 0},
            {time: 9}
        ], {time: "<5"})).toEqual([
                {time: 0}
            ]);
    });

    it("Should play nice with greater than equal to", function () {
        expect(filter([
            {time: "5"},
            {time: 0},
            {time: 9}
        ], {time: ">=5"})).toEqual([
                {time: "5"},
                {time: 9}
            ]);
    });

    it("Should play nice with less than equal to", function () {
        expect(filter([
            {time: "5"},
            {time: 0},
            {time: 9}
        ], {time: "<=5"})).toEqual([
                {time: "5"},
                {time: 0}
            ]);
    });

    it("Should play nice with negatives", function () {
        expect(filter([
            {time: "5"},
            {time: 0},
            {time: -12},
            {time: -90},
            {time: 9}
        ], {time: "=-12"})).toEqual([
                {time: -12}
            ]);
    });

    it("Should play nice with multi keys", function () {
        expect(filter([
            {time: "5", color: "6"},
            {time: 0, color: 44},
            {time: -12, color: 0},
            {time: -90, color: -3},
            {time: 9, color: 17}
        ], {time: "<9", color: "> 16"})).toEqual([
                {time: 0, color: 44}
            ]);
    });
});