'use strict';

angular.module('propertySearchApp')
  .service('esriGisGeometryService', ['$resource', '$q', 'paConfiguration', function($resource, $q, paConfiguration){


    var urlBase = paConfiguration.urlGeometryService;


    var GeometryResource = $resource(urlBase + ":endPoint", 
                                     {endPoint:""},
                                     {project:{method:'JSONP'}
				     });

    var xyToLatitudeLongitude = function(x, y){
      var inSR = 2236;
      var outSR = 4326;
      var geometries = {"geometryType" : "esriGeometryPoint",
            "geometries" : [{"x": x, "y": y}]};

      var geometryPromise = project(inSR, outSR, geometries);
      return geometryPromise.then(function(geometry){
        return {latitude:geometry.geometries[0].y, longitude:geometry.geometries[0].x};
      },function(result){});
    }; 

    var project = function(inSpatialReference, outSpatialReference, geometries){
      var endPoint = 'project';
      var params = {"inSR":inSpatialReference,
                    "outSR":outSpatialReference,
                    "geometries":JSON.stringify(geometries),
                    "f":"json",
                    "callback": 'JSON_CALLBACK',
                    "endPoint":endPoint
                   };         

      var deferred = $q.defer();
      GeometryResource.project(params, function(result){
        deferred.resolve(result);
        //console.log("Some xy was returned", result.geometryType);
      },function(response){
        console.log("some xy error was returned", response);
      });
     
      return deferred.promise.then(function(geometry){
	return geometry;
      }, function(response){
        return $q.reject({message:response});
      });
 
    };
    
    /**
     * Produce a circle geometry with center at (x,y) and radius radius
     **/
    var circleGeometry = function(x, y, radius){
      var spatialReference = new esri.SpatialReference(paConfiguration.wkidJson);
      var center = new esri.geometry.Point(x, y, spatialReference);
      return new esri.geometry.Circle({
        center: center,
        radius: radius,
        numberOfPoints: 4,
      }); 
    };
    


    // public API
    return {xyToLatitudeLongitude:xyToLatitudeLongitude,
            getCircleGeometry:circleGeometry};

}]);

