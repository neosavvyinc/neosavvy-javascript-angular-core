Neosavvy.AngularCore.Filters.filter('nsNumericClamp', function () {
    return function (val, min, max) {
        if (_.isNumber(val)) {
            min = (min || min === 0) ? parseFloat(min) : undefined;
            max = (max || max === 0) ? parseFloat(max) : undefined;
            val = parseFloat(val);
            if (_.isNumber(max) && _.isNumber(min) && max < min) {
                throw "You have created an impossible clamp with this filter.";
            }
            if (min || min === 0) {
                val = Math.max(min, val);
            }
            if (max || max === 0) {
                val = Math.min(max, val);
            }
        }
        return val
    };
});