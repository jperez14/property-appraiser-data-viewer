'use strict';

angular.module('propertySearchApp')
  .controller('CandidatesCtrl', 
  ['$scope', '$q', '$window', '$routeParams', '$log', 'localStorageService', 'candidate', 'propertySearchService', function (
    $scope, $q, $window, $routeParams, $log, localStorageService, candidate, propertySearchService) {
    
    $scope.property = localStorageService.get('property');
	
    $scope.errorMsg = "";
    $scope.showError = false;
	$scope.ownerName = localStorageService.get('ownerName');
	$scope.address = localStorageService.get('address');
	$scope.suite = localStorageService.get('suite');
	$scope.subDivision = localStorageService.get('subDivision');
	$scope.folio = localStorageService.get('folio');
	$scope.isOwnerCandidates = localStorageService.get('isOwnerCandidates');
    $scope.isAddressCandidates = localStorageService.get('isAddressCandidates');
    $scope.isPartialFolioCandidates = localStorageService.get('isPartialFolioCandidates');
	$scope.isSubDivisionCandidates = localStorageService.get('isSubDivisionCandidates');
	$scope.candidatesList = null;
	
	$scope.tempCandidatesList = localStorageService.get('candidatesList');
    $scope.fromPage = 1;
    $scope.toPage = 200;

    $scope.showErrorDialog = function(message){
      $scope.errorMsg = message;
      $scope.showError = true;
      $('#error-modal').modal('show');
    };

	function promiseSuccess(result){
      if(result.completed == true) {
        if(result.candidates.length == 0) {
          $scope.showErrorDialog(result.message);
        }
        else
          $scope.candidatesList = result;
      }
      else {
        $scope.showErrorDialog(result.message);
      }
    };

	function promiseError(error){
      $log.error("getCandidates error ", error);
      $scope.showErrorDialog("Unable to print now. Please try again later");
    }
	
	if($scope.tempCandidatesList.candidates.length < $scope.tempCandidatesList.total){
	//if($scope.tempCandidatesList.candidates.length < 1000){
      $scope.loader = true;
	  if($scope.isOwnerCandidates == "true") {
        propertySearchService.getCandidatesByOwner($scope.ownerName, $scope.fromPage, $scope.toPage).then(promiseSuccess, promiseError);
	  }
	  else if($scope.isAddressCandidates == "true") {
        propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, $scope.fromPage, $scope.toPage).then(promiseSuccess, promiseError);
	  }
	  else if($scope.isPartialFolioCandidates == "true") {
        propertySearchService.getCandidatesByPartialFolio($scope.folio, $scope.fromPage, $scope.toPage).then(promiseSuccess, promiseError);
	  }
	  else if($scope.isSubDivisionCandidates == "true") {
        propertySearchService.getCandidatesBySubDivision($scope.subDivision, $scope.fromPage, $scope.toPage).then(promiseSuccess, promiseError);
	  }
	}
	else {
	  $scope.candidatesList = $scope.tempCandidatesList;
	}

	$scope.showFolioStatus = function(status) {
	  return candidate.getFolioStatus(status);
    };

    $scope.getRenamedMunicipality = function(municipality) {
      return candidate.getRenamedMunicipality(municipality);
    };
    
    $scope.doPrint = function() {
      window.print();
    };
	
  }
  ]);
