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
      var tiled = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial);
      var parcels = new esri.layers.FeatureLayer(urlParcelLayer);
      var layers = new esri.layers.GraphicsLayer({id:"layers"});
      map.addLayer(tiled);
      map.addLayer(parcels);
      map.addLayer(layers);
      
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

    $scope.joseFlag = true;
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
    $scope.fromPage = 1;
    $scope.toPage = 200;
    $scope.itemsPerFetch = 200;
    
    $scope.address = "";

    $scope.suite = "";
    $scope.folioMask = "99-9999-999-9999";
    
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
      $scope.fromPage = 1;
      $scope.toPage = 200;

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
	if(property.extraFeature[rollYear] != undefined &&
	   property.land[rollYear] != undefined &&
	   property.building[rollYear] != undefined)
	  return true;
	else
	  return false;
      }
      else false;
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


    $scope.getPropertyByFolio = function(candidateFolio){

      // Clear previous data.
      clearResults();
      $scope.map.graphics.clear();
      $scope.map.getLayer("layers").clear();
      $scope.resetLayers();
      $scope.joseFlag = false;

      // resize map container
      //$scope.mapStyle = {width:'100%', height:'200px'};
      //$scope.map.resize();

      // Get folio to search for.
      var folio = (candidateFolio != undefined) ? candidateFolio : $scope.folio;

      // Get property data.
      var propertyPromise = propertySearchService.getPropertyByFolio(folio).then(function(property){
            $scope.property = property;
            $scope.showHideSalesInfoGrantorColumns($scope.property.salesInfo);
      }, function(error){
          $scope.showError = true;
	  $scope.errorMsg = error.message;
      });

      // Get xy for property and display it in map.
      var geometryPromise = esriGisService.getPointFromFolio($scope, folio).then(function(featureSet){

        if(featureSet.features != undefined && featureSet.features.length > 0) {
	  var myPoint = {"geometry":{
	    "x":featureSet.features[0].attributes.X_COORD,
	    "y":featureSet.features[0].attributes.Y_COORD},
		         "symbol":paConfig.propertyMarkerSymbol
			};
	  var gra = new esri.Graphic(myPoint);
	  $scope.map.graphics.add(gra);
	  $scope.map.centerAndZoom(myPoint.geometry, 10);          
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

      $q.all([propertyPromise, geometryPromise]).then(function(data){
        $scope.property.location = data[1];},function(error){
          console.log("there was an error");
        });
    };

    $scope.fetchNextPage = function() {
      if($scope.toPage >= $scope.candidatesList.total) {
        $scope.showError = true;
        $scope.errorMsg = "You are on the last page of results";
      }
      else {
	$scope.fromPage = $scope.fromPage + $scope.itemsPerFetch;
	$scope.toPage = $scope.toPage + $scope.itemsPerFetch;
	propertySearchService.getCandidatesByOwner($scope.ownerName, $scope.fromPage, $scope.toPage).then(function(result){
	  $scope.candidatesList.candidates = _.union($scope.candidatesList.candidates, result.candidates);
	  console.log("candidates updated", $scope.candidatesList);
	}, function(error) {
	  $scope.fromPage = $scope.fromPage - $scope.itemsPerFetch;
	  $scope.toPage = $scope.toPage - $scope.itemsPerFetch;
	  console.log("error when fetching nextPage of candidates"+error);
	});
      }
    };

    $scope.getCandidatesByOwner = function(){
      clearResults();
      propertySearchService.getCandidatesByOwner($scope.ownerName, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.showError = result.completed;
	    $scope.errorMsg = result.message;
	  }
	  else if(result.candidates.length == 1)
	    $scope.getPropertyByFolio(result.candidates[0].folio);
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
      propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.showError = result.completed;
	    $scope.errorMsg = result.message;
	  }
	  else if(result.candidates.length == 1)
	    $scope.getPropertyByFolio(result.candidates[0].folio);
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

    $scope.getCandidatesByPartialFolio = function(){
      clearResults();
      //TODO : compute and populate partialFolio
      var partialFolio = "";
      propertySearchService.getCandidatesByPartialFolio(partialFolio, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.showError = result.completed;
	    $scope.errorMsg = result.message;
	  }
	  else if(result.candidates.length == 1)
	    $scope.getPropertyByFolio(result.candidates[0].folio);
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


  }]);


