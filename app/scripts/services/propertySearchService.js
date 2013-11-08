'use strict';

angular.module('propertySearchApp')
  .service('propertySearchService', ['$resource', 'candidateService', function($resource, candidateService){
    
    var urlBase = "/PaPublicServices/PAGISService.svc/";

    var PropertyResource = $resource(urlBase + ":endPoint", 
                                     {endPoint:""},
                                     {propertyByFolio:{method:'GET'},
				      candidatesByOwner:{method:'GET'},
				      candidatesByAddress:{method:'GET'}
				     }
                                    );

    var propertyByFolio = function(folio, callback){

      var endPoint = 'GetPropertySearchByFolio';
      var params = {folioNumber:folio, layerId:'4', "endPoint":endPoint};         
      
      var property = PropertyResource.propertyByFolio(params, function(){
        var legalDescription = property.LegalDescription.Description.split(",");
        property.LegalDescription.Description = legalDescription;
        if(callback){
          callback(property);
        }

      }, function(){});

      return property;

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

