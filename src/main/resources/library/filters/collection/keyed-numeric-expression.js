/**
 * @ngdoc filter
 * @name neosavvy.angularcore.filters:nsCollectionKeyedNumericExpression
 * @function
 *
 * @description
 * Allows filtering for a collection based on the index of a property and the numeric expression that corresponds to it.
 *
 * Example of the inputs:
 *   data: [[{val: 1}, {val: 3}], [{val: 4}, {val: 5}], [{val: 1}, {val: 7}]]
 *   propertyToExpressions: {val: '!=3'}
 *   property: 'val'
 *
 * Will return
 *  [[{val: 4}, {val: 5}], [{val: 1}, {val: 7}]]
 *
 *
 * @example
 * <pre>
 * <input ng-model={{someCollection | nsCollectionKeyedNumericExpression : expressionsOnTheScope : 'name'}}/>
 * </pre>
 */
Neosavvy.AngularCore.Filters.filter('nsCollectionKeyedNumericExpression', ['$parse', function ($parse) {
    return function (data, propertyToExpressions, property) {
        if (data && data.length) {
            if (propertyToExpressions && _.keys(propertyToExpressions).length) {
                return data.filter(function (item) {
                    for (var key in propertyToExpressions) {
                        if (!Neosavvy.Core.Utils.StringUtils.isBlank(propertyToExpressions[key])) {
                            var expression = propertyToExpressions[key];
                            if (!(/</.test(expression)) && !(/>/.test(expression))) {
                                expression = expression.replace(/=/g, "==");
                            }
                            if (expression && /\d/.test(expression) &&
                                !$parse(String(Neosavvy.Core.Utils.MapUtils.highPerformanceGet(item, (property || key))) + expression)()) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
            return data;
        }
        return [];
    };
}]);