Neosavvy.AngularCore.Directives
    .directive('nsRequiredIfShown',
    function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var valid = (!element.is(':visible') || !Neosavvy.Core.Utils.StringUtils.isBlank(viewValue));
                    ctrl.$setValidity('nsRequiredIfShown', valid);
                    return valid ? viewValue : undefined;
                })
            }
        }
    });