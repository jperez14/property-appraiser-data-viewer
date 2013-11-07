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

      this.propertyInfo = buildPropertyInfo(data.PropertyInfo)

    };

    /**
     *
     **/
    var buildSiteAddresses = function(data){

      // No data return an empty array.
      if(isUndefinedOrNull(data))
        return [];

      var siteAddresses = [];
      
      
    };
    

    /**
     * it builds the propertyInfo. 
     * If data is undefined or null it returns an empty object {}. 
     * If data is empty object {}, return all fields with value null.
     * When the properties on data are undefined 
     * (the property may not be there) it makes the
     * propertyInfo.someproperty = null; 
     **/
    var buildPropertyInfo = function(data){

      // No data return an empty object
      if(isUndefinedOrNull(data))
        return {};
        
      // map fields, and when field does not exists
      // assign it to null.
      var propertyInfo = {};      
      
      if(typeof data.BathroomCount === "undefined")
        propertyInfo.bathroomCount = null;
      else
        propertyInfo.bathroomCount = data.BathroomCount;        

      if(typeof data.BedroomCount === "undefined")
        propertyInfo.bedroomCount = null;
      else
        propertyInfo.bedroomCount = data.BedroomCount;

      if(typeof data.BuildingEffectiveArea === "undefined")
        propertyInfo.buildingEffectiveArea = null;
      else
        propertyInfo.buildingEffectiveArea = data.BuildingEffectiveArea;

      if(typeof data.DORCodeCurrent === "undefined")
        propertyInfo.DORCodeCurrent = null;
      else
        propertyInfo.DORCodeCurrent = data.DORCodeCurrent;

      if(typeof data.DORDescription === "undefined")
        propertyInfo.DORDescription = null;
      else
        propertyInfo.DORDescription = data.DORDescription;

      if(typeof data.FloorCount === "undefined")
        propertyInfo.floorCount = null;
      else
        propertyInfo.floorCount = data.FloorCount;

      if(typeof data.FolioNumber === "undefined")
        propertyInfo.folioNumber = null;
      else
        propertyInfo.folioNumber = data.FolioNumber;

      if(typeof data.HalfBathroomCount === "undefined")
        propertyInfo.halfBathroomCount = null;
      else
        propertyInfo.halfBathroomCount = data.HalfBathroomCount;

      if(typeof data.HxBaseYear === "undefined")
        propertyInfo.hxBaseYear = null;
      else
        propertyInfo.hxBaseYear = data.HxBaseYear;

      if(typeof data.LotSize === "undefined")
        propertyInfo.lotSize = null;
      else
        propertyInfo.lotSize = data.LotSize;

      if(typeof data.Neighborhood === "undefined")
        propertyInfo.neighborhood = null;
      else
        propertyInfo.neighborhood = data.Neighborhood;

      if(typeof data.NeighborhoodDescription === "undefined")
        propertyInfo.neighborhoodDescription = null;
      else
        propertyInfo.neighborhoodDescription = data.NeighborhoodDescription;

      if(typeof data.PercentHomesteadCapped === "undefined")
        propertyInfo.percentHomesteadCapped = null;
      else
        propertyInfo.percentHomesteadCapped = data.PercentHomesteadCapped;

      if(typeof data.PlatBook === "undefined")
        propertyInfo.platBook = null;
      else
        propertyInfo.platBook = data.PlatBook;

      if(typeof data.PlatPage === "undefined")
        propertyInfo.platPage = null;
      else
        propertyInfo.platPage = data.PlatPage;

      if(typeof data.PrimaryZone === "undefined")
        propertyInfo.primaryZone = null;
      else
        propertyInfo.primaryZone = data.PrimaryZone;

      if(typeof data.PrimaryZoneDescription === "undefined")
        propertyInfo.primaryZoneDescription = null;
      else
        propertyInfo.primaryZoneDescription = data.PrimaryZoneDescription;

      if(typeof data.Status === "undefined")
        propertyInfo.status = null;
      else
        propertyInfo.status = data.Status;

      if(typeof data.Subdivision === "undefined")
        propertyInfo.subdivision = null;
      else
        propertyInfo.subdivision = data.Subdivision;

      if(typeof data.SubdivisionDescription === "undefined")
        propertyInfo.subdivisionDescription = null;
      else
        propertyInfo.subdivisionDescription = data.SubdivisionDescription;

      if(typeof data.UnitCount === "undefined")
        propertyInfo.unitCount = null;
      else
        propertyInfo.unitCount = data.UnitCount;

      if(typeof data.YearBuilt === "undefined")
        propertyInfo.yearBuilt = null;
      else
        propertyInfo.yearBuilt = data.YearBuilt;                  
      
      return propertyInfo
          
    };

    var isUndefinedOrNull = function(val){ return angular.isUndefined(val) || val === null}

    // Public API
    return {
      Property: Property
    };
    
    
  });
