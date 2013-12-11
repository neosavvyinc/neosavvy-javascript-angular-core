/**
 * @ngdoc object
 * @name neosavvy.angularcore.services.services:nsModal
 * @description
 * An angular service to generate modal pop-up. Plays nice with $animate if you've
 * included it in your project.
 * @example
 *  nsModal.open($scope.$new(), 'templateUrl.html' }) => opens a modal with a new child scope using `templateUrl.html` as the modal body
 *  nsModal.open($scope, 'templateUrl.html', myCallBackFn }) => opens a modal with an existing scope, myCallBackFn is fired when the modal closes
 *  nsModal.close() => close the modal
 *
 */
Neosavvy.AngularCore.Services.factory('nsModal', 
    [
        '$compile',
        '$document',
        '$animate',
        '$timeout',
        function($compile, $document, $animate, $timeout) {

    var body = $document.find('body'),
        backdrop,
        overlay,
        callback;

    function open (scope, template, closeCallback) {

        var positionWrapper;

        if (!scope || typeof scope !== 'object') {
            throw 'missing scope parameter';
        }

        if (template) {
            callback = closeCallback || undefined;

            backdrop = $compile(angular.element('<div ng-click="close()" class="modal-backdrop" style="background:rgba(10,10,10, 0.6); position:fixed; top:0px;right:0px;left:0px;bottom:0px;"></div>'))(scope);

            // add the inner modal-position wrapper in order to center dynamically sized modals
            positionWrapper = angular.element('<div class="modal-position"></div>');

            // accept angular.element objects and template URLs
            if (typeof template === 'object') {
                positionWrapper.append(template);
            } else if (typeof template === 'string') {
                var cTemplate = $compile(angular.element('<ng-include src="\'' + template + '\' "></ng-include>'))(scope);
                positionWrapper.append(cTemplate);
            } else {
                throw "template parameter must be of type object or string";
            }

            overlay = $compile(angular.element('<div class="modal-overlay" ng-class="modalOverlayClass"></div>'))(scope);
            overlay.append(positionWrapper);

            scope.close = close;

            $timeout(function () {
                scope.$apply(function () {
                    body.append(backdrop);
                    body.append(overlay);
                });
            }, 0);

        } else {
            throw 'missing template parameter';
        }
    };

    function close () {
        if (overlay) {
            $animate.leave(overlay, function () {
                backdrop.remove();
            });

            if (typeof callback === 'function') {
                callback();
            }
        }
    };

    return {

        /**
         * @ngdoc method
         * @name neosavvy.angularcore.services.services:nsModal#open
         * @methodOf neosavvy.angularcore.services.services:nsModal
         *
         * @description
         * Calling nsModal.open will open a modal on the screen. 
         *
         * @param {Object} scope (required) the scope to use inside the modal. can pass in $scope.$new() for new child scope.
         * @param {String|Object} template (required) the location of the template to include in the modal OR an angular.element to include
         * @param {Function} closeCallback (optional) a function call when the modal closes
         */
        open: open,

        /**
         * @ngdoc method
         * @name neosavvy.angularcore.services.services:nsModal#close
         * @methodOf neosavvy.angularcore.services.services:nsModal
         *
         * @description
         * Calling nsModal.close will close all open modals
         *
         */
        close: close
    }
}]);
