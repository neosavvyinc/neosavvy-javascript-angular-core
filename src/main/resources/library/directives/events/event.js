/**
 * @ngdoc directive
 * @name neosavvy.angularcore.directives.directive:nsEvent
 * @description A quick way to attach a handler for any jQuery/Zepto supported event to an element or some selection of its children.
 * @restrict A
 * @example
 *
 * This will fire the onBlur method on the scope (or parent scopes) whenever a blur event is fired.
 * <pre>
 * <input ns-event="blur, onBlur></input>
 * </pre>
 *
 * In this case, only clicking the .header elements within the parent element will fire off the onClickHeader method.
 * <pre>
 * <p ns-event="click, onClickHeader, .header">
 *      <span class="header></span>
 *      <label>Some Content</label>
 *      <label>Some Content</label>
 *      <span class="header></span>
 *      <label>Some Content</label>
 *      <label>Some Content</label>
 * </p>
 * </pre>
 */
Neosavvy.AngularCore.Directives
    .directive('nsEvent', ['$rootScope', function ($rootScope) {
    return {
        restrict:'A',
        scope:false,
        link:function (scope, element, attrs) {
            var nsEvent = attrs.nsEvent.replace(/ /g, '').split(",");
            var bindFirst = (!_.isUndefined(attrs.nsEventHighPriority) ? true : false);
            if (nsEvent.length < 2) {
                throw "Specify an event and handler in order to use the ns-event directive!";
            }

            function matchKey(key) {
                return key.match(/.*?(?=\(|$)/i)[0];
            }

            function findScope(scope, name) {
                if (!_.isUndefined(scope[matchKey(name)])) {
                    return scope;
                } else if (scope.$parent) {
                    return findScope(scope.$parent, name);
                } else {
                    throw "Your handler method has not been found in the scope chain, please add " + name + " to the scope chain!";
                }
            }

            function handler(e) {
                var myScope = findScope(scope, nsEvent[1]);
                myScope.$event = e;
                myScope.$apply(function() {
                    myScope[nsEvent[1]]();
                });
            }

            //Initialize event listeners
            if (nsEvent.length === 2) {
                if (bindFirst) {
                    element.bindFirst(nsEvent[0], handler);
                } else {
                    element.bind(nsEvent[0], handler);
                }
            } else {
                for (var i = 2; i < nsEvent.length; i++) {
                    var selector = $(element).find(nsEvent[i]);
                    if (bindFirst) {
                        selector.bindFirst(nsEvent[0], handler);
                    } else {
                        selector.bind(nsEvent[0], handler);
                    }
                }
            }
        }
    }
}]);
