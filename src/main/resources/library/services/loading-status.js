Neosavvy.AngularCore.Services.factory('nsLoadingStatusService', function () {

    var indicators = {},
        wrapFunction = function (wrapFn, identifier) {
            if (!identifier)
                throw 'a valid identifier was not provided, did you forget to include one?';

            return _.partial(function (fn) {
                indicators[identifier] = true;
                return fn.apply(null, _.rest(arguments))['finally'](function () {
                        indicators[identifier] = false; 
                    });
            }, wrapFn)
        };

    return {
        wrapService: wrapFunction,
        registeredIndicators: indicators
    }
});
