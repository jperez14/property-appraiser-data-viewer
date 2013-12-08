'use strict';

angular.module('propertySearchApp')
  .controller('MainCtrl', ['$scope', 'propertySearchService', 'esriGisService', function ($scope, propertySearchService, esriGisService) {

    function initMap(){
      var myMap = new esri.Map('map');
      var urlAerial = "http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer";
      var urlAerial2 = "http://arcgis.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer";
      var urlStreet = "http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/BaseMap/MapServer";
      var tiled = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial2);

      var urlParcels = "http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/57";
      //var parcels = new esri.layers.FeatureLayer(urlParcels);

      myMap.addLayer(tiled);
      //myMap.addLayer(parcels);
      
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
      var folio = folioNum.trim().replace(/-/g, "");
      $scope.getPropertyByFolio(folio);
    };

    $scope.getPropety

    $scope.getPropertyByFolio = function(candidateFolio){

      // Clear previous data.
      clearResults();
      $scope.map.graphics.clear();

      // Get folio to search for.
      var folio = (candidateFolio != undefined) ? candidateFolio : $scope.folio;

      // Get property data.
      propertySearchService.getPropertyByFolio(folio).then(function(property){
        $scope.property = property;
      });

      // Get xy for property and display it in map.
      esriGisService.getPointFromFolio($scope, folio).then(function(featureSet){
        
        var myPoint = {"geometry":{"x":featureSet.features[0].attributes.X_COORD,"y":featureSet.features[0].attributes.Y_COORD},"symbol":{"color":[255,0,0,128],
                                                                                                                                          "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS",
                                                                                                                                          "style":"esriSMSSquare","outline":{"color":[0,0,0,255],"width":1,
                                                                                                                                                                             "type":"esriSLS","style":"esriSLSSolid"}}};
        var gra = new esri.Graphic(myPoint);
        $scope.map.graphics.add(gra);
        $scope.map.centerAndZoom(myPoint.geometry, 10);

      }, function(error){console.log("there was an error");})

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


//      var ranValue = Math.random();
//      console.log("ranValue about to call greet service ", ranValue)
//      esriGisService.greet($scope, ranValue).then(function(greet){
//        console.log("The greeting is", greet);
//      });


//       esriGisService.getPointFromFolio(folio).then(function(featureSet){
//         
//        var myPoint = {"geometry":{"x":featureSet.features[0].attributes.X_COORD,"y":featureSet.features[0].attributes.Y_COORD},"symbol":{"color":[255,0,0,128],
//                                                                        "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS",
//                                                                        "style":"esriSMSSquare","outline":{"color":[0,0,0,255],"width":1,
//                                                                                                           "type":"esriSLS","style":"esriSLSSolid"}}};
//        var gra = new esri.Graphic(myPoint);
//        $scope.map.graphics.add(gra);
//
//        }, function(error){console.log("there was an error");});
