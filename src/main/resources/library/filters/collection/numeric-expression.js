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