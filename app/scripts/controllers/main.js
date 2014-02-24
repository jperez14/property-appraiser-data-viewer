'use strict';

angular.module('propertySearchApp')
  .controller('MainCtrl', ['$scope', '$q', '$window', '$routeParams', '$log', 'localStorageService', 'propertySearchService', 'esriGisService', 'esriGisGeometryService', 'paConfiguration', 'SharedDataService', function ($scope, $q, $window, $routeParams, $log, localStorageService, propertySearchService, esriGisService, esriGisGeometryService, paConfig, SharedData) {

    // IMPORTANT - Do not move
    $scope.mapClicked = function(event){
      $log.debug("Map has been clicked");
      var folio = esriGisService.getFolioFromPoint($scope, event.mapPoint.x, event.mapPoint.y);
      folio.then(function(folioValue){
        if(folioValue !== "") {
          $scope.getPropertyByFolio(folioValue);
        }

      }, function(error){});
    };

    // IMPORTANT - Do not move
    $scope.drawEndHandler  = function (geometry){
      $log.debug("DrawEnd Handler completed.");
      $scope.drawToolBar.deactivate();
      $scope.map.setExtent(geometry);
    };

    var isUndefinedOrNull = function(val){ return _.isUndefined(val) || _.isNull(val)};

	var isNumber = function(val){ return eval('/^\\d+$/').test(val);};

    var isAlphabetic = function(val) {
		var expr = new RegExp("^[a-zA-Z-' ]*$");
		return expr.test(val);
	};
	
	// IMPORTANT - Do not move
    function initMap(){

      var map = new esri.Map('map', {extent:new esri.geometry.Extent(paConfig.initialExtentJson),
                                     logo:false, 
                                     showAttribution:false}
                             );

      $scope.map = map;
      //esri.config.defaults.io.corsDetection = false;
      //esri.config.defaults.io.corsEnabledServers.push("gisweb.miamidade.gov");

      map.on('load',function(){
        $log.debug("OnLoad is called");
        map.enableRubberBandZoom();
        map.disableScrollWheelZoom();
        map.hideZoomSlider();

        $scope.navToolBar  = new esri.toolbars.Navigation(map);
        $scope.drawToolBar = new esri.toolbars.Draw(map);
        dojo.connect($scope.drawToolBar, "onDrawEnd", $scope.drawEndHandler);
        //Add events to map.
        map.on("click", $scope.mapClicked);

        map.on('extent-change', function(extent) {
          map.resize();
          map.reposition();
        });


        map.resize();

        if(!isUndefinedOrNull($scope.folioParam) && $scope.folioParam != ""){
          $scope.folio = $scope.folioParam;
          $scope.searchByFolio();
        }

      });
      
      // urls for the map.
      var urlAerial = paConfig.urlAerialMap;
      var urlStreet = paConfig.urlStreetMap;
      var urlParcelLayer = paConfig.urlParcelLayer;

      //Add layers.
      var aerialLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial, {id:"aerial"});
      var streetLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlStreet, {id:"street"});
      var parcels = new esri.layers.FeatureLayer(urlParcelLayer);
      var layers = new esri.layers.GraphicsLayer({id:"layers"});
      var parcelPoint = esri.layers.GraphicsLayer({id:"parcelPoint", maxScale:2252});
      var parcelBoundary = esri.layers.GraphicsLayer({id:"parcelBoundary", minScale:2251});
      map.addLayer(aerialLayer);
      map.addLayer(streetLayer);
      map.addLayer(parcels);
      map.addLayer(layers);
      map.addLayer(parcelBoundary);
      map.addLayer(parcelPoint);
      streetLayer.hide(); 

    };


    // Init url params.
    $scope.$on('$routeChangeSuccess', function(event, routeData){
      $scope.folioParam = routeData.params.folio;

      // Initialize the map.
      dojo.ready(initMap);
    });

//    $scope.folioParam = $routeParams.folio;
//    $scope.$watch('folioParam', function(){
//      if(!isUndefinedOrNull($scope.folioParam) && $scope.folioParam != ""){
//        $scope.folio = $scope.folioParam;
//        $scope.searchByFolio();
//      }
//
//    });

    $scope.$watch('showError', function(){
//      if(!isUndefinedOrNull($scope.map))
//        $scope.map.resize();
    });


    $scope.hideMap = true;

    $scope.mapActivateZoomInBox = function (){
      $scope.drawToolBar.activate(esri.toolbars.Draw.EXTENT);
    };



    $scope.mapZoomIn = function(){
      var extent=$scope.map.extent;
      $scope.map.setExtent(extent.expand(0.5));
    };

    $scope.mapZoomOut = function(){
      var extent=$scope.map.extent;
      $scope.map.setExtent(extent.expand(2));
      var mapLevel = $scope.map.getLevel();
      if (mapLevel == 8) 
        $scope.map.setLevel(mapLevel - 1);
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
      $scope.map.setExtent(new esri.geometry.Extent(paConfig.initialExtentJson));
      if(!isUndefinedOrNull($scope.property.location)){
        var geometry = {"x":$scope.property.location.x, 
                        "y":$scope.property.location.y, 
                        "spatialReference":{"wkid":2236}};
        $scope.map.centerAt(geometry);
      }

      //$scope.navToolBar.zoomToFullExtent();
    };
    
    $scope.mapToggleAerialOn = function(){
      $scope.map.getLayer("aerial").show();
      $scope.map.getLayer("street").hide();
    }

    $scope.mapToggleStreetOn = function(){
      $scope.map.getLayer("street").show();
      $scope.map.getLayer("aerial").hide();
    }
    
    $scope.folio = "";
    $scope.property = null;//SharedData.property;
    $scope.propertySiteAddress = "";
    
    $scope.showError = false;
    $scope.errorMsg = "";
    
    $scope.ownerName = "";
    $scope.candidatesList = null;
	$scope.previousCandidatesList = null;

    $scope.isOwnerCandidates = false;
    $scope.isAddressCandidates = false;
    $scope.isPartialFolioCandidates = false;
    $scope.fromPage = 1;
    $scope.toPage = 200;
    $scope.itemsPerFetch = 200;

    
    $scope.address = "";

    $scope.suite = "";
    $scope.folioMask = "9?9-9999-999-9999";
    
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
    
    $scope.layerData = {};
    $scope.showLayerData = function(){
      return ! _.isEqual($scope.layerData,{})
    }
    
    

    $scope.turnLayerOnOff = function(layer){

      if (layer.value === true){
        var featurePromise = esriGisService.getFeatureFromPointLayerIntersection($scope, layer, $scope.property.location.x, $scope.property.location.y);

        featurePromise.then(function(feature){

          var myPolygon = {"geometry":feature.geometry, "symbol":layer.layerSymbol, "attributes":layer};
	  var gra = new esri.Graphic(myPolygon);
	  $scope.map.getLayer("layers").add(gra);

          $scope.layerData[layer.label] = feature.attributes[layer.attributes[0]];
        });
      }else{
        _.each($scope.map.getLayer("layers").graphics, function(graphicLayer){
          if(graphicLayer.attributes !== null)
            if(graphicLayer.attributes.label === layer.label){
	      $scope.map.getLayer("layers").remove(graphicLayer);              
              delete $scope.layerData[layer.label];
            }

        });
      }
      
    };
    

    function clearResults() {

      $scope.showError = false;
      //$scope.property = null;
	  $scope.propertySiteAddress = "";
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

	$scope.showErrorDialog = function(message, hideMap){
		$scope.errorMsg = message;
		$scope.showError = true;
		if(hideMap)
			$scope.hideMap = true;
		$('#error-modal').modal('show');
	};

    $scope.showFolioStatus = function(status) {
      if(status != undefined) {
        if(status != null && status != "AC Active")
          return "("+ status.substr(2).trim() +")";
        else
          return "";
	  }
	  if(status == undefined && $scope.property != null) {
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

    $scope.getCandidateFolio = function(folio, savePrevious) {
      $scope.folio = folio;
      if(isUndefinedOrNull(savePrevious)) {
	$scope.previousCandidatesList = $scope.candidatesList;
      }
      $scope.searchByFolio();
    };
    
    $scope.populatePreviousCandidates = function() {
      $scope.candidatesList = $scope.previousCandidatesList;
      $scope.previousCandidatesList = null;
      $scope.property = null;
      $scope.hideMap = true;
    };

    $scope.searchByFolio = function(){
      var folio = $scope.folio;
      clearResults();
      if (folio != undefined && folio.length < 6 ) {
		$scope.property = null;
		$scope.showErrorDialog("Please enter at least 6 digits for Folio", true);
      }
      else if(folio != undefined && folio.length >=6 && folio.length < 13) {
		$scope.property = null;
		$scope.getCandidatesByPartialFolio(folio);
      }
      else if(folio != undefined && folio.length == 13){
        $scope.getPropertyByFolio(folio);

      }
    };

    var getProperty = function (folio){
      var propertyPromise = propertySearchService.getPropertyByFolio(folio);

      return propertyPromise.then(function(property){
        $log.debug("property with folio", folio, property);
        $scope.property = property;
	$scope.setPropertySiteAddress(property);
	$scope.showHideSalesInfoGrantorColumns($scope.property.salesInfo);
	$scope.activeRollYearTab = $scope.property.rollYear1;    

        // When parent folio exists use it to get the polygon.
        var folioPolygon = "";
        if($scope.property.propertyInfo.parentFolio !== "")
          folioPolygon = $scope.property.propertyInfo.parentFolio;
        else
          folioPolygon = folio;
        
        $log.debug("Folio to search for polygon", folioPolygon);
        return folioPolygon;

      }, function(error){
        $log.error("getProperty:propertyPromise error", error);
	$scope.property = null;
	$scope.showErrorDialog(error.message, true);
        $q.reject(error);
      });
    };            


    var getPolygon = function(folio){
      var polygonPromise = esriGisService.getPolygonFromFolio($scope, folio);

      return polygonPromise.then(function(polygon){
        // add polygon
        $scope.property.location = {polygon:polygon};
        var polygonGraphic = esriGisService.getGraphicMarkerFromPolygon(polygon);
        $scope.map.getLayer("parcelBoundary").add(polygonGraphic);

        // add point 
        var coords = {x:polygon.getExtent().getCenter().x,
                      y:polygon.getExtent().getCenter().y};
        var pointGraphic = esriGisService.getGraphicMarkerFromXY(coords.x, coords.y);
        $scope.map.getLayer("parcelPoint").add(pointGraphic);
	$scope.property.location.x = coords.x;
	$scope.property.location.y = coords.y;

        $scope.map.setExtent(polygon.getExtent(), true);
        $log.debug("getPolygon:center coords in polygon", coords);
        return(coords);
        

      }, function(error){
        $log.error("getPolygon:error- ", error);
	$scope.mapZoomToFullExtent();
        var message = "Map could not be displayed.";
	$scope.showErrorDialog(message);

        $q.reject(error);
      });

    };

    
    var getLatitudeLongitude = function(coords){
      var latLongPromise = esriGisGeometryService.xyToLatitudeLongitude(coords.x, coords.y);

      return latLongPromise.then(function(location){
        $log.debug("getLatitudeLongitude: latitude longitude", location);
        $scope.property.location.latitude = location.latitude;
        $scope.property.location.longitude = location.longitude;

      });
    };


    $scope.getPropertyByFolio = function(folio){

      // Clear previous data.
      clearResults();

      $scope.map.graphics.clear();
      $scope.map.getLayer("layers").clear();
      $scope.map.getLayer("parcelBoundary").clear();
      $scope.map.getLayer("parcelPoint").clear();
      //$scope.resetLayers();
      $scope.hideMap = false;

      getProperty(folio)
        .then(getPolygon)
        .then(getLatitudeLongitude)
        .then(function(){
          _.each($scope.layers, function(layer){
            $scope.turnLayerOnOff(layer);
          });
        })
        .catch(function(error){
          $log.error("getPropertyByFolio:catch", error);
        });
    };
    

//    $scope.getPropertyByFolio = function(folio){
//
//
//      // Clear previous data.
//      clearResults();
//
//      $scope.map.graphics.clear();
//      $scope.map.getLayer("layers").clear();
//      $scope.map.getLayer("parcelBoundary").clear();
//      $scope.map.getLayer("parcelPoint").clear();
//      $scope.resetLayers();
//      $scope.hideMap = false;
//
//      var propertyPromise = propertySearchService.getPropertyByFolio(folio).then(function(property){
//	$scope.property = property;
//	$scope.setPropertySiteAddress(property);
//	$scope.showHideSalesInfoGrantorColumns($scope.property.salesInfo);
//	$scope.activeRollYearTab = $scope.property.rollYear1;
//
//        // When parent folio exists use it to get the polygon.
//        var folioPolygon = "";
//        // Get xy for property and display it in map.
//        if($scope.property.propertyInfo.parentFolio !== "")
//          folioPolygon = $scope.property.propertyInfo.parentFolio;
//        else
//          folioPolygon = folio;
//        
//        esriGisService.getPolygonFromFolio($scope, folioPolygon).then(
//          function(polygon){
//
//            // add polygon
//            $scope.property.location = {polygon:polygon};
//            var polygonGraphic = esriGisService.getGraphicMarkerFromPolygon(polygon);
//            $scope.map.getLayer("parcelBoundary").add(polygonGraphic);
//
//            // add point 
//            var coords = {x:polygon.getExtent().getCenter().x,y:polygon.getExtent().getCenter().y};
//            var pointGraphic = esriGisService.getGraphicMarkerFromXY(coords.x, coords.y);
//            $scope.map.getLayer("parcelPoint").add(pointGraphic);
//	    $scope.property.location.x = coords.x;
//	    $scope.property.location.y = coords.y;
//
//            // zoom into parcel
//            //	    var geometry = {
//            //	      "x":coords.x,
//            //	      "y":coords.y,
//            //	      "spatialReference":{"wkid":2236}
//            //	    };
//            //	    $scope.map.centerAndZoom(geometry, 10);
//            $scope.map.setExtent(polygon.getExtent(), true);
//
//            // get latitude and longitude - pictometry needs it.
//            esriGisGeometryService.xyToLatitudeLongitude(coords.x, coords.y)
//              .then(function(location){
//                $scope.property.location.latitude = location.latitude;
//                $scope.property.location.longitude = location.longitude;
//                console.log(location);
//              }
//                   );
//
//            
//
//          }, function(error){
//            console.log("getPropertyByFolio:getXYFromFolio Error- ", error);
//	    $scope.mapZoomToFullExtent();
//            var message = "Map could not be displayed.";
//	    $scope.showErrorDialog(message);
//          });
//
//      }, function(error){
//	$scope.property = null;
//	$scope.showErrorDialog(error.message, true);
//      });
//      
//    };
    
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
      $log.debug("candidates updated", $scope.candidatesList);
    };
    $scope.candidatesPaginationFailure = function(error) {
      $scope.fromPage = $scope.fromPage - $scope.itemsPerFetch;
      $scope.toPage = $scope.toPage - $scope.itemsPerFetch;
      $log.error("error when fetching nextPage of candidates", error);
    };
    
    $scope.fetchNextPage = function() {
      if($scope.toPage >= $scope.candidatesList.total) {
		$scope.showErrorDialog("You have reached the end of the results of your search", true);
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
	$scope.hideMap = true;
	  clearResults();
      if(_.isEmpty($scope.ownerName)) {
	    $scope.property = null;
		$scope.showErrorDialog("Please enter a valid Owner Name", true);
		return true;
	  }
	  else if(!isAlphabetic($scope.ownerName)) {
	    $scope.property = null;
		$scope.showErrorDialog("Please enter only aplhabetic characters", true);
		return true;
	  }
	  $scope.loader = true; //flag hackeysack
      $scope.isOwnerCandidates = true;
	  $scope.property = null;
      propertySearchService.getCandidatesByOwner($scope.ownerName, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
		$scope.showErrorDialog(result.message, true);
	  }
	  else if(result.candidates.length == 1){
		$scope.getCandidateFolio(result.candidates[0].folio, false);
      }
	  else if(result.candidates.length > 1){
	    $scope.candidatesList = result;
	  }
	}
	else {
	  $scope.showErrorDialog(result.message, true);
	}
      }, function(error){
		$log.error("getCandidatesByOwner error ", error);
		$scope.showErrorDialog("Oops !! The request failed. Please try again later", true);
      });
    };

    $scope.getCandidatesByAddress = function(){
	  $scope.hideMap = true;
      clearResults();
      if(_.isEmpty($scope.address)){
	    $scope.property = null;
		$scope.showErrorDialog("Please enter a valid Address", true);
		return true;
	  }
	  else if(isNumber($scope.address)){
	    $scope.property = null;
		$scope.showErrorDialog("Please enter a valid Address, only numeric characters is an invalid Address", true);
		return true;
	  }
	  else if($scope.address.toUpperCase().indexOf("APT") >= 0 || $scope.address.toUpperCase().indexOf("APARTMENT") >= 0 || 
			  $scope.address.toUpperCase().indexOf("UNIT") >= 0 || $scope.address.toUpperCase().indexOf("SUITE") >= 0 || 
			  $scope.address.indexOf("#") >= 0 ) {
		$scope.property = null;
		$scope.showErrorDialog("Please enter Apt/Apartment/Unit/Suite/# in the field for Suite", true);
		return true;
	  }
      $scope.isAddressCandidates = true;
	  $scope.loader = true; //flag hackeysack
	  $scope.property = null;
      propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
		$scope.showErrorDialog(result.message, true);
	  }
	  else if(result.candidates.length == 1){
		$scope.getCandidateFolio(result.candidates[0].folio, false);
      }
	  else if(result.candidates.length > 1) {
	    $scope.candidatesList = result;
	  }
	}
	else {
	  $scope.showErrorDialog(result.message, true);
	}
      }, function(error){
		$scope.showErrorDialog("Oops !! The request failed. Please try again later", true);
      });

    };

    $scope.getCandidatesByPartialFolio = function(folio){
	  $scope.hideMap = true;
      clearResults();
		$scope.loader = true; //flag hackeysack
      $scope.isPartialFolioCandidates = true;
      propertySearchService.getCandidatesByPartialFolio(folio, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.property = null;
		$scope.showErrorDialog(result.message, true);
	  }
	  else if(result.candidates.length == 1){
		$scope.getCandidateFolio(result.candidates[0].folio, false);
	  }
	  else if(result.candidates.length > 1)
	    $scope.property = null;
	    $scope.candidatesList = result;
	}
	else {
	  $scope.property = null;
	  $scope.showErrorDialog(result.message, true);
	}

      }, function(error){
	    $scope.property = null;
		$log.error("getCandidatesByPartialFolio error ", error);
		$scope.showErrorDialog("Oops !! The request failed. Please try again later", true);
      });

    };

    $scope.openPictometryWindow = function(){

      //var url = '#/pictometry/' + $scope.property.location.x + '/' +
      //$scope.property.location.y;
      
      var url = "views/pictometry/pictometry.html?latitude=" + $scope.property.location.latitude + "&longitude="+$scope.property.location.longitude;
      $window.open(url);
    };

    $scope.openReportSummaryWindow = function(){
        var url = '#/report/summary';
        localStorageService.add('property',$scope.property);

        $window.open(url,'name','height=1000,width=840, location=0');
    };

    $scope.openReportDetailsWindow = function(){
        var url = '#/report/details';
        localStorageService.add('property',$scope.property);

        $window.open(url,'name','height=1000,width=840, location=0');
    };

    $scope.openComparableSales = function(){
      var url = "#/comparablesales/" + $scope.property.propertyInfo.folioNumber;
      $window.open(url);
    };
    
    $scope.setPropertySiteAddress = function(property) {
      if(property != null && !_.isEmpty(property.siteAddresses[0].address.trim())) {
	$scope.propertySiteAddress = property.siteAddresses[0].streetNumber+" "+property.siteAddresses[0].streetPrefix.trim()+" "+
	  property.siteAddresses[0].streetName.trim()+" "+property.siteAddresses[0].streetSuffix.trim();
      }
      else
	$scope.propertySiteAddress = "";
    };


//    $scope.getComparableSales = function() {
//      //Create FORM object
//      var salesForm = document.createElement("form");
//      salesForm.method = "post";
//      salesForm.target = "_blank";
//      salesForm.action = "http://gisims2.miamidade.gov/Myneighborhood/salesmap.asp";
//      //Append Input
//      //Folio
//      var folioInput = document.createElement("input");
//      folioInput.setAttribute("name", "folio");
//      folioInput.setAttribute("value", $scope.folio);
//      salesForm.appendChild(folioInput);
//      //Cmd
//      var cmdInput = document.createElement("input");
//      cmdInput.setAttribute("name", "Cmd");
//      cmdInput.setAttribute("value", "FOLIO");
//      salesForm.appendChild(cmdInput);
//      //Append Sales Form
//      document.body.appendChild(salesForm);
//      //Submit the Form
//      salesForm.submit();
//      //Remove Sales Form
//      document.body.removeChild(salesForm);
//    };

    $scope.showStreetView = function() {
      var url = "views/streetview/streetview.html?latitude=" + $scope.property.location.latitude + "&longitude="+$scope.property.location.longitude;
      $window.open(url, "name", "height=700, width=1000, location=0'");
    };

}]);


