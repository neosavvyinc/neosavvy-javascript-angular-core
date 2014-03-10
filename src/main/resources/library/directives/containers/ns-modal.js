Neosavvy.AngularCore.Directives.controller('nsModalCtrl', ['$scope', function ($scope) {

    // TO DO
    // make tooltip position customizable and/or 
    this.positionTooltip =  function (e, element) {
            if (e) {
                var localX = -0.75 * e.currentTarget.clientWidth;
                var localY = 0.65 * e.currentTarget.clientHeight;
                var containerCoords = $(e.target).offset();
                var xPos = localX + containerCoords.left;
                var yPos = localY + containerCoords.top;
            }
            
            element.css("position", "absolute");
            element.css("top", yPos);
            element.css("left", xPos);
            return element;
        }
}]);

Neosavvy.AngularCore.Directives.directive('nsModal', [
    'nsModal',
    function (nsModalService) {

        return {
            restrict: 'EA',
            transclude: 'element',
            replace: true,
            scope: false,
            controller: 'nsModalCtrl',
            compile: function (tElem, tAttr, transclude) {
                return function (scope, elem, attr, modalCtrl) {
                    var childScope = scope.$new(),
                        isTooltip = !!attr.tooltip;

                    if (typeof attr.open !== 'string') {
                        throw 'an open handler was not specified';
                    };

                    // close modal on route change
                    scope.$on('$routeChangeStart', function (e) {
                        nsModalService.close();
                    });

                    var closeCallback = scope[attr.callback] || angular.noop;

                    scope[attr.open] = function (e) {
                        transclude(childScope, function (clone) {
                            var element = isTooltip ? modalCtrl.positionTooltip(e, clone) : clone;
                            nsModalService.open(childScope, element, closeCallback);
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

