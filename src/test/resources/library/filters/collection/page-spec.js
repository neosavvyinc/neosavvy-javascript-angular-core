describe("nsCollectionPage", function () {
    var filter;

    describe('page', function() {

        beforeEach(function() {
            module.apply(module, ['neosavvy.angularcore.filters'])

            inject(function($filter){
                filter = $filter('nsCollectionPage');
            })
        })

        it('Should return an empty array when no data is passed', function() {
            expect(filter()).toEqual([]);
        })

        it('Should return the first item of a 3 item array when count = 1', function() {

            var items = [1,2,3];
            var page1 = filter( items, 0, 1);
            var page2 = filter( items, 1, 1);
            var page3 = filter( items, 2, 1);
            expect(page1[0]).toEqual(1);
            expect(page2[0]).toEqual(2);
            expect(page3[0]).toEqual(3);


        });

        it('Should return the first page of data in a 10 item set with 3 item pages', function() {

            var items = [1,2,3,4,5,6,7,8,9,10];

            var page1 = filter( items, 0, 3);

            expect(page1).toBeDefined();
            expect(page1.length).toEqual(3);
            expect(page1[0]).toEqual(1);
            expect(page1[1]).toEqual(2);
            expect(page1[2]).toEqual(3);

        });

        it('Should return the last page of data in a 10 item set with 3 item pages', function() {
            var items = [1,2,3,4,5,6,7,8,9,10];

            var lastPage = filter( items, 3, 3);

            expect(lastPage).toBeDefined();
            expect(lastPage.length).toEqual(1);
            expect(lastPage[0]).toEqual(10);

        });

        it('Should silently return no data when asking for a page that has no data', function() {

            var items = [1,2,3,4,5,6,7,8,9,10];

            var pageOutsideDataSet = filter( items, 4, 3);

            expect(pageOutsideDataSet ).toBeDefined();
            expect(pageOutsideDataSet.length).toEqual(0);

        })

    })
});