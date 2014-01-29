Neosavvy.AngularCore.Documentation.directive('nsApiDoc',
    ['$http',
        function ($http) {
            return {
                restrict: 'E',
                template: '<div ng-transclude></div>',
                transclude: true,
                scope: {
                    endpoint: '='
                },
                link: function (scope, elem, attrs) {
                    var d = scope.$watch('endpoint', function (val) {
                        if (val) {
                            var hpGet = Neosavvy.Core.Utils.MapUtils.highPerformanceGet;
                            scope.path = scope.endpoint.path;
                            scope.method = scope.endpoint.method;
                            scope.params = scope.endpoint.params;
                            scope.payload = scope.endpoint.payload ? JSON.stringify(scope.endpoint.payload, undefined, 4) : {};

                            scope.response = {};
                            scope.errors = undefined;

                            var urlBuilder = new Neosavvy.Core.Builders.RequestUrlBuilder(scope.path);
                            if (scope.params && _.keys(scope.params).length) {
                                urlBuilder = urlBuilder.addParam(scope.params);
                            }

                            $http({method: scope.method, url: urlBuilder.build(), data: scope.payload}).then(function (resp) {
                                scope.response = JSON.stringify(hpGet(resp, attrs.responseKey), undefined, 4);
                                scope.endpoint.response = scope.response;

                                scope.endpoint.status = 'Ok';

                                if (scope.response) {
                                    d();
                                }

                            }, function (response) {
                                scope.endpoint.status = 'Failure';
                                scope.endpoint.response = response;
                            });
                        }
                    }, true);

                }
            }
        }]);

