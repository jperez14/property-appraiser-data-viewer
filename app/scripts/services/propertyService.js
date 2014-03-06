'use strict';

angular.module('propertySearchApp')
  .factory('propertyService', function () {

    var Property = function(data) {

      this.propertyInfo = {};
      this.mailingAddress = {};
      this.classifiedAgInfo = {};
      this.legalDescription = {};
      this.assessment = {};
      this.taxable = {};
      this.land = {};
      this.building = {};
      this.extraFeature = {};
      this.siteAddresses = [];
      this.salesInfo = [];
      this.ownersInfo = [];
      this.benefit = {};
      this.district = null;
      this.geoParcel = null;
      this.rollYear1 = null;
      this.rollYear2 = null;
      this.rollYear3 = null;
      this.message = null;
      this.completed = null;

      
      if(isUndefinedOrNull(data)) {

        this.district = null;
        this.geoParcel = null;
        this.rollYear1 = null;
        this.rollYear2 = null;
        this.rollYear3 = null;
	this.message = null;
	this.completed = null;

        this.land = buildLand({})
        this.building = buildBuilding({})
        this.extraFeature = buildExtraFeature({});
        this.assessment = buildAssessment({});
        this.taxable = buildTaxable({});
        this.benefit = buildBenefit({});

        this.propertyInfo = buildPropertyInfo({});
        this.mailingAddress = buildMailingAddress({});
        this.classifiedAgInfo = buildClassifiedAgriculturalInfo({});
        this.legalDescription = buildLegalDescription({});
        this.siteAddresses = buildSiteAddresses([]);
        this.salesInfo = buildSalesInfo([]);
        this.ownersInfo = buildOwnersInfo([]);


      }
      else{

        this.district = data.District;
        this.geoParcel = data.GeoParcel;
        this.rollYear1 = data.RollYear1;
        this.rollYear2 = this.rollYear1 - 1;
        this.rollYear3 = this.rollYear1 - 2;
	this.message = data.Message;
	this.completed = data.Completed;

        this.land = buildLand(data.Land); 
        this.building = buildBuilding(data.Building); 
        this.extraFeature = buildExtraFeature(data.ExtraFeature);
        this.assessment = buildAssessment(data.Assessment);
        this.taxable = buildTaxable(data.Taxable);

        this.propertyInfo = buildPropertyInfo(data.PropertyInfo);
        this.mailingAddress = buildMailingAddress(data.MailingAddress);
        this.classifiedAgInfo = buildClassifiedAgriculturalInfo(data.ClassifiedAgInfo);
        this.legalDescription = buildLegalDescription(data.LegalDescription);
        this.siteAddresses = buildSiteAddresses(data.SiteAddress);
        this.salesInfo = buildSalesInfo(data.SalesInfos);
        this.ownersInfo = buildOwnersInfo(data.OwnerInfos);
        this.benefit = buildBenefit(data.Benefit);

      }
    };

    var fieldTypeChanger = {
      dateOfSale:"Date"
    };
    
    var benefitAttr = {
      description: "Description",
      message:     "Message",
      year:        "TaxYear",
      type:        "Type",
      value:       "Value",
      url:         "Url" 
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
      year:                "RollYear"              
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
      year:               "RollYear"
    };
    

    var extraFeatureAttr = {
      actualYearBuilt:   "ActualYearBuilt",   
      adjustedUnitPrice: "AdjustedUnitPrice", 
      depreciatedValue:  "DepreciatedValue",  
      description:       "Description",       
      units:             "Units",             
      useCode:           "UseCode",
      percentCondition:  "PercentCondition",
      message:           "Message",
      year:              "RollYear"
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
      documentStamps:       "DocumentStamps",        
      officialRecordBook:   "OfficialRecordBook",     
      officialRecordPage:   "OfficialRecordPage",     
      qualifiedFlag:        "QualifiedFlag",          
      qualifiedSourceCode:  "QualifiedSourceCode",    
      reasonCode:           "ReasonCode",             
      reviewCoad:           "ReviewCoad",             
      salePrice:            "SalePrice",              
      saleId:               "SaleId",                
      saleInstrument:       "SaleInstrument",        
      vacantFlag:           "VacantFlag",             
      validCoad:            "ValidCoad",              
      verifyCoad:           "VerifyCoad",
      granteeName1:         "GranteeName1",
      granteeName2:         "GranteeName2",
      grantorName1:         "GrantorName1",
      grantorName2:         "GrantorName2",
      qualificationDescription: "QualificationDescription"              

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
      buildingActualArea:        "BuildingActualArea",
      buildingBaseArea:          "BuildingBaseArea",
      buildingEffectiveArea:     "BuildingEffectiveArea",   
      buildingGrossArea:         "BuildingGrossArea",
      buildingHeatedArea:        "BuildingHeatedArea",
      DORCode:                   "DORCode",          
      DORDescription:            "DORDescription",          
      floorCount:                "FloorCount",              
      folioNumber:               "FolioNumber",             
      parentFolio:               "ParentFolio",
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
      address3: "Address3",
      city: "City",
      country: "Country",
      state: "State",
      zipCode: "ZipCode"
    };              

    var assessmentInfoAttr = {
      assessedValue:     "AssessedValue",     
      buildingOnlyValue: "BuildingOnlyValue", 
      extraFeatureValue: "ExtraFeatureValue", 
      landValue:         "LandValue",         
      message:           "Message",           
      totalValue:        "TotalValue",        
      year:              "Year"
    };

    var taxableInfoAttr = {
      cityExemptionValue:     "CityExemptionValue",    
      cityTaxableValue:       "CityTaxableValue",      
      countyExemptionValue:   "CountyExemptionValue",  
      countyTaxableValue:     "CountyTaxableValue",    
      message:                "Message",               
      regionalExemptionValue: "RegionalExemptionValue",
      regionalTaxableValue:   "RegionalTaxableValue",  
      schoolExemptionValue:   "SchoolExemptionValue",  
      schoolTaxableValue:     "SchoolTaxableValue",    
      year:                   "Year"                   
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
	  return _.filter(buildArray(data, siteAddressAttr), function(val) {
		return val.address.length > 0;
	  });
    };

    var buildAssessment = function(data){

      var assessment = {};
      if(isUndefinedOrNull(data))
        return {};
      
      // Switch the AssessmentInfo array into a map with key the year.
      _.each(data.AssessmentInfos, function(origAssessmentInfo){
        var assessmentInfo = buildObject(origAssessmentInfo, assessmentInfoAttr);
        var data = {"assessmentInfo":assessmentInfo, message:[]};
        assessment[assessmentInfo.year] = data; 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(isUndefinedOrNull(assessment[origMessage.Year]))
            assessment[origMessage.Year] = {assessmentInfo:[], message:[]};
          assessment[origMessage.Year].message = message; 
        }

      });

      return assessment;
    };


    var buildTaxable = function(data){

      var taxable = {};
      if(isUndefinedOrNull(data))
        return {};
      
      // Switch the TaxableInfo array into a map with key the year.
      _.each(data.TaxableInfos, function(origTaxableInfo){
        var taxableInfo = buildObject(origTaxableInfo, taxableInfoAttr);
        var data = {"taxableInfo":taxableInfo, message:[]};
        taxable[taxableInfo.year] = data; 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(isUndefinedOrNull(taxable[origMessage.Year]))
            taxable[origMessage.Year] = {taxableInfo:[], message:[]};
          taxable[origMessage.Year].message = message; 
        }

      });

      return taxable;
    };



    var buildBenefit= function(data){
      var benefit = {benefits:{}, messages:{}};
      if(isUndefinedOrNull(data))
        return benefit;

      // Group by benefit description
      var benefits = {}
      var sequence = 0;
      _.each(data.BenefitInfos, function(originalBenefit){
        var mappedBenefit = buildObject(originalBenefit, benefitAttr);
        if(isUndefinedOrNull(benefits[mappedBenefit.description])){
          sequence = sequence + 1;
          benefits[mappedBenefit.description] = {years:{},
                                                 type:mappedBenefit.type,
                                                 url:mappedBenefit.url,
                                                 description:mappedBenefit.description,
                                                 sequence:sequence
                                                };
        }
        
        benefits[mappedBenefit.description].years[mappedBenefit.year] = mappedBenefit;
      });

      // Extract an array of benefits
      benefit.benefits = _.values(benefits);

      _.each(data.Messages, function(origMessage){
        var message = _.map(origMessage.Message.split("|"), 
                            function(value){return value.trim();});
        benefit.messages[origMessage.Year] = message;
      });

      return benefit;

    };
    


    var buildLand = function(data){

      var land = {};
      if(isUndefinedOrNull(data))
        return {};
      
      // Switch the Landlines array into a map with key the year.
      _.each(data.Landlines, function(origLandLine){
        var landLine = buildObject(origLandLine, landLineAttr);
        if(isUndefinedOrNull(land[landLine.year]))
          land[landLine.year] = {landLines:[], message:[]};
        land[landLine.year].landLines.push(landLine); 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(isUndefinedOrNull(land[origMessage.Year]))
            land[origMessage.Year] = {landLines:[], message:[]};
          land[origMessage.Year].message = message; 
        }

      });

      return land;
    };






    var buildBuilding = function(data){

      var building = {};
      if(isUndefinedOrNull(data))
        return {};
      
      // Switch the Buildinglines array into a map with key the year.
      _.each(data.BuildingInfos, function(origBuildingInfo){
        var buildingInfo = buildObject(origBuildingInfo, buildingInfoAttr);
        if(isUndefinedOrNull(building[buildingInfo.year]))
          building[buildingInfo.year] = {buildingsInfo:[], message:[], showSketch:false};
        // assign building information
        building[buildingInfo.year].buildingsInfo.push(buildingInfo);
        // assign sketck flag
        if(buildingInfo.traversePoints === 'Y') 
          building[buildingInfo.year].showSketch = true; 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(isUndefinedOrNull(building[origMessage.Year]))
            building[origMessage.Year] = {buildingsInfo:[], message:[]};
          building[origMessage.Year].message = message; 
        }

      });

      return building;
    };




    var buildExtraFeature = function(data){

      var extraFeature = {};
      if(isUndefinedOrNull(data))
        return {};
      
      // Switch the ExtraFeaturelines array into a map with key the year.
      _.each(data.ExtraFeatureInfos, function(origExtraFeatureInfo){
        var extraFeatureInfo = buildObject(origExtraFeatureInfo, extraFeatureAttr);
        if(isUndefinedOrNull(extraFeature[extraFeatureInfo.year]))
          extraFeature[extraFeatureInfo.year] = {extraFeaturesInfo:[], message:[]};
        extraFeature[extraFeatureInfo.year].extraFeaturesInfo.push(extraFeatureInfo); 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(isUndefinedOrNull(extraFeature[origMessage.Year]))
            extraFeature[origMessage.Year] = {extraFeaturesInfo:[], message:[]};
          extraFeature[origMessage.Year].message = message; 
        }

      });

      return extraFeature;
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

      // remove dashes from folio number.
      if(!isUndefinedOrNull(propertyInfo.folioNumber))
        propertyInfo.folioNumber = propertyInfo.folioNumber.replace(/-/g, "");
      else 
        propertyInfo.folioNumber = "";

      // remove dashes from parent folio number.
      if(!isUndefinedOrNull(propertyInfo.parentFolio))
        propertyInfo.parentFolio = propertyInfo.parentFolio.replace(/-/g, "");
      else 
        propertyInfo.parentFolio = "";

      return propertyInfo;

    };

    var buildMailingAddress = function(data){
      return buildObject(data, mailingAddressAttr);      
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

      // Parse description piped (|) separated.
      if(! _.isNull(legalDescription.description))
        legalDescription.parsedDescription = _.map(legalDescription.description.split("|"), 
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
      // -1 should be converted to NULL.
      var result = {};      

      _.each(attributes, function(value, key){
        if(isUndefinedOrNull(data))
          result[key] = null;
        else if ( _.isUndefined(data[value]))
          result[key] = null;
        else if(data[value] === -1)
          result[key] = null;
        else if(_.isString(data[value]))
          result[key] = data[value].trim(); 
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

    var isPropertyValid = function(rawProperty){
      if(rawProperty.Completed === false)
        return false;
      else if (rawProperty.Completed === true && 
               _.isNull(rawProperty.PropertyInfo.FolioNumber))
        return false
      else
        return true;
    };


    // Public API
    return {
      Property: Property,
      isPropertyValid: isPropertyValid
    };
    
    
  });
