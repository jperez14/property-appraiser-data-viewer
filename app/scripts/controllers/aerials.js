'use strict';

angular.module('propertySearchApp')
  .controller('AerialsCtrl', ['$scope', '$routeParams', '$log' ,'localStorageService', 'paConfiguration','esriGisService', 'utils', function ($scope, $routeParams, $log,localStorageService, paConfig, esriGisService, utils){


    $scope.property = localStorageService.get('property');
    $scope.mapReference = localStorageService.get('map');

    $scope.drawEndHandler  = function (geometry){
      $log.debug("DrawEndHandler: completed.");
      $scope.drawToolBar.deactivate();
      $scope.map.setExtent(geometry);
    };

    function initMap(){

      var map = new esri.Map('aerialmap', 
                             {extent:new esri.geometry.Extent($scope.mapReference.extent), 
                              logo:false, 
                              showAttribution:false}
                            );

      var scalebar = new esri.dijit.Scalebar({map: map, scalebarStyle:"line"}, dojo.byId("scale-container"));

      $scope.map = map;

      map.on('load',function(){
//        $log.debug("OnLoad is called");
        map.enableRubberBandZoom();
        map.disableScrollWheelZoom();
        map.hideZoomSlider();
        map.disableDoubleClickZoom();

        $scope.navToolBar  = new esri.toolbars.Navigation(map);
        $scope.drawToolBar = new esri.toolbars.Draw(map);
        dojo.connect($scope.drawToolBar, "onDrawEnd", $scope.drawEndHandler);

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
        }

      });
      
      // urls for the map.
      var urlAerial = paConfig.aerials[$scope.yearParam];

      //Add layers.
      var aerialLayer = new esri.layers.ArcGISImageServiceLayer(urlAerial, {id:"aerial"});
      var parcelPoint = esri.layers.GraphicsLayer({id:"parcelPoint", maxScale:24000});
      var parcelBoundary = esri.layers.GraphicsLayer({id:"parcelBoundary", minScale:23999});
      map.addLayer(aerialLayer);
      map.addLayer(parcelBoundary);
      map.addLayer(parcelPoint);

    };


    // Init url params.
    $scope.$on('$routeChangeSuccess', function(event, routeData){
      $scope.yearParam = routeData.params.year;

      // Initialize the map.
      dojo.ready(initMap);
    });



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
      $scope.map.setExtent(new esri.geometry.Extent($scope.mapReference.extent));
    };
    
    $scope.mapZoomToFullExtent = function(){
      $scope.map.setExtent(new esri.geometry.Extent(paConfig.initialExtentJson));
      if(!utils.isUndefinedOrNull($scope.property.location)){
        var geometry = {"x":$scope.property.location.x, 
                        "y":$scope.property.location.y, 
                        "spatialReference":{"wkid":2236}};
        $scope.map.centerAt(geometry);
      }

    };

}]);

