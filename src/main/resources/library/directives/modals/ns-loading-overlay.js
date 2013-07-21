Neosavvy.AngularCore.Directives
    .directive('nsLoadingOverlay', function () {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'static/application/core/directives/ns-loading-overlay.html',
            scope:{
                loading:"=loading"
            },
            link:function (scope, element, attrs) {
                var spinner = null;
                var options = {
                    lines:13, // The number of lines to draw
                    length:40, // The length of each line
                    width:6, // The line thickness
                    radius:20, // The radius of the inner circle
                    corners:1, // Corner roundness (0..1)
                    rotate:0, // The rotation offset
                    color:'#000', // #rgb or #rrggbb
                    speed:1, // Rounds per second
                    trail:60, // Afterglow percentage
                    shadow:false, // Whether to render a shadow
                    hwaccel:false, // Whether to use hardware acceleration
                    className:'spinner', // The CSS class to assign to the spinner
                    zIndex:2e9, // The z-index (defaults to 2000000000)
                    top:'auto', // Top position relative to parent in px
                    left:'auto' // Left position relative to parent in px
                };

                scope.$watch('loading', function (newValue) {
                    if (newValue) {
                        if (!spinner) {
                            spinner = new Spinner(options);
                        }
                        spinner.spin(element[0])
                    } else {
                        if (spinner) {
                            spinner.stop();
                        }
                    }
                });
            }
        }
    });