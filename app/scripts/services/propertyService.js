'use strict';

angular.module('propertySearchApp')
  .factory('propertyService', ['$log', 'utils', 'paConfiguration', 'esriGisService',function ($log, utils, paConfig, esriGisService) {

    var Property = function(data) {

      this.propertyInfo = {};
      this.additionalInfo = {};
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

      
      if(utils.isUndefinedOrNull(data)) {

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
        this.additionalInfo = buildAdditionalInfo({});

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
        this.additionalInfo = buildAdditionalInfo(data.Additionals);
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

    var buildAdditionalInfo = function(data){
	  var additionalInfo = {infoList:[]};
	  if(utils.isUndefinedOrNull(data))
	    return {};
	  _.each(data.AddtionalInfo, function(origAdditionalInfo){
	    var info = {key:origAdditionalInfo.InfoName.trim(), value:origAdditionalInfo.InfoValue};
		info.isUrl = (info.value.indexOf('http') > -1) ? true : false;
	    additionalInfo.infoList.push(info);
	  });
	  if(! _.isNull(data.HeaderMessage))
        additionalInfo.headers = _.map(data.HeaderMessage.split("|"), 
                                                   function(value){return value.trim();});
      else
        additionalInfo.headers = [];
	  if(! _.isNull(data.FooterMessage))
        additionalInfo.footers = _.map(data.FooterMessage.split("|"), 
                                                   function(value){return value.trim();});
      else
        additionalInfo.footers = [];
	  
	  return additionalInfo;
	};

	var buildAssessment = function(data){

      var assessment = {};
      if(utils.isUndefinedOrNull(data))
        return {};
      
      // Switch the AssessmentInfo array into a map with key the year.
      _.each(data.AssessmentInfos, function(origAssessmentInfo){
        var assessmentInfo = buildObject(origAssessmentInfo, assessmentInfoAttr);
        var data = {"assessmentInfo":assessmentInfo, message:[]};
        assessment[assessmentInfo.year] = data; 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! utils.isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(utils.isUndefinedOrNull(assessment[origMessage.Year]))
            assessment[origMessage.Year] = {assessmentInfo:[], message:[]};
          assessment[origMessage.Year].message = message; 
        }

      });

      return assessment;
    };


    var buildTaxable = function(data){

      var taxable = {};
      if(utils.isUndefinedOrNull(data))
        return {};
      
      // Switch the TaxableInfo array into a map with key the year.
      _.each(data.TaxableInfos, function(origTaxableInfo){
        var taxableInfo = buildObject(origTaxableInfo, taxableInfoAttr);
        var data = {"taxableInfo":taxableInfo, message:[]};
        taxable[taxableInfo.year] = data; 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! utils.isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(utils.isUndefinedOrNull(taxable[origMessage.Year]))
            taxable[origMessage.Year] = {taxableInfo:[], message:[]};
          taxable[origMessage.Year].message = message; 
        }

      });

      return taxable;
    };



    var buildBenefit= function(data){
      var benefit = {benefits:{}, messages:{}};
      if(utils.isUndefinedOrNull(data))
        return benefit;

      // Group by benefit description
      var benefits = {}
      var sequence = 0;
      _.each(data.BenefitInfos, function(originalBenefit){
        var mappedBenefit = buildObject(originalBenefit, benefitAttr);
        if(utils.isUndefinedOrNull(benefits[mappedBenefit.description])){
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
      if(utils.isUndefinedOrNull(data))
        return {};
      
      // Switch the Landlines array into a map with key the year.
      _.each(data.Landlines, function(origLandLine){
        var landLine = buildObject(origLandLine, landLineAttr);
        if(utils.isUndefinedOrNull(land[landLine.year]))
          land[landLine.year] = {landLines:[], message:[]};
        land[landLine.year].landLines.push(landLine); 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! utils.isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(utils.isUndefinedOrNull(land[origMessage.Year]))
            land[origMessage.Year] = {landLines:[], message:[]};
          land[origMessage.Year].message = message; 
        }

      });

      return land;
    };






    var buildBuilding = function(data){

      var building = {};
      if(utils.isUndefinedOrNull(data))
        return {};
      
      // Switch the Buildinglines array into a map with key the year.
      _.each(data.BuildingInfos, function(origBuildingInfo){
        var buildingInfo = buildObject(origBuildingInfo, buildingInfoAttr);
        if(utils.isUndefinedOrNull(building[buildingInfo.year]))
          building[buildingInfo.year] = {buildingsInfo:[], message:[], showSketch:false};
        // assign building information
        building[buildingInfo.year].buildingsInfo.push(buildingInfo);
        // assign sketck flag
        if(buildingInfo.traversePoints === 'Y') 
          building[buildingInfo.year].showSketch = true; 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! utils.isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(utils.isUndefinedOrNull(building[origMessage.Year]))
            building[origMessage.Year] = {buildingsInfo:[], message:[]};
          building[origMessage.Year].message = message; 
        }

      });

      return building;
    };




    var buildExtraFeature = function(data){

      var extraFeature = {};
      if(utils.isUndefinedOrNull(data))
        return {};
      
      // Switch the ExtraFeaturelines array into a map with key the year.
      _.each(data.ExtraFeatureInfos, function(origExtraFeatureInfo){
        var extraFeatureInfo = buildObject(origExtraFeatureInfo, extraFeatureAttr);
        if(utils.isUndefinedOrNull(extraFeature[extraFeatureInfo.year]))
          extraFeature[extraFeatureInfo.year] = {extraFeaturesInfo:[], message:[]};
        extraFeature[extraFeatureInfo.year].extraFeaturesInfo.push(extraFeatureInfo); 
      });

      // Add messages to each key year.
      _.each(data.Messages, function(origMessage){
        if(! utils.isUndefinedOrNull(origMessage.Message)){
          var message = _.map(origMessage.Message.split("|"), 
                              function(value){return value.trim();});
          // add the message array to the year.
          if(utils.isUndefinedOrNull(extraFeature[origMessage.Year]))
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
      if(!utils.isUndefinedOrNull(propertyInfo.folioNumber))
        propertyInfo.folioNumber = propertyInfo.folioNumber.replace(/-/g, "");
      else 
        propertyInfo.folioNumber = "";

      // remove dashes from parent folio number.
      if(!utils.isUndefinedOrNull(propertyInfo.parentFolio))
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
        if(utils.isUndefinedOrNull(data))
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
      if(utils.isUndefinedOrNull(data))
        return [];

      var result = [];

      _.each(data, function(originalValue){
        var newValue = {};            
        _.each(attributes, function(value, key){
          newValue[key] = originalValue[value]; 
        });
        //change field types if required
        _.each(fieldTypeChanger, function(value, key){
          if(!utils.isUndefinedOrNull(newValue[key])){
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
        if(utils.isUndefinedOrNull(data))
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
      if(utils.isUndefinedOrNull(data))
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

    var isPropertyValid = function(rawProperty){
      if(rawProperty.Completed === false)
        return false;
      else if (rawProperty.Completed === true && 
               _.isNull(rawProperty.PropertyInfo.FolioNumber))
        return false
      else
        return true;
    };


    /*
     * TODO: This function needs and can be broken up. 
     * additionalInfoFromGis: To build the additionalInfo data is made
     * out of 3 pieces, collected in different places, which takes as
     * a base the original additionalInfo coming from the PA.
     * 1. paConfiguration.additionalInfoLayers: Data that needs to come from a GIS polygon layer.
     * Intersection of the property of xy, with the layer, will give
     * the attributes (the data). Special cases
     *   a. Zoning: If first 2 digits of folio are 30 then query a
     *   layer, otherwise query some other layer.
     *   b. Zoning Land Use: To get the description, once you have the
     *   land use code you can query the description layer.
     * 2. paConfiguration.additionalInfoUrls: Data that needs a url 
     * which needs to be built dynamically with certain params, like
     * x, y and address
     * 3. Static data that it is already in the
     * property.additionalInfo.infoList. If the value is other than
     * COUNTYGIS, this is the flag that says to take the data as is.
     */
    var additionalInfoFromGIS = function($scope ,property){
      var x = property.location.x;
      var y = property.location.y;
      var folio = property.propertyInfo.folioNumber;

      // Zoning, choose between layers depending on start of folio 30.
      var folioMatch = /^30/

      var additionalInfoLayers = _.map(paConfig.additionalInfoLayers, function(data){
        var cloneData = _.clone(data);
        if(data.label === 'Zoning'){
          if(folioMatch.test(folio))
            cloneData.url = data.url + '3';              
          else
            cloneData.url = data.url + '4';              
        }
        return cloneData;
      });



      return esriGisService.getFeatureFromPointMultiLayerIntersection($scope, additionalInfoLayers, x, y).then(function(additionalInfoData){

       //create map  with key is label of layer and value is the attribute. 
       var additionalInfoGIS =  _.object(_.keys(additionalInfoData), 
                 _.map(_.values(additionalInfoData), function(value, index){
                   var attribute = additionalInfoLayers[index].attributes[0];
                   if(!utils.isUndefinedOrNull(value))
                     return value.attributes[attribute];
                   else
                     return "NONE";
                 }));
        $log.debug("propertyService:additionalInfoFromGIS", additionalInfoGIS);

        //Iterate over additionalInfo and map data into the model
        var additionalInfo = _.map(property.additionalInfo.infoList, function(info){
          var infoTmp = _.clone(info);
          if(additionalInfoGIS[infoTmp.key])
            infoTmp.value = additionalInfoGIS[infoTmp.key];
          if(paConfig.additionalInfoUrls[infoTmp.key]){
            var paramString = "";
            var additionalInfoUrl = paConfig.additionalInfoUrls[infoTmp.key];
            paramString = _.reduce(additionalInfoUrl.params, function(memo, paramValue, paramKey){
              var tmpParamValue = paramValue; 
              if(paramKey === 'x')
                tmpParamValue = property.location.x; 
              if(paramKey === 'y')
                tmpParamValue = property.location.y;
              if(paramKey === 'address')
                tmpParamValue = property.siteAddresses[0].address;  
              if(paramKey === 'paramvalue')
                tmpParamValue = property.siteAddresses[0].address;  
              return memo + paramKey + '=' + tmpParamValue + '&'; 
            }, '?');

            infoTmp.value = paConfig.additionalInfoUrls[infoTmp.key].url + paramString;
            infoTmp.isUrl = true;
          }

          return infoTmp;
        });
        $log.debug("propertyService:additionalInfoFromGIS:additionalInfo", additionalInfo);
        return additionalInfo;
      });


    };
    

    // Public API
    return {
      Property: Property,
      isPropertyValid: isPropertyValid,
      additionalInfoFromGIS: additionalInfoFromGIS
    };
    
    
  }]);
