'use strict';

angular.module('propertySearchApp')
  .service('propertySearchService', ['$resource', '$q', 'candidateService', 'propertyService', function($resource, $q, candidateService, propertyService){
    
    var urlBase = "/PaPublicServices/PAGISService.svc/";

    var PropertyResource = $resource(urlBase + ":endPoint", 
                                     {endPoint:""},
                                     {propertyByFolio:{method:'GET'},
				      candidatesByOwner:{method:'GET'},
				      candidatesByAddress:{method:'GET'}
				     }
                                    );

//    var propertyByFolio = function(folio, callback){
//
//      var endPoint = 'GetPropertySearchByFolio';
//      var params = {folioNumber:folio, layerId:'4', "endPoint":endPoint};         
//      
//
//
//      var property = PropertyResource.propertyByFolio(params, function(){
//        var property2 = new propertyService.Property(property);
//        property = property2;
//        if(callback){
//          callback(property);
//        }
//      }, function(){});
//
//      return property;
//    };

    var propertyByFolio = function(folio, callback){

      var endPoint = 'GetPropertySearchByFolio';
      var params = {folioNumber:folio, layerId:'4', "endPoint":endPoint};         

      var deferred = $q.defer();
      var rawProperty = PropertyResource.propertyByFolio(params, function(){
        deferred.resolve(new propertyService.Property(rawProperty));
      }, function(){deferred.resolve("hello")});

      return deferred.promise.then(function(property){
        return property;
      });
    };
    

    var candidatesByOwner = function(ownerName, from, to, callback) {
      var endPoint = 'GetOwners';
      var params = {"ownerName":ownerName, "from":from, "to":to, "endPoint":endPoint};
      var candidates = PropertyResource.candidatesByOwner(params, function() {
	candidates = new candidateService.Candidates(candidates);
	if(callback) {
	  callback(candidates);
	}
      }, function() {});
      
      return candidates;

    };
    
    var candidatesByAddress = function(address, unit, from, to, callback){
      var endPoint = "GetAddress";
      var params = {"myAddress":address, "myUnit":unit, "from":from, "to":to, "endPoint":endPoint};
      var candidates = PropertyResource.candidatesByAddress(params, function() {
	candidates = new candidateService.Candidates(candidates);
	if(callback) {
	  callback(candidates);
	}
      }, function() {});
      
      return candidates;

    };
    
    return {getPropertyByFolio:propertyByFolio,
	    getCandidatesByOwner:candidatesByOwner,
	    getCandidatesByAddress:candidatesByAddress
           };
    

  }]);
