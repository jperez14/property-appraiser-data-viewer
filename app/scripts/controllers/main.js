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
	$scope.suite = "";
	$scope.folioMask = "99-9999-999-9999";
    
	$scope.salesInfoGrantorName1 = false;
	$scope.salesInfoGrantorName2 = false;

    function clearResults() {
      $scope.property = null;
      $scope.candidatesList = null;
      $scope.salesInfoGrantorName1 = false;
      $scope.salesInfoGrantorName2 = false;
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
	
	$scope.showHideSalesInfoGrantorColumns = function(salesInfo) {
		if(salesInfo.length > 0){
			_.each(salesInfo, function(sale){
				if(sale.grantorName1 != null && sale.grantorName1 != undefined && sale.grantorName1.trim() != "")
					$scope.salesInfoGrantorName1 = true;
				if(sale.grantorName2 != null && sale.grantorName2 != undefined && sale.grantorName2.trim() != "")
					$scope.salesInfoGrantorName2 = true;
			});
		}
	};
	
	$scope.salesInfoColumnCount = function() {
		var count = 4;
		count = ($scope.salesInfoGrantorName1 == true) ? count + 1 : count;
		count = ($scope.salesInfoGrantorName2 == true) ? count + 1 : count;
		return count;
	};

	$scope.isDisplayMessages = function(property, propertySection, rollYear) {
		if(property != null && property != undefined && propertySection != null && propertySection != undefined)
		{
			if(rollYear != null && rollYear != undefined){
				if(propertySection[rollYear] != undefined && propertySection[rollYear].message.length > 0)
					return true;
				else
					return false;
			}
			else if((propertySection[property.rollYear1] != undefined 
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
      var folio = folioNum.trim().replace(/-/g, "");
      $scope.getPropertyByFolio(folio);
    };

    $scope.getPropertyByFolio = function(candidateFolio){
      clearResults();
	  var folio = (candidateFolio != undefined) ? candidateFolio : $scope.folio;
      propertySearchService.getPropertyByFolio(folio).then(function(property){
        $scope.property = property;
		$scope.showHideSalesInfoGrantorColumns($scope.property.salesInfo);
      });

    };

    $scope.getCandidatesByOwner = function(){
	  clearResults();
	  propertySearchService.getCandidatesByOwner($scope.ownerName, 1, 200).then(function(candidatesList){
		if(candidatesList.candidates.length > 1)
			$scope.candidatesList = candidatesList;
		else if(candidatesList.candidates.length == 1)
			$scope.getCandidateFolio(candidatesList.candidates[0].folio);
	  });
    };

    $scope.getCandidatesByAddress = function(){
	  clearResults();
	  propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, 1, 200).then(function(candidatesList){
		if(candidatesList.candidates.length > 1)
			$scope.candidatesList = candidatesList;
		else if(candidatesList.candidates.length == 1)
			$scope.getCandidateFolio(candidatesList.candidates[0].folio);
	  });
    };

  }]);


