/**
 * @ngdoc filter
 * @name neosavvy.angularcore.filters:nsLogicalIf
 * @function
 *
 * @description
 * This filter return either the 2nd or 3rd param based on the outcome of a conditional statement
 *
 * @example
 * <pre>
 * <p ng-bind="someScopeVariable > 6 | nsLogicalIf : 'Your value is above 6' : 'Your value is below 6'"></p>
 * </pre>
 */
Neosavvy.AngularCore.Filters.filter('nsLogicalIf', function () {
    return function (input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});