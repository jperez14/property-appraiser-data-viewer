'use strict';

angular.module('propertySearchApp')
  .service('propertySearchService', ['$resource', '$q', 'candidateService', 'propertyService', function($resource, $q, candidateService, propertyService){
    
    var urlBase = "/PaPublicServices/PAGISService.svc/";

    var PropertyResource = $resource(urlBase + ":endPoint", 
                                     {endPoint:""},
                                     {propertyByFolio:{method:'GET'},
				      candidatesByOwner:{method:'GET'},
				      candidatesByAddress:{method:'GET'},
				      candidatesByPartialFolio:{method:'GET'}
				     }
                                    );


    
    var propertyByFolio = function(folio){
      var endPoint = 'GetPropertySearchByFolio';
      var params = {folioNumber:folio, layerId:'4', "endPoint":endPoint};         

      var deferred = $q.defer();
      var rawProperty = PropertyResource.propertyByFolio(params, function (){
        if(propertyService.isPropertyValid(rawProperty))
          deferred.resolve(new propertyService.Property(rawProperty));
        else
          deferred.reject(rawProperty.Message)
      }, function(response){deferred.reject(response)});
      
      return deferred.promise.then(function(property){
	return property;
      }, function(response){
        return response;
      });
    };

    var candidatesByOwner = function(ownerName, from, to, callback) {
      var endPoint = 'GetOwners';
      var params = {"ownerName":ownerName, "from":from, "to":to, "endPoint":endPoint};
      return getCandidates(params);
    };
    
    var candidatesByAddress = function(address, unit, from, to, callback){
      var endPoint = "GetAddress";
      var params = {"myAddress":address, "myUnit":unit, "from":from, "to":to, "endPoint":endPoint};
      
      return getCandidates(params);

    };
    
    var candidatesByPartialFolio = function(partialFolio, from, to, callback){
      var endPoint = "GetPropertySearchByPartialFolio";
      var params = {"partialFolioNumber":partialFolio, "from":from, "to":to, "endPoint":endPoint};
      
      return getCandidates(params);
    };
    
    function getCandidates(params)
    {
      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesByPartialFolio(params, 
	                                                             function(){
		                                                       deferred.resolve(new candidateService.Candidates(candidatesList));
		                                                     },
		                                                     function(response){
		                                                       deffered.reject(response);
	                                                             });

      return deferred.promise.then(function(candidatesList){
	return candidatesList;
      }, function(response){
        return response;
      });
    }
    
    // public API
    return {getPropertyByFolio:propertyByFolio,
	    getCandidatesByOwner:candidatesByOwner,
	    getCandidatesByAddress:candidatesByAddress,
	    getCandidatesByPartialFolio:candidatesByPartialFolio
           };

  }]);

