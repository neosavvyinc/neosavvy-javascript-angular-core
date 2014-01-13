Neosavvy.AngularCore.Directives
    .directive('nsLoadingOverlay',
    function () {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var radius = attrs.nsSpinnerRadius ? parseFloat(attrs.nsSpinnerRadius) : null;
                var width = attrs.nsSpinnerWidth ? parseFloat(attrs.nsSpinnerWidth) : null;
                var lines = attrs.nsSpinnerLines ? parseFloat(attrs.nsSpinnerLines) : null;
                var trail = attrs.nsSpinnerTrail ? parseFloat(attrs.nsSpinnerTrail) : null;
                var sizeToWindow = (attrs.nsSpinnerSizeToWindow === 'true');
                var opts = {
                    lines: lines || 10, // The number of lines to draw
                    length: parseInt(attrs.nsLoadingOverlayLength) || 55, // The length of each line
                    width: width || 3, // The line thickness
                    radius: radius || 10, // The radius of the inner circle
                    color: '#292929', // #rbg or #rrggbb
                    speed: 1, // Rounds per second
                    trail: trail || 100, // Afterglow percentage
                    shadow: (attrs.nsSpinnerShadow ? attrs.nsSpinnerShadow !== 'false' : true) // Whether to render a shadow
                };
                var spinner;

                //WATCHERS
                scope.$watch(attrs.nsLoadingOverlay, function (newValue) {
                    if (newValue) {
                        spinner = new Spinner(opts).spin(element[0]);
                        if (sizeToWindow) {
                            $(spinner.el).css('top', String($(window).height() / 2) + "px");
                        }
                    } else if (spinner) {
                        spinner.stop();
                        spinner = null;
                    }
                });
            }
        }
    });