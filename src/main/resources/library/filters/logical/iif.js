Neosavvy.AngularCore.Filters.filter('nsLogiciIif', function () {
    return function (input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});