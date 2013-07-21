/*! neosavvy-angular-core - v0.1.0 - 2013-07-21
* Copyright (c) 2013 Neosavvy, Inc.; Licensed  */
Neosavvy
    .Directives
    .directive('nsButtonBar', function () {
        return new Neosavvy.Traits("StatefulControl", {
                restrict:'E',
                replace:true,
                templateUrl:'neosavvyinc/javascript-angular-core/library/directives/controls/ns-button-bar.html',
                scope:{
                    labelField:"@labelField",
                    dataField:"@dataField",
                    multiSelect:"=multiSelect",
                    selectedClass:"@selectedClass",
                    items:"=items",
                    selectedItems:"=selectedItems",
                    selectedItem:"=selectedItem",
                    asRow:"@asRow"
                },
                link:function (scope, element, attrs) {
                    //Getters
                    scope.getListClass = function () {
                        if (scope.asRow && parseInt(scope.asRow)) {
                            return "row";
                        }
                        return null;
                    }

                    scope.getStyleClass = function (item, index) {
                        var clazzes = "";
                        if (scope.asRow && parseInt(scope.asRow) && scope.items && scope.items.length) {
                            if (index == 0) {
                                clazzes += "first";
                            } else if (index == (scope.items.length - 1)) {
                                clazzes += "last";
                            }
                        }

                        if (scope.selectedItems && scope.selectedItems.indexOf(item) != -1 || scope.selectedItem == item) {
                            clazzes += (" " + (scope.selectedClass || "selected"));
                        }
                        return clazzes;
                    };

                    //Action Handlers
                    scope.onClick = function (item) {
                        if (scope.multiSelect) {
                            scope.selectedItems = scope.selectedItems || [];
                            var idx = scope.selectedItems.indexOf(item);
                            if (idx == -1) {
                                scope.selectedItems.push(item);
                            } else {
                                scope.selectedItems.splice(idx, 1);
                            }
                            scope.selectedItems = scope.selectedItems.slice();
                        } else {
                            scope.selectedItem = item;
                        }
                    };
                }
            });
    });
Neosavvy
    .Directives
    .directive('nsTooltip', function () {
        return {
            compile:function (tElement, tAttrs, transclude) {
                var tooltipClazz = tAttrs.tooltip;
                $(tElement[0]).append('<div style="display: none;" class="tooltip ' + tooltipClazz + '">&nbsp;</div>');
                return function (scope, iElement, iAttrs) {
                    //Adds Mouseover Handler to directive
                    iElement.bind('mouseover', function (e) {
                        scope.$apply(function () {
                            var myTooltip = iElement[0].getElementsByClassName(tooltipClazz)[0];
                            $(myTooltip).css('display', 'block');
                            $(myTooltip).removeClass('animated fadeOut')
                            $(myTooltip).addClass('animated fadeIn');
                        });
                    });
                    iElement.bind('mouseleave', function (e) {
                        scope.$apply(function () {
                            var myTooltip = iElement[0].getElementsByClassName(tooltipClazz)[0];
                            $(myTooltip).removeClass('animated fadeIn')
                            $(myTooltip).addClass('animated fadeOut');
                            $(myTooltip).css('display', 'none');
                        });
                    })
                };
            }
        }
    });
Neosavvy.AngularCore.Directives
    .directive('nsLoadingOverlay', function () {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'static/application/core/directives/ns-loading-overlay.html',
            scope:{
                loading:"=loading"
            },
            link:function (scope, element, attrs) {
                var spinner = null;
                var options = {
                    lines:13, // The number of lines to draw
                    length:40, // The length of each line
                    width:6, // The line thickness
                    radius:20, // The radius of the inner circle
                    corners:1, // Corner roundness (0..1)
                    rotate:0, // The rotation offset
                    color:'#000', // #rgb or #rrggbb
                    speed:1, // Rounds per second
                    trail:60, // Afterglow percentage
                    shadow:false, // Whether to render a shadow
                    hwaccel:false, // Whether to use hardware acceleration
                    className:'spinner', // The CSS class to assign to the spinner
                    zIndex:2e9, // The z-index (defaults to 2000000000)
                    top:'auto', // Top position relative to parent in px
                    left:'auto' // Left position relative to parent in px
                };

                scope.$watch('loading', function (newValue) {
                    if (newValue) {
                        if (!spinner) {
                            spinner = new Spinner(options);
                        }
                        spinner.spin(element[0])
                    } else {
                        if (spinner) {
                            spinner.stop();
                        }
                    }
                });
            }
        }
    });
