Neosavvy.AngularCore.Directives
    .directive('nsZurbCheckbox',
    function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<label for="{{id}}-checkbox" ng-click="_onClick()"><input type="checkbox" ' +
                'id="{{id}}-checkbox" style="display: none;"><span class="custom checkbox">' +
                '</span><span ng-bind="label"></span></label>',
            scope: {
                'label': '@',
                'onClick': '&',
                'value': '=ngModel'
            },
            link: function (scope, element, attrs) {
                //Initialization
                var modifiedOnClick = false
                var $checkbox = element.find('span.checkbox');
                scope.id = attrs.id || uuid.v1();

                //Watchers
                scope.$watch('value', function (val) {
                    if (!modifiedOnClick) {
                        if (val) {
                            if (!$checkbox.hasClass('checked')) {
                                $checkbox.addClass('checked');
                            }
                        } else {
                            $checkbox.removeClass('checked');
                        }
                    }
                    modifiedOnClick = false;
                });

                //Action Handlers
                scope._onClick = function () {
                    //The class will switch after the click method has fired
                    modifiedOnClick = true;
                    scope.value = !$checkbox.hasClass('checked');
                    if (scope.onClick) {
                        scope.onClick({value: scope.value})
                    }
                };
            }
        }
    });