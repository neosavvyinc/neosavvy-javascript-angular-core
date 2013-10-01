/**
 * @ngdoc filter
 * @name neosavvy.angularcore.filters:nsCollectionFilterProperty
 * @function
 *
 * @description
 * This returns the intersection of collection and values based on property
 * including deep properties. Very similar to nsCollectionFilterProperties, with a slight efficiency
 * gain for a single property.
 *
 * Example of the inputs:
 *   collection: [{name:'adam', value:1},{name:'trevor', value:2},{name:'chris',value:3}]
 *   property: name
 *   values: 'trevor'
 *
 * Will return
 *  [{name: 'trevor'}]
 *
 *
 * @example
 * <pre>
 * <input ng-model={{someCollection | nsCollectionFilterProperties:'propertyName':val}}/>
 * </pre>
 *
 * <pre>
 * <input ng-model={{someCollection | nsCollectionFilterProperties:'deep.property.name':val}}/>
 * </pre>
 */
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