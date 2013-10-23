'use strict';



var dataviewer2App = angular.module('dataviewer2App')
  .run(function($rootScope, $templateCache) {
	$rootScope.$on('$viewContentLoaded', function() {
		$templateCache.removeAll();
	});
  })
  .controller('MainCtrl', function ($scope, $resource) {

    $scope.folio = "";
    $scope.property = null;
    $scope.showError = false;

    
    

    /**
     * Get Property Information with folio 
     * in scope.folio. Assign the information to
     * scope.property.
     */

    $scope.getPropertyByFolio = function(){


      var url = "PaPublicServices/PAGISService.svc/GetPropertySearchByFolio"
      var params = {folioNumber:$scope.folio,layerId:'4'};

      var property = $resource(url, params, 
                            {retrieve:{method:'GET'}});


      //$scope.property = property.retrieve();
      var address = property.retrieve(function(){

        if(address.PropertyInfo.FolioNumber == null){
          $scope.property = null;
          $scope.showError = true;
        }else{
          var legalDescription = address.LegalDescription.Description.split(",");
          address.LegalDescription.Description = legalDescription;
          console.log(legalDescription);
          $scope.showError = false;
          $scope.property = address;

        }

      }, function(){$scope.showError = true;
            });

    };
    
  

});


