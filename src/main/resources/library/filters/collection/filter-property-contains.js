Neosavvy.AngularCore.Filters.filter('nsCollectionFilterPropertyContains', function () {
    return function (collection, property, value) {
        if (collection && value) {
            return collection.filter(function (item) {
                return (String(Neosavvy.Core.Utils.MapUtils.get(item, property)).toLowerCase().indexOf(String(value).toLowerCase()) !== -1);
            });
        }
        return collection;
    };
});