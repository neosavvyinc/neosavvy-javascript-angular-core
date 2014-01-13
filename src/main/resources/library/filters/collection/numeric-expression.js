/**
 * @ngdoc filter
 * @name neosavvy.angularcore.filters:nsCollectionNumericExpression
 * @function
 *
 * @description
 * Allows filtering for a collection based on the index of a property and the numeric expression that corresponds to it.
 *
 * Example of the inputs:
 *   data: [[{val: 1}, {val: 3}], [{val: 4}, {val: 5}], [{val: 1}, {val: 7}]]
 *   expressionAndIndexes: ['', '> 4']
 *   property: 'val'
 *
 * Will return
 *  [[{val: 4}, {val: 5}], [{val: 1}, {val: 7}]]
 *
 *
 * @example
 * <pre>
 * <input ng-model={{someCollection | nsCollectionNumericExpression : expressionsOnTheScope : 'name'}}/>
 * </pre>
 */
Neosavvy.AngularCore.Filters.filter('nsCollectionNumericExpression', ['$parse', function ($parse) {
    return function (data, expressionsAndIndexes, property) {
        if (data && data.length) {
            if (expressionsAndIndexes && expressionsAndIndexes.length) {
                return data.filter(function (item) {
                    for (var i = 0; i < expressionsAndIndexes.length; i++) {
                        var expressionAndProperty = expressionsAndIndexes[i];
                        var expression = expressionAndProperty.expression;
                        if (!(/</.test(expression)) && !(/>/.test(expression))) {
                            expression = expression.replace(/=/g, "==");
                        }
                        var value = (property ? item[parseInt(expressionAndProperty.index)][property] : item[parseInt(expressionAndProperty.index)]);
                        if (expression && /\d/.test(expression) && !$parse(String(value) + expression)()) {
                            return false;
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