'use strict';

angular.module('propertySearchApp')
  .factory('candidate', ['$q', '$log', 'utils', 'esriGisLocatorService', function ($q, $log, utils, esriGisLocatorService) {

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
      this.candidates = [];
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

    var candidateFromProperty = function(property){
      var candidate = new Candidate();
      if(utils.isUndefinedOrNull(property))
        return candidate;

      if(!utils.isUndefinedOrNull(property.siteAddresses[0])){
        var streetNumber = property.siteAddresses[0].streetNumber;
        var streetPrefix = property.siteAddresses[0].streetPrefix;
        var streetName = property.siteAddresses[0].streetName;
        var streetSuffix = property.siteAddresses[0].streetSuffix;
        var streetSuffixDirection = property.siteAddresses[0].streetSuffixDirection;
        candidate.siteAddress = streetNumber + " " + streetPrefix + " " + streetName +
          " " + streetSuffix + " " + streetSuffixDirection;

        candidate.municipality = property.siteAddresses[0].city;
      }else{
        candidate.siteAddress = "";
        candidate.municipality = "";
      }

      if(!utils.isUndefinedOrNull(property.ownersInfo[0]))
        candidate.firstOwner = property.ownersInfo[0].name;

      if(!utils.isUndefinedOrNull(property.ownersInfo[1]))
        candidate.secondOwner = property.ownersInfo[1].name;

      if(!utils.isUndefinedOrNull(property.ownersInfo[2]))
        candidate.third = property.ownersInfo[2].name;

      candidate.folio = property.propertyInfo.folioNumber;      
      candidate.subdivisionDescription = property.propertyInfo.subdivisionDescription;

      return candidate;
      
    };
    

    /**
     * map an array of esri candidates to an array of candidates objects
     */   
    var candidatesFromEsriCandidates = function(esriCandidates){
      
      // Convert esri candidates to our candidate model.
      var candidates = _.map(esriCandidates, function(esriCandidate){
        return candidateFromEsriCandidate(esriCandidate);
      }); 

      return filterCandidatesWithNoFolio(candidates); 
    };
    

    /**
     * map an array of PA candidates to an array of candidates objects
     */   
    var candidatesFromPACandidates = function(paCandidates) {
      // Convert pa candidates to our candidate model.
      var candidates = _.map(paCandidates, function(paCandidate){
        return candidateFromPaCandidate(paCandidate);
      }); 
      return filterCandidatesWithNoFolio(candidates); 
    };
    

    /**
     *  filter out candidates with no folio.
     **/
    var filterCandidatesWithNoFolio = function(candidates) {

      return _.filter(candidates, function(candidate){
        if(utils.isUndefinedOrNull(candidate.folio))
          return false;
        else if(candidate.folio === "")
          return false;
        else
          return true;
      });
    };

    /**
     *  filter out candidates with no address.
     **/
    var filterCandidatesWithNoAddress = function(candidates) {

      return _.filter(candidates, function(candidate){
        if(utils.isUndefinedOrNull(candidate.siteAddress))
          return false;
        else if(candidate.siteAddress === "")
          return false;
        else
          return true;
      });
    };

    /**
     * receives raw data from paCandidates and it is going to return
     * a candidate.Candidates model
     **/
    var candidatesFromPaData = function(data){
      var candidates = new Candidates();
      
      if(!utils.isUndefinedOrNull(data)) {
	    candidates.completed = data.Completed;
	    candidates.message = data.Message;
	    candidates.total = data.Total;
            candidates.candidates = candidatesFromPACandidates(data.MinimumPropertyInfos);
      }
      
      return candidates;

    };
    
    /**
     * receives raw data from esriCandidates and it is going to return
     * a candidate.Candidates model
     **/
    var candidatesFromEsriData = function(data){
      var candidates = new Candidates();
      
      if(!utils.isUndefinedOrNull(data)) {

        if(data.error === true){
          candidates.completed = false;
          candidates.message = "Error while getting candidates from locator.";
        } else{
	    candidates.completed = true;
	    candidates.message = "";
            candidates.candidates = candidatesFromEsriCandidates(data.candidates);
            candidates.total = candidates.candidates.length;
        }

      }

      return candidates;
    };

    
    var candidatesFromProperties = function(properties){

      var candidatesArray = _.map(properties, function(property){
        return candidateFromProperty(property);
      }); 


      var candidates = new Candidates();
      if(!utils.isUndefinedOrNull((candidatesArray))){
	    candidates.completed = true;
	    candidates.message = "";
            candidates.candidates = candidatesArray;
            candidates.total = candidates.candidates.length;
        
      }
      
      return candidates;
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
      getCandidatesFromProperties: candidatesFromProperties,
      getCandidatesFromPaData: candidatesFromPaData,
      getCandidatesFromEsriData: candidatesFromEsriData
    };
    
    
  }]);
