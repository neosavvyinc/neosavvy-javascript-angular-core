Neosavvy.AngularCore.Filters.filter("nsTruncate", function () {
    return function (val, length) {
        if (!_.isEmpty(val) && length < val.length) {
            val = val.slice(0, length) + "...";
        }
        return val;
    };
});