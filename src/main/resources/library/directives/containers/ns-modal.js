Neosavvy.AngularCore.Directives.directive('nsModal', [
    'nsModal',
    function (nsModalService) {
        return {
            restrict: 'E',
            transclude: 'element',
            replace: true,
            scope: false,
            compile: function (tElem, tAttr, transclude) {
                return function (scope, elem, attr) {
                    var childScope = scope.$new();

                    if (typeof attr.open !== 'string') {
                        throw 'an open handler was not specified';
                    }

                    // close modal on route change
                    scope.$on('$routeChangeStart', function (e) {
                        nsModalService.close();
                    });

                    var closeCallback = scope[attr.callback] || angular.noop;

                    scope[attr.open] = function () {
                        transclude(childScope, function (clone) {
                            nsModalService.open(childScope, clone, closeCallback);
                        });
                    };

                    scope[attr.close] = function () {
                        nsModalService.close();
                    };
                }
            }
        }
    }
]);

