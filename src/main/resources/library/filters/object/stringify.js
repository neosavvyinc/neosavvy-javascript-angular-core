Neosavvy.AngularCore.Filters.filter('nsStringify', function () {
    return function (val) {
        if (val && typeof val === 'object') {
            return JSON.stringify(val);
        }
        return val;
    };
});