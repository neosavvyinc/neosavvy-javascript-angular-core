Neosavvy.AngularCore.Filters.filter('nsTextMarkdown',
    ['$sce', function ($sce) {
        return function (value) {
            if (/<[a-z][\s\S]*>/i.test(value) == false) {
                var converter = new Showdown.converter();
                var html = converter.makeHtml(value || '');
            } else {
                var html = value;
            }
            return $sce.trustAsHtml(html);
        };
    }]);