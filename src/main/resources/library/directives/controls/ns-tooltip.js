Neosavvy
    .Directives
    .directive('nsTooltip', function () {
        return {
            compile:function (tElement, tAttrs, transclude) {
                var tooltipClazz = tAttrs.tooltip;
                $(tElement[0]).append('<div style="display: none;" class="tooltip ' + tooltipClazz + '">&nbsp;</div>');
                return function (scope, iElement, iAttrs) {
                    //Adds Mouseover Handler to directive
                    iElement.bind('mouseover', function (e) {
                        scope.$apply(function () {
                            var myTooltip = iElement[0].getElementsByClassName(tooltipClazz)[0];
                            $(myTooltip).css('display', 'block');
                            $(myTooltip).removeClass('animated fadeOut')
                            $(myTooltip).addClass('animated fadeIn');
                        });
                    });
                    iElement.bind('mouseleave', function (e) {
                        scope.$apply(function () {
                            var myTooltip = iElement[0].getElementsByClassName(tooltipClazz)[0];
                            $(myTooltip).removeClass('animated fadeIn')
                            $(myTooltip).addClass('animated fadeOut');
                            $(myTooltip).css('display', 'none');
                        });
                    })
                };
            }
        }
    });