'use strict';

angular.module('propertySearchApp')
  .factory('propertyService', function () {

    //Completed, Message
    var Property = function(data) {

      this.propertyInfo = {};
      this.mailingAddress = {};
      this.assessmentInfo = {};
      this.classifiedAgInfo = {};
      this.exemptionInfo = {};
      this.legalDescription = {};
      this.siteAddresses = [];
      this.salesInfo = [];
      this.ownersInfo = [];
      this.extraFeatures = [];
      this.landLines = [];
      this.district = null;
      this.geoParcel = null;

      if(isUndefinedOrNull(data)) {
        this.propertyInfo = buildPropertyInfo({});
        this.mailingAddress = buildMailingAddress({});
        this.assessmentInfo = buildAssessmentInfo({});
        this.classifiedAgInfo = buildClassifiedAgriculturalInfo({});
        this.exemptionInfo = buildExemptionInfo({});
        this.legalDescription = buildLegalDescription({});
        this.siteAddresses = buildSiteAddresses([]);
        this.salesInfo = buildSalesInfo([]);
        this.ownersInfo = buildOwnersInfo([]);
        this.extraFeatures = buildExtraFeatures([]);
        this.landLines = buildLandLines([]);
      }
      else{
        this.propertyInfo = buildPropertyInfo(data.PropertyInfo);
        this.mailingAddress = buildMailingAddress(data.MailingAddress);
        this.assessmentInfo = buildAssessmentInfo(data.AssessmentInfo);
        this.classifiedAgInfo = buildClassifiedAgriculturalInfo(data.ClassifiedAgInfo);
        this.exemptionInfo = buildExemptionInfo(data.ExemptionInfo);
        this.legalDescription = buildLegalDescription(data.LegalDescription);
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
                              yearBuilt:                 "YearBuilt"
                             };
        
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
      
      return propertyInfo;
          
    };

    var buildMailingAddress = function(data){

      var mailingAddressAttr = { address1: "Address1",
                                 address2: "Address2",
                                 city: "City",
                                 country: "Country",
                                 state: "State",
                                 zipCode: "ZipCode"};              
        
      // map fields, and when field does not exists
      // assign it to null.
      var mailingAddress = {};      

      _.each(mailingAddressAttr, function(value, key){
        if(isUndefinedOrNull(data))
          mailingAddress[key] = null;
        else if ( _.isUndefined(data[value]))
          mailingAddress[key] = null;
        else
          mailingAddress[key] = data[value]; 
      });
      
      return mailingAddress;
          
    };

    var buildAssessmentInfo = function(data){
      
      var assessmentInfoAttr = {
        assessedValueCurrent:             "AssessedValueCurrent",            
        assessedValuePrior:               "AssessedValuePrior",              
        assessedValueTwoPrior:            "AssessedValueTwoPrior",           
        assessmentYearCurrent:            "AssessmentYearCurrent",           
        assessmentYearPrior:              "AssessmentYearPrior",             
        assessmentYearTwoPrior:           "AssessmentYearTwoPrior",          
        buildingValueCurrent:             "BuildingValueCurrent",            
        buildingValuePrior:               "BuildingValuePrior",              
        buildingValueTwoPrior:            "BuildingValueTwoPrior",           
        cityExemptionValueCurrent:        "CityExemptionValueCurrent",       
        cityExemptionValuePrior:          "CityExemptionValuePrior",         
        cityExemptionValueTwoPrior:       "CityExemptionValueTwoPrior",      
        cityTaxableValueCurrent:          "CityTaxableValueCurrent",         
        cityTaxableValuePrior:            "CityTaxableValuePrior",           
        cityTaxableValueTwoPrior:         "CityTaxableValueTwoPrior",        
        countyExemptionValueCurrent:      "CountyExemptionValueCurrent",     
        countyExemptionValuePrior:        "CountyExemptionValuePrior",       
        countyExemptionValueTwoPrior:     "CountyExemptionValueTwoPrior",    
        countyTaxableValueCurrent:        "CountyTaxableValueCurrent",       
        countyTaxableValuePrior:          "CountyTaxableValuePrior",         
        countyTaxableValueTwoPrior:       "CountyTaxableValueTwoPrior",      
        landValueCurrent:                 "LandValueCurrent",                
        landValuePrior:                   "LandValuePrior",                  
        landValueTwoPrior:                "LandValueTwoPrior",               
        regionalExemptionValueCurrent:    "RegionalExemptionValueCurrent",   
        regionalExemptionValuePrior:      "RegionalExemptionValuePrior",     
        regionalExemptionValueTwoPrior:   "RegionalExemptionValueTwoPrior",  
        regionalTaxableValueCurrent:      "RegionalTaxableValueCurrent",     
        regionalTaxableValuePrior:        "RegionalTaxableValuePrior",       
        regionalTaxableValueTwoPrior:     "RegionalTaxableValueTwoPrior",    
        schoolExemptionValueCurrent:      "SchoolExemptionValueCurrent",     
        schoolExemptionValuePrior:        "SchoolExemptionValuePrior",       
        schoolExemptionValueTwoPrior:     "SchoolExemptionValueTwoPrior",    
        schoolTaxableValueCurrent:        "SchoolTaxableValueCurrent",       
        schoolTaxableValuePrior:          "SchoolTaxableValuePrior",         
        schoolTaxableValueTwoPrior:       "SchoolTaxableValueTwoPrior",      
        totalValueCurrent:                "TotalValueCurrent",               
        totalValuePrior:                  "TotalValuePrior",                 
        totalValueTwoPrior:               "TotalValueTwoPrior"                  
      };              
        
      // map fields, and when field does not exists
      // assign it to null.
      var assessmentInfo = {};      

      _.each(assessmentInfoAttr, function(value, key){
        if(isUndefinedOrNull(data))
          assessmentInfo[key] = null;
        else if ( _.isUndefined(data[value]))
          assessmentInfo[key] = null;
        else
          assessmentInfo[key] = data[value]; 
      });
      
      return assessmentInfo;
          
    };

    var buildClassifiedAgriculturalInfo = function(data){
      
      var classifiedAgriculturalInfoAttr = { 
        acreage:"Acreage",
        calculatedValue:"CalculatedValue",
        landCode:"LandCode",
        landUse:"LandUse",
        unitPrice:"UnitPrice"
      };              
        
      // map fields, and when field does not exists
      // assign it to null.
      var classifiedAgriculturalInfo = {};      

      _.each(classifiedAgriculturalInfoAttr, function(value, key){
        if(isUndefinedOrNull(data))
          classifiedAgriculturalInfo[key] = null;
        else if ( _.isUndefined(data[value]))
          classifiedAgriculturalInfo[key] = null;
        else
          classifiedAgriculturalInfo[key] = data[value]; 
      });
      
      return classifiedAgriculturalInfo;
          
    };

    var buildExemptionInfo = function(data){
      
      var exemptionInfoAttr = { 
        agDifferentialValueCurrent:"AgDifferentialValueCurrent",
        agDifferentialValuePrior:"AgDifferentialValuePrior",
        agDifferentialValueTwoPrior:"AgDifferentialValueTwoPrior",
        assessmentYearCurrent:"AssessmentYearCurrent",
        assessmentYearPrior:"AssessmentYearPrior",
        assessmentYearTwoPrior:"AssessmentYearTwoPrior",
        countySecondHomesteadExValueCurrent:"CountySecondHomesteadExValueCurrent",
        countySecondHomesteadExValuePrior:"CountySecondHomesteadExValuePrior",
        countySecondHomesteadExValueTwoPrior:"CountySecondHomesteadExValueTwoPrior",
        countySeniorExValueCurrent:"CountySeniorExValueCurrent",
        countySeniorExValuePrior:"CountySeniorExValuePrior",
        countySeniorExValueTwoPrior:"CountySeniorExValueTwoPrior",
        disabledExValueCurrent:"DisabledExValueCurrent",
        disabledExValuePrior:"DisabledExValuePrior",
        disabledExValueTwoPrior:"DisabledExValueTwoPrior",
        homesteadExValueCurrent:"HomesteadExValueCurrent",
        homesteadExValuePrior:"HomesteadExValuePrior",
        homesteadExValueTwoPrior:"HomesteadExValueTwoPrior",
        veteranExValueCurrent:"VeteranExValueCurrent",
        veteranExValuePrior:"VeteranExValuePrior",
        veteranExValueTwoPrior:"VeteranExValueTwoPrior",
        widowExValueCurrent:"WidowExValueCurrent",
        widowExValuePrior:"WidowExValuePrior",
        widowExValueTwoPrior:"WidowExValueTwoPrior"
      };              
        
      // map fields, and when field does not exists
      // assign it to null.
      var exemptionInfo = {};      

      _.each(exemptionInfoAttr, function(value, key){
        if(isUndefinedOrNull(data))
          exemptionInfo[key] = null;
        else if ( _.isUndefined(data[value]))
          exemptionInfo[key] = null;
        else
          exemptionInfo[key] = data[value]; 
      });
      
      return exemptionInfo
          
    };


    var buildLegalDescription = function(data){
      
      var legalDescriptionAttr = {
        description: "Description",
        number: "Number"
      };              
        
      // map fields, and when field does not exists
      // assign it to null.
      var legalDescription = {};      

      _.each(legalDescriptionAttr, function(value, key){
        if(isUndefinedOrNull(data))
          legalDescription[key] = null;
        else if ( _.isUndefined(data[value]))
          legalDescription[key] = null;
        else
          legalDescription[key] = data[value]; 
      });

      // Parse description comma separated.
      if(! _.isNull(legalDescription.description))
        legalDescription.parsedDescription = _.map(legalDescription.description.split(","), 
                                                   function(value){return value.trim();});
      else
        legalDescription.parsedDescription = [];

      return legalDescription;
          
    };

    var isUndefinedOrNull = function(val){ return _.isUndefined(val) || _.isNull(val)}

    // Public API
    return {
      Property: Property
    };
    
    
  });
