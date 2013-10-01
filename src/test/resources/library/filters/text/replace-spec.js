
describe('nsTextReplace filter', function () {

    var nsTextReplace;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.filters']);

        inject(function($filter) {
            nsTextReplace = $filter('nsTextReplace');
        });
    });
    
    it('should return the passed in value if it is empty', function () {
        var response = nsTextReplace('');
        expect(response).toEqual('');

        response = nsTextReplace(undefined);
        expect(response).toEqual(undefined);
    });

    it('should return the passed in value if the number of arguments is not greater than 1', function () {
        var response = nsTextReplace('mashed potatoes');
        expect(response).toEqual('mashed potatoes');
    });

    it('should return the passed in the string with the correct characters replaced', function () {
        var response = nsTextReplace('mashed potatoes', 'mashed');
        expect(response).toEqual(' potatoes');

        response = nsTextReplace('porkchop sandwiches', 'porkchop ');
        expect(response).toEqual('sandwiches');
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
        expect(difference).toBeLessThan(3000);

    })

});
