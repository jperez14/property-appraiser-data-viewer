'use strict';

angular.module('propertySearchApp')
  .factory('propertyService', function () {

    //Completed, Message
    var Property = function(data) {

      this.propertyInfo = {};
      this.legalDescription = {};
      this.mailingAddress = {};
      this.assessmentInfo = {};
      this.classifiedAgInfo = {};
      this.exemptionInfo = {};
      this.siteAddresses = [];
      this.salesInfo = [];
      this.ownersInfo = [];
      this.extraFeatures = [];
      this.landLines = [];

      this.district = null;
      this.geoParcel = null;

      if(isUndefinedOrNull(data)) {
        this.propertyInfo = buildPropertyInfo({});
        this.siteAddresses = buildSiteAddresses([]);
        this.salesInfo = buildSalesInfo([]);
        this.ownersInfo = buildOwnersInfo([]);
        this.extraFeatures = buildExtraFeatures([]);
        this.landLines = buildLandLines([]);
      }
      else{
        this.propertyInfo = buildPropertyInfo(data.PropertyInfo);
        this.siteAddresses = buildSiteAddresses(data.SiteAddresses);
        this.salesInfo = buildSalesInfo(data.SalesInfo);
        this.ownersInfo = buildOwnersInfo(data.OwnerInfos);
        this.extraFeatures = buildExtraFeatures(data.ExtraFeatures);
        this.landLines = buildLandLines(data.Landlines);
      }


    };


    var buildLandLines = function(data){

      // data not given - return an empty array.
      if(isUndefinedOrNull(data))
        return [];

      var landLineAttr = {
        adjustedUnitPrice:   "AdjustedUnitPrice",
        calculatedValue:     "CalculatedValue",  
        depth:               "Depth",            
        frontFeet:           "FrontFeet",        
        landUse:             "LandUse",          
        landlineType:        "LandlineType",     
        muniZone:            "MuniZone",         
        percentCondition:    "PercentCondition", 
        totalAdjustments:    "TotalAdjustments", 
        unitType:            "UnitType",         
        units:               "Units",            
        useCode:             "UseCode",          
        zone:                "Zone"              
      };                  

      var landLines = [];

      _.each(data, function(originalLandLine){
        var landLine = {};            
        _.each(landLineAttr, function(value, key){
            landLine[key] = originalLandLine[value]; 
        });
        landLines.push(landLine);
      });

      return landLines;
            
    };

    var buildExtraFeatures = function(data){

      // data not given - return an empty array.
      if(isUndefinedOrNull(data))
        return [];

      var extraFeatureAttr = {
        actualYearBuilt:   "ActualYearBuilt",   
        adjustedUnitPrice: "AdjustedUnitPrice", 
        depreciatedValue:  "DepreciatedValue",  
        description:       "Description",       
        units:             "Units",             
        useCode:           "UseCode"            
      };                  

      var extraFeatures = [];

      _.each(data, function(originalExtraFeature){
        var extraFeature = {};            
        _.each(extraFeatureAttr, function(value, key){
            extraFeature[key] = originalExtraFeature[value]; 
        });
        extraFeatures.push(extraFeature);
      });

      return extraFeatures;
            
    };

    var buildOwnersInfo = function(data){

      // data not given - return an empty array.
      if(isUndefinedOrNull(data))
        return [];

      var ownerInfoAttr = {
        description:     "Description",  
        marriedFlag:     "MarriedFlag",  
        name:            "Name",         
        percentageOwn:   "PercentageOwn",
        role:            "Role",         
        tenancyCd:       "TenancyCd"    
      };                  

      var ownersInfo = [];

      _.each(data, function(originalOwnerInfo){
        var ownerInfo = {};            
        _.each(ownerInfoAttr, function(value, key){
            ownerInfo[key] = originalOwnerInfo[value]; 
        });
        ownersInfo.push(ownerInfo);
      });

      return ownersInfo;
            
    };

    var buildSalesInfo = function(data){

      // data not given - return an empty array.
      if(isUndefinedOrNull(data))
        return [];

      var saleInfoAttr = {
        appraiserNote:        "AppraiserNote",            
        dateOfSale:           "DateOfSale",             
        docuementStamps:      "DocuementStamps",        
        etlRunId:             "Etlrun_id",              
        grantee2:             "Grantee2",               
        granteeName:          "GranteeName",            
        grantor2:             "Grantor2",               
        grantorName:          "GrantorName",            
        lineNumber:           "LineNumber",             
        modifTp:              "Modif_tp",               
        note:                 "Note",                   
        officialRecordBook:   "OfficialRecordBook",     
        officialRecordPage:   "OfficialRecordPage",     
        qualifiedFlag:        "QualifiedFlag",          
        qualifiedSourceCode:  "QualifiedSourceCode",    
        reasonCode:           "ReasonCode",             
        receivedDate:         "ReceivedDate",           
        resetFlag:            "ResetFlag",              
        reviewCoad:           "ReviewCoad",             
        salePrice:            "SalePrice",              
        salesId:              "SalesId",                
        salesInstrument:      "SalesInstrument",        
        strap:                "Strap",                  
        vacantFlag:           "VacantFlag",             
        validCoad:            "ValidCoad",              
        verifyCoad:           "VerifyCoad"              
      };                  

      var salesInfo = [];

      _.each(data, function(originalSaleInfo){
        var saleInfo = {};            
        _.each(saleInfoAttr, function(value, key){
            saleInfo[key] = originalSaleInfo[value]; 
        });
        salesInfo.push(saleInfo);
      });

      return salesInfo;
            
    };


    /**
     *
     **/
    var buildSiteAddresses = function(data){

      // data not given - return an empty array.
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
                             zip:                       "Zip"
                            };                  

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
