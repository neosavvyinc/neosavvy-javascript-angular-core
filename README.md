javascript-angular-core
=======================

Neosavvy, Inc. core libraries for angular js.

## Getting Started
Via bower,

    bower install neosavvy-javascript-angular-core

###Development Version,

Install all through npm,

    npm install

Install bower,

    sudo npm -g install bower

Install Grunt,

    sudo npm -g install grunt-cli

Scripts dependencies,

    bower install


To compile source code,

    grunt

To run unit tests while developing,

    grunt karma:unit

## Modules

    var Neosavvy = Neosavvy || {};
    Neosavvy.AngularCore = Neosavvy.AngularCore || {};

    Neosavvy.AngularCore.Analytics = angular.module('neosavvy.angularcore.analytics', []);
    Neosavvy.AngularCore.Controllers = angular.module('neosavvy.angularcore.controllers', []);
    Neosavvy.AngularCore.Directives = angular.module('neosavvy.angularcore.directives', []);
    Neosavvy.AngularCore.Filters = angular.module('neosavvy.angularcore.filters', []);
    Neosavvy.AngularCore.Services = angular.module('neosavvy.angularcore.services', []);

    Neosavvy.AngularCore.Dependencies = ['neosavvy.angularcore.analytics', 'neosavvy.angularcore.controllers', 'neosavvy.angularcore.directives', 'neosavvy.angularcore.filters', 'neosavvy.angularcore.services'];

## neosavvy.angularcore.analytics

Define your global analytics callback with the provider at config time,

    angular.module('app')
        .config(['nsAnalyticsProvider', function (nsAnalyticsProvider) {

            //Provider Setup
            nsAnalyticsProvider.config({
                callBack: function(name, options) {
                    mixpanel.track(name, options);
                    omniture.track(name, options);
                }
            });
        }]);


Define controller analytics at runtime,

    angular.module('app')
        .run(['nsAnalytics', function (nsAnalytics) {

                //Controllers
                nsAnalytics('ElectionCtrl', {
                    countVote: {
                        name: "VOTE",
                        options : {
                            musician: "{{$scope.lastVote}}"
                        }
                    }
                });

                nsAnalytics('ProfileCtrl', {
                    pushComment: {
                        name: "COMMENT",
                        options: {
                            musician: "{{$scope.musician.name}}",
                            comments: "{{$scope.musician.comments.length}}"
                        }
                    }
                });

            }]);


## Notes on nsModal
Required styles for nsModal are available in ```src/main/resources/styles/scss/modals.scss```.
In order for nsModal to work properly, you must included the compiled CSS from this file in
your application.

### 0.1.6 - 01/17/2014

Initial release.

## LICENSE

The MIT License

Copyright (c) 2013 Neosavvy, http://www.neosavvy.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Enjoy!
