Neosavvy.AngularCore.Filters.filter('nsCollectionFilterProperties', function () {
    return function (collection, property, values) {
        if (collection && values) {
            return collection.filter(function (item) {
                return (values.indexOf(Neosavvy.Core.Utils.MapUtils.get(item, property)) !== -1);
            });
        }
        return collection;
    };
});