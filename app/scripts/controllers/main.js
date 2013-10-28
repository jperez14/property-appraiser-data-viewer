'use strict';

angular.module('dataviewer2App')
  .controller('MainCtrl', ['$scope', 'propertyService', function ($scope, propService) {

	$scope.folio = "";
    $scope.property = null;
    $scope.showError = false;
	$scope.errorMsg = "";
	
	$scope.ownerFirstName = "";
	$scope.ownerLastName = "";
	$scope.ownersList = null;
	
	$scope.address = "";
	
	function clearResults() {
		$scope.property = null;
		$scope.ownersList = null;
	};
	
	$scope.getOwnerFolio = function(folioNum){
		console.log("ownerFolio", folioNum);
		$scope.folio = folioNum.trim().replace(/-/g, "");
		$scope.getPropertyByFolio();
	};

    /**
     * Get Property Information with folio 
     * in scope.folio. Assign the information to
     * scope.property.
     */
    $scope.getPropertyByFolio = function(){
		clearResults();
		var address = propService.getFolio($scope.folio).retrieve(
			function() {
				if(address.PropertyInfo.FolioNumber == null){
				  $scope.property = null;
				  $scope.errorMsg = address.Message;
				  $scope.showError = true;
				}else{
				  var legalDescription = address.LegalDescription.Description.split(",");
				  address.LegalDescription.Description = legalDescription;
				  console.log(legalDescription);
				  $scope.showError = false;
				  $scope.property = address;
				}
			}, function(){
				$scope.errorMsg = address.Message;
				$scope.showError = true;
            });
    };

	$scope.getOwnersByName = function() {
		clearResults();
		var owners = propService.getOwner($scope.ownerFirstName, $scope.ownerLastName).retrieve(
			function(){
				console.log("owners", owners);
				if(owners.Total == 0)
				{
					$scope.errorMsg = owners.Message;
					$scope.showError = true;
				}
				else{
					$scope.ownersList = owners.MinimumPropertyInfos;
				}
			},function(){
				console.log("owners error", owners);
				$scope.errorMsg = owners.Message;
				$scope.showError = true;
		});
	};
	
	$scope.getAddressCandidates = function() {
		clearResults();
		var addr = $scope.address.trim().split('#');
		var fullAddr = addr[0].trim().replace(/ /g,"%20").trim();
		var unit = "";
		if(addr[1] != undefined)
			unit = addr[1].trim();
		var candidates = propService.getAddress(fullAddr, unit).retrieve(
			function() {
				console.log(candidates);
			},
			function() {
				console.log(candidates);
		});
	};

}]);


