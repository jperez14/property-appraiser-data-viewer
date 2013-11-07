'use strict';

describe('Service: propertyService', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  // instantiate service
  var propertyService;
  beforeEach(inject(function (_propertyService_) {
    propertyService = _propertyService_;
  }));

  it('PropertyData null, maps to a full populated object',function(){
    var property = new propertyService.Property(null);
    expect(property.propertyInfo.bathroomCount).toBe(null);
    expect(property.siteAddresses).toEqual([]);
  });

  it('PropertyData undfined, maps to a full populated object',function(){
    var property = new propertyService.Property();
    expect(property.propertyInfo.bathroomCount).toBe(null);
    expect(property.siteAddresses).toEqual([]);
  });

  it('PropertyData empty object {}, maps to a full populated object',function(){
    var property = new propertyService.Property({});
    expect(property.propertyInfo.bathroomCount).toBe(null);
    expect(property.siteAddresses).toEqual([]);
  });

  // test propertyInfo
  it('PropertyInfoData not exists maps to propertyInfo populated with default values', function(){
    var property = new propertyService.Property({PropertyInfo:{}});
    expect(property.propertyInfo.bathroomCount).toBe(null);
  });

  it('PropertyInfoData null maps to propertyInfo populated with default values', function(){
    var property = new propertyService.Property({PropertyInfo:null});
    expect(property.propertyInfo.bathroomCount).toBe(null);
  });

  it('propertyInfo with a property value', function(){
    var property = new propertyService.Property({PropertyInfo:{BathroomCount:2}});
    expect(property.propertyInfo.bathroomCount).toBe(2);
  });


  it('map incoming PropertyInfo fields to our propertyInfo model fields',function(){
    var givenProperty = {PropertyInfo: {
      BathroomCount: 1,
      BedroomCount: 3,
      BuildingEffectiveArea: 1848,
      DORCodeCurrent: "0101",
      DORDescription: "RESIDENTIAL - SINGLE FAMILY : 1 UNIT",
      FloorCount: 1,
      FolioNumber: "01-3126-042-0370",
      HalfBathroomCount: 1,
      HxBaseYear: 0,
      LotSize: 13800,
      Neighborhood: 6310,
      NeighborhoodDescription: "SANTA CLARA ",
      PercentHomesteadCapped: 0,
      PlatBook: "6",
      PlatPage: "141",
      PrimaryZone: "5700",
      PrimaryZoneDescription: "DUPLEXES - GENERAL ",
      Status: "AC Active",
      Subdivision: "013126042",
      SubdivisionDescription: "ALLAPATTAH PARK ",
      UnitCount: 1,
      YearBuilt: 1949
    }};
    
    var expectedProperty = {propertyInfo: {
      bathroomCount: 1,
      bedroomCount: 3,
      buildingEffectiveArea: 1848,
      DORCodeCurrent: "0101",
      DORDescription: "RESIDENTIAL - SINGLE FAMILY : 1 UNIT",
      floorCount: 1,
      folioNumber: "01-3126-042-0370",
      halfBathroomCount: 1,
      hxBaseYear: 0,
      lotSize: 13800,
      neighborhood: 6310,
      neighborhoodDescription: "SANTA CLARA ",
      percentHomesteadCapped: 0,
      platBook: "6",
      platPage: "141",
      primaryZone: "5700",
      primaryZoneDescription: "DUPLEXES - GENERAL ",
      status: "AC Active",
      subdivision: "013126042",
      subdivisionDescription: "ALLAPATTAH PARK ",
      unitCount: 1,
      yearBuilt: 1949      
    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.propertyInfo).toEqual(expectedProperty.propertyInfo);

  });

  // test siteAddresses
  it('SiteAddressesData not exists maps to siteAddresses empty array', function(){
    var property = new propertyService.Property({SiteAddresses:[]});
    expect(property.siteAddresses).toEqual([]);
  });

  it('SiteAddressesData null maps to siteAddresses empty array', function(){
    var property = new propertyService.Property({SiteAddresses:null});
    expect(property.siteAddresses).toEqual([]);
  });


  it('map incoming SiteAddresses fields to our siteAddresses model fields',function(){
    var givenProperty = {SiteAddresses: [{
      Address: "0 1",
      BuildingNumber: 1,
      City: "",
      StreetName: "",
      StreetNumber: 0,
      StreetPrefix: " ",
      StreetSuffix: "",
      StreetSuffixDirection: " ",
      Unit: "",
      Zip: ""}]};

    var expectedProperty = {siteAddresses: [{
      address: "0 1",
      buildingNumber: 1,
      city: "",
      streetName: "",
      streetNumber: 0,
      streetPrefix: " ",
      streetSuffix: "",
      streetSuffixDirection: " ",
      unit: "",
      zip: ""}]};

    var property = new propertyService.Property(givenProperty);
    expect(property.siteAddresses).toEqual(expectedProperty.siteAddresses);

  });

  // test salesInfo
  it('SalesInfoData not exists maps to salesInfo empty array', function(){
    var property = new propertyService.Property({SalesInfo:[]});
    expect(property.salesInfo).toEqual([]);
  });

  it('SalesInfo null maps to salesInfo empty array', function(){
    var property = new propertyService.Property({SalesInfo:null});
    expect(property.salesInfo).toEqual([]);
  });

  it('map incoming SalesInfo fields to our salesInfo model fields',function(){
    var givenProperty = {SalesInfo: [{
      AppraiserNote: null,
      DateOfSale: "9/1/1982",
      DocuementStamps: 0,
      Etlrun_id: 0,
      Grantee2: null,
      GranteeName: null,
      Grantor2: null,
      GrantorName: null,
      LineNumber: 0,
      Modif_tp: null,
      Note: null,
      OfficialRecordBook: "11557",
      OfficialRecordPage: "0429",
      QualifiedFlag: null,
      QualifiedSourceCode: null,
      ReasonCode: "00",
      ReceivedDate: null,
      ResetFlag: "",
      ReviewCoad: null,
      SalePrice: 60000,
      SalesId: 3,
      SalesInstrument: null,
      Strap: null,
      VacantFlag: "",
      ValidCoad: null,
      VerifyCoad: null
    }]};

    var expectedProperty = {salesInfo: [{
      appraiserNote: null,
      dateOfSale: "9/1/1982",
      docuementStamps: 0,
      etlRunId: 0,
      grantee2: null,
      granteeName: null,
      grantor2: null,
      grantorName: null,
      lineNumber: 0,
      modifTp: null,
      note: null,
      officialRecordBook: "11557",
      officialRecordPage: "0429",
      qualifiedFlag: null,
      qualifiedSourceCode: null,
      reasonCode: "00",
      receivedDate: null,
      resetFlag: "",
      reviewCoad: null,
      salePrice: 60000,
      salesId: 3,
      salesInstrument: null,
      strap: null,
      vacantFlag: "",
      validCoad: null,
      verifyCoad: null
    }]};

    var property = new propertyService.Property(givenProperty);
    expect(property.salesInfo).toEqual(expectedProperty.salesInfo);

  });


  // test ownersInfo.
  it('OwnerInfosData not exists maps to ownersInfo empty array', function(){
    var property = new propertyService.Property({OwnerInfos:[]});
    expect(property.ownersInfo).toEqual([]);
  });

  it('OwnerInfosData null maps to ownersInfo empty array', function(){
    var property = new propertyService.Property({OwnerInfos:null});
    expect(property.ownersInfo).toEqual([]);
  });

  it('map incoming OwnersInfo fields to our ownersInfo model fields',function(){
    var givenProperty = {OwnerInfos: [{
      Description: "",
      MarriedFlag: "",
      Name: "Joan McTemp",
      PercentageOwn: 0,
      Role: null,
      TenancyCd: ""
    }]};

    var expectedProperty = {ownersInfo: [{
      description: "",
      marriedFlag: "",
      name: "Joan McTemp",
      percentageOwn: 0,
      role: null,
      tenancyCd: ""
    }]};

    var property = new propertyService.Property(givenProperty);
    expect(property.ownersInfo).toEqual(expectedProperty.ownersInfo);

  });

  // test extraFeatures
  it('ExtraFeaturesData not exists maps to ExtraFeatures empty array', function(){
    var property = new propertyService.Property({ExtraFeatures:[]});
    expect(property.extraFeatures).toEqual([]);
  });

  it('ExtraFeatures null maps to extraFeatures empty array', function(){
    var property = new propertyService.Property({ExtraFeatures:null});
    expect(property.extraFeatures).toEqual([]);
  });

  it('map incoming ExtraFeatures fields to our extraFeatures model fields',function(){
    var givenProperty = {ExtraFeatures: [{
      ActualYearBuilt: 1994,
      AdjustedUnitPrice: 8,
      DepreciatedValue: 672,
      Description: "Chain-link Fence 4-5 ft high",
      Units: 100,
      UseCode: "0034 "
    }]};

    var expectedProperty = {extraFeatures: [{
      actualYearBuilt: 1994,
      adjustedUnitPrice: 8,
      depreciatedValue: 672,
      description: "Chain-link Fence 4-5 ft high",
      units: 100,
      useCode: "0034 "
    }]};

    var property = new propertyService.Property(givenProperty);
    expect(property.extraFeatures).toEqual(expectedProperty.extraFeatures);

  });

  // test landLines
  it('LandlinesData not exists maps to landLines empty array', function(){
    var property = new propertyService.Property({Landlines:[]});
    expect(property.landLines).toEqual([]);
  });

  it('Landlines null maps to landLines empty array', function(){
    var property = new propertyService.Property({Landlines:null});
    expect(property.landLines).toEqual([]);
  });

  it('map incoming Landlines fields to our landLines model fields',function(){
    var givenProperty = {Landlines: [{
      AdjustedUnitPrice: "278.1540",
      CalculatedValue: "27815",
      Depth: 0,
      FrontFeet: 0,
      LandUse: "GENERAL",
      LandlineType: "C",
      MuniZone: "T3 O",
      PercentCondition: 1,
      TotalAdjustments: 1.0302,
      UnitType: "F ",
      Units: "100.0000",
      UseCode: "00 ",
      Zone: "5700"
    }]};

    var expectedProperty = {landLines: [{
      adjustedUnitPrice: "278.1540",
      calculatedValue: "27815",
      depth: 0,
      frontFeet: 0,
      landUse: "GENERAL",
      landlineType: "C",
      muniZone: "T3 O",
      percentCondition: 1,
      totalAdjustments: 1.0302,
      unitType: "F ",
      units: "100.0000",
      useCode: "00 ",
      zone: "5700"
    }]};

    var property = new propertyService.Property(givenProperty);
    expect(property.landLines).toEqual(expectedProperty.landLines);

  });


})
