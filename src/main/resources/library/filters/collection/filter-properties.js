/**
 * @ngdoc filter
 * @name neosavvy.angularcore.filters:nsCollectionFilterProperties
 * @function
 *
 * @description
 * This returns the intersection of collection and values based on property
 * including deep properties.
 *
 * Example of the inputs:
 *   collection: [{name:'adam', value:1},{name:'trevor', value:2},{name:'chris',value:3}]
 *   property: name
 *   values: ['adam,'chris']
 *
 * Will return
 *  [{name:'adam', value:1},{name:'chris',value:3}]
 *
 *
 * @example
 * <pre>
 * <input ng-model={{someCollection | nsCollectionFilterProperties:'propertyName':[val1,val2]}}/>
 * </pre>
 *
 * <pre>
 * <input ng-model={{someCollection | nsCollectionFilterProperties:'deep.property.name':[val1,val2]}}/>
 * </pre>
 */
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