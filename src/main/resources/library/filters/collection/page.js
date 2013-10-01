/**
 * @ngdoc filter
 * @name neosavvy.angularcore.filters:nsCollectionPage
 * @function
 *
 * @description
 * Allows data pagination through the manipulation of a couple simple scope variables.
 *
 * Example of the inputs:
 *   collection: [1, 3, 5, 8, 10, 11, 12, 27, 18, 28]
 *   page: 1
 *   count: 3
 *
 * Will return
 *  [8, 10, 11]
 *
 *
 * @example
 * <pre>
 * <label ng-repeat="item in someCollectionOnScope | nsCollectionPage : pageNumber : 10" ng-bind="item.name"></label>
 * </pre>
 */
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