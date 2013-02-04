var Neosavvy = Neosavvy || {};
Neosavvy.Directives = Neosavvy.Directives || {};

Neosavvy.Directives.StatefulControl = function(options) {
    if (options) {
        //Defaults
        options.transclude = true;
        options.replace = true;

        if (options.compile) {

        }
    }
    return options;
};