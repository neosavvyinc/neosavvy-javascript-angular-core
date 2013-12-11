Neosavvy.AngularCore.Directives
    .directive('nsMaskedTimeInput',
        ['$filter',
            function ($filter) {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<input class="re-masked-time-input" ng-model="time"></input>',
                    scope: {
                        time: "="
                    },
                    link: function (scope, element, attrs) {
                        $.mask.definitions['2'] = "[0-2]";
                        $.mask.definitions['5'] = "[0-5]";
                        $.mask.definitions['X'] = ['A|P|a|p'];
                        $(element).mask("29:59:59", {placeholder: " "});
                        element.bind("keyup", function (e) {
                            if (e.currentTarget.value && /\d{2}:\d{2}:\d{2}/.test(e.currentTarget.value)) {
                                scope.$apply(function () {
                                    scope.time = String(e.currentTarget.value);
                                });
                            }
                        });
                    }
                }
            }]);