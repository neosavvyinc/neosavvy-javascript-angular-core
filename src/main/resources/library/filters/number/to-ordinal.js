Neosavvy.Filters.filter('numberToOrdinal', function () {
    return function (value) {
        if (value || value == 0) {
            return Neosavvy.Core.Utils.NumberUtils.toOrdinal(value);
        }
        return null;
    }
});