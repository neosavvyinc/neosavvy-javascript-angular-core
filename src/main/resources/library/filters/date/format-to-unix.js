Neosavvy.AngularCore.Filters.filter('nsDateFormatToUnix', function () {
    return function (val, format) {

        if( Neosavvy.Core.Utils.StringUtils.isBlank(val) ) {
            return val
        }

        val = moment(val, (format || undefined));

        if (!Neosavvy.Core.Utils.StringUtils.isBlank(val) && val.isValid()) {
            return val.unix();
        } else {
            throw "You have passed invalid input to hbDateFormatToUnix filter";
        }


    };
});