/*! neosavvy-angular-core - v0.1.0 - 2013-07-23
* Copyright (c) 2013 Neosavvy, Inc.; Licensed  */
var Neosavvy = Neosavvy || {};
Neosavvy.AngularCore = Neosavvy.AngularCore || {};
Neosavvy.AngularCore.Directives = angular.module('neosavvy.angularcore.directives', []);
Neosavvy.AngularCore.Filters = angular.module('neosavvy.angularcore.filters', []);
Neosavvy.AngularCore.Services = angular.module('neosavvy.angularcore.services', []);

Neosavvy.AngularCore.Directives
    .directive('nsInlineHtml',
    ['$compile',
        function ($compile) {
            return {
                restrict:'E',
                template:'<div></div>',
                replace:true,
                scope:false,
                link:function (scope, element, attrs) {
                    var value = attrs.value || false;
                    if (!value) {
                        throw "You must provide an html value on the scope in order to bind inline html!";
                    }
                    var dereg = scope.$watch(value, function (value) {
                        if (value) {
                            element.replaceWith($compile(angular.element(value))(scope));
                            dereg();
                        }
                    });
                }
            }
        }]);
Neosavvy.AngularCore.Services.factory('nsServiceExtensions',
    ['$q', '$http',
        function ($q, $http) {
            return {
                request: function (params, additionalSuccess, additionalError) {
                    if (!params.method) {
                        throw "You must provide a method for each service request.";
                    }
                    if (!params.url) {
                        throw "You must provide a url for each service request.";
                    }

                    var deferred = $q.defer();
                    $http(params).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data);
                            if (additionalSuccess) {
                                additionalSuccess(data);
                            }
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                            if (additionalError) {
                                additionalError(data);
                            }
                        });

                    return deferred.promise;
                }
            };
        }]);