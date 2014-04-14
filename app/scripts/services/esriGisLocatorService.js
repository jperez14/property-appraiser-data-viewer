'use strict';

angular.module('propertySearchApp')
  .service('esriGisLocatorService', ['$resource', '$q', '$log', 'paConfiguration', 'utils', function($resource, $q, $log, paConfiguration, utils){


    var urlBase = paConfiguration.urlLocatorService;


    var LocatorResource = $resource(urlBase, {},
                                    {geoAddress20:{method:'JSONP', 
                                                   url:urlBase+"GeoAddress-20/GeocodeServer/findAddressCandidates"},
                                     locator20:{method:'JSONP', 
                                                   url:urlBase+"MD_Locator-20/GeocodeServer/findAddressCandidates"}
				    });
    
    var geoAddress20 = function(candidateAddress){
      var params = {"f":"json",
                    "Single Line Input":candidateAddress,
                    "outFields":'*',
                    "callback": 'JSON_CALLBACK'
                   };

      var deferred = $q.defer();
      LocatorResource.geoAddress20(params, function(result){
        deferred.resolve(result);
      },function(response){
        $log.error("esriGisLocatorService:geoAddress20 ", candidateAddress, response);
        deferred.reject(response);
      });
     
      return deferred.promise.then(function(candidates){
        $log.debug("esriGisLocatorService:geoAddress20. Candidates from address ", candidateAddress, candidates)
	return candidates;
      }, function(error){
        return $q.reject({message:"", error:error});
      });
      
    };

    var locator20 = function(candidateAddress){
      var params = {"f":"json",
                    "Street":candidateAddress,
                    "outFields":'*',
                    "callback": 'JSON_CALLBACK'
                   };

      var deferred = $q.defer();
      LocatorResource.locator20(params, function(result){
        deferred.resolve(result);
      },function(response){
        $log.error("esriGisLocatorService:locator20 ", candidateAddress, response);
        deferred.reject(response);
      });
     
      return deferred.promise.then(function(candidates){
        $log.debug("esriGisLocatorService:locator20. Candidates from address ", candidateAddress, candidates);
	return cleanCandidates(candidates.candidates);
      }, function(error){
        return $q.reject({message:"", error:error});
      });
      
    };

    var deleteDuplicateCandidates = function(rawCandidates){
      var sortedCandidates = _.sortBy(rawCandidates, function(candidate){
        return candidate.attributes.Loc_name;
      }
                                                     );
      var uniqueCandidates = _.uniq(sortedCandidates, false, function(candidate){  
        return candidate.address;
      });

      return uniqueCandidates;
    };

    var cleanCandidates = function(candidates){
      if(_.isEmpty(candidates))
        return {candidates:[], found:true};
     
      var uniqCandidates = deleteDuplicateCandidates(candidates);

      var geoAddress100 = _.filter(candidates, function(candidate){
        return (candidate.score === 100 && candidate.attributes.Loc_name === "GeoAddress-20");
      });

      var geoStreet100 = _.filter(candidates, function(candidate){
        return (candidate.score === 100 && candidate.attributes.Loc_name === "GeoStreet-20");
      });

      // If there are score of 100 only use those
      if(! _.isEmpty(geoAddress100))
        return {candidates:geoAddress100, found:true};
      else if(! _.isEmpty(geoStreet100))
        return  {candidates:geoStreet100, found:false}; //polygon flag needed.
     
      
      var geoAddress85 = _.chain(candidates)
      .filter(function(candidate){
        return (candidate.score >= 85 && candidate.attributes.Loc_name === "GeoAddress-20")})
      .sortBy("score")
      .value();

      var geoStreet85 = _.chain(candidates)
      .filter(function(candidate){
        return (candidate.score >= 85 && candidate.attributes.Loc_name === "GeoStreet-20")})
      .sortBy("score")
      .value();

      if(geoAddress85.length === 1 && geoAddress85[0].score >= geoStreet85[0].score)
        return {candidates:geoAddress85, found:true};
      else{
        var geoStreet = _.chain(candidates)
          .filter(function(candidate){
            return (candidate.attributes.Loc_name === "GeoStreet-20")})
          .sortBy("score")
          .value();
        
        return {candidates:[geoStreet.reverse()[0]], found:false};
      }


      return {candidates:[], found:true};
      
    };
    
    
    // public API
    return {
      deleteDuplicateCandidates:deleteDuplicateCandidates,
      cleanCandidates:cleanCandidates,
      geoAddress20:geoAddress20,
      locator20: locator20};

}]);

