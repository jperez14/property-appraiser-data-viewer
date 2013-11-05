/**
* Remove views from the template cache
*/
angular.module('propertySearchApp')
  .run(function($rootScope, $templateCache) {
	$rootScope.$on('$viewContentLoaded', function() {
		$templateCache.removeAll();
	});
  });
