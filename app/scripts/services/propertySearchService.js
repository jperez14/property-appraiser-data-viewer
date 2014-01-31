'use strict';

angular.module('propertySearchApp')
  .service('propertySearchService', ['$resource', '$q', 'candidateService', 'propertyService', 'paConfiguration', function($resource, $q, candidateService, propertyService, paConfig){
    
    var urlBase = paConfig.urlPropertyAppraiser;

    var PropertyResource = $resource(urlBase + ":endPoint",
                                     {endPoint:""},
                                     {propertyByFolio:{method:'GET'},
				      candidatesByOwner:{method:'GET'},
				      candidatesByAddress:{method:'GET'},
				      candidatesByPartialFolio:{method:'GET'}
				     }
                                    );


    /**
     * Requests property information by folio.
     * When Folio is found return the property. 
     * When the Folio does not exist, or the request
     * failed an object of the form {message:"some message"}
     * is returned.
     */
    var propertyByFolio = function(folio){
      var endPoint = "";
      var params = {"folioNumber":folio, 
                    "clientAppName":'PropertySearch', 
                    "Operation":'GetPropertySearchByFolio',
                   "endPoint":endPoint};         

      var deferred = $q.defer();
      var rawProperty = PropertyResource.propertyByFolio(params, function (){
        if(propertyService.isPropertyValid(rawProperty))
          deferred.resolve(new propertyService.Property(rawProperty));
        else
          deferred.reject(rawProperty.Message)
      }, function(response){deferred.reject("Ooops The request failed. Try again later.")});
      
      return deferred.promise.then(function(property){
	return property;
      }, function(response){
        return $q.reject({message:response});
      });
    };

    var candidatesByOwner = function(ownerName, from, to, callback) {
      var endPoint = '';
      var params = {"ownerName":ownerName, 
                    "clientAppName":'PropertySearch', 
                    "from":from, 
                    "to":to,
                    "Operation":'GetOwners',
                    "enPoint":endPoint};

      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesByOwner(params, 
	                                                      function(){
		                                                deferred.resolve(new candidateService.Candidates(candidatesList));
		                                              },
		                                              function(response){
		                                                deferred.reject(response);
	                                                      });

      return deferred.promise.then(function(candidatesList){
	return candidatesList;
      }, function(response){
        return response;
      });

    };
    
    var candidatesByAddress = function(address, unit, from, to, callback){
      var endPoint = "";
      var params = {"myAddress":address, "myUnit":unit, 
                    "clientAppName":'PropertySearch', 
                    "from":from, 
                    "to":to, 
                    "Operation":'GetAddress',
                    "endPoint": endPoint
                   };

      
      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesByAddress(params, 
	                                                        function(){
		                                                  deferred.resolve(new candidateService.Candidates(candidatesList));
		                                                },
		                                                function(response){
		                                                  deferred.reject(response);
	                                                        });

      return deferred.promise.then(function(candidatesList){
	return candidatesList;
      }, function(response){
        return response;
      });

    };
    
    var candidatesByPartialFolio = function(partialFolio, from, to, callback){
      var endPoint = "";
      var params = {"partialFolioNumber":partialFolio, 
                    "clientAppName":'PropertySearch', 
                    "from":from, 
                    "to":to, 
                    "Operation":"GetPropertySearchByPartialFolio",
                    "endPoint":endPoint};
      
      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesByPartialFolio(params, 
	                                                             function(){
		                                                       deferred.resolve(new candidateService.Candidates(candidatesList));
		                                                     },
		                                                     function(response){
		                                                       deferred.reject(response);
	                                                             });


      return deferred.promise.then(function(candidatesList){
	return candidatesList;
      }, function(response){
        return response;
      });

    };
    

    // public API
    return {getPropertyByFolio:propertyByFolio,
	    getCandidatesByOwner:candidatesByOwner,
	    getCandidatesByAddress:candidatesByAddress,
	    getCandidatesByPartialFolio:candidatesByPartialFolio
           };

  }]);

