var Neosavvy = Neosavvy || {};
Neosavvy.Directives = Neosavvy.Directives || {};

Neosavvy.Directives.StatefulControl = function (options) {
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