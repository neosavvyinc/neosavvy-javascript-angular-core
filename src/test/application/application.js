'use strict'

/**
 * The application file bootstraps the angular app by  initializing the main module and
 * creating namespaces and moduled for controllers, filters, services, and directives.
 */

var Neosavvy = Neosavvy || {};

Neosavvy.Constants = angular.module('neosavvy.constants', []);
Neosavvy.Services = angular.module('neosavvy.services', []);
Neosavvy.Controllers = angular.module('neosavvy.controllers', []);
Neosavvy.Filters = angular.module('neosavvy.filters', []);
Neosavvy.Directives = angular.module('neosavvy.directives', []);

//Global Accessor For Dependencies
Neosavvy.Dependencies = ['neosavvy.filters', 'neosavvy.services', 'neosavvy.directives', 'neosavvy.constants', 'neosavvy.controllers'];

//Application Initialization
angular.module('neosavvy', Neosavvy.Dependencies).
    config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.search);
            if (results == null) {
                return "";
            }
            else {
                return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        }

        //HTML 5 Push States Enabled
        $locationProvider.html5Mode(false);

        //Init Routes
        $routeProvider.
            otherwise({templateUrl:'content/content-ptl.html'});
    }]);
