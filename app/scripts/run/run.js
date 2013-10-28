/**
* Remove views from the template cache
*/
angular.module('dataviewer2App')
  .run(function($rootScope, $templateCache) {
	$rootScope.$on('$viewContentLoaded', function() {
		$templateCache.removeAll();
	});
  });
