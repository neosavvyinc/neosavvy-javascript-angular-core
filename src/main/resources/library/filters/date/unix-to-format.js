Neosavvy.AngularCore.Filters.filter('nsDateUnixToFormat', function () {
    return function (val, format) {
        if (!Neosavvy.Core.Utils.StringUtils.isBlank(val)) {
            format = format || 'MMMM Do, YYYY';
            var myMoment = moment.unix(val);
            if (myMoment.isValid()) {
                return myMoment.utc().format(format);
            } else {
                throw "You have passed an invalid epoch time to the date filter.";
            }
        }
        return val;
    };
});