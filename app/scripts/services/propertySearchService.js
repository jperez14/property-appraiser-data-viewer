'use strict';

angular.module('propertySearchApp')
  .service('propertySearchService', ['$resource', '$q', '$log', 'candidate', 'esriGisLocatorService', 'esriGisService', 'propertyService', 'paConfiguration', function($resource, $q, $log, candidate, esriGisLocatorService, esriGisService, propertyService, paConfig){
    
    var urlBase = paConfig.urlPropertyAppraiser;

    var PropertyResource = $resource(urlBase + ":endPoint",
                                     {endPoint:""},
                                     {propertyByFolio:{method:'GET'},
				      candidatesByOwner:{method:'GET'},
				      candidatesByAddress:{method:'GET'},
				      candidatesByPartialFolio:{method:'GET'},
				      hasValidStreetName:{method:'GET'}
				     }
                                    );


    /**
     * Requests property information by folio. s
     * When Folio is found return the property. 
     * When the Folio does not exist, or the request
     * failed an object of the form {message:"some message"}
     * is returned.
     **/
    var propertyByFolio = function(folio, clientAppName){

      var endPoint = "";
      var params = {"folioNumber":folio, 
                    "clientAppName":clientAppName || paConfig.clientAppName, 
                    "Operation":'GetPropertySearchByFolio',
                    "endPoint":endPoint};         

      var deferred = $q.defer();
      var rawProperty = PropertyResource.propertyByFolio(params, function (){
        if(propertyService.isPropertyValid(rawProperty))
          deferred.resolve(new propertyService.Property(rawProperty));
        else
          deferred.reject(rawProperty.Message)
      }, function(response){
        $log.error("propertySearchService:propertyByFolio:", urlBase, folio, response);
        deferred.reject("The request failed. Try again later.")});
      
      return deferred.promise.then(function(property){
	return property;
      }, function(response){
        $log.error("propertySearchService:propertyByFolio:", urlBase, folio, response);
        return $q.reject({message:response});
      });
    };


    /**
     * return a promise where the data returned by that promise is an array of
     * propertyService.Property objects for each one of
     * the folios. It discard folios that are not found.
     * When passing an empty array of folios or null the promise
     * returns an ampty array as data.
     **/
    var propertiesByFolios = function(folios, clientAppName){
      //self = this;
      var propertyPromises = [];
      
      // Get a promise for each folio.
      _.each(folios, function(folio){
        propertyPromises.push(propertyByFolio(folio, clientAppName).then(
          function(data){return data},
          function(response){return null }
        ));
      });

      // Discard not existing properties.
      var all = $q.all(propertyPromises);
      return all.then(function(data){
        $log.debug("propertySearchService:propertiesByFolios: ", data)
        return _.filter(data, function(property){return property != null});
      });
    };
    

    var candidatesByOwner = function(ownerName, from, to, callback) {
      var endPoint = '';
      var params = {"ownerName":ownerName, 
                    "clientAppName":paConfig.clientAppName, 
                    "from":from, 
                    "to":to,
                    "Operation":'GetOwners',
                    "enPoint":endPoint};

      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesByOwner(params, 
	                                                      function(){
		                                                deferred.resolve(candidate.getCandidatesFromPaData(candidatesList));
		                                              },
		                                              function(response){
		                                                deferred.reject(response);
	                                                      });

      return deferred.promise.then(function(candidatesList){
	return candidatesList;
      }, function(response){
        $log.error("propertySearchService:candidatesByOwner:", urlBase, ownerName, response);
        return $q.reject(response);
      });

    };
    
    var candidatesByAddressFromPA = function(address, unit, from, to, callback){
      var endPoint = "";
      var params = {"myAddress":address, "myUnit":unit, 
                    "clientAppName":paConfig.clientAppName, 
                    "from":from, 
                    "to":to, 
                    "Operation":'GetAddress',
                    "endPoint": endPoint
                   };

      
      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesByAddress(params, 
        function(){
          deferred.resolve(candidate.getCandidatesFromPaData(candidatesList));
        },
        function(response){
          deferred.reject(response);
        });

      return deferred.promise.then(function(candidatesList){
	return candidatesList;
      }, function(response){
        $log.error("propertySearchService:candidatesByAddress:", urlBase, address, unit, response);
        return $q.reject(response);
      });

    };
    
    var candidatesByPartialFolio = function(partialFolio, from, to, callback){
      var endPoint = "";
      var params = {"partialFolioNumber":partialFolio, 
                    "clientAppName":paConfig.clientAppName, 
                    "from":from, 
                    "to":to, 
                    "Operation":"GetPropertySearchByPartialFolio",
                    "endPoint":endPoint};
      
      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesByPartialFolio(params, 
	                                                             function(){
		                                                       deferred.resolve(candidate.getCandidatesFromPaData(candidatesList));
		                                                     },
		                                                     function(response){
		                                                       deferred.reject(response);
	                                                             });


      return deferred.promise.then(function(candidatesList){
	return candidatesList;
      }, function(response){
        $log.error("propertySearchService:candidatesByPartialFolio:", urlBase, partialFolio, response);
        return $q.reject(response);
      });

    };
    

    var hasValidStreetName = function(address, callback){
      var endPoint = "";
      var params = {"myAddress":address, 
                    "clientAppName":paConfig.clientAppName, 
                    "Operation":"ContainsValidStreetName",
                    "endPoint":endPoint};
      
      var deferred = $q.defer();
      
      var isValidStreet = PropertyResource.hasValidStreetName(params, 
	                                                      function(){
		                                                deferred.resolve({
	                                                          completed:isValidStreet.Completed,
	                                                          message:isValidStreet.Message,
	                                                          valid:isValidStreet.Valid
	                                                        });
		                                              },
		                                              function(response){
		                                                deferred.reject(response);
	                                                      });

      return deferred.promise.then(function(isValidStreet){
	return isValidStreet;
      }, function(response){
        $log.error("propertySearchService:hasValidStreetName:", response);
        return $q.reject(response);
      });

    };



  var candidatesByAddress = function(address, unit, from, to){
    var promise = candidatesByAddressFromPA(address, unit, from, to);

    return promise.then(
      function(result){
        if(result.completed == true) 
          return result;
        else
          var message = result.message;
          return candidatesByAddressFromEsri(address).then(function(result){
          if(result.candidates.length == 0)
              result.message = message;
          return result;
          });
      }, function(error){
        return $q.reject({error:error, message:"The request failed. Please try again later"});
      });
  };

   var candidatesByAddressFromEsri = function(address){
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
          var candidates = candidate.getCandidatesFromEsriData({error:true});
          $log.error("getCandidatesByAddressFromEsri. returning default candidates", error, candidates);
          return $q.reject(candidates);
        });
    }

    var esriCandidateRoute = function(data){
      var candidates = candidate.getCandidatesFromEsriData(data);
      var folios = _.pluck(candidates.candidates, 'folio');
      return propertiesByFolios(folios, paConfig.clientAppNameGeo)
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
      var promise = propertiesByFolios(folios, paConfig.clientAppNameGeo);
      return promise.then(function(properties){return properties});
    };




//    var candidatesByAddressFromEsri = function(candidateAddress){
//      var promise = esriGisLocatorService.locator20(candidateAddress);
//      return promise.then(
//        function(data){
//          var candidates = candidate.getCandidatesFromEsriData(data);
//          $log.debug("propertySearchService:candidatesByAddressFromEsri esri candidates are ", candidateAddress, candidates);
//          return candidates;
//        }, function(error){
//          $log.error("propertySearchService:candidatesByAddressFromEsri ", error);
//          var candidates = candidate.candidatesFromEsriData({error:true});
//          return $q.reject(candidates);
//        });
//    };
//
//
//
//
//    var candidatesByAddressFromEsri2 = function(candidateAddress){
//      var promise = candidatesByAddressFromEsri(candidateAddress);
//      return promise.then(function(candidates){
//
//        if(candidates.found){
//          var folios = _.pluck(candidates.candidates, 'folio');
//          return propertiesByFolios(folios).then(function(properties){
//            return candidate.getCandidatesFromProperties(properties);
//          });          
//        } else {
//          var x = candidates.candidates[0].location.x;
//          var y = candidates.candidates[0].location.y;
//          var url = paConfig.urlMunicipalityLayer;
//          // get features from circle
//          var featuresPromise = esriGisService.featuresInCircle(x, y, 100, url, false);
//          featuresPromise.then(function(featureSet){
//            console.log("FEATURESET", featureSet);
//          });
//          
//        }
//
//
//      });
//    };
//
//
//
//    var candidatesByAddress = function(address, unit, from, to){
//      var promise = candidatesByAddressFromPA(address, unit, from, to);
//      
//      return promise.then(function(result){
//	if(result.completed == true) {
//          return result;
//	}
////        else
////          return $q.reject({error:{}, message:result.message})
//	else {
//          var message = result.message;
//          return candidatesByAddressFromEsri2(address).then(function(result){
//            if(result.candidates.length == 0)
//              result.message = message;
//            return result;
//          },function(error){
//            return $q.reject({error:error, message:"The request failed. Please try again later"});
//          });
//	}
//      }, function(error){
//            return $q.reject({error:error, message:"The request failed. Please try again later"});
//      });
//
//    };
    

//*****************************************************************
//    var getCandidatesByAddressFromEsri_1 = function(address){
//      var promise = esriGisLocatorService.locator20(candidateAddress);
//      return promise.then(
//        function(data){
//          if(data.found){
//            return candidate.getCandidatesFromEsriData(data.cadidates);
//          }else{
//            return noEsriCandidateRoute(data.candidates);
//          }
//        }, function(error){
//          var candidates = candidate.candidatesFromEsriData({error:true});
//          return $q.reject(candidates);
//        });
//    }
//
//    var noEsriCandidateRoute = function(candidates){
//      return esriGisService.featuresInCircle(x, y, 100, url, false)
//      .then(propertiesFromCandidates);
//    }
//
//    var populateCandidatesWithOwnerData_1 = function(candidates){
//      var folios = _.pluck(candidates.candidates, 'folio');
//      var promise = propertiesByFolios(folios);
//
//      return promise.then(function(properties){
//        return candidate.getCandidatesFromProperties(properties);
//      });
//      
//    }

//    getCandidatesByAddressFromEsri_1("someAddress")
//    .then(populateCandidatesWithOwnerData_1, getFeaturesInCircle)
//    .

    // public API
    return {getPropertyByFolio:propertyByFolio,
            getPropertiesByFolios:propertiesByFolios,
	    getCandidatesByOwner:candidatesByOwner,
            getCandidatesByAddressFromEsri:candidatesByAddressFromEsri,
            getCandidatesByAddressFromPA:candidatesByAddressFromPA,
	    getCandidatesByAddress:candidatesByAddress,
	    getCandidatesByPartialFolio:candidatesByPartialFolio,
	    getHasValidStreetName:hasValidStreetName
           };

  }]);

