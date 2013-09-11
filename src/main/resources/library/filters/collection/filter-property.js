Neosavvy.AngularCore.Filters.filter('nsCollectionFilterProperty', function () {
    return function (collection, property, value) {
        if (collection && value) {
            return collection.filter(function (item) {
                return (Neosavvy.Core.Utils.MapUtils.get(item, property) === value);
            });
        }
        return collection;
    };
});