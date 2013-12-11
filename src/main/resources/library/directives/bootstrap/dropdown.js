Neosavvy.AngularCore.Directives
    .directive('nsBootstrapDropdown', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="btn-group"><a class="btn dropdown-toggle" ng-class="innerLinkClass" data-toggle="{{_disabled | nsLogicalIf : \'\' : \'dropdown\'}}">{{labelField && selectedItem[labelField] | nsLogicalIf : selectedItem[labelField] : (selectedItem || default)}}<span class="caret"></span></a><ul class="dropdown-menu"><li ng-repeat="item in items" ng-click="onClick(item)"><a ng-bind="labelField && item[labelField] | nsLogicalIf : item[labelField] : item"></a></li></ul></div>',
            scope: {
                items: "=",
                selectedItem: "=",
                labelField: "@",
                default: "@",
                disabled: "@"
            },
            link: function (scope, element, attrs) {
                scope._disabled = false;
                scope.$watch('disabled', function (val) {
                    scope._disabled = (val && (String(val) === '1' || String(val) === 'true'));
                });

                scope.onClick = function (item) {
                    if (!scope._disabled) {
                        scope.selectedItem = item;
                    }
                };

                if (attrs.linkClass) {
                    scope.innerLinkClass = attrs.linkClass;
                }
            }
        }
    });