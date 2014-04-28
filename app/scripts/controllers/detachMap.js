'use strict';

angular.module('propertySearchApp')
  .controller('DetachMapCtrl', ['$scope', '$routeParams', 'localStorageService', 'paConfiguration', 'esriGisService', function ($scope, $routeParams, localStorageService, paConfig, esriGisService){


    function initMap(){

      var map = new esri.Map('detachmap', 
                             {extent:new esri.geometry.Extent(paConfig.initialExtentJson), 
                              logo:false, 
                              showAttribution:false}
                            );

      var scalebar = new esri.dijit.Scalebar({map: map, scalebarStyle:"line"}, dojo.byId("scale-container"));

      $scope.map = map;

      map.on('load',function(){
        map.resize();

        // zoom into point and draw polygon

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

      window.opener.windowScope.map = $scope.map;
    };

    dojo.ready(initMap);


    $scope.attachMapToParent = function(){
      console.log("the things in parent window scope are", window.opener.windowScope);
      window.opener.windowScope.map = $scope.map;
    };

    

  }]);
