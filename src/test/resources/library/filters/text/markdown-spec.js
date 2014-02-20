describe("nsTextMarkdown", function () {
    var filter, $sce;

    beforeEach(function () {
        module.apply(module, Neosavvy.AngularCore.Dependencies);
        inject(function ($injector) {
            filter = $injector.get('$filter')('nsTextMarkdown');
            $sce = $injector.get('$sce');
        });
    });

    it("Should accept a string with no html elements and apply nsTextMarkdown conversion", function () {
        var filteredString = filter("This is a sentence about words.");
        expect($sce.getTrusted($sce.HTML, filteredString)).toEqual("<p>This is a sentence about words.</p>")
    });

    it("Should accept a string with nsTextMarkdown syntax and apply nsTextMarkdown conversion to html", function () {
        var filteredString = filter("#This is a heading");
        expect($sce.getTrusted($sce.HTML, filteredString)).toEqual('<h1 id="thisisaheading">This is a heading</h1>')
    });

    it("Should accept a string with html elements and NOT apply nsTextMarkdown conversion", function () {
        var filteredString = filter("<p>This is a sentence about words.</p>");
        expect($sce.getTrusted($sce.HTML, filteredString)).toEqual("<p>This is a sentence about words.</p>")
    });
});