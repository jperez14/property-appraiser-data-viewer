'use strict';

angular.module('propertySearchApp')
  .service('esriGisService',['$q', 'paConfiguration',  function ($q, paConfig) {


    var pointFromFolio = function($scope, folio){

      var url = paConfig.urlCoordFromFolio;       
      var queryTask = new esri.tasks.QueryTask(url);

      var query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.where = "CHILD=" + folio;
      query.outFields = ["*"];

      var deferred = $q.defer();
      queryTask.execute(query,function (featureSet) {
          deferred.resolve(featureSet);
          $scope.$apply();
        }, function (error) {
          deferred.reject(error);
          $scope.$apply();
        });


      return deferred.promise.then(function(featureSet){
        console.log("featureSet",featureSet);
        return featureSet}, function(error){
          console.log('Getting pointFromFolio ERROR: ',error);
          return error;});
    };

    var folioFromPoint = function ($scope, x, y){
      var url = paConfig.urlParcelLayer;
      return featuresFromPointLayerIntersection($scope, x, y, url, false).then(function(featureSet){
        if(featureSet.features.length > 0)
          return featureSet.features[0].attributes.FOLIO;
        else
          return "";
        
      } ,function(error){return error;});
    };

    var municipalityFromPoint = function($scope, layer, x, y){
      var url = layer.url;
      return featuresFromPointLayerIntersection($scope, x, y, url, true).then(function(featureSet){
        if(featureSet.features.length > 0)
          return featureSet.features[0].geometry;
        else
          return null;
        
      } ,function(error){return error;});

      
    };
    
    var featuresFromPointLayerIntersection = function ($scope, x, y, url, returnGeometry){
      // build hte query.
      var point = new esri.geometry.Point(x, y, new esri.SpatialReference(paConfig.wkidJson));
      var query = new esri.tasks.Query();
      query.geometry = point;
      query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
      query.returnGeometry = returnGeometry;
      query.outFields = ["*"];
      query.outSpatialReference = paConfig.wkidJson; 

      // execute the query.
      var queryTask = new esri.tasks.QueryTask(url);

      var deferred = $q.defer();
      queryTask.execute(query,function (featureSet) {
          deferred.resolve(featureSet);
          $scope.$apply();
        }, function (error) {
          deferred.reject(error);
          $scope.$apply();
        });


      return deferred.promise.then(function(featureSet){
        console.log("featureSet",featureSet);
        return featureSet}, function(error){
          console.log('Getting pointFromFolio ERROR: ',error);
          return error;});

    };
    

    // public API
    return {getPointFromFolio:pointFromFolio,
            getFolioFromPoint:folioFromPoint,
            getMunicipalityFromPoint:municipalityFromPoint
           };

  }]);
