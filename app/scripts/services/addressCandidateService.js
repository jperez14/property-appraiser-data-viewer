'use strict';

angular.module('propertySearchApp')
  .factory('addressCandidateService', function () {


    var PropertyCandidate = function(data){
      return buildObject(data, propertyCandidateAttr);
    };
    
    var PropertyCandidates = function(data){
      

    };
    
    
    var propertyCandidateAttr = {
      owner1      : "Owner1",
      owner2      : "Owner",
      owner3      : "Owner3",
      address     : "SiteAddres",
      folioNumber : "Strap"
    };      

    var buildObject = function(data, attributes){

      // map fields, and when field does not exists
      // assign it to null.
      var result = {};      

      _.each(attributes, function(value, key){
        if(isUndefinedOrNull(data))
          result[key] = null;
        else if ( _.isUndefined(data[value]))
          result[key] = null;
        else
          result[key] = data[value]; 
      });
      
      return result;

    };


    var isUndefinedOrNull = function(val){ return _.isUndefined(val) || _.isNull(val)}

    

    // Public API
    return {
      PropertyCandidate: PropertyCandidate
    };
    
    
  });
