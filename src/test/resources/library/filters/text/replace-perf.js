describe('nsTextReplace filter', function () {

    var nsTextReplace;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.filters']);

        inject(function($filter) {
            nsTextReplace = $filter('nsTextReplace');
        });
    });

    it('should perform really fast with 1000000 elements', function() {

        var itemsToReplace = [];
        for( var i = 0; i <= 1000000; i++) {
            itemsToReplace[i] = 'porkchop sandwiches';
        }

        var startTime = new Date();
        for( var j = 0; j <= 1000000; j++) {
            itemsToReplace[j] = nsTextReplace(itemsToReplace[j], "porkchop ");
        }
        var endTime = new Date();

        var difference = endTime - startTime;
        expect(difference).toBeLessThan(4500);

    })

});
