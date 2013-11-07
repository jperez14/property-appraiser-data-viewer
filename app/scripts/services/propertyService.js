'use strict';

angular.module('propertySearchApp')
  .factory('propertyService', function () {

    //Completed, Message
    var Property = function(data) {

      this.propertyInfo = {};
      this.siteAddresses = [];
      this.salesInfo = [];
      this.ownersInfo = [];
      this.legalDescription = {};
      this.mailingAddress = {};
      this.assessmentInfo = {};
      this.classifiedAgInfo = {};
      this.exemptionInfo = {};
      this.extraFeatures = [];
      this.landCInfo = [];

      this.district = null;
      this.geoParcel = null;

      if(isUndefinedOrNull(data)) {
        this.propertyInfo = buildPropertyInfo({});
        this.siteAddresses = buildSiteAddresses([]);
      }
      else{
        this.propertyInfo = buildPropertyInfo(data.PropertyInfo);
        this.siteAddresses = buildSiteAddresses(data.SiteAddresses);
      }


    };

    /**
     *
     **/
    var buildSiteAddresses = function(data){

      // data - return an empty array.
      if(isUndefinedOrNull(data))
        return [];

      var siteAddressAttr = {address:                   "Address",              
                             buildingNumber:            "BuildingNumber",       
                             city:                      "City",                 
                             streetName:                "StreetName",           
                             streetNumber:              "StreetNumber",         
                             streetPrefix:              "StreetPrefix",         
                             streetSuffix:              "StreetSuffix",         
                             streetSuffixDirection:     "StreetSuffixDirection",
                             unit:                      "Unit",                 
                             zip:                       "Zip"}                  

      var siteAddresses = [];

      _.each(data, function(originalSiteAddress){
        var siteAddress = {};            
        _.each(siteAddressAttr, function(value, key){
            siteAddress[key] = originalSiteAddress[value]; 
        });
        siteAddresses.push(siteAddress);
      });

      return siteAddresses;
            
    };
    

    /**
     * it builds the propertyInfo. 
     * If data is undefined or null or empty object {} it returns an dafault object
     * populated with nulls. 
     * When the properties on data are undefined 
     * (the property may not be there) it makes the
     * propertyInfo.someproperty = null; 
     **/
    var buildPropertyInfo = function(data){
      
      var propertyInfoAttr = { bathroomCount:             "BathroomCount",                     
                              bedroomCount:              "BedroomCount",            
                              buildingEffectiveArea:     "BuildingEffectiveArea",   
                              DORCodeCurrent:            "DORCodeCurrent",          
                              DORDescription:            "DORDescription",          
                              floorCount:                "FloorCount",              
                              folioNumber:               "FolioNumber",             
                              halfBathroomCount:         "HalfBathroomCount",       
                              hxBaseYear:                "HxBaseYear",              
                              lotSize:                   "LotSize",                 
                              neighborhood:              "Neighborhood",            
                              neighborhoodDescription:   "NeighborhoodDescription", 
                              percentHomesteadCapped:    "PercentHomesteadCapped",  
                              platBook:                  "PlatBook",                
                              platPage:                  "PlatPage",                
                              primaryZone:               "PrimaryZone",             
                              primaryZoneDescription:    "PrimaryZoneDescription",  
                              status:                    "Status",                  
                              subdivision:               "Subdivision",             
                              subdivisionDescription:    "SubdivisionDescription",  
                              unitCount:                 "UnitCount",               
                              yearBuilt:                 "YearBuilt"}              
        
      // map fields, and when field does not exists
      // assign it to null.
      var propertyInfo = {};      

      _.each(propertyInfoAttr, function(value, key){
        if(isUndefinedOrNull(data))
          propertyInfo[key] = null;
        else if ( _.isUndefined(data[value]))
          propertyInfo[key] = null;
        else
          propertyInfo[key] = data[value]; 
      });
      
      return propertyInfo
          
    };

    var isUndefinedOrNull = function(val){ return _.isUndefined(val) || _.isNull(val)}

    // Public API
    return {
      Property: Property
    };
    
    
  });
