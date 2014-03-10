'use strict';

angular.module('propertySearchApp')
  .controller('ReportCtrl', ['$scope', '$routeParams', 'localStorageService', 'paConfiguration', 'esriGisService', function ($scope, $routeParams, localStorageService, paConfig, esriGisService){

    $scope.property = localStorageService.get('property');
    $scope.mapReference = localStorageService.get('map');
    $scope.reportType = $routeParams.type;

    function initMap(){

      var map = new esri.Map('printmap', 
                             {extent:new esri.geometry.Extent($scope.mapReference.extent), 
                              logo:false, 
                              showAttribution:false}
                            );

      var scalebar = new esri.dijit.Scalebar({map: map, scalebarStyle:"line"});

      $scope.map = map;

      map.on('load',function(){
        map.disableClickRecenter()	
        map.disableDoubleClickZoom()
        map.disableKeyboardNavigation()
        map.disableMapNavigation()
        map.disablePan()	
        map.disableRubberBandZoom()
        map.disableScrollWheelZoom()	
        map.disableShiftDoubleClickZoom()
        map.disableSnapping()
        map.hideZoomSlider();

        map.resize();

        // zoom into point and draw polygon
        if(! _.isUndefined($scope.property.location)){
	  var geometry = {
	    "x": $scope.property.location.x,
	    "y": $scope.property.location.y,
	    "spatialReference":{"wkid":2236}
	  };

          var polygon = $scope.property.location.polygon;
          var polygonGraphic = esriGisService.getGraphicMarkerFromPolygon(polygon);
          $scope.map.getLayer("parcelBoundary").add(polygonGraphic);

          var pointGraphic = esriGisService.getGraphicMarkerFromXY(geometry.x, geometry.y)
          $scope.map.getLayer("parcelPoint").add(pointGraphic);

	  //$scope.map.centerAndZoom(geometry, $scope.mapReference.level);
        }
        


      });
      
      // urls for the map.
      var urlAerial = paConfig.urlAerialMap;
      var urlStreet = paConfig.urlStreetMap;

      //Add layers.
      var aerialLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial, {id:"aerial"});
      var streetLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlStreet, {id:"street"});
      var layers = new esri.layers.GraphicsLayer({id:"layers"});
      var parcelPoint = esri.layers.GraphicsLayer({id:"parcelPoint", maxScale:24000});
      var parcelBoundary = esri.layers.GraphicsLayer({id:"parcelBoundary", minScale:23999});
      map.addLayer(aerialLayer);
      map.addLayer(streetLayer);
      map.addLayer(parcelBoundary);
      map.addLayer(parcelPoint);
      streetLayer.hide(); 

    };




    dojo.ready(initMap);    


    
    $scope.doPrint = function() {
      window.print();
    };
    
    $scope.getCurrentDate = function() {
      var dt = new Date();
      return dt.getMonth() + 1 + '/' + dt.getDate() + '/' + dt.getFullYear();
    };
    
    $scope.showBenefitsMessages = function(){
      return $scope.property.benefit.messages[$scope.property.rollYear1] != undefined || 
	$scope.property.benefit.messages[$scope.property.rollYear2] != undefined || 
	$scope.property.benefit.messages[$scope.property.rollYear3] != undefined;
    };	

    

  }]);
