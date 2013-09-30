Neosavvy.AngularCore.Filters.filter('nsCollectionPage', function () {
    return function (collection, page, count) {
        if (collection && collection.length) {
            if (page !== undefined && count) {
                var start = page * count;
                return collection.slice(start, Math.min(start + count, collection.length));
            }
        } else {
            collection = [];
        }
        return collection;
    };
});