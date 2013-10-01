ddescribe('nsModal service', function () {

    var nsModal;

    beforeEach(function () {
        module.apply(module, ['neosavvy.angularcore.services']);

        inject(function($injector) {
            nsModal = $injector.get('nsModal');
        });
    });

    it('should define the nsModal factory', function () {
        expect(nsModal).toBeUndefined();
    });
});

