'use strict';

angular.module('propertySearchApp')
  .service('propertySearchService', ['$resource', '$q', '$log', 'candidate', 'esriGisLocatorService', 'esriGisService', 'propertyService', 'paConfiguration', 'utils', function($resource, $q, $log, candidate, esriGisLocatorService, esriGisService, propertyService, paConfig, utils){
    
    var urlBase = paConfig.urlPropertyAppraiser;

    var PropertyResource = $resource(urlBase + ":endPoint",
                                     {endPoint:""},
                                     {propertyByFolio:{method:'GET'},
					  candidatesBySubDivision:{method:'GET'},
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
    
    var candidatesBySubDivision = function(subDivision, from, to, callback) {
      var endPoint = '';
      var params = {"subDivisionName":subDivision, 
                    "clientAppName":paConfig.clientAppName, 
                    "from":from, 
                    "to":to,
                    "Operation":'GetPropertySearchBySubDivision',
                    "enPoint":endPoint};

      var deferred = $q.defer();
      var candidatesList = PropertyResource.candidatesBySubDivision(params, 
        function(){
          deferred.resolve(candidate.getCandidatesFromPaData(candidatesList));
		}, function(response){
		  deferred.reject(response);
	    });

      return deferred.promise.then(function(candidatesList){
	    return candidatesList;
      }, function(response){
        $log.error("propertySearchService:candidatesBySubDivision:", urlBase, subDivision, response);
        return $q.reject(response);
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
      var candidatesList = PropertyResource.candidatesByOwner(params, function(){
        deferred.resolve(candidate.getCandidatesFromPaData(candidatesList));
      }, function(response){
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



    /**
     * additionalInfoList - array of additinalInfo strings as
     * configured in paConfig.additionalInfoUrls
     * x - x coordinate of property
     * y - y coordinate of property
     * address - address of the property.
     * builds additionalInfo objects which have the form
     * {key:'label', value:'http://someurl', isUrl:true}
     * It looks at the configuration on paConfig.additionalInfoUrls
     * and builds a url.
     * return - map where the key is the additionalInfo string passed
     * value is the created addtionalInfo object shown above.
     **/
    var buildAdditionalInfoUrls = function(additionalInfoList, x, y, address){
      
      var additionalInfo = _.map(additionalInfoList, function(info){

        var infoTmp = {key:info};
        
        // build the url based on hte params configuration.
        if(paConfig.additionalInfoUrls[info]){
          var paramString = "";
          var additionalInfoUrl = paConfig.additionalInfoUrls[info];
          paramString = _.reduce(additionalInfoUrl.params, function(memo, paramValue, paramKey){
            var tmpParamValue = paramValue; 

            if(paramKey === 'x')
              tmpParamValue = x; 
            else if(paramKey === 'y')
              tmpParamValue = y;
            else if(paramKey === 'address' || paramKey === 'paramvalue') {
              tmpParamValue = address;
            }

            return memo + paramKey + '=' + tmpParamValue + '&'; 
          }, '?');

          infoTmp.value = paConfig.additionalInfoUrls[infoTmp.key].url + paramString;
          infoTmp.isUrl = true;
        }

        return infoTmp;

      });

      return _.object(additionalInfoList, additionalInfo);

    };


    /**
     * additionalInfoList - array of additinalInfo strings as
     * configured in additionalInfoLayers
     * x - x coordinate of property
     * y - y coordinate of property
     * folio - folio of the property.
     * builds additionalInfo objects which have the form
     * {key:'label', value:'some value', isUrl:false}
     * It looks at the configuration on paConfig.additionalInfoUrls
     * and populates the value based on some property on the layer.
     * The property is configured in paConfig.additionalInfoLayers
     * return - map where the key is the additionalInfo string passed
     * value is the created addtionalInfo object shown above.
     **/
    var buildAdditionalInfoLayers = function($scope, additionalInfoList, x, y, folio){
      
      var folioMatch = /^30/
      // Build the layers needed.
      var additionalInfoLayers = _.map(additionalInfoList, function(info){
        var clone = _.clone(paConfig.additionalInfoLayers[info]);
        // url for zoning is different for municipalities.
        if(clone.label === 'Zoning'){
          if(!folioMatch.test(folio))
            clone.url = paConfig.additionalInfoLayers['ZoningMunicipalities'].url;
        }
        return clone;
      });

      return esriGisService.getFeatureFromPointMultiLayerIntersection(
        $scope, additionalInfoLayers, x, y).then(function(additionalInfoData){

          var data = _.object(_.map(additionalInfoData, function (value, key) {
            var attribute = paConfig.additionalInfoLayers[key].attributes[0];
            var tmp = {key:key, value:null, isUrl:false};
            if(!utils.isUndefinedOrNull(value))
              tmp.value = value.attributes[attribute];
            else
              tmp.value = "NONE";

            return [key, tmp];

          }));
          
          return data;
          
        });
      
    };


    /*
     * Building the additionalInfo data is made
     * out of 3 pieces, collected in different places, which takes as
     * a base the original additionalInfo coming from the PA.
     * 1. paConfiguration.additionalInfoLayers: Data that needs to come from a GIS polygon layer.
     * Intersection of the property of xy, with the layer, will give
     * the attributes (the data). Special cases
     *   a. Zoning: If first 2 digits of folio are 30 then query a
     *   layer, otherwise query some other layer.
     *   b. Zoning Land Use: To get the description, once you have the
     *   land use code you can query the description layer.
     * 2. paConfiguration.additionalInfoUrls: Data that needs a url 
     * which needs to be built dynamically with certain params, like
     * x, y and address
     * 3. Static data that it is already in the
     * property.additionalInfo.infoList. If the value is other than
     * COUNTYGIS, this is the flag that says to take the data as is.
     */
    var buildAdditionalInfo = function($scope, property){

      // setup parameters
      var x = property.location.x;
      var y = property.location.y;
      var folio = property.propertyInfo.folioNumber;
      var address = "";
      if(!utils.isUndefinedOrNull(property.siteAddresses[0]))
        address = property.siteAddresses[0].address;  

      var additionalInfoList  = _.pluck(property.additionalInfo.infoList, "key")
      // define the list of additionalInfo urls required
      var additionalInfoUrlsList = _.intersection(_.keys(paConfig.additionalInfoUrls), 
                                                  additionalInfoList);

      // define the list of additionalInfo layers required
      var additionalInfoLayersList = _.intersection(_.keys(paConfig.additionalInfoLayers), 
                                                  additionalInfoList);

      var result1 = buildAdditionalInfoUrls(additionalInfoUrlsList, x, y, address);

      return buildAdditionalInfoLayers($scope, additionalInfoLayersList, x, y, folio)
        .then(function(result2){
          return _.map(property.additionalInfo.infoList, function(info){
            if(result1[info.key])
              return result1[info.key];
            else if (result2[info.key])
              return result2[info.key];
            else return info;
          });
          
        });
    };
    



    // public API
    return {getPropertyByFolio:propertyByFolio,
            getPropertiesByFolios:propertiesByFolios,
	    getCandidatesByOwner:candidatesByOwner,
		getCandidatesBySubDivision:candidatesBySubDivision,
        getCandidatesByAddressFromEsri:candidatesByAddressFromEsri,
        getCandidatesByAddressFromPA:candidatesByAddressFromPA,
	    getCandidatesByAddress:candidatesByAddress,
	    getCandidatesByPartialFolio:candidatesByPartialFolio,
	    getHasValidStreetName:hasValidStreetName,
            buildAdditionalInfoUrls:buildAdditionalInfoUrls,
            buildAdditionalInfo:buildAdditionalInfo
           };

  }]);

