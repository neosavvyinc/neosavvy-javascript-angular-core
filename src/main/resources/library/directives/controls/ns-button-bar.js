'use strict'

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