'use strict';

angular.module('propertySearchApp')
  .factory('propertyService', function () {

    //Completed, Message
    var Property = function(data) {

      this.propertyInfo = {};
      this.mailingAddress = {};
      this.assessmentInfo = {};
      this.classifiedAgInfo = {};
      this.legalDescription = {};
      this.siteAddresses = [];
      this.salesInfo = [];
      this.ownersInfo = [];
      this.extraFeatures = [];
      this.landLines = [];
      this.buildingsInfo = [];
      this.benefitsInfo = [];
      this.district = null;
      this.geoParcel = null;
      this.rollYear1 = null;
      this.rollYear2 = null;
      this.rollYear3 = null;

      
      if(isUndefinedOrNull(data)) {

        this.district = null;
        this.geoParcel = null;
        this.rollYear1 = null;
        this.rollYear2 = null;
        this.rollYear3 = null;

        this.propertyInfo = buildPropertyInfo({});
        this.mailingAddress = buildMailingAddress({});
        this.assessmentInfo = buildAssessmentInfo({});
        this.classifiedAgInfo = buildClassifiedAgriculturalInfo({});
        this.legalDescription = buildLegalDescription({});
        this.siteAddresses = buildSiteAddresses([]);
        this.salesInfo = buildSalesInfo([]);
        this.ownersInfo = buildOwnersInfo([]);
        this.extraFeatures = buildExtraFeatures([]);
        this.landLines = buildLandLines([]);
        this.buildingsInfo = buildBuildingsInfo([]);
        this.benefitsInfo = buildBenefitsInfo([]);

      }
      else{

        this.district = data.District;
        this.geoParcel = data.GeoParcel;
        this.rollYear1 = data.RollYear1;
        this.rollYear2 = this.rollYear1 - 1;
        this.rollYear3 = this.rollYear1 - 2;

        this.propertyInfo = buildPropertyInfo(data.PropertyInfo);
        this.mailingAddress = buildMailingAddress(data.MailingAddress);
        this.assessmentInfo = buildAssessmentInfo(data.AssessmentInfo);
        this.classifiedAgInfo = buildClassifiedAgriculturalInfo(data.ClassifiedAgInfo);
        this.legalDescription = buildLegalDescription(data.LegalDescription);
        this.siteAddresses = buildSiteAddresses(data.SiteAddress);
        this.salesInfo = buildSalesInfo(data.SalesInfos);
        this.ownersInfo = buildOwnersInfo(data.OwnerInfos);
        this.extraFeatures = buildExtraFeatures(data.ExtraFeatures);
        this.landLines = buildLandLines(data.Landlines);
        this.buildingsInfo = buildBuildingsInfo(data.BuildingInfos);
        this.benefitsInfo = buildBenefitsInfo(data.BenefitInfos, this.rollYear1);

      }
    };

	var fieldTypeChanger = {
         dateOfSale:"Date"
    };
	
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
      zone:                "Zone",
      rollYear:          "RollYear"              
    };  

    var buildingInfoAttr = {
      actual:             "Actual",              
      actualArea:         "ActualArea",          
      adjustedBasePrice:  "AdjustedBasePrice",   
      buildingNo:         "BuildingNo",          
      depreciatedValue:   "DepreciatedValue",    
      effective:          "Effective",           
      effectiveArea:      "EffectiveArea",       
      grossArea:          "GrossArea",           
      heatedArea:         "HeatedArea",          
      percentComp:        "PercentComp",         
      percentageGood:     "PercentageGood",      
      replacementCostNew: "ReplacementCostNew",  
      segNo:              "SegNo",               
      totalAdjustedPoints:"TotalAdjustedPoints", 
      traversePoints:     "TraversePoints",
      rollYear:          "RollYear"       
    };
    

    var extraFeatureAttr = {
      actualYearBuilt:   "ActualYearBuilt",   
      adjustedUnitPrice: "AdjustedUnitPrice", 
      depreciatedValue:  "DepreciatedValue",  
      description:       "Description",       
      units:             "Units",             
      useCode:           "UseCode",
      rollYear:          "RollYear"
    };                  

    var ownerInfoAttr = {
      description:     "Description",  
      marriedFlag:     "MarriedFlag",  
      name:            "Name",         
      percentageOwn:   "PercentageOwn",
      role:            "Role",         
      tenancyCd:       "TenancyCd"    
    };                  

    var saleInfoAttr = {
      dateOfSale:           "DateOfSale",             
      docuementStamps:      "DocuementStamps",        
      officialRecordBook:   "OfficialRecordBook",     
      officialRecordPage:   "OfficialRecordPage",     
      qualifiedFlag:        "QualifiedFlag",          
      qualifiedSourceCode:  "QualifiedSourceCode",    
      reasonCode:           "ReasonCode",             
      reviewCoad:           "ReviewCoad",             
      salePrice:            "SalePrice",              
      salesId:              "SalesId",                
      salesInstrument:      "SalesInstrument",        
      vacantFlag:           "VacantFlag",             
      validCoad:            "ValidCoad",              
      verifyCoad:           "VerifyCoad",
      granteeName1:         "GranteeName1",
      granteeName2:         "GranteeName2",
      grantorName1:         "GrantorName1",
      grantorName2:         "GrantorName2"              
      //appraiserNote:        "AppraiserNote",            
      //etlRunId:             "Etlrun_id",              
      //grantee2:             "Grantee2",               
      //granteeName:          "GranteeName",     
      //grantor1:             "Grantor1",
      //grantor2:             "Grantor2",               
      //grantorName:          "GrantorName",            
      //lineNumber:           "LineNumber",             
      //modifTp:              "Modif_tp",               
      //note:                 "Note",                   
      //receivedDate:         "ReceivedDate",           
      //resetFlag:            "ResetFlag",              
      //strap:                "Strap",                  
    };                  

    var siteAddressAttr = {
      address:                   "Address",              
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

    var propertyInfoAttr = {
      bathroomCount:             "BathroomCount",                     
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
      yearBuilt:                 "YearBuilt",
      municipality:              "Municipality",
      showCurrentValuesFlag:     "ShowCurrentValuesFlag" 
    };

    var mailingAddressAttr = {
      address1: "Address1",
      address2: "Address2",
      city: "City",
      country: "Country",
      state: "State",
      zipCode: "ZipCode"};              

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


    var classifiedAgriculturalInfoAttr = { 
      acreage:"Acreage",
      calculatedValue:"CalculatedValue",
      landCode:"LandCode",
      landUse:"LandUse",
      unitPrice:"UnitPrice"
    };              


    var legalDescriptionAttr = {
      description: "Description",
      number:      "Number"
    };              

    var buildOwnersInfo = function(data){
      return buildArray(data, ownerInfoAttr);      
    };

    var buildSalesInfo = function(data){
      return buildArray(data, saleInfoAttr);      
    };

    var buildSiteAddresses = function(data){
      return buildArray(data, siteAddressAttr);      
    };

    var buildBenefitsInfo = function(data, baseYear){

      // data not given - return an empty array.
      if(isUndefinedOrNull(data))
        return [];      

      var groupedBenefits = {};
      var benefit = {};

      // group same type of benefits.
      _.each(data, function(originalBenefit){
        benefit = {};
        if(_.isUndefined(groupedBenefits[originalBenefit.Description])){
          benefit.description = originalBenefit.Description;
          benefit.type = originalBenefit.Type;
          benefit.data = {};
          benefit.data[originalBenefit.TaxYear] = originalBenefit.Value;

          groupedBenefits[originalBenefit.Description] = benefit;          
        }else{
          benefit = groupedBenefits[originalBenefit.Description];
          benefit.data[originalBenefit.TaxYear] = originalBenefit.Value;
        }

      });

      // pick from benefit.data the baseYear and two prior
      _.each(groupedBenefits, function(benefitType, key){
        benefitType.values = [];
        benefitType.values.push(benefitType.data[baseYear] || 0);
        benefitType.values.push(benefitType.data[baseYear-1] || 0);
        benefitType.values.push(benefitType.data[baseYear-2] || 0);
      });

      return _.values(groupedBenefits);
      
    };
    
    var buildExtraFeatures = function(data){
      return buildMapByYear(data, extraFeatureAttr);
    };

    var buildLandLines = function(data){
      return buildMapByYear(data, landLineAttr);
    };

    var buildBuildingsInfo = function(data){
      return buildMapByYear(data, buildingInfoAttr);
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

      var propertyInfo  =  buildObject(data, propertyInfoAttr);

      // convert showCurrentValuesFlag to a boolean value.
      if(propertyInfo.showCurrentValuesFlag === "Y")
        propertyInfo.showCurrentValuesFlag = true;
      else
        propertyInfo.showCurrentValuesFlag = false;

      return propertyInfo;

    };

    var buildMailingAddress = function(data){
      return buildObject(data, mailingAddressAttr);      
    };

    var buildAssessmentInfo = function(data){
      return buildObject(data, assessmentInfoAttr);      
    };

    var buildClassifiedAgriculturalInfo = function(data){
      return buildObject(data, classifiedAgriculturalInfoAttr);            
    };


    var buildLegalDescription = function(data){
      
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


    var buildArray = function(data, attributes){
      
      // data not given - return an empty array.
      if(isUndefinedOrNull(data))
        return [];

      var result = [];

      _.each(data, function(originalValue){
        var newValue = {};            
        _.each(attributes, function(value, key){
          newValue[key] = originalValue[value]; 
        });
        //change field types if required
        _.each(fieldTypeChanger, function(value, key){
          if(!isUndefinedOrNull(newValue[key])){
            if(value === "Date"){
              newValue[key] = new Date(newValue[key]);
            }
          }
        });
        result.push(newValue);
      });

      return result;
      
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

    var buildMapByYear = function(data, attributes){

      // data not given - return an empty array.
      if(isUndefinedOrNull(data))
        return {};
      
      var result = {};
      
      _.each(data, function(originalValue){
        var newValue = {};            
        _.each(attributes, function(value, key){
          newValue[key] = originalValue[value]; 
        });

        // put  value in he map with key rollYear.
        if(_.isUndefined(result[newValue.rollYear])){
          result[newValue.rollYear] = [];
          result[newValue.rollYear].push(newValue);
        }else{
          result[newValue.rollYear].push(newValue);
        }
      });

      return result;

    };


    var isUndefinedOrNull = function(val){ return _.isUndefined(val) || _.isNull(val)}

    // Public API
    return {
      Property: Property
    };
    
    
  });
