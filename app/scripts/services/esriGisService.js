'use strict';

angular.module('propertySearchApp')
  .service('esriGisService',['$q', '$log', 'paConfiguration',  function ($q, $log, paConfig) {

    var queryLayer = function($scope, url, whereClause, returnGeometry){
      
      // build query.
      var queryTask = new esri.tasks.QueryTask(url);
      var query = new esri.tasks.Query();
      query.returnGeometry = returnGeometry;
      query.where = whereClause;
      query.outFields = ["*"];
      // execute query.
      var deferred = $q.defer();
      queryTask.execute(query,function (featureSet) {
        deferred.resolve(featureSet);
        $scope.$apply();
      }, function (error) {
        deferred.reject(error);
        $scope.$apply();
      });

      // return promise.
      return deferred.promise.then(
        function(featureSet){
          return featureSet}, 
        function(error){
          return $q.reject(error);
        }
      );

    }
        
    var xyFromFolio = function($scope, folio){

      var url = paConfig.urlCoordFromFolio;       
      var whereClause = "CHILD='" + folio + "'";
      return queryLayer($scope, url, whereClause, false).then(
        function(featureSet){
	  if(featureSet.features != undefined && featureSet.features.length > 0) {
	    return {
	      "x":featureSet.features[0].attributes.X_COORD,
	      "y":featureSet.features[0].attributes.Y_COORD};
	  }else{
            var message = "No xy found for folio " + folio;
	    return $q.reject({error:featureSet, message:message});
	  }
        }, 
        function(error){
          var message = "error when trying to get xy from folio. "
          return $q.reject({"error":error, "message":message});
          //return {"error":error, "message":message}; 
        }
      );

    };

    var graphicMarkerFromXY = function(x, y){
      	  var point = {
            "geometry":{
	      "x":x,
	      "y":y,
	      "spatialReference":{"wkid":2236}},
            "symbol":paConfig.propertyMarkerPictureSymbol
          };
	  
      return new esri.Graphic(point);
    }
    
	var joinGeometries = function(featureSet){
	    var geometry = featureSet.features[0].geometry;
		_.each(featureSet.features, function(feature, index){
		    if (index == 0)
			  return;
			_.each(feature.geometry.rings, function(ring){
				geometry.rings.push(ring);
			});
		});
		return geometry;
	}
	
    var polygonFromFolio = function($scope, folio){

      var url = paConfig.urlParcelBoundariesLayer;
      var whereClause = "FOLIO='" + folio + "'";
      return queryLayer($scope, url, whereClause, true).then(
        function(featureSet){
	  if(featureSet.features != undefined && featureSet.features.length > 0) {
	    return joinGeometries(featureSet);
		//return featureSet.features[0].geometry;
	  }else{
            var message = "No polygon found for folio " + folio;
            return $q.reject({"error":featureSet, "message":message});
          }
        }, 
        function(error){
          var message = "error  when getting polygonFormFolio";
          return $q.reject({"error":error, "message":message});
        }
      );

    };


    var graphicMarkerFromPolygon = function(polygon){

	  var boundary = {"geometry":polygon,
                          "symbol":paConfig.propertyBoundarySymbol};
	  return new esri.Graphic(boundary);
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

    var geometryAndFolioFromXY = function($scope, x, y){
      var url = paConfig.urlParcelLayer;

      return featuresFromPointLayerIntersection($scope, x, y, url, true).then(
        function(featureSet){
	  if(featureSet.features != undefined && featureSet.features.length > 0) {
            var data = {geometry:featureSet.features[0].geometry, 
                      folio:featureSet.features[0].attributes.FOLIO};
            return data;
	  }else{
            $log.debug("geometryAndFolioFromXY: No folio found in x,y ", x, y, url, featureSet);
            return {geometry:null, folio:""}
          }
        }, 
        function(error){
          $log.error("geometryAndFolioFromXY: error ", error);
          var message = "error  when getting geometryAndFolioFromXY";
          return $q.reject({"error":error, "message":message});
        }
      );
    };
    
    
    var featureFromPointLayerIntersection = function($scope, layer, x, y){
      var url = layer.url;
      return featuresFromPointLayerIntersection($scope, x, y, url, true).then(function(featureSet){
        if(featureSet.features.length > 0){
          return {geometry:featureSet.features[0].geometry, 
           attributes:featureSet.features[0].attributes}
        }

        else
          return null;
        
      } ,function(error){return error;});
      
    };

    var geometryFromPointLayerIntersection = function($scope, layer, x, y){
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
        $log.debug("featuresFromPointLayerIntersection:features",featureSet);
        return featureSet}, function(error){
          $log.error('featuresFromPointLayerIntersection:error ',error);
          return error;});

    };

    

    // public API
    return {getXYFromFolio:xyFromFolio,
            getGraphicMarkerFromXY:graphicMarkerFromXY,
            getPolygonFromFolio:polygonFromFolio,
            getGraphicMarkerFromPolygon:graphicMarkerFromPolygon,
            getFolioFromPoint:folioFromPoint,
            getGeometryFromPointLayerIntersection:geometryFromPointLayerIntersection,
            getFeatureFromPointLayerIntersection:featureFromPointLayerIntersection,
            getGeometryAndFolioFromXY:geometryAndFolioFromXY
           };

  }]);
