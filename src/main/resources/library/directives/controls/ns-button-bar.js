'use strict'

Neosavvy
    .Directives
    .directive('nsButtonBar', function () {
        return {
            restrict:'E',
            replace:true,
            transclude:'element',
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
            compile:function (tElement, tAttrs, transclude) {
                console.log("Compiled");


                return function (scope, element, attrs) {

                    function dataAttrOrAttr(attr, name) {
                        return (attr.name == name || (attr.name = "data-" + name));
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

                    transclude(scope, function (clone) {
                        if (clone.length) {
                            var children = clone[0].children;
                            if (children.length) {
                                if (children[0].tagName.replace(":", "-").toLowerCase() == "ns-control-data") {
                                    var controlData = children[0];
                                    var stateObject = controlData.getAttribute('state-object') || controlData.getAttribute('data-state-object');
                                    var stateProperty = controlData.getAttribute('state-property') || controlData.getAttribute('data-state-property');
                                    var stateDataFilters = {};
                                    var controlDataStates = controlData.children;
                                    if (controlDataStates.length) {
                                        for (var i = 0; i < controlDataStates.length; i++) {
                                            var controlDataState = controlDataStates[i];
                                            var include = controlDataState.getAttribute('include') || controlDataState.getAttribute('data-include');
                                            if (include) {
                                                include = include.replace(" ", "").split(",");
                                            }
                                            var exclude = controlDataState.getAttribute('exclude') || controlDataState.getAttribute('data-exclude');
                                            if (exclude) {
                                                exclude = exclude.replace(" ", "").split(",");
                                            }
                                            var stateValue = controlDataState.getAttribute('state-value') || controlDataState.getAttribute('data-state-value');
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
                };
            }
        }
    });