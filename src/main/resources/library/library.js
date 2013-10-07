var Neosavvy = Neosavvy || {};
Neosavvy.AngularCore = Neosavvy.AngularCore || {};
Neosavvy.AngularCore.Analytics = angular.module('neosavvy.angularcore.analytics', []);
Neosavvy.AngularCore.Directives = angular.module('neosavvy.angularcore.directives', []);
Neosavvy.AngularCore.Filters = angular.module('neosavvy.angularcore.filters', []);
Neosavvy.AngularCore.Services = angular.module('neosavvy.angularcore.services', []);
Neosavvy.AngularCore.Dependencies = ['neosavvy.angularcore.analytics', 'neosavvy.angularcore.directives', 'neosavvy.angularcore.filters', 'neosavvy.angularcore.services'];
