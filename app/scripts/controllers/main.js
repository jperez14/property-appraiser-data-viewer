'use strict';

angular.module('propertySearchApp')
  .controller('MainCtrl', ['$scope', 'propertySearchService', function ($scope, propertySearchService) {

    function initMap(){
      var myMap = new esri.Map('map');
      var urlAerial = "http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer";
      var urlStreet = "http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/BaseMap/MapServer";
      var tiled = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial);


      myMap.addLayer(tiled);
      
      $scope.map = myMap;
    };

    // Initialize the map.
    dojo.ready(initMap);

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

      // add a point
      var myPoint = {"geometry":{"x":857869.8,"y":488913.9},"symbol":{"color":[255,0,0,128],
    "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS",
    "style":"esriSMSSquare","outline":{"color":[0,0,0,255],"width":1,
    "type":"esriSLS","style":"esriSLSSolid"}}};
      var gra = new esri.Graphic(myPoint);
      $scope.map.graphics.add(gra);
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


