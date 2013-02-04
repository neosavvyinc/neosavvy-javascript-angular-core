(function () {

    Neosavvy.Filters.filter('toDateString', function () {
        return function (timeStamp) {
            var date;

            date = new Date(parseInt(timeStamp));

            return date.toLocaleDateString();
        }
    });

    Neosavvy.Filters.filter('toOrdinal', function () {
        return function (value) {
            if (value || value == 0) {
                return Neosavvy.Core.Utils.NumberUtils.toOrdinal(value);
            }
            return null;
        }
    });

    Neosavvy.Filters.filter('toShortMonthAndDateSeparateLines', function () {
        return function (value) {
            if (value) {
                var date = new Date(value);
                var monthComponent = date.strftime("%b.");
                var dayComponent = Neosavvy.Core.Utils.NumberUtils.toOrdinal(date.strftime("%e"));
                return monthComponent + "\n" + dayComponent;
            }
            return null;
        }
    });

    Neosavvy.Filters.filter('toShowTimeTime', function () {
        return function (value) {
            if (value) {
                var dateString = new Date(value).strftime("%I:%M%p");
                dateString = dateString.replace("PM", "");
                dateString = Neosavvy.Core.Utils.StringUtils.replaceIfExistsAtIndex(dateString, "0", "", 0);
                return dateString;
            }
            return null;
        }
    });

    Neosavvy.Filters.filter('toUpcomingDay', function () {
        return function (value) {
            if (value) {
                if (Neosavvy.Core.Utils.DateUtils.sameDay(value, new Date())) {
                    return "Today";
                } else if (Neosavvy.Core.Utils.DateUtils.sameDay(value, Neosavvy.Core.Utils.DateUtils.daysFromNow(1))) {
                    return "Tomorrow";
                }
                return value.strftime("%A");
            }
            return null;
        }
    });

    Neosavvy.Filters.filter('toLabelFromConst', function () {
        return function (value) {
            if (value) {
                return value.replace("_", " ");
            }
            return null;
        }
    });

})();