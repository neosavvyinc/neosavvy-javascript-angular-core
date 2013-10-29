(function (window, angular) {
    var controllers = {};
    var newInstantiatedController = null;

    function ngControllerDirective(nsAnalytics) {
        var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        return {
            scope: false,
            priority: -100,
            require: 'ngController',
            link: function (scope, element, attrs, ctrl) {
                //matches[1] is the controller name matches[3] is the name in the DOM
                var matches = attrs.ngController.match(CNTRL_REG);
                var name = matches[1];
                controllers[name] = controllers[name] || [];
                controllers[name].push({id: (attrs.id || undefined), name: name, scope: scope, instance: ctrl});

                //Get the new controller up to speed
                newInstantiatedController = controllers[name][controllers[name].length - 1];
                //nsAnalytics(name);
            }
        }
    }

    function nsControllersFactory() {
        return {
            get: function (name) {
                if (!Neosavvy.Core.Utils.StringUtils.isBlank(name)) {
                    if (controllers[name] && controllers[name].length) {
                        return controllers[name];
                    } else {
                        throw "No controllers have been instantiated with this name. Either you have a type or race condition.";
                    }
                } else {
                    return controllers;
                }
            },
            getById: function (name, id) {
                if (controllers[name] && controllers[name].length) {
                    var item = Neosavvy.Core.Utils.CollectionUtils.itemByProperty(controllers[name], "id", id);
                    if (item) {
                        return item;
                    } else {
                        throw "A controller with that dom based ID does not exist, check your spelling or initialization.";
                    }
                } else {
                    throw "No controllers have been instantiated with this name. Either you have a type or race condition.";
                }
            },
            getByScope: function(scope) {
                if (scope) {
                    var item;
                    var id = _.isString(scope) ? scope : scope.$id;
                    for (var i = 0; i < _.values(controllers).length; i++) {
                        var myControllers = _.values(controllers)[i];
                        item = Neosavvy.Core.Utils.CollectionUtils.itemByProperty(myControllers, "scope.$id", id);
                        if (item) {
                            break;
                        }
                    }
                    if (item) {
                        return item;
                    } else {
                        throw "No controller instance was found for the passed in scope or hashKey.";
                    }
                } else {
                    throw "You have passed in an empty scope or $$hashKey for a scope.";
                }
            },
            getLast: function() {
                return newInstantiatedController;
            }
        };
    }

    angular.module('neosavvy.angularcore.controllers').factory('nsControllers', nsControllersFactory);
    angular.module('neosavvy.angularcore.controllers').directive('ngController', ['nsAnalytics', ngControllerDirective]);

    //Clears out controllers for testing and app reloads.
    angular.module('neosavvy.angularcore.controllers').config(function() {
        controllers = {};
    });
})(window, window.angular);