var Neosavvy = Neosavvy || {};
Neosavvy.TraitConstructors = Neosavvy.TraitConstructors || {};
Neosavvy.TraitConstructors.StatefulControl = function (options) {
    if (options) {
        //Force component to use transclude
        options.transclude = 'element';

        //Helpers
        function getDataAttrOrAttr(element, attrName) {
            return (element.getAttribute(attrName) || element.getAttribute("data-" + attrName));
        }

        function splitIfExists(attr) {
            if (attr) {
                attr.replace(" ", "").split(",");
            }
            return attr;
        }

        function itemOrPropertyString(itemString, propertyString) {
            if (propertyString) {
                return itemString + "." + propertyString;
            }
            return itemString;
        }

        function createStateDataFilter(include, exclude) {
            return function (dataProvider) {
                if (dataProvider) {
                    return dataProvider.filter(function (item) {
                        if (item) {
                            var includeOkay = true, excludeOkay = true;
                            if (include && include.length) {
                                includeOkay = (include.indexOf(item) != -1) || (include.indexOf(item.value) != -1);
                            } else if (exclude && exclude.length) {
                                excludeOkay = (exclude.indexOf(item) == -1) && (exclude.indexOf(item.value) == -1);
                            }
                            return includeOkay && excludeOkay;
                        } else {
                            return false;
                        }
                    });
                }
                return null;
            };
        }

        function createCompileFn(options) {
            var childCompile = options.compile;
            var childLink = options.link;
            return function (tElement, tAttrs, transclude) {
                var returnedLink;
                if (childCompile) {
                    returnedLink = childCompile.call(this, tElement, tAttrs, transclude);
                }

                return function (scope, element, attrs, ctrl) {
                    if (!scope.hasOwnProperty('items')) {
                        throw "Scope must define an items value in all stateful controls."
                    }

                    transclude(scope, function (clone) {
                        if (clone.length) {
                            var children = clone[0].children;
                            if (children.length) {
                                if (children[0].tagName.replace(":", "-").toLowerCase() == "ns-control-data") {
                                    var controlData = children[0];
                                    var stateObject = getDataAttrOrAttr(controlData, 'state-object');
                                    var stateProperty = getDataAttrOrAttr(controlData, 'state-property');
                                    var stateDataFilters = {};
                                    var controlDataStates = controlData.children;
                                    if (controlDataStates.length) {
                                        for (var i = 0; i < controlDataStates.length; i++) {
                                            var controlDataState = controlDataStates[i];
                                            var include = splitIfExists(getDataAttrOrAttr(controlDataState, 'include'));
                                            var exclude = splitIfExists(getDataAttrOrAttr(controlDataState, 'exclude'));
                                            var stateValue = getDataAttrOrAttr(controlDataState, 'state-value');
                                            stateDataFilters[stateValue] = createStateDataFilter(include, exclude);
                                        }
                                        scope.$parent.$watch(itemOrPropertyString(stateObject, stateProperty), function (newValue, oldValue) {
                                            if (stateDataFilters[newValue]) {
                                                scope.innerItems = stateDataFilters[newValue](scope.items);
                                            } else {
                                                scope.innerItems = scope.items;
                                            }
                                        });
                                    }

                                }
                            }
                        }
                    });

                    if (returnedLink) {
                        returnedLink.call(this, scope, element, attrs, ctrl);
                    }
                    else if (childLink) {
                        childLink.call(this, scope, element, attrs, ctrl);
                    }
                };
            };
        }

        var myCompile = createCompileFn(options);
        options.compile = myCompile;
    }
    return options;
};
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
Neosavvy.Filters.filter('numberToOrdinal', function () {
    return function (value) {
        if (value || value == 0) {
            return Neosavvy.Core.Utils.NumberUtils.toOrdinal(value);
        }
        return null;
    }
});
var Neosavvy = Neosavvy || {};
Neosavvy.AngularCore = Neosavvy.AngularCore || {};
Neosavvy.AngularCore.Directives = angular.module('neosavvy.angularcore.directives', []);
Neosavvy.AngularCore.Filters = angular.module('neosavvy.angularcore.filters', []);
Neosavvy.AngularCore.Services = angular.module('neosavvy.angularcore.services', []);

Neosavvy.AngularCore.Services.factory('nsServiceExtensions',
    ['$q', '$http',
        function ($q, $http) {
            return {
                request: function (params, additionalSuccess, additionalError) {
                    if (!params.method) {
                        throw "You must provide a method for each service request.";
                    }
                    if (!params.url) {
                        throw "You must provide a url for each service request.";
                    }

                    var deferred = $q.defer();
                    $http(params).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data);
                            if (additionalSuccess) {
                                additionalSuccess(data);
                            }
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                            if (additionalError) {
                                additionalError(data);
                            }
                        });

                    return deferred.promise;
                }
            };
        }]);