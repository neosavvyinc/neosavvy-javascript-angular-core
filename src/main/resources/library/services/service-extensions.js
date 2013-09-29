/**
 * @ngdoc object
 * @name neosavvy.angularcore.services.services:nsServiceExtensions
 * @requires $q, $http
 * @description
 * Helper methods for Angular JS oriented $http requests and native XHR requests.
 *
 * @example
 * nsServiceExtensions.request({method: 'GET', url: 'http://www.neosavvy.com'});
 * nsServiceExtensions.xhr({method: 'GET', url: 'http://www.neosavvy.com'});
 *
 * Both methods return a deferred.promise object (with then handlers). The only difference is that the nsServiceExtensions.request method is hooked into
 * the standard angular lifecycle. The nsServiceExtensions.xhr method supports angular caching and transformers, but does not hook into the lifecyle.
 */
Neosavvy.AngularCore.Services.factory('nsServiceExtensions',
    ['$q', '$http',
        function ($q, $http) {
            /**
             * Parse headers into key value object
             *
             * @param {string} headers Raw headers as a string
             * @returns {Object} Parsed headers as key value object
             */
            function parseHeaders(headers) {
                var parsed = {}, key, val, i;

                if (!headers) return parsed;

                forEach(headers.split('\n'), function (line) {
                    i = line.indexOf(':');
                    key = lowercase(trim(line.substr(0, i)));
                    val = trim(line.substr(i + 1));

                    if (key) {
                        if (parsed[key]) {
                            parsed[key] += ', ' + val;
                        } else {
                            parsed[key] = val;
                        }
                    }
                });

                return parsed;
            }

            function getFromCache(params) {
                if (params.cache && params.method === 'GET') {
                    var cached = params.cache.get(params.url);
                    if (cached && cached.length) {
                        return cached;
                    }
                }
                return undefined;
            }

            function storeInCache(params, status, response, headers) {
                if (params.cache && params.method === 'GET') {
                    params.cache.put(params.url, [status, response, parseHeaders(headers)]);
                }
            }

            return {
                /**
                 * @ngdoc method
                 * @name neosavvy.angularcore.services.services:nsServiceExtensions#request
                 * @methodOf neosavvy.angularcore.services.services:nsServiceExtensions
                 *
                 * @description
                 * The standard $http request method helper with error handling, transformers, and added response handlers.
                 *
                 * @param {Object} params
                 * @param {Function} additionalSuccess
                 * @param {function} additionalError
                 * @returns {Promise} $q promise object
                 */
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
                },
                /**
                 * @ngdoc method
                 * @name neosavvy.angularcore.services.services:nsServiceExtensions#xhr
                 * @methodOf neosavvy.angularcore.services.services:nsServiceExtensions
                 *
                 * @description
                 * The native XHR request method helper with error handling, transformers, and added response handlers.
                 *
                 * @param {Object} params
                 * @returns {Promise} Q promise object
                 */
                xhr: function (params) {
                    if (!params.method) {
                        throw "You must provide a method for each service request.";
                    }
                    if (!params.url) {
                        throw "You must provide a url for each service request.";
                    }

                    var deferred = Q.defer();
                    var cached = getFromCache(params);
                    if (cached) {
                        //cached[0] is status, cached[1] is response, cached[2] is headers
                        deferred.resolve(cached[1]);
                    } else {
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                var resp = xhr.responseText;
                                if (xhr.status === 200) {
                                    storeInCache(params, xhr.status, resp, xhr.getAllResponseHeaders());

                                    if (params.transformResponse) {
                                        resp = params.transformResponse(resp);
                                    } else if (xhr.getResponseHeader("Content-Type") === "application/json") {
                                        resp = JSON.parse(resp);
                                    }

                                    deferred.resolve(resp, xhr.status, xhr.getAllResponseHeaders());
                                } else {
                                    deferred.reject(resp, xhr.status, xhr.getAllResponseHeaders());
                                }
                            }
                        };

                        xhr.onerror = function () {
                            deferred.reject(xhr, xhr.status, xhr.getAllResponseHeaders());
                        };

                        var data = params.data;
                        if (data) {
                            if (params.transformRequest) {
                                data = params.transformRequest(data);
                            } else if (!_.isString(data)) {
                                data = JSON.stringify(data);
                            }
                        }

                        xhr.open(params.method, params.url, true);
                        xhr.send(data);
                    }

                    return deferred.promise;
                }
            };
        }]);