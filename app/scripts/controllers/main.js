'use strict';

angular.module('propertySearchApp')
  .controller('MainCtrl', ['$scope', 'propertySearchService', function ($scope, propertySearchService) {

    $scope.folio = "";
    $scope.property = null;
    $scope.showError = false;
    $scope.errorMsg = "";
    
    $scope.ownerName = "";
    $scope.candidatesList = null;
    
    $scope.address = "";
	$scope.folioMask = "99-9999-999-9999";
    
    function clearResults() {
      $scope.property = null;
      $scope.candidatesList = null;
    };
/*
	$scope.showFullListOfOwners = function() {
		if($scope.property != null && $scope.property.ownersInfo.length > 2)
			return true;
		else
			return false;
	};
*/
/*
	$scope.showFullListOfSiteAddresses = function() {
		if($scope.property != null && $scope.property.siteAddresses.length > 1)
			return true;
		else
			return false;
	};
*/
	$scope.getRenamedMunicipality = function(municipality) {
		if(municipality.toUpperCase() === 'UNINCORPORATED COUNTY')
			return "Miami";
		else
			return municipality;
	};
	
	$scope.isCountryUSA = function(country) {
		if(country != undefined && (country.toUpperCase() === 'USA' || country.toUpperCase() === 'US'))
			return true;
		else
			return false;
	};
	
	$scope.isDisplayMessages = function(property, propertySection) {
		if(property != null && property != undefined && propertySection != null && propertySection != undefined)
		{
			if((propertySection[property.rollYear1] != undefined 
					&& propertySection[property.rollYear1].message.length > 0)
				|| (propertySection[property.rollYear2] != undefined 
					&& propertySection[property.rollYear2].message.length > 0)
				|| (propertySection[property.rollYear3] != undefined 
					&& propertySection[property.rollYear3].message.length > 0))
				return true;
			else
				return false;
		}
		else
			return false;
	};

    $scope.getCandidateFolio = function(folioNum){
      $scope.folio = folioNum.trim().replace(/-/g, "");
	  $scope.ownerName = "";
	  $scope.address = "";
      $scope.getPropertyByFolio();
    };

    $scope.getPropertyByFolio = function(){
      clearResults();
      propertySearchService.getPropertyByFolio($scope.folio).then(function(property){
        $scope.property = property;
      });

    };

    $scope.getCandidatesByOwner = function(){
	  clearResults();
	  propertySearchService.getCandidatesByOwner($scope.ownerName, 1, 200, function(result){
		$scope.candidatesList = result;
		console.log("candidatesList", $scope.candidatesList);
	  });
    };

    $scope.getCandidatesByAddress = function(){
	  clearResults();
      var addr = $scope.address.trim().split('#');
      var fullAddr = addr[0].trim();
      var unit = "";
      if(addr[1] != undefined) {
        unit = addr[1].trim();
	  }
	  propertySearchService.getCandidatesByAddress(fullAddr, unit, 1, 200, function(result){
		$scope.candidatesList = result;
	  });
    };

  }]);


