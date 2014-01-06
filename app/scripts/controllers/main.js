'use strict';

angular.module('propertySearchApp')
  .controller('MainCtrl', ['$scope', '$q', 'propertySearchService', 'esriGisService', 'paConfiguration', function ($scope, $q, propertySearchService, esriGisService, paConfig) {

    function initMap(){

      var map = new esri.Map('map');
      
      // urls for the map.
      var urlAerial = paConfig.urlAerialMap;
      var urlStreet = paConfig.urlStreetMap;
      var urlParcelLayer = paConfig.urlParcelLayer;

      //Add layers.
      var aerialLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial, {id:"aerial"});
      var streetLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlStreet, {id:"street"});
      var parcels = new esri.layers.FeatureLayer(urlParcelLayer);
      var layers = new esri.layers.GraphicsLayer({id:"layers"});
      map.addLayer(aerialLayer);
      map.addLayer(streetLayer);
      map.addLayer(parcels);
      map.addLayer(layers);
      streetLayer.hide(); 

      
      //Add events to map.
      map.on("click", $scope.mapClicked);


      // Enable Navagation Fatures
      dojo.connect(map, 'onLoad',function(){
        map.enableRubberBandZoom();
        map.disableScrollWheelZoom();
        map.hideZoomSlider();

        $scope.navToolBar  = new esri.toolbars.Navigation(map);
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

    $scope.joseFlag = true;
    $scope.activateToolbar = function (){
      toolbar.activate(esri.toolbars.Draw.EXTENT);
    };

    $scope.drawEndHandler  = function (geometry){
      toolbar.deactivate();
    };

    $scope.mapZoomIn = function(){
      var extent=$scope.map.extent;
      $scope.map.setExtent(extent.expand(0.5));
    };

    $scope.mapZoomOut = function(){
      var extent=$scope.map.extent;
      $scope.map.setExtent(extent.expand(2));
    };

    $scope.mapZoomToProperty = function(){
      if(!isUndefinedOrNull($scope.property))
        if(!isUndefinedOrNull($scope.property.location)){
          var geometry = {"x":$scope.property.location.x, 
                          "y":$scope.property.location.y, 
                          "spatialReference":{"wkid":2236}};
          $scope.map.centerAndZoom(geometry, 10);
        }
    };
    
    $scope.mapZoomToFullExtent = function(){
      $scope.navToolBar.zoomToFullExtent();
    };
    
    $scope.mapZoomInBox = function(){
      $scope.navToolBar.activate(esri.toolbars.Navigation.ZOOM_IN);
    };
    
    $scope.mapToggleAerialOn = function(){
      $scope.map.getLayer("aerial").show();
      $scope.map.getLayer("street").hide();
    }

    $scope.mapToggleStreetOn = function(){
      $scope.map.getLayer("street").show();
      $scope.map.getLayer("aerial").hide();
    }
    

    $scope.mapClicked = function(event){
      var folio = esriGisService.getFolioFromPoint($scope, event.mapPoint.x, event.mapPoint.y);
      folio.then(function(folioValue){
        var myPromise = $scope.getPropertyByFolio(folioValue);
        myPromise.then(function(data){
//          console.log("mapClicked data ", data);
//          var geometry = {
//	      "x":$scope.property.location.x,
//	      "y":$scope.property.location.y,
//	      "spatialReference":{"wkid":2236}}
//          $scope.map.centerAndZoom(geometry, 10);          
        }
                        , function(error){}
                          );
      }, 
                 function(error){});
    };

    $scope.folio = "";
    $scope.property = null;
    
    $scope.showError = false;
    $scope.errorMsg = "";
    
    $scope.ownerName = "";
    $scope.candidatesList = null;

    $scope.isOwnerCandidates = false;
    $scope.isAddressCandidates = false;
    $scope.isPartialFolioCandidates = false;
    $scope.fromPage = 1;
    $scope.toPage = 200;
    $scope.itemsPerFetch = 200;

    
    $scope.address = "";

    $scope.suite = "";
    $scope.folioMask = "99-9999-9?99-9999";
    
    $scope.activeSearchTab = "Address";
    $scope.isActiveSearchTab = function(tab) {
      return $scope.activeSearchTab == tab;
    };
    $scope.setActiveSearchTab = function(tab) {
      $scope.activeSearchTab = tab;
    };

    $scope.activeRollYearTab = 0;
    $scope.isActiveRollYearTab = function(rollYear) {
      return $scope.activeRollYearTab == rollYear;
    };
    $scope.setActiveRollYearTab = function(rollYear) {
      $scope.activeRollYearTab = rollYear;
    };
    
    $scope.salesInfoGrantorName1 = false;
    $scope.salesInfoGrantorName2 = false;

    $scope.layers = paConfig.layers;
    $scope.resetLayers = function(){
      _.each($scope.layers, function(layer){
        layer.value = false;
      });
    };
    
    $scope.turnLayerOnOff = function(layer){

      if (layer.value === true){
        var geometry = esriGisService.getMunicipalityFromPoint($scope, layer, $scope.property.location.x, $scope.property.location.y);
        geometry.then(function(geometry){
          var myPolygon = {"geometry":geometry, "symbol":paConfig.layerSymbol, "attributes":layer};
	  var gra = new esri.Graphic(myPolygon);
	  $scope.map.getLayer("layers").add(gra);
        });
      }else{
        _.each($scope.map.getLayer("layers").graphics, function(graphicLayer){
          if(graphicLayer.attributes !== null)
            if(graphicLayer.attributes.label === layer.label)
	      $scope.map.getLayer("layers").remove(graphicLayer);              
        });
      }
      
      
    };
    

    function clearResults() {

      $scope.showError = false;
      $scope.property = null;
      $scope.candidatesList = null;
      $scope.isOwnerCandidates = false;
      $scope.isAddressCandidates = false;
      $scope.isPartialFolioCandidates = false;
      $scope.fromPage = 1;
      $scope.toPage = 200;
      $scope.activeRollYearTab = 0;


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

    $scope.isDisplayYearTab = function(property, rollYear){

      if(property != null) {
	if(property.extraFeature[rollYear] != undefined ||
	   property.land[rollYear] != undefined ||
	   property.building[rollYear] != undefined)
	  return true;
	else
	  return false;
      }
      else 
	return false;
    };
    
    $scope.isDisplayMessages = function(property, propertySection, rollYear) {

      if(property != null && property != undefined && propertySection != null && propertySection != undefined)
      {
	if(rollYear != null && rollYear != undefined){
	  if(propertySection.messages != undefined && propertySection.messages.length > 0)
	    return true;
	  else if(propertySection[rollYear] != undefined && propertySection[rollYear].message.length > 0)
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

   
    $scope.searchByFolio = function(){
      var folio = $scope.folio;
      if(folio != undefined && folio.length >=7 && folio.length < 13) {
	$scope.getCandidatesByPartialFolio(folio);
      }
      else if(folio != undefined && folio.length == 13){
        var myPromise = $scope.getPropertyByFolio(folio);
        myPromise.then(function(data){
          console.log("mapClicked data ", data);
          var geometry = {
	    "x":$scope.property.location.x,
	    "y":$scope.property.location.y,
	    "spatialReference":{"wkid":2236}}
          $scope.map.centerAndZoom(geometry, 10);          
        }
                       , function(error){}
                      );

      }

    };
    
    $scope.getPropertyByFolio = function(folio){

      // Clear previous data.
      clearResults();

      $scope.map.graphics.clear();
      $scope.map.getLayer("layers").clear();
      $scope.resetLayers();
      $scope.joseFlag = false;

      // Get property data.
      var propertyPromise = propertySearchService.getPropertyByFolio(folio).then(function(property){
	$scope.property = property;
	$scope.showHideSalesInfoGrantorColumns($scope.property.salesInfo);
	$scope.activeRollYearTab = $scope.property.rollYear1;
      }, function(error){
	$scope.showError = true;
	$scope.errorMsg = error.message;
      });

      // Get xy for property and display it in map.
      var geometryPromise = esriGisService.getPointFromFolio($scope, folio).then(function(featureSet){

	if(featureSet.features != undefined && featureSet.features.length > 0) {
	  var myPoint = {"geometry":{
	    "x":featureSet.features[0].attributes.X_COORD,
	    "y":featureSet.features[0].attributes.Y_COORD,
	    "spatialReference":{"wkid":2236}},
			 "symbol":paConfig.propertyMarkerSymbol
			};
	  var gra = new esri.Graphic(myPoint);
	  $scope.map.graphics.add(gra);
	  //$scope.map.centerAndZoom(myPoint.geometry, 10);          
	  return {
	    "x":featureSet.features[0].attributes.X_COORD,
	    "y":featureSet.features[0].attributes.Y_COORD};
	}else{
	  return $q.reject("No point found");
	}
      }, function(error){
	console.log("there was an error");
	$scope.showError = true;
	$scope.errorMsg = "Oops !! The request failed. Please try again later";
      });

      return $q.all([propertyPromise, geometryPromise]).then(function(data){
	$scope.property.location = data[1];},function(error){
	  console.log("there was an error");
	});


    };
    
    $scope.getCandidatesHeight = function(){
      if($scope.candidatesList == null)
	return {height:'560px'};
      else if($scope.candidatesList != null && $scope.candidatesList.candidates.length <= 2)
	return {height:'215px'};
      else if($scope.candidatesList != null && $scope.candidatesList.candidates.length <= 4)
	return {height:'330px'};
      else if($scope.candidatesList != null && $scope.candidatesList.candidates.length <= 6)
	return {height:'445px'};
      else if($scope.candidatesList != null && $scope.candidatesList.candidates.length >= 7)
	return {height:'560px'};
      else
	return {height:'560px'};
    };
    


    $scope.candidatesPaginationSuccess = function(result){
      $scope.candidatesList.candidates = _.union($scope.candidatesList.candidates, result.candidates);
      console.log("candidates updated", $scope.candidatesList);
    };
    $scope.candidatesPaginationFailure = function(error) {
      $scope.fromPage = $scope.fromPage - $scope.itemsPerFetch;
      $scope.toPage = $scope.toPage - $scope.itemsPerFetch;
      console.log("error when fetching nextPage of candidates"+error);
    };
    
    $scope.fetchNextPage = function() {
      if($scope.toPage >= $scope.candidatesList.total) {
        $scope.showError = true;
        $scope.errorMsg = "You are on the last page of results";
      }
      else {
	$scope.fromPage = $scope.fromPage + $scope.itemsPerFetch;
	$scope.toPage = $scope.toPage + $scope.itemsPerFetch;
	
	if(	$scope.isOwnerCandidates === true) {
	  propertySearchService.getCandidatesByOwner($scope.ownerName, $scope.fromPage, $scope.toPage)
	    .then($scope.candidatesPaginationSuccess, $scope.candidatesPaginationFailure);
	}
	if($scope.isAddressCandidates === true) {
	  propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, $scope.fromPage, $scope.toPage)
	    .then($scope.candidatesPaginationSuccess, $scope.candidatesPaginationFailure);
	}
	if($scope.isPartialFolioCandidates === true) {
	  propertySearchService.getCandidatesByPartialFolio(partialFolio, $scope.fromPage, $scope.toPage)
	    .then($scope.candidatesPaginationSuccess, $scope.candidatesPaginationFailure);
	}
      }
    };

    $scope.getCandidatesByOwner = function(){

      clearResults();
      $scope.isOwnerCandidates = true;
      propertySearchService.getCandidatesByOwner($scope.ownerName, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.showError = result.completed;
	    $scope.errorMsg = result.message;
	  }
	  else if(result.candidates.length == 1){
            $scope.folio = result.candidates[0].folio;
            $scope.searchByFolio();
          }
	  else if(result.candidates.length > 1)
	    $scope.candidatesList = result;
	}
	else {
	  $scope.showError = !result.completed;
	  $scope.errorMsg = result.message;
	}
      }, function(error){
	console.log("getCandidatesByOwner error "+error);
	$scope.showError = true;
	$scope.errorMsg = "Oops !! The request failed. Please try again later";
      });
    };

    $scope.getCandidatesByAddress = function(){
      clearResults();
      $scope.isAddressCandidates = true;
      propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.showError = result.completed;
	    $scope.errorMsg = result.message;
	  }
	  else if(result.candidates.length == 1){
            $scope.folio = result.candidates[0].folio;
            $scope.searchByFolio();
          }
	  else if(result.candidates.length > 1)
	    $scope.candidatesList = result;
	}
	else {
	  $scope.showError = !result.completed;
	  $scope.errorMsg = result.message;
	}
      }, function(error){
	console.log("getCandidatesByAddress error "+error);
	$scope.showError = true;
	$scope.errorMsg = "Oops !! The request failed. Please try again later";
      });

    };

    $scope.getCandidatesByPartialFolio = function(folio){
      clearResults();

      $scope.isPartialFolioCandidates = true;
      propertySearchService.getCandidatesByPartialFolio(folio, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.showError = result.completed;
	    $scope.errorMsg = result.message;
	  }
	  else if(result.candidates.length == 1){
            $scope.folio = result.candidates[0].folio;
            $scope.searchByFolio();
          }
	  else if(result.candidates.length > 1)
	    $scope.candidatesList = result;
	}
	else {
	  $scope.showError = !result.completed;
	  $scope.errorMsg = result.message;
	}

      }, function(error){
	console.log("getCandidatesByPartialFolio error "+error);
	$scope.showError = true;
	$scope.errorMsg = "Oops !! The request failed. Please try again later";
      });

    };

    var isUndefinedOrNull = function(val){ return _.isUndefined(val) || _.isNull(val)};


  }]);


