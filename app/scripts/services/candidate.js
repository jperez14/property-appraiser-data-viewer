'use strict';

angular.module('propertySearchApp')
  .factory('candidate', ['utils', 'esriGisLocatorService', function (utils, esriGisLocatorService) {

    var Candidate = function(){

      this.siteAddress = null;
      this.municipality = null;
      this.folio = null;
      this.firstOwner = null;
      this.secondOwner = null;
      this.thirdOwner = null;
      this.status = null;
      this.subdivisionDescription = null;

    };

    var Candidates = function(){
      this.completed = null;
      this.message = null;
      this.total = null;
      this.canidates = [];
    };
    
    /**
     * map an esri candidate to a candidate object
     */  
    var candidateFromEsriCandidate = function(esriCandidate){

      var candidate = new Candidate();
      if(utils.isUndefinedOrNull(esriCandidate))
        return candidate;

      if(utils.isUndefinedOrNull(esriCandidate.address))
        return candidate;

      // break address
      var compositeAddress = _.map(esriCandidate.address.split(","), function(value){
        return value.trim();
      });
      candidate.siteAddress = compositeAddress[0];
      candidate.municipality = municipalities[compositeAddress[1]];
      candidate.folio = esriCandidate.attributes.Street_ID;

      return candidate;
    }
    

    /**
     * map an array of esri candidates to an array of candidates objects
     */   
    var candidatesFromEsriCandidates = function(esriCandidates){
      
      // Convert esri candidates to our candidate model.
      var candidates = _.map(esriCandidates, function(esriCandidate){
        return candidateFromEsriCandidate(esriCandidate);
      }); 

      return filterCandidates(candidates); 
    };
    
	var candidatesFromPACandidates = function(paCandidates) {
	  // Convert pa candidates to our candidate model.
      var candidates = _.map(paCandidates, function(paCandidate){
        return candidateFromPaCandidate(paCandidate);
      }); 
      return filterCandidates(candidates); 
    };
	
	var filterCandidates = function(candidates) {
      // filter out candidates with no folio.
      return _.filter(candidates, function(candidate){
        if(utils.isUndefinedOrNull(candidate.folio))
          return false;
        else if(candidate.folio === "")
          return false;
        else
          return true;
      });
	};
	
	var candidateFromPaCandidate = function(paCandidate) {
      var candidate = new Candidate();
      if(utils.isUndefinedOrNull(paCandidate))
        return candidate;

        if(!utils.isTypeUndefinedOrIsEmpty(paCandidate.SiteAddress))
          candidate.siteAddress = paCandidate.SiteAddress;
        if(!utils.isTypeUndefinedOrIsEmpty(paCandidate.Municipality))
          candidate.municipality = paCandidate.Municipality;
		if(!utils.isTypeUndefined(paCandidate.Strap))
          candidate.folio = paCandidate.Strap.trim().replace(/-/g, "");
        if(!utils.isTypeUndefinedOrIsEmpty(paCandidate.Owner1))
          candidate.firstOwner = paCandidate.Owner1;
        if(!utils.isTypeUndefinedOrIsEmpty(paCandidate.Owner2))
          candidate.secondOwner = paCandidate.Owner2;
        if(!utils.isTypeUndefinedOrIsEmpty(paCandidate.Owner3))
          candidate.thirdOwner = paCandidate.Owner3;
        if(!utils.isTypeUndefinedOrIsEmpty(paCandidate.Status))
		  candidate.status = paCandidate.Status;
		if(!utils.isTypeUndefinedOrIsEmpty(paCandidate.SubdivisionDescription))
		  candidate.subdivisionDescription = paCandidate.SubdivisionDescription;

	return candidate;
	};

    var getCandidates = function(candidateAddress){
      var promise = esriGisLocatorService.candidates20(candidateAddress);
      return promise.then(
        function(data){
          return candidatesFromEsriCandidates(data.candidates)
        }, function(error){});
     };
    

    var municipalities = {
      "1": "MIAMI",
      "2": "MIAMI BEACH",
      "3": "CORAL GABLES",
      "4": "HIALEAH",
      "5": "MIAMI SPRINGS",
      "6": "NORTH MIAMI",
      "7": "NORTH MIAMI BEACH",
      "8": "OPA-LOCKA",
      "9": "SOUTH MIAMI",
      "10": "HOMESTEAD",
      "11": "MIAMI SHORES",
      "12": "BAL HARBOUR",
      "13": "BAY HARBOR ISLANDS",
      "14": "SURFSIDE",
      "15": "WEST MIAMI",
      "16": "FLORIDA CITY",
      "17": "BISCAYNE PARK",
      "18": "EL PORTAL",
      "19": "GOLDEN BEACH",
      "20": "PINECREST",
      "21": "INDIAN CREEK VILLAGE",
      "22": "MEDLEY",
      "23": "NORTH BAY VILLAGE",
      "24": "KEY BISCAYNE",
      "25": "SWEETWATER",
      "26": "VIRGINIA GARDENS",
      "27": "HIALEAH GARDENS",
      "28": "AVENTURA",
      "30": "UNINCORPORATED MIAMI-DADE",
      "31": "SUNNY ISLES BEACH",
      "32": "MIAMI LAKES",
      "33": "PALMETTO BAY",
      "34": "MIAMI GARDENS",
      "35": "DORAL",
      "36": "CUTLER BAY"
    };
    

    // Public API
    return {
      Candidate: Candidate,
      candidateFromEsriCandidate: candidateFromEsriCandidate,
      candidatesFromEsriCandidates: candidatesFromEsriCandidates,
      getCandidates: getCandidates
    };
    
    
}]);
