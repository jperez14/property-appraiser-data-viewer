'use strict';

angular.module('propertySearchApp')
  .controller('MainCtrl', ['$scope', '$q', '$window', '$routeParams', '$log', 'localStorageService', 'utils', 'propertySearchService', 'esriGisService', 'esriGisGeometryService', 'candidate', 'paConfiguration', 'SharedDataService', 'propertyService', function ($scope, $q, $window, $routeParams, $log, localStorageService, utils, propertySearchService, esriGisService, esriGisGeometryService, candidate, paConfig, SharedData, propertyService) {

    // IMPORTANT - Do not move
    $scope.mapClicked = function(event){
      $log.debug("mapClicked: Map has been clicked:", event.mapPoint.x, event.mapPoint.y);
      $scope.getPropertyByXY(event.mapPoint.x, event.mapPoint.y);
    };

    $scope.mapDoubleClicked = function(event){
      $log.debug("mapDoubleClicked", event.mapPoint.x, event.mapPoint.y);
	  var gisPropertyPromise = getCondoFlgAndFolioFromXY(event.mapPoint.x, event.mapPoint.y);
      gisPropertyPromise.then(function(gisProperty){
	    if(gisProperty.condoFlg == true)
		  $scope.folio = gisProperty.folio.substr(0,9);
		else
		  $scope.folio = gisProperty.folio;
		$scope.previousCandidatesInfo = null;
		$scope.searchByFolio();
      }, function(error){
        $log.error("mapDoubleClicked", error);
        $scope.showErrorDialog(error.message);
        return $q.reject(error);
      });  
    }

    // IMPORTANT - Do not move
    $scope.drawEndHandler  = function (geometry){
      $log.debug("DrawEndHandler: completed.");
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

      var scalebar = new esri.dijit.Scalebar({map: map, scalebarStyle:"line"}, dojo.byId("scale-container"));

      $scope.map = map;
      //esri.config.defaults.io.corsDetection = false;
      //esri.config.defaults.io.corsEnabledServers.push("gisweb.miamidade.gov");

      map.on('load',function(){
        $log.debug("OnLoad is called");
        map.enableRubberBandZoom();
        map.disableScrollWheelZoom();
        map.hideZoomSlider();
        map.disableDoubleClickZoom();
        
        $scope.navToolBar  = new esri.toolbars.Navigation(map);
        $scope.drawToolBar = new esri.toolbars.Draw(map);
        dojo.connect($scope.drawToolBar, "onDrawEnd", $scope.drawEndHandler);
        //Add events to map.
        map.on("click", $scope.mapClicked);
        map.on("dbl-click", $scope.mapDoubleClicked);

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
      var parcelPoint = esri.layers.GraphicsLayer({id:"parcelPoint", maxScale:12000});
      var parcelBoundary = esri.layers.GraphicsLayer({id:"parcelBoundary", minScale:11999});
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

//    $scope.$watch('hideMap', function(){
//      if($scope.map){
//          $scope.map.resize();
//          $scope.map.reposition();
//      }
//
//    });

    $scope.$watch('mapState', function(){
      if($scope.map){
        if($scope.mapState == "BigMap"){
          $scope.map.resize();
          $scope.map.reposition();
          $window.setTimeout(function(){$scope.map.setExtent(new esri.geometry.Extent(paConfig.initialExtentJson));}, 1000);
        }

        if($scope.mapState == "SmallMap"){
          $window.setTimeout(function(){
            if(!isUndefinedOrNull($scope.property))
              if(!isUndefinedOrNull($scope.property.location))
                $scope.map.setExtent($scope.property.location.polygon.getExtent(), true);}, 1500);
          //$window.setTimeout(function(){$scope.mapZoomToProperty();}, 1500);
        }


      }

    });


    $scope.mapState = "BigMap";

    $scope.mapStyleState = function(){

//      if($scope.map){
//        $scope.map.resize();
//        $scope.map.reposition();
//      }

      if($scope.mapState === "BigMap"){
        return "col-md-12 col-sm-12";
      }

      if($scope.mapState === "SmallMap"){
        return "col-md-8 col-sm-7";
      }

      if($scope.mapState === "NoMap"){
        return "no_map";
      }

    }




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
    
    $scope.aerialYears = _.keys(paConfig.aerials);
    $scope.aerialYear = "";

    $scope.folio = "";
    $scope.property = null;//SharedData.property;
    $scope.propertySiteAddress = "";
    
    $scope.showError = false;
    $scope.errorMsg = "";
    
    $scope.subDivision = "";
	$scope.ownerName = "";
    $scope.candidatesList = null;
    $scope.previousCandidatesInfo = null;

    $scope.isOwnerCandidates = false;
    $scope.isAddressCandidates = false;
    $scope.isPartialFolioCandidates = false;
	$scope.isSubDivisionCandidates = false;
    $scope.fromPage = 1;
    $scope.toPage = 200;
    $scope.itemsPerFetch = 200;
    $scope.isEndOfResults = false;
    
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
	  $scope.isSubDivisionCandidates = false;
      $scope.fromPage = 1;
      $scope.toPage = 200;
      $scope.isEndOfResults = false;
      $scope.activeRollYearTab = 0;


      $scope.salesInfoGrantorName1 = false;
      $scope.salesInfoGrantorName2 = false;

      // Clear the layers
      $scope.map.graphics.clear();
      $scope.map.getLayer("layers").clear();
      $scope.map.getLayer("parcelBoundary").clear();
      $scope.map.getLayer("parcelPoint").clear();
    };

    $scope.showErrorDialog = function(message){
      $scope.errorMsg = message;
      $scope.showError = true;
      $('#error-modal').modal('show');
    };

    $scope.showPropertyFolioStatus = function() {
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

	$scope.showFolioStatus = function(status) {
      return candidate.getFolioStatus(status);
    };

    $scope.getRenamedMunicipality = function(municipality) {
	  return candidate.getRenamedMunicipality(municipality);
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
	$scope.previousCandidatesInfo = {
	  'candidatesList':$scope.candidatesList,
	  'isEndOfResults':$scope.isEndOfResults,
	  'fromPage':$scope.fromPage,
	  'toPage':$scope.toPage,
          'isOwnerCandidates':$scope.isOwnerCandidates,
          'isAddressCandidates':$scope.isAddressCandidates,
          'isPartialFolioCandidates':$scope.isPartialFolioCandidates,
		  'isSubDivisionCandidates':$scope.isSubDivisionCandidates
	};
      }
      $scope.searchByFolio();
    };
    
    $scope.populatePreviousCandidates = function() {
      $scope.isEndOfResults = $scope.previousCandidatesInfo.isEndOfResults;
      $scope.fromPage = $scope.previousCandidatesInfo.fromPage;
      $scope.toPage = $scope.previousCandidatesInfo.toPage;
      $scope.candidatesList = $scope.previousCandidatesInfo.candidatesList;
      $scope.isOwnerCandidates = $scope.previousCandidatesInfo.isOwnerCandidates;
      $scope.isAddressCandidates = $scope.previousCandidatesInfo.isAddressCandidates;
      $scope.isPartialFolioCandidates = $scope.previousCandidatesInfo.isPartialFolioCandidates;
	  $scope.isSubDivisionCandidates = $scope.previousCandidatesInfo.isSubDivisionCandidates;
      $scope.previousCandidatesInfo = null;
      $scope.property = null;
      $scope.mapState = "NoMap";
    };

    $scope.searchByFolio = function(){
      var folio = $scope.folio;
      clearResults();
      if (folio != undefined && folio.length < 6 ) {
	$scope.property = null;
        $scope.mapState = "BigMap";            
	$scope.showErrorDialog("Please enter at least 6 digits for Folio");
      }
      else if(folio != undefined && folio.length >=6 && folio.length < 13) {
	$scope.property = null;
        $scope.mapState = "NoMap";            
	$scope.getCandidatesByPartialFolio(folio);
      }
      else if(folio != undefined && folio.length == 13){
        $scope.getPropertyByFolio(folio);

      }
    };

    var getProperty = function (folio){
      var propertyPromise = propertySearchService.getPropertyByFolio(folio);

      return propertyPromise.then(function(property){
        $log.debug("getProperty:property with folio", folio, property);
        $scope.property = property;
        $scope.mapState = "SmallMap";            
	$scope.setPropertySiteAddress(property);
	$scope.showHideSalesInfoGrantorColumns($scope.property.salesInfo);
	$scope.activeRollYearTab = $scope.property.rollYear1;    

        // When parent folio exists use it to get the polygon.
        var folioPolygon = "";
        if($scope.property.propertyInfo.parentFolio !== "") {
          folioPolygon = $scope.property.propertyInfo.parentFolio;
          $log.debug("getProperty:Parent folio is", folioPolygon);
        }
        else 
          folioPolygon = folio;
        
        $log.debug("getProperty:Folio to search for polygon", folioPolygon);
        return folioPolygon;

      }, function(error){
        $log.error("getProperty:propertyPromise error", error);
	$scope.property = null;
        $scope.mapState = "BigMap";            
	$scope.showErrorDialog(error.message);
        return $q.reject(error);
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

        return $q.reject(error);
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

    var getCondoFlgAndFolioFromXY = function(x, y){
      var gisPropertyPromise = esriGisService.getCondoFlgAndFolioFromXY($scope, x, y);
      return gisPropertyPromise.then(function(gisProperty){
        if (gisProperty.folio !== ""){
          return gisProperty;
        }
        else {
          var message = "getCondoFlgAndFolioFromXY: no folio found for x,y"
          return $q.reject({"error":null, "message":message})
        }
      }, function(error){
        $log.error("getCondoFlgAndFolioFromXY", error);
        $scope.showErrorDialog(error.message);
        return $q.reject(error);
      });  
    };

    var getGeometryAndFolioFromXY = function(x, y){
      var gisPropertyPromise = esriGisService.getGeometryAndFolioFromXY($scope, x, y);
      return gisPropertyPromise.then(function(gisProperty){
        if (gisProperty.folio !== ""){
          clearResults();
          return gisProperty;
        }
        else {
          var message = "getGeometryAndFolioFromXY: no folio found for x,y"
          return $q.reject({"error":null, "message":message})
        }

        
      }, function(error){
        $log.error("getGeometryAndFolioFromXY", error);
        $scope.showErrorDialog(error.message);
        return $q.reject(error);
      });  
    };

	var getPropertyAndAddPolygon = function(gisProperty){
      return getProperty(gisProperty.folio).then(function(folio){
        
        // add polygon
        var polygon = gisProperty.geometry;
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

      });
    };

    $scope.getPropertyByXY = function(x, y){

      getGeometryAndFolioFromXY(x, y)
        .then(getPropertyAndAddPolygon)
        .then(getLatitudeLongitude)
        .then(function(){
          _.each($scope.layers, function(layer){
            $scope.turnLayerOnOff(layer);
          });
          propertySearchService.buildAdditionalInfo($scope, $scope.property)
            .then(function(additionalInfo){
              $scope.property.additionalInfo.infoList = additionalInfo;
            });

        })['catch'](function(error){
          $log.error("getPropertyByXY:catch", error);
        });
      
    };
    

    $scope.getPropertyByFolio = function(folio){

      // Clear previous data.
      clearResults();

      getProperty(folio)
        .then(getPolygon)
        .then(getLatitudeLongitude)
        .then(function(){
          _.each($scope.layers, function(layer){
            $scope.turnLayerOnOff(layer);
          });
          propertySearchService.buildAdditionalInfo($scope, $scope.property)
            .then(function(additionalInfo){
              $scope.property.additionalInfo.infoList = additionalInfo;
            });

        })['catch'](function(error){
          $log.error("getPropertyByFolio:catch", error);
        });
    };
    
    
    $scope.getCandidatesHeight = function(){
      if ($scope.isGingerbread()) return {height:'auto'};

      if($scope.candidatesList == null)
	return {height:'560px'};
      else if($scope.candidatesList != null && $scope.candidatesList.candidates.length <= 2)
	return {height:'225px'};
      else if($scope.candidatesList != null && $scope.candidatesList.candidates.length <= 4)
	return {height:'360px'};
      else if($scope.candidatesList != null && $scope.candidatesList.candidates.length <= 6)
	return {height:'490px'};
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
      if($scope.isEndOfResults) {
	return true;
      }
      if($scope.toPage >= $scope.candidatesList.total) {
	$scope.isEndOfResults = true;
	$scope.showErrorDialog("You have reached the end of the results of your search");
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
	  propertySearchService.getCandidatesByPartialFolio($scope.folio, $scope.fromPage, $scope.toPage)
	    .then($scope.candidatesPaginationSuccess, $scope.candidatesPaginationFailure);
	}
	if($scope.isSubDivisionCandidates === true) {
	  propertySearchService.getCandidatesBySubDivision($scope.subDivision, $scope.fromPage, $scope.toPage)
	    .then($scope.candidatesPaginationSuccess, $scope.candidatesPaginationFailure);
	}
      }
    };

    $scope.getCandidatesBySubDivision = function(){
	  clearResults();
	  if(_.isEmpty($scope.subDivision)){
	    $scope.property = null;
		$scope.mapState = "BigMap";
		$scope.showErrorDialog("Please enter a valid Sub Division");
		return true;
	  }
	  $scope.loader = true; //flag hackeysack
	  
	  $scope.isSubDivisionCandidates = true;
	  $scope.property = null;
	  $scope.mapState = "NoMap";
	  propertySearchService.getCandidatesBySubDivision($scope.subDivision, $scope.fromPage, $scope.toPage)
	  .then(function(result){
	    if(result.completed == true){
		  if(result.candidates.length == 0) {
		    $scope.mapState = "BigMap";
			$scope.showErrorDialog(result.message);
		  }
		  else if(result.candidates.length == 1) {
		    $scope.getCandidateFolio(result.candidates[0].folio, false);
		  }
		  else if(result.candidates.length > 1) {
            $scope.previousCandidatesInfo = null;
            $scope.mapState = "NoMap";
	        $scope.candidatesList = result;
		  }
		}
		else{
          $scope.mapState = "BigMap";
	      $scope.showErrorDialog(result.message);
		}
	  }, function(error){
           $log.error("getCandidatesBySubDivision error ", error);
           $scope.mapState = "BigMap";
           $scope.showErrorDialog("The request failed. Please try again later");
      });
	};
	
	$scope.getCandidatesByOwner = function(){
      clearResults();
      if(_.isEmpty($scope.ownerName)) {
	$scope.property = null;
        $scope.mapState = "BigMap";
	$scope.showErrorDialog("Please enter a valid Owner Name");
	return true;
      }
      //else if(!isAlphabetic($scope.ownerName)) {
      //$scope.property = null;
      //$scope.showErrorDialog("Please enter only alphabetic characters");
      //return true;
      //}
      $scope.loader = true; //flag hackeysack

      $scope.isOwnerCandidates = true;
      $scope.property = null;
      $scope.mapState = "NoMap";
      propertySearchService.getCandidatesByOwner($scope.ownerName, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
            $scope.mapState = "BigMap";
	    $scope.showErrorDialog(result.message);
	  }
	  else if(result.candidates.length == 1){
	    $scope.getCandidateFolio(result.candidates[0].folio, false);
          }
	  else if(result.candidates.length > 1){
	    $scope.previousCandidatesInfo = null;
            $scope.mapState = "NoMap";
	    $scope.candidatesList = result;
	  }
	}
	else {
          $scope.mapState = "BigMap";
	  $scope.showErrorDialog(result.message);
	}
      }, function(error){
	$log.error("getCandidatesByOwner error ", error);
        $scope.mapState = "BigMap";
	$scope.showErrorDialog("The request failed. Please try again later");
      });
    };


    $scope.validateAddress = function(){
      clearResults();
      if(_.isEmpty($scope.address)){
	$scope.property = null;
        $scope.mapState = "BigMap";
	$scope.showErrorDialog("Please enter a valid Address");
	return true;
      }
      else if(isNumber($scope.address)){
	$scope.property = null;
        $scope.mapState = "BigMap";
	$scope.showErrorDialog("Please enter a valid Address, only numeric characters is an invalid Address");
	return true;
      }

      else if($scope.address.indexOf('-') > 0) {
	var regex = new RegExp("-", 'g');
	var replacedAddr = $scope.address.replace(regex, '');
	if(isNumber(replacedAddr)) {
	  $scope.property = null;
	  //$scope.showErrorDialog("Invalid address – looks like you entered a folio number.");
	  $scope.setActiveSearchTab('Folio');
	  $scope.getCandidateFolio(replacedAddr, false);
	}
        else if(isAlphabetic($scope.address))
	  $scope.getHasValidStreetName($scope.address);
	else 
	  $scope.getCandidatesByAddress();
      }

      else if($scope.address.toUpperCase().indexOf("APT") >= 0 || $scope.address.toUpperCase().indexOf("APARTMENT") >= 0 || 
              $scope.address.toUpperCase().indexOf("UNIT") >= 0 || $scope.address.toUpperCase().indexOf("SUITE") >= 0 || 
	      $scope.address.indexOf("#") >= 0 ) {
	$scope.property = null;
        $scope.mapState = "BigMap";
	$scope.showErrorDialog("Please enter Apt/Apartment/Unit/Suite/# in the field for Suite");
	return true;
      }

      else if(isAlphabetic($scope.address)) {
	$scope.getHasValidStreetName($scope.address);
      }
      else 
	$scope.getCandidatesByAddress();
    };

    $scope.getHasValidStreetName = function(address) {
      propertySearchService.getHasValidStreetName(address).then(function(result){
	if(result.completed == true) {
	  if(result.valid == true)
	    $scope.getCandidatesByAddress();
	  else {
	    $scope.ownerName = address;
	    $scope.setActiveSearchTab('Owner');
	    $('[name="ownerName"]').removeClass('placeholder'); //Temp Fix
	    $scope.getCandidatesByOwner();
	  }
	}
	else {
	  $scope.showErrorDialog(result.message);
	}
      }, function(error){
	$scope.showErrorDialog("The request failed. Please try again later");
	return true;
      });
    };



    $scope.getCandidatesByAddress = function(){

      $scope.isAddressCandidates = true;
      $scope.loader = true; //flag hackeysack
      $scope.property = null;
      $scope.mapState = "NoMap";
      propertySearchService.getCandidatesByAddress($scope.address, $scope.suite, $scope.fromPage, $scope.toPage).then(function(result){

	if(result.candidates.length == 0) {
          $scope.mapState = "BigMap";
	  $scope.showErrorDialog(result.message);
	}
	else if(result.candidates.length == 1){
          $scope.mapState = "SmallMap";
	  $scope.getCandidateFolio(result.candidates[0].folio, false);
        }
	else if(result.candidates.length > 1) {
	  $scope.previousCandidatesInfo = null;
          $scope.mapState = "NoMap";
	  $scope.candidatesList = result;
	}

      }, function(error){
        $scope.mapState = "BigMap";
	$scope.showErrorDialog(error.message);
      });

    };

    $scope.getCandidatesByPartialFolio = function(folio){
      $scope.mapState = "NoMap";
      clearResults();
      $scope.loader = true; //flag hackeysack
      $scope.isPartialFolioCandidates = true;
      propertySearchService.getCandidatesByPartialFolio(folio, $scope.fromPage, $scope.toPage).then(function(result){
	if(result.completed == true) {
	  if(result.candidates.length == 0) {
	    $scope.property = null;
            $scope.mapState = "BigMap";            
	    $scope.showErrorDialog(result.message);
	  }
	  else if(result.candidates.length == 1){
        $scope.isPartialFolioCandidates = false;
        $scope.mapState = "SmallMap";
	    $scope.getCandidateFolio(result.candidates[0].folio, false);
	  }
	  else if(result.candidates.length > 1) {
	    $scope.previousCandidatesInfo = null;
	    $scope.property = null;
        $scope.mapState = "NoMap";
	    $scope.candidatesList = result;
	  }
	}
	else {
	  $scope.property = null;
          $scope.mapState = "BigMap";            
	  $scope.showErrorDialog(result.message);
	}

      }, function(error){
	$scope.property = null;
        $scope.mapState = "BigMap";            
	$log.error("getCandidatesByPartialFolio error ", error);
	$scope.showErrorDialog("The request failed. Please try again later");
      });

    };

    $scope.openAerialsWindow = function(){
      var url = '#/aerials/' + $scope.aerialYear;
      localStorageService.add('property',$scope.property);
      localStorageService.add('map', {level:$scope.map.getLevel(), extent:$scope.map.extent});

      if (!_.isEmpty($scope.aerialYear)) {$window.open(url, '_blank')};
      
    };

    $scope.openPictometryWindow = function(){

      //var url = '#/pictometry/' + $scope.property.location.x + '/' +
      //$scope.property.location.y;
      
      var url = "views/pictometry/pictometry.html?latitude=" + $scope.property.location.latitude + "&longitude="+$scope.property.location.longitude;
      $window.open(url);
    };

    $scope.openPrintCandidatesWindow = function(){
	  var url = '#/candidatesPrint';
	  localStorageService.add('candidatesList',$scope.candidatesList);
      localStorageService.add('property',$scope.property);
      localStorageService.add('isOwnerCandidates', $scope.isOwnerCandidates);
      localStorageService.add('isAddressCandidates', $scope.isAddressCandidates);
      localStorageService.add('isPartialFolioCandidates', $scope.isPartialFolioCandidates);
      localStorageService.add('isSubDivisionCandidates', $scope.isSubDivisionCandidates);
	  localStorageService.add('ownerName', $scope.ownerName);
	  localStorageService.add('address', $scope.address);
	  localStorageService.add('suite', $scope.suite);
	  localStorageService.add('subDivision', $scope.subDivision);
	  localStorageService.add('folio', $scope.folio);

	  $window.open(url,'name','height=1000, width=840, location=0, scrollbars=yes');
	};
	
	$scope.openReportSummaryWindow = function(){
      var url = '#/report/summary';
      localStorageService.add('property',$scope.property);
      localStorageService.add('map', {level:$scope.map.getLevel(), extent:$scope.map.extent});

      $window.open(url,'name','height=1000, width=840, location=0, scrollbars=yes');
    };

    $scope.openReportDetailsWindow = function(){
      var url = '#/report/details';
      localStorageService.add('property',$scope.property);
      localStorageService.add('map', {level:$scope.map.getLevel(), extent:$scope.map.extent});

      $window.open(url,'name','height=1000, width=840, location=0, scrollbars=yes');
    };

    $scope.openComparableSales = function(){
      var url = "#/comparablesales/" + $scope.property.propertyInfo.folioNumber;
      $window.open(url);
    };
    
    $scope.setPropertySiteAddress = function(property) {
      if(property != null && property.siteAddresses.length > 0 && !_.isEmpty(property.siteAddresses[0].address.trim())) {
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
      //$window.open(url, "name", "height=700, width=1000, location=0'"); //Opens in new window
      $window.open(url, '_blank'); //Opens in new tab
    };

    $scope.isGingerbread = function() {
      var start = navigator.userAgent.indexOf("Android ");
      var majorversion = navigator.userAgent.substr(start+8,1)
      if (majorversion < 3)
        return true; 
      else 
        return false;
    };

  }]);


