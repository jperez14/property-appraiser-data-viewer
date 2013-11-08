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


  // test mailingAddress
  it('MailingAddressData not exists maps to mailingAddress populated with default values', function(){
    var property = new propertyService.Property({MailingAddress:{}});
    expect(property.mailingAddress.address1).toBe(null);
  });

  it('MailingAddressData null maps to mailingAddress populated with default values', function(){
    var property = new propertyService.Property({MailingAddress:null});
    expect(property.mailingAddress.address1).toBe(null);
  });

  it('mailingAddress with a property value', function(){
    var property = new propertyService.Property({MailingAddress:{Address1:"111 NW 1st"}});
    expect(property.mailingAddress.address1).toBe("111 NW 1st");
  });


  it('map incoming MailingAddress fields to our mailingAddress model fields',function(){
    var givenProperty = {MailingAddress: {
      Address1: "200 SW 27th Street",
      Address2: "",
      City: "Coral Gables",
      Country: "",
      State: "Florida",
      ZipCode: "33133"
    }};
    
    var expectedProperty = {mailingAddress: {
      address1: "200 SW 27th Street",
      address2: "",
      city: "Coral Gables",
      country: "",
      state: "Florida",
      zipCode: "33133"
    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.mailingAddress).toEqual(expectedProperty.mailingAddress);

  });

  // test assessmentInfo
  it('AssessmentInfoData not exists maps to assessmentInfo populated with default values', function(){
    var property = new propertyService.Property({AssessmentInfo:{}});
    expect(property.assessmentInfo.assessedValueCurrent).toBe(null);
  });

  it('AssessmentInfoData null maps to assessmentInfo populated with default values', function(){
    var property = new propertyService.Property({AssessmentInfo:null});
    expect(property.assessmentInfo.assessedValueCurrent).toBe(null);
  });

  it('assessmentInfo with a property value', function(){
    var property = new propertyService.Property({AssessmentInfo:{AssessedValueCurrent:2}});
    expect(property.assessmentInfo.assessedValueCurrent).toBe(2);
  });


  it('map incoming AssessmentInfo fields to our assessmentInfo model fields',function(){
    var givenProperty = {AssessmentInfo: {
      AssessedValueCurrent: 70067,
      AssessedValuePrior: 75395,
      AssessedValueTwoPrior: 84661,
      AssessmentYearCurrent: 2013,
      AssessmentYearPrior: 2012,
      AssessmentYearTwoPrior: 2011,
      BuildingValueCurrent: 42252,
      BuildingValuePrior: 46498,
      BuildingValueTwoPrior: 50664,
      CityExemptionValueCurrent: 0,
      CityExemptionValuePrior: 0,
      CityExemptionValueTwoPrior: 0,
      CityTaxableValueCurrent: 70067,
      CityTaxableValuePrior: 75395,
      CityTaxableValueTwoPrior: 84661,
      CountyExemptionValueCurrent: 0,
      CountyExemptionValuePrior: 0,
      CountyExemptionValueTwoPrior: 0,
      CountyTaxableValueCurrent: 70067,
      CountyTaxableValuePrior: 75395,
      CountyTaxableValueTwoPrior: 84661,
      LandValueCurrent: 27815,
      LandValuePrior: 28897,
      LandValueTwoPrior: 33997,
      RegionalExemptionValueCurrent: 0,
      RegionalExemptionValuePrior: 0,
      RegionalExemptionValueTwoPrior: 0,
      RegionalTaxableValueCurrent: 70067,
      RegionalTaxableValuePrior: 75395,
      RegionalTaxableValueTwoPrior: 84661,
      SchoolExemptionValueCurrent: 0,
      SchoolExemptionValuePrior: 0,
      SchoolExemptionValueTwoPrior: 0,
      SchoolTaxableValueCurrent: 70067,
      SchoolTaxableValuePrior: 75395,
      SchoolTaxableValueTwoPrior: 84661,
      TotalValueCurrent: 70067,
      TotalValuePrior: 75395,
      TotalValueTwoPrior: 84661
    }};
    
    var expectedProperty = {assessmentInfo: {
      assessedValueCurrent: 70067,
      assessedValuePrior: 75395,
      assessedValueTwoPrior: 84661,
      assessmentYearCurrent: 2013,
      assessmentYearPrior: 2012,
      assessmentYearTwoPrior: 2011,
      buildingValueCurrent: 42252,
      buildingValuePrior: 46498,
      buildingValueTwoPrior: 50664,
      cityExemptionValueCurrent: 0,
      cityExemptionValuePrior: 0,
      cityExemptionValueTwoPrior: 0,
      cityTaxableValueCurrent: 70067,
      cityTaxableValuePrior: 75395,
      cityTaxableValueTwoPrior: 84661,
      countyExemptionValueCurrent: 0,
      countyExemptionValuePrior: 0,
      countyExemptionValueTwoPrior: 0,
      countyTaxableValueCurrent: 70067,
      countyTaxableValuePrior: 75395,
      countyTaxableValueTwoPrior: 84661,
      landValueCurrent: 27815,
      landValuePrior: 28897,
      landValueTwoPrior: 33997,
      regionalExemptionValueCurrent: 0,
      regionalExemptionValuePrior: 0,
      regionalExemptionValueTwoPrior: 0,
      regionalTaxableValueCurrent: 70067,
      regionalTaxableValuePrior: 75395,
      regionalTaxableValueTwoPrior: 84661,
      schoolExemptionValueCurrent: 0,
      schoolExemptionValuePrior: 0,
      schoolExemptionValueTwoPrior: 0,
      schoolTaxableValueCurrent: 70067,
      schoolTaxableValuePrior: 75395,
      schoolTaxableValueTwoPrior: 84661,
      totalValueCurrent: 70067,
      totalValuePrior: 75395,
      totalValueTwoPrior: 84661

    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.assessmentInfo).toEqual(expectedProperty.assessmentInfo);

  });

  // test exemptionInfo
  it('ExemptionInfoData not exists maps to exemptionInfo populated with default values', function(){
    var property = new propertyService.Property({ExemptionInfo:{}});
    expect(property.exemptionInfo.agDifferentialValueCurrent).toBe(null);
  });

  it('ExemptionInfoData null maps to exemptionInfo populated with default values', function(){
    var property = new propertyService.Property({ExemptionInfo:null});
    expect(property.exemptionInfo.agDifferentialValueCurrent).toBe(null);
  });

  it('exemptionInfo with a property value', function(){
    var property = new propertyService.Property({ExemptionInfo:{AgDifferentialValueCurrent:2}});
    expect(property.exemptionInfo.agDifferentialValueCurrent).toBe(2);
  });


  it('map incoming ExemptionInfo fields to our exemptionInfo model fields',function(){
    var givenProperty = {ExemptionInfo: {
      AgDifferentialValueCurrent: 0,
      AgDifferentialValuePrior: 0,
      AgDifferentialValueTwoPrior: 0,
      AssessmentYearCurrent: 2013,
      AssessmentYearPrior: 2012,
      AssessmentYearTwoPrior: 2011,
      CountySecondHomesteadExValueCurrent: 0,
      CountySecondHomesteadExValuePrior: 0,
      CountySecondHomesteadExValueTwoPrior: 0,
      CountySeniorExValueCurrent: 0,
      CountySeniorExValuePrior: 0,
      CountySeniorExValueTwoPrior: 0,
      DisabledExValueCurrent: 0,
      DisabledExValuePrior: 0,
      DisabledExValueTwoPrior: 0,
      HomesteadExValueCurrent: 0,
      HomesteadExValuePrior: 0,
      HomesteadExValueTwoPrior: 0,
      VeteranExValueCurrent: 0,
      VeteranExValuePrior: 0,
      VeteranExValueTwoPrior: 0,
      WidowExValueCurrent: 0,
      WidowExValuePrior: 0,
      WidowExValueTwoPrior: 0
    }};
    
    var expectedProperty = {exemptionInfo: {
      agDifferentialValueCurrent: 0,
      agDifferentialValuePrior: 0,
      agDifferentialValueTwoPrior: 0,
      assessmentYearCurrent: 2013,
      assessmentYearPrior: 2012,
      assessmentYearTwoPrior: 2011,
      countySecondHomesteadExValueCurrent: 0,
      countySecondHomesteadExValuePrior: 0,
      countySecondHomesteadExValueTwoPrior: 0,
      countySeniorExValueCurrent: 0,
      countySeniorExValuePrior: 0,
      countySeniorExValueTwoPrior: 0,
      disabledExValueCurrent: 0,
      disabledExValuePrior: 0,
      disabledExValueTwoPrior: 0,
      homesteadExValueCurrent: 0,
      homesteadExValuePrior: 0,
      homesteadExValueTwoPrior: 0,
      veteranExValueCurrent: 0,
      veteranExValuePrior: 0,
      veteranExValueTwoPrior: 0,
      widowExValueCurrent: 0,
      widowExValuePrior: 0,
      widowExValueTwoPrior: 0
    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.exemptionInfo).toEqual(expectedProperty.exemptionInfo);

  });

  // test classifiedAgInfo
  it('ClassifiedAgInfoData not exists maps to classifiedAgInfo populated with default values', function(){
    var property = new propertyService.Property({ClassifiedAgInfo:{}});
    expect(property.classifiedAgInfo.acreage).toBe(null);
  });

  it('ClassifiedAgInfoData null maps to classifiedAgInfo populated with default values', function(){
    var property = new propertyService.Property({ClassifiedAgInfo:null});
    expect(property.classifiedAgInfo.acreage).toBe(null);
  });

  it('classifiedAgInfo with a property value', function(){
    var property = new propertyService.Property({ClassifiedAgInfo:{Acreage:2}});
    expect(property.classifiedAgInfo.acreage).toBe(2);
  });


  it('map incoming ClassifiedAgInfo fields to our classifiedAgInfo model fields',function(){
    var givenProperty = {ClassifiedAgInfo: {
      Acreage: 0,
      CalculatedValue: 0,
      LandCode: null,
      LandUse: null,
      UnitPrice: 0
    }};
    
    var expectedProperty = {classifiedAgInfo: {
      acreage: 0,
      calculatedValue: 0,
      landCode: null,
      landUse: null,
      unitPrice: 0
    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.classifiedAgInfo).toEqual(expectedProperty.classifiedAgInfo);

  });


  // test legalDescription
  it('LegalDescriptionData not exists maps to legalDescription populated with default values', function(){
    var property = new propertyService.Property({LegalDescription:{}});
    expect(property.legalDescription.description).toBe(null);
  });

  it('LegalDescriptionData null maps to legalDescription populated with default values', function(){
    var property = new propertyService.Property({LegalDescription:null});
    expect(property.legalDescription.description).toBe(null);
  });

  it('legalDescription with a property value', function(){
    var property = new propertyService.Property({LegalDescription:{Description:"Hello You, Hello Me"}});
    expect(property.legalDescription.description).toBe("Hello You, Hello Me");
  });


  it('map incoming LegalDescription fields to our legalDescription model fields',function(){
    var givenProperty = {LegalDescription: {
      Description: "Hello You, Hello Me",
      Number: null
    }};
    
    var expectedProperty = {legalDescription: {
      description: "Hello You, Hello Me",
      parsedDescription:["Hello You","Hello Me"],
      number: null
    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.legalDescription).toEqual(expectedProperty.legalDescription);

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
