describe("nsCollectionNumericExpression", function () {
    var filter;

    describe('numericExpression', function () {
        beforeEach(function () {
            module.apply(module, ['neosavvy.angularcore.filters']);

            inject(function ($filter) {
                filter = $filter('nsCollectionNumericExpression');
            });
        });

        it('Should return an empty array when no data is passed', function () {
            expect(filter()).toEqual([]);
        });

        it('Should return an empty array if no expressions to properties are passed', function () {
            expect(filter([25, 67, 34])).toEqual([25, 67, 34]);
        });

        it('Should be able to filter by an arbitrary expression on a field', function () {
            var data = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 0]
            ];
            var expressionsAndIndexes = [{expression: "", index: 2}];
            expect(filter(data, expressionsAndIndexes)).toEqual([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 0]
            ]);
        });

        it('Should return the original collection when the expression is blank', function () {
            var data = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 0]
            ];
            var expressionsAndIndexes = [{expression: ">6", index: 1}];
            expect(filter(data, expressionsAndIndexes)).toEqual([[7, 8, 0]]);
        });

        it('Should play nice with multiple expressions', function () {
            var data = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 0]
            ];
            var expressionsAndIndexes = [{expression: ">3", index: 1}, {expression: "<6", index: 0}];
            expect(filter(data, expressionsAndIndexes)).toEqual([[4, 5, 6]]);
        });

        it('Should return empty when an expression is mal-formed', function () {
            var data = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 0]
            ];
            var expressionsAndIndexes = [{expression: ">$3", index: 1}, {expression: "<6", index: 0}];
            expect(filter(data, expressionsAndIndexes)).toEqual([]);
        });
    });
});