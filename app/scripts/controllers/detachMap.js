'use strict';

angular.module('propertySearchApp')
  .controller('DetachMapCtrl', ['$scope', '$routeParams', 'localStorageService', 'paConfiguration', 'esriGisService', function ($scope, $routeParams, localStorageService, paConfig, esriGisService){

    $scope.parentScope = window.opener.windowScope;
    //window.onunload = $scope.parentScope.attachMap;


    $scope.mapZoomIn = function(){
      $scope.parentScope.mapZoomIn(); 
    };

    $scope.mapZoomOut = function(){
      $scope.parentScope.mapZoomOut();
    };

    $scope.mapActivateZoomInBox = function(){
      $scope.parentScope.mapActivateZoomInBox();
    };

    $scope.mapZoomToFullExtent = function(){
      $scope.parentScope.mapZoomToFullExtent();
    };

    $scope.mapZoomToProperty = function(){
      $scope.parentScope.mapZoomToProperty();
    };

    $scope.mapClicked = function(event){
      $scope.parentScope.mapClicked(event);
    };

    $scope.mapToggleAerialOn = function(){
      $scope.parentScope.mapToggleAerialOn();
    };

    $scope.mapToggleStreetOn = function(){
      $scope.parentScope.mapToggleStreetOn();
    };

    $scope.openPictometryWindow = function(){
      $scope.parentScope.openPictometryWindow();
    };

    $scope.showStreetView = function(){
      $scope.parentScope.showStreetView();
    };

    $scope.attachMap = function(){
      //$scope.parentScope.attachMap($scope.map.extent);
      $scope.parentScope.attachMap();
    };
    
    $scope.close = function(){
      window.close();
    };

    window.onunload = $scope.attachMap;
    
    
    


    function initMap(){

      var map = new esri.Map('detachmap', 
                             {extent:new esri.geometry.Extent(paConfig.initialExtentJson), 
                              logo:false, 
                              showAttribution:false}
                            );

      var scalebar = new esri.dijit.Scalebar({map: map, scalebarStyle:"line"}, dojo.byId("scale-container"));

      $scope.map = map;

      map.on('load',function(){

        map.enableRubberBandZoom();
        map.disableScrollWheelZoom();
        map.hideZoomSlider();

        $scope.drawToolBar = new esri.toolbars.Draw(map);
        dojo.connect($scope.drawToolBar, "onDrawEnd", $scope.parentScope.drawEndHandler);
        $scope.parentScope.drawToolBar = $scope.drawToolBar; 

        //Add events to map.
        map.on("click", $scope.mapClicked);

        map.on('extent-change', function(extent) {
          map.resize();
          map.reposition();
        });

        map.resize();

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
      var parcelPoint = esri.layers.GraphicsLayer({id:"parcelPoint", maxScale:24000});
      var parcelBoundary = esri.layers.GraphicsLayer({id:"parcelBoundary", minScale:23999});
      map.addLayer(aerialLayer);
      map.addLayer(streetLayer);
      map.addLayer(parcels);
      map.addLayer(layers);
      map.addLayer(parcelBoundary);
      map.addLayer(parcelPoint);
      streetLayer.hide(); 

      $scope.map.setExtent($scope.parentScope.map.extent, true);
      $scope.parentScope.map = $scope.map;

    };

    dojo.ready(initMap);


    $scope.attachMapToParent = function(){
      window.opener.windowScope.map = $scope.map;
    };

    

  }]);
