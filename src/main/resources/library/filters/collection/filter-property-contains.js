/**
 * @ngdoc filter
 * @name neosavvy.angularcore.filters:nsCollectionFilterPropertyContains
 * @function
 *
 * @description
 * This returns items in the collection that contain the string specified in the value.
 *
 * Example of the inputs:
 *   collection: [{name:'Mr. Adam', value:1},{name:'Mr. Trevor', value:2},{name:'Dr. Chris',value:3}]
 *   property: name
 *   value: 'Dr.'
 *
 * Will return
 *  [{name:'Dr. Chris',value:3}]
 *
 *
 * @example
 * <pre>
 * <input ng-model={{someCollection | nsCollectionFilterPropertyContains:'propertyName':val}}/>
 * </pre>
 *
 * <pre>
 * <input ng-model={{someCollection | nsCollectionFilterPropertyContains:'deep.property.name':val}}/>
 * </pre>
 */
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