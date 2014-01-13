Neosavvy.AngularCore.Directives
    .directive('nsMaskedDateInput',
            function () {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<input class="re-masked-date-input" ng-model="date"></input>',
                    scope: {
                        date: "=",
                        selectionEnabled: "@"
                    },
                    link: function (scope, element, attrs) {
                        $.mask.definitions['1'] = "[0-1]";
                        $.mask.definitions['2'] = "[0-2]";
                        $.mask.definitions['3'] = "[0-3]";
                        $(element).mask("39/19/2999", {placeholder: " "});
                        element.bind("keyup", function (e) {
                            if (e.currentTarget.value && /^\d{2}\/\d{2}\/\d{4}$/.test(e.currentTarget.value)) {
                                scope.$apply(function () {
                                    scope.date = String(e.currentTarget.value);
                                });
                            }
                        });

                        //WATCHERS
                        var dereg = scope.$watch('selectionEnabled', function (newValue) {
                            if (newValue && newValue !== 'false') {
                                //$(element[0]).datepicker();
                                dereg();
                            }
                        });

                        //GETTERS
                        scope.getPickerVisibility = function () {
                            return scope.selectionEnabled && scope.selectionEnabled !== 'false';
                        };
                    }
                }
            });