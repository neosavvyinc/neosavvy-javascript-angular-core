ddescribe("nsServiceExtensions", function () {
    var extensions, $httpSpy, successMethod, errorMethod, deferredResolveSpy, deferredRejectSpy, additionalSuccessSpy, additionalErrorSpy;

    beforeEach(module(function ($provide) {
        $provide.provider('$http', function () {
            $httpSpy = jasmine.createSpy().andReturn({success: function(arg) {
                successMethod = arg;
                return {error: function(argB) {
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
        module.apply(module, ['neosavvy.angularcore.services']);

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
    });
});