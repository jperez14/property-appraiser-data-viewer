'use strict';

angular.module('propertySearchApp')
  .controller('MainCtrl', ['$scope', 'propertySearchService', 'esriGisService', 'paConfiguration', function ($scope, propertySearchService, esriGisService, paConfig) {

    function initMap(){

      var map = new esri.Map('map');
      
      // urls for the map.
      var urlAerial = paConfig.urlAerialMap;
      var urlStreet = paConfig.urlStreetMap;
      var urlParcelLayer = paConfig.urlParcelLayer;

      //Add layers.
      var tiled = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial);
      var parcels = new esri.layers.FeatureLayer(urlParcelLayer);
      map.addLayer(tiled);
      map.addLayer(parcels);
      
      //Add events to map.
      map.on("click", $scope.mapClicked);


      // Enable Navagation Fatures
      dojo.connect(map, 'onLoad',function(){
        map.enableRubberBandZoom();
        map.disableScrollWheelZoom();
      });



      $scope.map = map;

//      dojo.connect(map, 'onLoad', function(theMap) {
//        //create the draw toolbar 
//        toolbar = new esri.toolbars.Draw(map);
//        dojo.connect(toolbar,"onDrawEnd",drawEndHandler);
//      });
      
    };

    // Initialize the map.
    dojo.ready(initMap);

    $scope. activateToolbar = function (){
        toolbar.activate(esri.toolbars.Draw.EXTENT);
    };

    $scope.drawEndHandler  = function (geometry){
        toolbar.deactivate();

    };

    $scope.mapClicked = function(event){
      var folio = esriGisService.getFolioFromPoint($scope, event.mapPoint.x, event.mapPoint.y);
      folio.then(function(folioValue){$scope.getPropertyByFolio(folioValue);}, function(error){});
    };

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
    $scope.showFolioStatus = function() {
      if($scope.property != null) {
	if($scope.property.propertyInfo.status != null && $scope.property.propertyInfo.status != "AC Active") {
	  return "("+ $scope.property.propertyInfo.status.substr(2).trim() +")";
	}
	else
	  return "";
      }
      else
	return "";
    };

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

      // Clear previous data.
      clearResults();
      $scope.map.graphics.clear();

      // Get folio to search for.
      var folio = (candidateFolio != undefined) ? candidateFolio : $scope.folio;

      // Get property data.
      propertySearchService.getPropertyByFolio(folio).then(function(property){
        $scope.property = property;
	$scope.showHideSalesInfoGrantorColumns($scope.property.salesInfo);
	$scope.showError = $scope.property.completed === false ? true : false;
	$scope.errorMsg = $scope.property.completed === false ? $scope.property.message : "";
      }, function(error){console.log("getPropertyByFolio error "+error);});

      // Get xy for property and display it in map.
      esriGisService.getPointFromFolio($scope, folio).then(function(featureSet){
        
        if(featureSet.features.length > 0) {
	  var myPoint = {"geometry":{
	    "x":featureSet.features[0].attributes.X_COORD,
	    "y":featureSet.features[0].attributes.Y_COORD},
			 "symbol":{"color":[255,0,0,128],
				   "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS",
				   "style":"esriSMSSquare",
				   "outline":{"color":[0,0,0,255],"width":1,"type":"esriSLS","style":"esriSLSSolid"}
				  }
			};
	  var gra = new esri.Graphic(myPoint);
	  $scope.map.graphics.add(gra);
	  $scope.map.centerAndZoom(myPoint.geometry, 10);
	}
      }, function(error){console.log("there was an error");})

    };

    $scope.getCandidatesByOwner = function(){

      clearResults();
      propertySearchService.getCandidatesByOwner($scope.ownerName, 1, 200).then(function(candidatesList){
	if(candidatesList.candidates.length > 1)
	  $scope.candidatesList = candidatesList;
	else if(candidatesList.candidates.length == 1)
	  $scope.getCandidateFolio(candidatesList.candidates[0].folio);
      }, function(error){console.log("getCandidatesByOwner error "+error);});
    };

    $scope.getCandidatesByAddress = function(){
      clearResults();
      propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, 1, 200).then(function(candidatesList){
	if(candidatesList.candidates.length > 1)
	  $scope.candidatesList = candidatesList;
	else if(candidatesList.candidates.length == 1)
	  $scope.getCandidateFolio(candidatesList.candidates[0].folio);
      }, function(error){console.log("getCandidatesByOwner error "+error);});

    };

  }]);


