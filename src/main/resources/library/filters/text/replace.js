Neosavvy.AngularCore.Filters.filter("nsTextReplace", function() {
    return function(val) {
        if (!_.isEmpty(val) && arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                val = val.replace(new RegExp(arguments[i], 'g'), "");
            }
        }
        return val;
    };
});
