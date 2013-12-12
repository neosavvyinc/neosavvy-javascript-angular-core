describe("nsServiceExtensions", function () {
    var extensions, $httpSpy, successMethod, errorMethod, deferredResolveSpy, deferredRejectSpy, additionalSuccessSpy, additionalErrorSpy;

    beforeEach(module(function ($provide) {
        $provide.provider('$http', function () {
            $httpSpy = jasmine.createSpy().andReturn({success: function (arg) {
                successMethod = arg;
                return {error: function (argB) {
                    errorMethod = argB;
                }}
            }});
            this.$get = function () {
                return $httpSpy;
            };
        });
        $provide.provider('$q', function () {
            deferredResolveSpy = jasmine.createSpy();
            deferredRejectSpy = jasmine.createSpy();
            this.$get = function () {
                return new function () {
                    this.defer = function () {
                        return {promise: "This is a promise!",
                            resolve: deferredResolveSpy,
                            reject: deferredRejectSpy};
                    }
                };
            };
        });
    }));

    beforeEach(function () {
        module('neosavvy.angularcore.services');

        inject(function ($injector) {
            extensions = $injector.get('nsServiceExtensions');
        });

        successMethod = undefined;
        errorMethod = undefined;
        additionalSuccessSpy = jasmine.createSpy();
        additionalErrorSpy = jasmine.createSpy();
    });

    describe("request", function () {
        it("Should throw an error when params are passed in without a method specified", function () {
            expect(function () {
                extensions.request({url: "http://www.neosavvy.com"});
            }).toThrow();
        });

        it("Should throw an error when params are passed in without a url", function () {
            expect(function () {
                extensions.request({method: "GET"});
            }).toThrow();
        });

        it("Should call $http with the params", function () {
            var params = {method: "POST", url: "http://www.burgerking.com"};
            extensions.request(params);
            expect($httpSpy).toHaveBeenCalledWith(params);
        });

        it("Should have set a success method", function () {
            expect(successMethod).toBeUndefined();
            extensions.request({method: "POST", url: "http://www.burgerking.com"});
            expect(successMethod).toBeDefined();
        });

        it("Should have set an error method", function () {
            expect(errorMethod).toBeUndefined();
            extensions.request({method: "POST", url: "http://www.burgerking.com"});
            expect(errorMethod).toBeDefined();
        });

        it("Should resolve the deferred promise in the success method", function () {
            extensions.request({method: "DELETE", url: "http://www.burgerking.com"});
            successMethod("Tom");
            expect(deferredResolveSpy).toHaveBeenCalledWith("Tom");
        });

        it("Should call additional success handlers in the success method when they are defined", function () {
            extensions.request({method: "DELETE", url: "http://www.morningstar.com"}, additionalSuccessSpy);
            successMethod("George");
            expect(additionalSuccessSpy).toHaveBeenCalledWith("George");
        });

        it("Should reject the deferred the promise in the error method", function () {
            extensions.request({method: "DELETE", url: "http://www.burgerking.com"});
            errorMethod("Error Tom");
            expect(deferredRejectSpy).toHaveBeenCalledWith("Error Tom");
        });

        it("Should call the additional error handlers in the error method when they are defined", function () {
            extensions.request({method: "PUT", url: "http://www.morningstar.com"}, null, additionalErrorSpy);
            errorMethod("Error George");
            expect(additionalErrorSpy).toHaveBeenCalledWith("Error George");
        });

        it("Should return the deferred.promise value", function () {
            expect(extensions.request({method: "PUT", url: "http://www.morningstar.com"}, null, additionalErrorSpy)).toEqual("This is a promise!");
        });
    });

    describe("xhr", function () {
        var transformRequestSpy, transformResponseSpy, qSpy, cacheSpy, myXhrRequest;

        beforeEach(function () {
            transformRequestSpy = jasmine.createSpy().andReturn("This is a transformed request!");
            transformResponseSpy = jasmine.createSpy().andReturn("This is a transformed response!");
            deferredResolveSpy = jasmine.createSpy();
            deferredRejectSpy = jasmine.createSpy();
            qSpy = spyOn(Q, 'defer').andReturn({promise: "This is my promise!", resolve: deferredResolveSpy, reject: deferredRejectSpy});
            cacheSpy = jasmine.createSpyObj('cacheSpy', ['get', 'put']);
            cacheSpy.get = cacheSpy.get.andReturn(["Status", "My response text", "Headers"]);
            window.XMLHttpRequest = function () {
                this.open = jasmine.createSpy();
                this.send = jasmine.createSpy();
                this.readyState = 4;
                myXhrRequest = this;
            };
            window.XMLHttpRequest.prototype = {
                getAllResponseHeaders: function () {
                    "This is your header fool!";
                },
                getResponseHeader: function () {
                    return 'application/json';
                }
            };
        });

        it("Should throw an error when params are passed in without a method specified", function () {
            expect(function () {
                extensions.xhr({url: "http://www.neosavvy.com"});
            }).toThrow();
        });

        it("Should throw an error when params are passed in without a url", function () {
            expect(function () {
                extensions.xhr({method: "GET"});
            }).toThrow();
        });

        it("Should get from the cache if cache is defined and the method is get and the item exists", function () {
            extensions.xhr({method: 'GET', url: 'http://www.google.com/numbers', cache: cacheSpy});
            expect(cacheSpy.get).toHaveBeenCalledWith('http://www.google.com/numbers');
            expect(deferredResolveSpy).toHaveBeenCalledWith("My response text");
        });

        it("Should set the onreadystatechange on the xhr request object", function () {
            extensions.xhr({method: 'POST', url: 'http://www.google.com/numbers', data: '{"name": "Something!"}'});
            expect(myXhrRequest.onreadystatechange).toBeDefined();
        });

        it("Should set the onerror on the xhr request object", function () {
            extensions.xhr({method: 'POST', url: 'http://www.google.com/numbers', data: '{"name": "Something!"}'});
            expect(myXhrRequest.onreadystatechange).toBeDefined();
        });

        it("Should call xhr.open", function () {
            extensions.xhr({method: 'POST', url: 'http://www.google.com/numbers', data: '{"name": "Something!"}'});
            expect(myXhrRequest.open).toHaveBeenCalledWith('POST', 'http://www.google.com/numbers', true);
        });

        it("Should call xhr.send", function () {
            extensions.xhr({method: 'GET', url: 'http://www.google.com/numbers'});
            expect(myXhrRequest.send).toHaveBeenCalledWith(undefined);
        });

        it("Should attempt to cache the values of returned get requests", function () {
            cacheSpy.get = cacheSpy.get.andReturn(null);
            extensions.xhr({method: 'GET', url: 'http://www.neosavvy.co.uk', cache: cacheSpy});
            myXhrRequest.readyState = 4;
            myXhrRequest.responseText = '{"name":"Here is your response fool!"}';
            myXhrRequest.status = 200;
            myXhrRequest.onreadystatechange();
            expect(cacheSpy.put).toHaveBeenCalledWith('http://www.neosavvy.co.uk', [200, '{"name":"Here is your response fool!"}', {}]);
        });

        it("Should use transformRequest if defined", function () {
            extensions.xhr({method: 'POST', url: 'http://www.neosavvy.co.uk', data: {name: "myData"}, transformRequest: transformRequestSpy});
            expect(transformRequestSpy).toHaveBeenCalledWith({name: "myData"});
            expect(myXhrRequest.send).toHaveBeenCalledWith("This is a transformed request!");
        });

        it("Should stringify the request if that operation has not been performed yet", function () {
            extensions.xhr({method: 'POST', url: 'http://www.neosavvy.co.uk', data: {name: "myData"}});
            expect(myXhrRequest.send).toHaveBeenCalledWith('{"name":"myData"}');
        });

        it("Should use transformResponse if defined", function () {
            extensions.xhr({method: 'GET', url: 'http://www.neosavvy.co.uk', transformResponse: transformResponseSpy});
            myXhrRequest.readyState = 4;
            myXhrRequest.responseText = "Here is your response fool!";
            myXhrRequest.status = 200;
            myXhrRequest.onreadystatechange();
            expect(transformResponseSpy).toHaveBeenCalledWith("Here is your response fool!");
        });

        it("Should parse the response via json if the application response is json", function () {
            myXhrRequest.getResponseHeader = function () {
                return 'application/json';
            };
            var jsonSpy = spyOn(JSON, 'parse');
            extensions.xhr({method: 'GET', url: 'http://www.neosavvy.co.uk'});
            myXhrRequest.readyState = 4;
            myXhrRequest.responseText = "Here is your response fool!";
            myXhrRequest.status = 200;
            myXhrRequest.onreadystatechange();
            expect(jsonSpy).toHaveBeenCalledWith("Here is your response fool!");
        });

        it("Should called the deferred.resolve if the status is 200", function () {
            extensions.xhr({method: 'GET', url: 'http://www.neosavvy.co.uk'});
            myXhrRequest.readyState = 4;
            myXhrRequest.responseText = '{"name":"Here is your response fool!"}';
            myXhrRequest.status = 200;
            myXhrRequest.onreadystatechange();
            expect(deferredResolveSpy).toHaveBeenCalledWith({name: "Here is your response fool!"}, 200, undefined);
        });

        it("Should call the deferred.reject if the status is 200", function () {
            myXhrRequest.getAllResponseHeaders = function () {
                "Here is your header fool!";
            };
            extensions.xhr({method: 'GET', url: 'http://www.neosavvy.co.uk'});
            myXhrRequest.readyState = 4;
            myXhrRequest.responseText = "Here is your response fool!";
            myXhrRequest.status = 201;
            myXhrRequest.onreadystatechange();
            expect(deferredRejectSpy).toHaveBeenCalledWith("Here is your response fool!", 201, undefined);
        });

        it("Should pass the data to xhr.send when it is defined", function () {
            extensions.xhr({method: 'POST', url: 'http://www.google.com/numbers', data: '{"name": "Something!"}'});
            expect(myXhrRequest.send).toHaveBeenCalledWith('{"name": "Something!"}');
        });

        it("Should return the deferred.promise", function () {
            expect(extensions.xhr({method: 'POST', url: 'http://www.google.com/numbers'})).toEqual("This is my promise!");
        });
    });

    describe("jqRequest", function () {
        var qSpy, $qSpy, cacheSpy, deferredResolveSpy, deferredRejectSpy;

        beforeEach(function () {
            deferredResolveSpy = jasmine.createSpy();
            deferredRejectSpy = jasmine.createSpy();
            qSpy = spyOn(Q, 'defer').andReturn({promise: "This is a promise!", resolve: deferredResolveSpy, reject: deferredRejectSpy});
            cacheSpy = jasmine.createSpyObj('cacheSpy', ['get', 'put']);
            cacheSpy.get = cacheSpy.get.andReturn(["Status", "My cached response text", "Headers"]);
            inject(function ($q) {
                $qSpy = spyOn($q, 'defer').andReturn({promise: "This is a $promise!", resolve: deferredResolveSpy, reject: deferredRejectSpy});
            });
        });

        it("Should throw an error when called without a method param", function () {
            expect(function () {
                extensions.jqRequest({url: "http://api.github.com"});
            }).toThrow();
        });

        it("Should throw an error when called without a url parameter", function () {
            expect(function () {
                extensions.jqRequest({method: "GET"});
            }).toThrow();
        });

        it("Should call Q.defer in the default case", function () {
            extensions.jqRequest({method: "GET", url: "http://api.github.com"});
            expect(qSpy).toHaveBeenCalledWith();
        });

        it("Should call $q.defer if specified to do so in the params", function () {
            extensions.jqRequest({method: "GET", url: "http://api.github.com", $q: true});
            expect($qSpy).toHaveBeenCalledWith();
        });

        it("Should return the response from the cache if exists for the params", function () {
            extensions.jqRequest({method: "GET", url: "http://api.github.com", cache: cacheSpy});
            expect(cacheSpy.get).toHaveBeenCalledWith("http://api.github.com");
            expect(deferredResolveSpy).toHaveBeenCalledWith("My cached response text");
        });

        it("Should be able to define a cache and not find anything", function () {
            cacheSpy.get = cacheSpy.get.andReturn(null);
            extensions.jqRequest({method: "GET", url: "http://api.github.com", cache: cacheSpy});
            expect(cacheSpy.get).toHaveBeenCalledWith("http://api.github.com");
            expect(deferredResolveSpy).not.toHaveBeenCalledWith("My cached response text");
        });

        it("Should return the Q promise", function () {
            var promise = extensions.jqRequest({method: "POST", url: "http://api.github.com"});
            expect(promise).toEqual("This is a promise!");
        });

        it("Should return the $q promise", function () {
            var promise = extensions.jqRequest({method: "PUT", url: "http://api.github.com", $q: true});
            expect(promise).toEqual("This is a $promise!");
        });

        describe("ajax", function () {
            var jqAjax = $.ajax, ajaxSpy, doneSpy, failSpy, response;
            beforeEach(function() {
                doneSpy = jasmine.createSpy();
                failSpy = jasmine.createSpy();
            });

            describe("ajax success", function () {
                beforeEach(function () {
                    response = [
                        {name: "Tom"},
                        {name: "Jerry"},
                        {name: "Clark"}
                    ];
                    ajaxSpy = spyOn($, "ajax").andReturn({done: function (fn) {
                        fn(response);
                        doneSpy();
                        return {fail: failSpy};
                    },
                        responseText: JSON.stringify(response)
                    });
                });

                it("Should call ajax with the params in jq format", function () {
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Fish"}});
                    expect(ajaxSpy).toHaveBeenCalledWith({type: "GET", url:"http://api.github.com", data: {food: "Fish"}});
                });

                it("Should set a done handler", function () {
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Beef"}});
                    expect(doneSpy).toHaveBeenCalledWith();
                });

                it("Should set a fail handler", function () {
                    extensions.jqRequest({method: "GET", url: "http://api.github.com/v3", data: {food: "Chinese"}});
                    expect(failSpy).toHaveBeenCalled();
                });

                it("Should be able to make a request with a request transformer", function () {
                    var transformRequestSpy = jasmine.createSpy().andReturn('This is a transformed request');
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Fish"}, transformRequest: transformRequestSpy});
                    expect(transformRequestSpy).toHaveBeenCalledWith({food: "Fish"});
                    expect(ajaxSpy).toHaveBeenCalledWith({type: "GET", url: "http://api.github.com", data: 'This is a transformed request'});
                });

                it("Should be able to resolve data", function () {
                    extensions.jqRequest({method: "GET", url: "http://api.github.com"});
                    expect(deferredResolveSpy).toHaveBeenCalledWith(response);
                });

                it("Should be able to resolve data with a response tranformer", function () {
                    var transformResponseSpy = jasmine.createSpy().andReturn("This is tranformed!");
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", transformResponse: transformResponseSpy});
                    expect(deferredResolveSpy).toHaveBeenCalledWith("This is tranformed!");
                });

                it("Should be able to pass ajax parameters to the ajax call", function () {
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Fish"}, ajax: {xhrFields: {withCredentials: true}, crossDomain: true}});
                    expect(ajaxSpy).toHaveBeenCalledWith({type: "GET", url:"http://api.github.com", data: {food: "Fish"}, xhrFields: {withCredentials: true}, crossDomain: true});
                });

                it("Should be able to overwrite existing parameters with ajax parameters that are set", function () {
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Fish"}, ajax: {url: "http://www.neosavvy.com", crossDomain: false}});
                    expect(ajaxSpy).toHaveBeenCalledWith({type: "GET", url:"http://www.neosavvy.com", data: {food: "Fish"}, crossDomain: false});
                });
            });

            describe("ajax fail", function () {
                beforeEach(function () {
                    ajaxSpy = spyOn($, "ajax").andReturn({done: doneSpy.andReturn({fail: function (fn) {
                        fn("There has been an error!");
                        failSpy();
                    }})});
                });

                it("Should call ajax with the params in jq format", function () {
                    extensions.jqRequest({method: "DELETE", url: "http://api.github.com", data: {food: "Fish"}});
                    expect(ajaxSpy).toHaveBeenCalledWith({type: "DELETE", url:"http://api.github.com", data: {food: "Fish"}});
                });

                it("Should set a done handler", function () {
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Beef"}});
                    expect(doneSpy).toHaveBeenCalled();
                });

                it("Should set a fail handler", function () {
                    extensions.jqRequest({method: "PUT", url: "http://api.github.com", data: {food: "Chicken"}});
                    expect(failSpy).toHaveBeenCalledWith();
                });

                it("Should be able to make a request with a request transformer", function () {
                    var transformRequestSpy = jasmine.createSpy().andReturn('This is a transformed request');
                    extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Fish"}, transformRequest: transformRequestSpy});
                    expect(transformRequestSpy).toHaveBeenCalledWith({food: "Fish"});
                    expect(ajaxSpy).toHaveBeenCalledWith({type: "GET", url: "http://api.github.com", data: 'This is a transformed request'});
                });

                it("Should be able to reject the response", function () {
                    extensions.jqRequest({method: "POST", url: "http://api.github.com", data: {food: "Fish"}});
                    expect(deferredRejectSpy).toHaveBeenCalledWith("There has been an error!");
                });
            });

            describe("IE 9", function () {
                describe("ajax success", function () {
                    beforeEach(function () {
                        response = [
                            {name: "Tom"},
                            {name: "Jerry"},
                            {name: "Clark"}
                        ];
                        ajaxSpy = spyOn($, "ajax").andReturn({done: function (fn) {
                            fn(response);
                            doneSpy();
                            return {fail: failSpy};
                        },
                            responseJSON: JSON.stringify(response)
                        });
                    });

                    it("Should call ajax with the params in jq format", function () {
                        extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Fish"}});
                        expect(ajaxSpy).toHaveBeenCalledWith({type: "GET", url:"http://api.github.com", data: {food: "Fish"}});
                    });

                    it("Should set a done handler", function () {
                        extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Beef"}});
                        expect(doneSpy).toHaveBeenCalledWith();
                    });

                    it("Should set a fail handler", function () {
                        extensions.jqRequest({method: "GET", url: "http://api.github.com/v3", data: {food: "Chinese"}});
                        expect(failSpy).toHaveBeenCalled();
                    });

                    it("Should be able to make a request with a request transformer", function () {
                        var transformRequestSpy = jasmine.createSpy().andReturn('This is a transformed request');
                        extensions.jqRequest({method: "GET", url: "http://api.github.com", data: {food: "Fish"}, transformRequest: transformRequestSpy});
                        expect(transformRequestSpy).toHaveBeenCalledWith({food: "Fish"});
                        expect(ajaxSpy).toHaveBeenCalledWith({type: "GET", url: "http://api.github.com", data: 'This is a transformed request'});
                    });

                    it("Should be able to resolve data", function () {
                        extensions.jqRequest({method: "GET", url: "http://api.github.com"});
                        expect(deferredResolveSpy).toHaveBeenCalledWith(response);
                    });

                    it("Should be able to resolve data with a response tranformer", function () {
                        var transformResponseSpy = jasmine.createSpy().andReturn("This is tranformed!");
                        extensions.jqRequest({method: "GET", url: "http://api.github.com", transformResponse: transformResponseSpy});
                        expect(deferredResolveSpy).toHaveBeenCalledWith("This is tranformed!");
                    });
                });
            });

            afterEach(function () {
                $.ajax = jqAjax;
            });


        });
    });
});