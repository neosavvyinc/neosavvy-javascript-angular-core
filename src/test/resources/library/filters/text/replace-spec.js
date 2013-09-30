
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

});
