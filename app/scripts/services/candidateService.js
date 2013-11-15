'use strict';

angular.module('propertySearchApp')
  .factory('candidateService', function () {

    //Completed, Message
    var Candidates = function(data) {
      this.candidates = [];
      this.candidates = buildCandidates(data.MinimumPropertyInfos);
    };

    /**
     * it builds the candidates. 
     * If data is undefined or null it returns an empty array []. 
     * If data is empty object {}, return an empty array [].
     * When the MinimumPropertyInfos on data is undefined 
     * (the MinimumPropertyInfos may not be there) it makes the
     * MinimumPropertyInfos = []; 
     **/
    var buildCandidates = function(data){
      // No data return an empty array
      if(isUndefinedOrNull(data))
        return [];
      
      // map fields, and when field does not exists
      // assign it to null.
      var candidates = [];
      
      if(typeof data === "undefined")
        candidates = [];
      else
        candidates = data;
      
      //iterate each candidate and 
      // - if field doesn't exist, assign it to null
      // - if field value is empty in some cases, assign it to null
      candidates = _.map(candidates, function(el){
        var candidate = {};

        if(isTypeUndefined(el.SiteAddress))
          candidate.siteAddress = null;
        else
          candidate.siteAddress = el.SiteAddress;

        if(isTypeUndefined(el.Strap))
          candidate.folio = null;
        else
          candidate.folio = el.Strap; //.trim().replace(/-/g, "");

        if(isTypeUndefinedOrIsEmpty(el.Owner1))
          candidate.firstOwner = null;
        else
          candidate.firstOwner = el.Owner1;

	if(isTypeUndefinedOrIsEmpty(el.Owner2))
          candidate.secondOwner = null;
        else
          candidate.secondOwner = el.Owner2;

	if(isTypeUndefinedOrIsEmpty(el.Owner3))
          candidate.thirdOwner = null;
        else
          candidate.thirdOwner = el.Owner3;

        return candidate;
      });
      
      return candidates;
      
    };

    var isUndefinedOrNull = function(val){ return angular.isUndefined(val) || val === null}
    
    var isTypeUndefined = function(val){return typeof val === "undefined"}

    var isTypeUndefinedOrIsEmpty = function(val){return typeof val === "undefined" || _.isEmpty(val) }
    
    // Public API
    return {
      Candidates: Candidates
    };
    
  });
