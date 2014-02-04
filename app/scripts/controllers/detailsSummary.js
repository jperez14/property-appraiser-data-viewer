'use strict';

angular.module('propertySearchApp')
  .controller('DetailsSummaryCtrl', ['$scope', 'paConfiguration', 'esriGisService', function ($scope, paConfig, esriGisService){

    $scope.property = window.opener.property;

    function initMap(){

      var map = new esri.Map('printmap', 
                             {extent:new esri.geometry.Extent(paConfig.initialExtentJson), 
                              logo:false, 
                              showAttribution:false}
                            );

      $scope.map = map;

      map.on('load',function(){
        console.log("OnLoad is called");
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
	  $scope.map.centerAndZoom(geometry, 10);

          var polygon = $scope.property.location.polygon;
          var graphic = esriGisService.getGraphicMarkerFromPolygon(polygon);
          $scope.map.getLayer("parcelBoundary").add(graphic);
        }
        


      });
      
      // urls for the map.
      var urlAerial = paConfig.urlAerialMap;
      var urlStreet = paConfig.urlStreetMap;

      //Add layers.
      var aerialLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlAerial, {id:"aerial"});
      var streetLayer = new esri.layers.ArcGISTiledMapServiceLayer(urlStreet, {id:"street"});
      var layers = new esri.layers.GraphicsLayer({id:"layers"});
      var parcelPoint = esri.layers.GraphicsLayer({id:"parcelPoint", maxScale:2252});
      var parcelBoundary = esri.layers.GraphicsLayer({id:"parcelBoundary", minScale:2251});
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
