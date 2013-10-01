//.modal-overlay {
//  position: absolute;
//  background-color: white;
//  left: 50%;
//  top: 50%;
//  width: 300px;
//  height: 300px;
//  margin-left: -150px;
//  margin-top: -150px;
//}

/**
 * @ngdoc object
 * @name neosavvy.angularcore.services.services:nsModal
 * @description
 * An angular service to generate a pop-up modal. Calling nsModal.open will open a modal
 * on the screen. nsModal.open accepts a config object with:
 * scope: the scope to use for the modal (required)
 * template: the template to include in the overlay (required)
 * closeCallback: a callback fired when the modal closes (optional)
 *
 * calling nsModal.close will close any modals currently on the screen
 *
 * @example
 * nsModal.open({ scope: $scope.$new(), template: 'templateUrl.html' }) => opens a modal with a new child scope
 * nsModal.open({ scope: $scope, template: 'templateUrl.html', closeCallback: myCallBackFn }) => opens a modal with an existing scope, myCallBackFn is fired when the modal closes
 * nsModal.close() => close the modal
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

    function open (options) {
        options = options || {};

        var scope = options.scope;

        if (!options.template) {
            throw 'missing template parameter';
        }

        var templateUrl = options.template;

        backdrop = angular.element('<div ng-click="close()" class="modal-backdrop" style="background:rgba(10,10,10, 0.6); position:fixed; top:0px;right:0px;left:0px;bottom:0px;"></div>');
        overlay = angular.element('<ng-include class="modal-overlay" src=" \'' + templateUrl + '\' "></ng-include>');
        
        
        $compile(backdrop)(scope);
        $compile(overlay)(scope);

        body.append(backdrop);
        body.append(overlay);

        scope.close = function() {
            backdrop.remove();
            overlay.remove();

            if (typeof options.closeCallback === 'function')
                options.closeCallback();
        }
    }

    function close () {
        backdrop.remove();
        overlay.remove();     
    }

    return {
        open: open,
        close: close
    }
}]);
