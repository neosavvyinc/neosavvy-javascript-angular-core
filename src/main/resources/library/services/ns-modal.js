/**
 * @ngdoc object
 * @name neosavvy.angularcore.services.services:nsModal
 * @description
 * An angular service to generate modal pop-up.
 * @example
 *  nsModal.open($scope.$new(), 'templateUrl.html' }) => opens a modal with a new child scope
 *  nsModal.open($scope, 'templateUrl.html', myCallBackFn }) => opens a modal with an existing scope, myCallBackFn is fired when the modal closes
 *  nsModal.close() => close the modal
 *
 */
Neosavvy.AngularCore.Services.factory('nsModal', 
    [
        '$compile', 
        '$document', 
        function($compile, $document) {

    var body = $document.find('body'),
        backdrop,
        overlay;

    function open (scope, templateUrl, closeCallback) {

        if (!scope) {
            throw 'missing scope parameter';
        }

        if (!templateUrl) {
            throw 'missing template parameter';
        }


        backdrop = angular.element('<div ng-click="close()" class="modal-backdrop" style="background:rgba(10,10,10, 0.6); position:fixed; top:0px;right:0px;left:0px;bottom:0px;"></div>');
        overlay = angular.element('<ng-include class="modal-overlay" src=" \'' + templateUrl + '\' "></ng-include>');
        
        
        $compile(backdrop)(scope);
        $compile(overlay)(scope);

        body.append(backdrop);
        body.append(overlay);

        scope.close = function() {
            backdrop.remove();
            overlay.remove();

            if (closeCallback === 'function')
                closeCallback();
        }
    }

    function close () {
        backdrop.remove();
        overlay.remove();     
    }

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
         * @param {String} templateUrl (required) the location the template to include in the modal
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
