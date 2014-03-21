'use strict';

angular.module('propertySearchApp')
  .service('esriGisLocatorService', ['$resource', '$q', '$log', 'paConfiguration', function($resource, $q, $log, paConfiguration){


    var urlBase = paConfiguration.urlLocatorService;


    var LocatorResource = $resource(urlBase, {},
                                    {candidates20:{method:'JSONP', 
                                                   url:urlBase+"GeoAddress-20/GeocodeServer/findAddressCandidates"}
				    });
    
    var candidates20 = function(candidateAddress){
      var params = {"f":"json",
                    "Single Line Input":candidateAddress,
                    "outFields":'*',
                    "callback": 'JSON_CALLBACK'
                   };

      var deferred = $q.defer();
      LocatorResource.candidates20(params, function(result){
        deferred.resolve(result);
      },function(response){
        $log.error("esriGisLocatorService:candidates20 ", candidateAddress, response);
        deferred.reject(response);
      });
     
      return deferred.promise.then(function(candidates){
        $log.debug("esriGisLocatorService:candidates20. Candidates from address ", candidateAddress, candidates)
	return candidates;
      }, function(error){
        return $q.reject({message:"", error:error});
      });
      
    };

    // public API
    return {candidates20:candidates20};

}]);

