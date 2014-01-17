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

```JavaScript
var Neosavvy = Neosavvy || {};
Neosavvy.AngularCore = Neosavvy.AngularCore || {};

Neosavvy.AngularCore.Analytics = angular.module('neosavvy.angularcore.analytics', []);
Neosavvy.AngularCore.Controllers = angular.module('neosavvy.angularcore.controllers', []);
Neosavvy.AngularCore.Directives = angular.module('neosavvy.angularcore.directives', []);
Neosavvy.AngularCore.Filters = angular.module('neosavvy.angularcore.filters', []);
Neosavvy.AngularCore.Services = angular.module('neosavvy.angularcore.services', []);

Neosavvy.AngularCore.Dependencies = [
'neosavvy.angularcore.analytics',
'neosavvy.angularcore.controllers',
'neosavvy.angularcore.directives',
'neosavvy.angularcore.filters',
'neosavvy.angularcore.services'
];
```

## neosavvy.angularcore.analytics

Define your global analytics callback with the provider at config time,

```JavaScript
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
```


Define controller analytics at runtime,

```JavaScript
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
```


## neosavvy.angularcore.controllers

Access controllers created in the dom at runtime, by name, by DOM id, by scope, and last,

```HTML
<div ng-controller="TomController" id="tom-controller-1"> ... </div>
<div ng-controller="TomController" id="tom-controller-2"> ... </div>
<div ng-controller="TomController" id="tom-controller-3"> ... </div>
<div ng-controller="TomController" id="tom-controller-4"> ... </div>
```

```JavaScript
angular.module('app')
    .controller('MyController',
        ['$scope', 'nsControllers', function($scope, nsControllers) {

          var allTomControllers = nsControllers.get('TomController');
          var tomControllerThree = nsControllers.getById('tom-controller-3');
          var tomControllerByScope = nsControllers.getByScope('#3F');
          var lastTomController = nsController.getLast();

        }]);
```


## neosavvy.angularcore.directives

Inline html from the server,

```HTML
<ns-inline-html value="myScopeValue"></ns-inline-html>
```


Modal with open handler and optional close handler, closes on route change,

```HTML
<ns-modal open="openMyModalFn" close="optionalFnHere">
    <label>My Custom Contents</label>
</ns-modal>
```


Static include remote templates, lazy load on demand,

```HTML
<!-- Wait for timeout -->
<ns-static-include wait-for="500"
    src="some/path/to/remote.html"></ns-static-include>

<!-- Wait for flag (lazy load) -->
<ns-static-include watch-wait-for="someFlagOnScope"
    src="some/path/to/remote.html"></ns-static-include>

<!-- Wait for timeout to render, not request -->
<ns-static-include wait-for-render="500"
    src="some/path/to/remote.html"></ns-static-include>

<!-- Wait for flag to render, not request -->
<ns-static-include watch-wait-for-render="someFlagOnScope"
    src="some/path/to/remote.html"></ns-static-include>
```

Serialize data loaded into the DOM,

```HTML
<!-- Scope Property -->
<ns-serialize data="{'name':'George', 'age':'62'}" property="myVarOnScope"></ns-serialize>

<!-- Scope Function -->
<ns-serialize data="{'name':'George', 'age':'62'}" property="myFn()"></ns-serialize>

<!-- Injected Value Property -->
<ns-serialize data="{'name':'George', 'age':'62'}" property="someProp"
    inject="myNgValue"></ns-serialize>

<!-- Injected Value Function -->
<ns-serialize data="{'name':'George', 'age':'62'}" property="someFn()"
    inject="myNgFactory"></ns-serialize>
```

Watch any jQuery or Zepto event,

```HTML
<!-- On Element -->
<input ns-event="blur, onBlur()">

<!-- On Sub Element -->
<div ns-event="click, onMultiClick(), a, .special">
  <a>Will Be Clicked</a>
  <a>Will Be Clicked</a>
  <button>Will Not Be Clicked</button>
  <button class="special>Will Be Clicked</button>
</div>
```

Only watch model changes on 'blur' event,

```HTML
<input ns-model-on-blur="myModel">
```

Only require input when shown,

```HTML
<!-- Not required for validation -->
<input ns-required-if-shown ng-show="false">

<!-- Required for validation -->
<input ns-required-if-shown ng-show="true">
```


## neosavvy.angularcore.filters

### Collection

Filter based on an 'or' case of available properties,

```JavaScript
$scope.myCollection = [
  {city: {name: "Omaha"}},
  {city: {name: "Chicago"}},
  {city: {name: "Boston"}}
];

$scope.wantedCities = ["Omaha", "Boston"];
```

```HTML
<!-- Will show Omaha and Boston -->
<label ng-repeat="myCollection | nsCollectionFilterProperties : 'city.name' : wantedCities"></label>
```

Filter based on a single matching property,

```JavaScript
$scope.myCollection = [
  {city: {name: "Omaha"}},
  {city: {name: "Chicago"}},
  {city: {name: "Boston"}}
];

$scope.wantedCity = "Chicago";
```

```HTML
<!-- Will show Chicago -->
<label ng-repeat="myCollection | nsCollectionFilterProperty : 'city.name' : wantedCity"></label>
```

Filter on property matching a substring,

```JavaScript
$scope.myCollection = [
  {city: {name: "Omaha"}},
  {city: {name: "Chicago"}},
  {city: {name: "Boston"}}
];

$scope.wantedCity = "Oma";
```

```HTML
<!-- Will show Omaha -->
<label ng-repeat="myCollection | nsCollectionFilterPropertyContains : 'city.name' : wantedCity"></label>
```


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
