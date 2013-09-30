describe('nsTruncate filter', function () {

    var nsTruncate;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.filters']);

        inject(function($filter) {
            nsTruncate = $filter('nsTruncate');
        });
    });
    
    it('should return the passed in value if it is empty', function () {
        var response = nsTruncate('');
        expect(response).toEqual('');

        response = nsTruncate();
        expect(response).toEqual();

        response = nsTruncate(undefined);
        expect(response).toEqual(undefined);
    });

    it('should return the passed in value if it is length than the max length', function () {

        var response = nsTruncate("hello", 5);
        expect(response).toEqual("hello");

    });

    it('should return a truncated version of the string if the passed in value is greater than the max', function () {
        var response = nsTruncate("hello hello hello", 5);
        expect(response).toEqual("hello...");
    });
});

