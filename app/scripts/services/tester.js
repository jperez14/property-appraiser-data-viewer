'use strict';

angular.module('propertySearchApp')
  .service('tester', ['$log', 'paConfiguration', 'esriGisLocatorService', 'propertySearchService', 'esriGisService','candidate', function($log, paConfig, esriGisLocatorService, propertySearchService, esriGisService, candidate){
    
  var getCandidatesByAddress = function(address){
    var promise = propertySearchService.getCandidatesByAddressFromPA(address, "", 1, 200);

    return promise.then(
      function(result){
        if(result.completed == true) 
          return result;
        else
          return getCandidatesByAddressFromEsri(address);
      });
  };

   var getCandidatesByAddressFromEsri = function(address){
      var promise = esriGisLocatorService.locator20(address);
      return promise.then(
        function(data){
          $log.debug("getCandidatesByAddressFromEsri: data from locator", data);
          if(data.found){
            return esriCandidateRoute(data);
          }else{
            return noEsriCandidateRoute(data.candidates);
          }
        }, function(error){
          var candidates = candidate.candidatesFromEsriData({error:true});
          $log.error("getCandidatesByAddressFromEsri. returning default candidates", error, candidates);
          return $q.reject(candidates);
        });
    }

    var esriCandidateRoute = function(data){
      var candidates = candidate.getCandidatesFromEsriData(data);
      var folios = _.pluck(candidates.candidates, 'folio');
      return propertySearchService.getPropertiesByFolios(folios)
      .then(candidate.getCandidatesFromProperties);
    }

    var noEsriCandidateRoute = function(candidates){
      var x = candidates[0].location.x;
      var y = candidates[0].location.y;
      var url = paConfig.urlParcelBoundariesLayer;

      return esriGisService.getFeaturesInCircle(x, y, 100, url, false)
        .then(propertiesFromFeatures)
        .then(candidate.getCandidatesFromProperties);
    };
    
    var propertiesFromFeatures = function(features){
      var folios = _.map(features, function(feature){return feature.attributes.FOLIO});
      var promise = propertySearchService.getPropertiesByFolios(folios);
      return promise.then(function(properties){return properties});
    };

    var test1 = function(address){

      getCandidatesByAddress(address).then(function(candidates){
        console.log("TEST1 CANDIDATES", candidates);
      });

//      getCandidatesByAddressFromEsri(address).then(function(candidates){
//        console.log("TEST1 CANDIDATES", candidates);
//      });
      
      
    }
    
    return {test1:test1}

  }]);


