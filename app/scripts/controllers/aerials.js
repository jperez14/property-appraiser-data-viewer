'use strict';

angular.module('propertySearchApp')
  .controller('AerialsCtrl', ['$scope', '$routeParams', 'localStorageService', 'paConfiguration','esriGisService', function ($scope, $routeParams, localStorageService, paConfig, esriGisService){


    $scope.property = localStorageService.get('property');
    $scope.mapReference = localStorageService.get('map');

    function initMap(){

      var map = new esri.Map('aerialmap', 
                             {extent:new esri.geometry.Extent($scope.mapReference.extent), 
                              logo:false, 
                              showAttribution:false}
                            );

      var scalebar = new esri.dijit.Scalebar({map: map, scalebarStyle:"line"}, dojo.byId("scale-container"));

      $scope.map = map;

      map.on('load',function(){

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



}]);

