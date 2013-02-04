var Neosavvy = Neosavvy || {};
Neosavvy.Traits = Neosavvy.Traits || {};

Neosavvy.Traits = function () {
    if (arguments.length) {
        var options = arguments[arguments.length - 1];
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length - 1; i++) {
                if (Neosavvy.TraitConstructors[arguments[i]]) {
                    options = new Neosavvy.TraitConstructors[arguments[i]](options);
                } else {
                    throw "You have not defined a constructor the specified trait. Please check your spelling."
                }
            }
        }
        return options;
    } else {
        throw "You must pass directive options in order to define a directive with traits."
    }
};