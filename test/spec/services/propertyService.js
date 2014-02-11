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

  it('propertyInfo with ShowCurrentValuesFlag Y will translate to true', function(){
    var property = new propertyService.Property({PropertyInfo:{ShowCurrentValuesFlag:'Y'}});
    expect(property.propertyInfo.showCurrentValuesFlag).toBe(true);
  });

  it('propertyInfo with ShowCurrentValuesFlag N will translate to false', function(){
    var property = new propertyService.Property({PropertyInfo:{ShowCurrentValuesFlag:'N'}});
    expect(property.propertyInfo.showCurrentValuesFlag).toBe(false);

    var property = new propertyService.Property({PropertyInfo:{ShowCurrentValuesFlag:null}});
    expect(property.propertyInfo.showCurrentValuesFlag).toBe(false);

    var property = new propertyService.Property({PropertyInfo:{ShowCurrentValuesFlag:""}});
    expect(property.propertyInfo.showCurrentValuesFlag).toBe(false);
  });

  it('map incoming PropertyInfo fields to our propertyInfo model fields',function(){
    var givenProperty = {PropertyInfo: {
      BathroomCount: 1,
      BedroomCount: 3,
      BuildingActualArea: 3443,
      BuildingBaseArea: 0,
      BuildingEffectiveArea: 1848,
      BuildingGrossArea: 2772,
      BuildingHeatedArea: 2333,
      DORCode: "0101",
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
      YearBuilt: 1949,
      Municipality: "Miami",
      ShowCurrentValuesFlag: "Y"
    }};
    
    var expectedProperty = {propertyInfo: {
      bathroomCount: 1,
      bedroomCount: 3,
      buildingActualArea: 3443,
      buildingBaseArea: 0,
      buildingEffectiveArea: 1848,
      buildingGrossArea: 2772,
      buildingHeatedArea: 2333,
      DORCode: "0101",
      DORDescription: "RESIDENTIAL - SINGLE FAMILY : 1 UNIT",
      floorCount: 1,
      folioNumber: "01-3126-042-0370",
      halfBathroomCount: 1,
      hxBaseYear: 0,
      lotSize: 13800,
      neighborhood: 6310,
      neighborhoodDescription: "SANTA CLARA",
      percentHomesteadCapped: 0,
      platBook: "6",
      platPage: "141",
      primaryZone: "5700",
      primaryZoneDescription: "DUPLEXES - GENERAL",
      status: "AC Active",
      subdivision: "013126042",
      subdivisionDescription: "ALLAPATTAH PARK",
      unitCount: 1,
      yearBuilt: 1949,
      municipality: "Miami",
      showCurrentValuesFlag: true
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
      Address3: "",
      City: "Coral Gables",
      Country: "",
      State: "Florida",
      ZipCode: "33133"
    }};
    
    var expectedProperty = {mailingAddress: {
      address1: "200 SW 27th Street",
      address2: "",
      address3: "",
      city: "Coral Gables",
      country: "",
      state: "Florida",
      zipCode: "33133"
    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.mailingAddress).toEqual(expectedProperty.mailingAddress);

  });

  // test assessment
  it('Assessment empty object maps to assessment object with empty values', function(){
    var property = new propertyService.Property({Assessment:{}});
    expect(property.assessment).toEqual({});
  });

  it('Assessment null maps to assessment object with empty values', function(){
    var property = new propertyService.Property({Assessment:null});
    expect(property.assessment).toEqual({});
  });

  it('Assessment does not exist maps to assessment object with empty values', function(){
    var property = new propertyService.Property({});
    expect(property.assessment).toEqual({});
  });

  it('map incoming AssessmentInfo fields to our assessmentInfo model fields',function(){
    var givenProperty = {Assessment: {
      AssessmentInfos: [
        {
          AssessedValue: 84661,
          BuildingOnlyValue: 49896,
          ExtraFeatureValue: 768,
          LandValue: 33997,
          Message: null,
          TotalValue: 84661,
          Year: 2011
        },        {
          AssessedValue: 84662,
          BuildingOnlyValue: 49892,
          ExtraFeatureValue: 762,
          LandValue: 33992,
          Message: null,
          TotalValue: 84662,
          Year: 2012
        }],
      Messages: [
        {
          Message: "This is test Message1|This is test Message2|This is test Message3",
          Year: 2011
        },        {
          Message: "This is test Message1|This is test Message2|This is test Message3",
          Year: 2012
        }]
    }};
    
    var expectedProperty = {assessment:{2011:{assessmentInfo:{
      assessedValue: 84661,
      buildingOnlyValue: 49896,
      extraFeatureValue: 768,
      landValue: 33997,
      message: null,
      totalValue: 84661,
      year: 2011
    }, message: ["This is test Message1","This is test Message2","This is test Message3"]},
                                        2012:{assessmentInfo:{
                                          assessedValue: 84662,
                                          buildingOnlyValue: 49892,
                                          extraFeatureValue: 762,
                                          landValue: 33992,
                                          message: null,
                                          totalValue: 84662,
                                          year: 2012
                                        }, message: ["This is test Message1","This is test Message2","This is test Message3"]}
                                       }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.assessment).toEqual(expectedProperty.assessment);

  });


  // test taxable
  it('Taxable empty object maps to taxable object with empty values', function(){
    var property = new propertyService.Property({Taxable:{}});
    expect(property.taxable).toEqual({});
  });

  it('Taxable null maps to taxable object with empty values', function(){
    var property = new propertyService.Property({Taxable:null});
    expect(property.taxable).toEqual({});
  });

  it('Taxable does not exist maps to taxable object with empty values', function(){
    var property = new propertyService.Property({});
    expect(property.taxable).toEqual({});
  });

  it('map incoming TaxableInfo fields to our taxableInfo model fields',function(){
    var givenProperty = {Taxable: {
      TaxableInfos: [
        {
          CityExemptionValue: 0,
          CityTaxableValue: 84661,
          CountyExemptionValue: 0,
          CountyTaxableValue: 84661,
          Message: null,
          RegionalExemptionValue: 0,
          RegionalTaxableValue: 84661,
          SchoolExemptionValue: 0,
          SchoolTaxableValue: 84661,
          Year: 2011
        },        {
          CityExemptionValue: 2,
          CityTaxableValue: 84662,
          CountyExemptionValue: 2,
          CountyTaxableValue: 84662,
          Message: null,
          RegionalExemptionValue: 2,
          RegionalTaxableValue: 84662,
          SchoolExemptionValue: 2,
          SchoolTaxableValue: 84662,
          Year: 2012
        }],
      Messages: [
        {
          Message: "This is test Message1|This is test Message2|This is test Message3",
          Year: 2011
        },        {
          Message: "This is test Message1|This is test Message2|This is test Message3",
          Year: 2012
        }]
    }};
    
    var expectedProperty = {taxable:{2011:{taxableInfo:{
      cityExemptionValue: 0,
      cityTaxableValue: 84661,
      countyExemptionValue: 0,
      countyTaxableValue: 84661,
      message: null,
      regionalExemptionValue: 0,
      regionalTaxableValue: 84661,
      schoolExemptionValue: 0,
      schoolTaxableValue: 84661,
      year: 2011
    }, message: ["This is test Message1","This is test Message2","This is test Message3"]},
                                     2012:{taxableInfo:{
                                       cityExemptionValue: 2,
                                       cityTaxableValue: 84662,
                                       countyExemptionValue: 2,
                                       countyTaxableValue: 84662,
                                       message: null,
                                       regionalExemptionValue: 2,
                                       regionalTaxableValue: 84662,
                                       schoolExemptionValue: 2,
                                       schoolTaxableValue: 84662,
                                       year: 2012
                                     }, message: ["This is test Message1","This is test Message2","This is test Message3"]}
                                    }};
    
    var property = new propertyService.Property(givenProperty);
    expect(property.taxable).toEqual(expectedProperty.taxable);

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
    var property = new propertyService.Property({LegalDescription:{Description:"Hello You |  Hello Me"}});
    expect(property.legalDescription.parsedDescription).toEqual(["Hello You","Hello Me"]);
  });


  it('map incoming LegalDescription fields to our legalDescription model fields',function(){
    var givenProperty = {LegalDescription: {
      Description: "Hello You | Hello Me",
      Number: null
    }};
    
    var expectedProperty = {legalDescription: {
      description: "Hello You | Hello Me",
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
    var givenProperty = {SiteAddress: [{
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
  it('SalesInfosData not exists maps to salesInfo empty array', function(){
    var property = new propertyService.Property({SalesInfos:[]});
    expect(property.salesInfo).toEqual([]);
  });

  it('SalesInfos null maps to salesInfo empty array', function(){
    var property = new propertyService.Property({SalesInfos:null});
    expect(property.salesInfo).toEqual([]);
  });

  it('map incoming SalesInfos fields to our salesInfo model fields',function(){
    var givenProperty = {SalesInfos: [{
      DateOfSale: "9/1/1982",
      DocumentStamps: 0,
      OfficialRecordBook: "11557",
      OfficialRecordPage: "0429",
      QualifiedFlag: null,
      QualifiedSourceCode: null,
      ReasonCode: "00",
      ReviewCoad: null,
      SalePrice: 60000,
      SaleId: 3,
      SaleInstrument: null,
      VacantFlag: "",
      ValidCoad: null,
      VerifyCoad: null,
      GranteeName1: "Joe",
      GranteeName2: "Peter",
      GrantorName1: "Frank",
      GrantorName2: "Jane",
      QualificationDescription: "2008 and prior year"



    }]};

    var expectedProperty = {salesInfo: [{
      dateOfSale: new Date("9/1/1982"),
      documentStamps: 0,
      officialRecordBook: "11557",
      officialRecordPage: "0429",
      qualifiedFlag: null,
      qualifiedSourceCode: null,
      reasonCode: "00",
      reviewCoad: null,
      salePrice: 60000,
      saleId: 3,
      saleInstrument: null,
      vacantFlag: "",
      validCoad: null,
      verifyCoad: null,
      granteeName1: "Joe",
      granteeName2: "Peter",
      grantorName1: "Frank",
      grantorName2: "Jane",
      qualificationDescription: "2008 and prior year"
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

  // test extraFeature
  it('ExtraFeature empty object maps to land object with empty values', function(){
    var property = new propertyService.Property({ExtraFeature:{}});
    expect(property.extraFeature).toEqual({});
  });

  it('ExtraFeature null maps to land object with empty values', function(){
    var property = new propertyService.Property({ExtraFeature:null});
    expect(property.extraFeature).toEqual({});
  });

  it('ExtraFeature does not exist maps to land object with empty values', function(){
    var property = new propertyService.Property({});
    expect(property.extraFeature).toEqual({});
  });

  it('map incoming ExtraFeatures fields to our extraFeatures model fields',function(){
    var givenProperty = {ExtraFeature:{
      ExtraFeatureInfos: [
        {
          ActualYearBuilt: 1994,
          AdjustedUnitPrice: 7.68,
          DepreciatedValue: 768,
          Description: "Chain-link Fence 4-5 ft high",
          Message: null,
          PercentCondition: 96,
          RollYear: 2011,
          Units: 100,
          UseCode: "0034"
        }],
      Messages:[{
        Message:"My Message",
        Year:2011
      }]}};
    

    var expectedProperty = {extraFeature:{2011:{
      extraFeaturesInfo: [
        {
          actualYearBuilt: 1994,
          adjustedUnitPrice: 7.68,
          depreciatedValue: 768,
          description: "Chain-link Fence 4-5 ft high",
          message: null,
          percentCondition: 96,
          year: 2011,
          units: 100,
          useCode: "0034"
        }],message:["My Message"]
    }}};
    

    var property = new propertyService.Property(givenProperty);
    expect(property.extraFeature).toEqual(expectedProperty.extraFeature);

  });

  //  it('map incoming ExtraFeatures fields to our extraFeatures model fields with several years',function(){
  //    var givenProperty = {ExtraFeature:{ExtraFeatureInfos: [{
  //      ActualYearBuilt: 1994,
  //      AdjustedUnitPrice: 8,
  //      DepreciatedValue: 672,
  //      Description: "Chain-link Fence 4-5 ft high",
  //      Units: 100,
  //      UseCode: "0034 ",
  //      RollYear: 2013
  //    },{
  //      ActualYearBuilt: 1997,
  //      AdjustedUnitPrice: 5,
  //      DepreciatedValue: 6,
  //      Description: "Another Fence",
  //      Units: 9,
  //      UseCode: "0033 ",
  //      RollYear: 2012
  //    },{
  //      ActualYearBuilt: 1985,
  //      AdjustedUnitPrice: 8,
  //      DepreciatedValue: 500,
  //      Description: "Ugly Fence",
  //      Units: 101,
  //      UseCode: "0034 ",
  //      RollYear: 2013
  //    }]}};
  //    
  //
  //    var expectedProperty = {extraFeature:{extraFeatures:{2013:[{
  //      actualYearBuilt: 1994,
  //      adjustedUnitPrice: 8,
  //      depreciatedValue: 672,
  //      description: "Chain-link Fence 4-5 ft high",
  //      units: 100,
  //      useCode: "0034 ",
  //      rollYear: 2013
  //    },{
  //      actualYearBuilt: 1985,
  //      adjustedUnitPrice: 8,
  //      depreciatedValue: 500,
  //      description: "Ugly Fence",
  //      units: 101,
  //      useCode: "0034 ",
  //      rollYear: 2013
  //    }],2012:[{
  //      actualYearBuilt: 1997,
  //      adjustedUnitPrice: 5,
  //      depreciatedValue: 6,
  //      description: "Another Fence",
  //      units: 9,
  //      useCode: "0033 ",
  //      rollYear: 2012
  //    }]}}};
  //    
  //
  //    var property = new propertyService.Property(givenProperty);
  //    expect(property.extraFeature).toEqual(expectedProperty.extraFeature);
  //
  //  });

  // test land
  it('Land empty object maps to land object with empty values', function(){
    var property = new propertyService.Property({Land:{}});
    expect(property.land).toEqual({});
  });

  it('Land null maps to land object with empty values', function(){
    var property = new propertyService.Property({Land:null});
    expect(property.land).toEqual({});
  });

  it('Land does not exist maps to land object with empty values', function(){
    var property = new propertyService.Property({});
    expect(property.land).toEqual({});
  });

  it('map incoming Landlines fields to our landLines model fields',function(){
    var givenProperty = {Land:{Landlines: [{
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
      Zone: "5700",
      RollYear: 2013
    }],
                               Messages: [
                                 {
                                   Message: "This is test Message1|This is test Message2|This is test Message3",
                                   Year: 2013
                                 }]}};

    var expectedProperty = {land:{2013:{landLines:[{
      adjustedUnitPrice: "278.1540",
      calculatedValue: "27815",
      depth: 0,
      frontFeet: 0,
      landUse: "GENERAL",
      landlineType: "C",
      muniZone: "T3 O",
      percentCondition: 1,
      totalAdjustments: 1.0302,
      unitType: "F",
      units: "100.0000",
      useCode: "00",
      zone: "5700",
      year: 2013
    }],message:["This is test Message1","This is test Message2","This is test Message3"]}
                                 }};
    

    var property = new propertyService.Property(givenProperty);
    expect(property.land).toEqual(expectedProperty.land);

  });

  //  it('map incoming Landlines fields to our landLines model fields with several years.',function(){
  //    var givenProperty = {Land:{Landlines: [{
  //      AdjustedUnitPrice: "278.1540",
  //      CalculatedValue: "27815",
  //      Depth: 0,
  //      FrontFeet: 0,
  //      LandUse: "GENERAL",
  //      LandlineType: "C",
  //      MuniZone: "T3 O",
  //      PercentCondition: 1,
  //      TotalAdjustments: 1.0302,
  //      UnitType: "F ",
  //      Units: "100.0000",
  //      UseCode: "00 ",
  //      Zone: "5700",
  //      RollYear: 2013
  //    },{
  //      AdjustedUnitPrice: "278.1546",
  //      CalculatedValue: "26816",
  //      Depth: 0,
  //      FrontFeet: 0,
  //      LandUse: "GENERAL",
  //      LandlineType: "C",
  //      MuniZone: "T3 O",
  //      PercentCondition: 1,
  //      TotalAdjustments: 1.0306,
  //      UnitType: "F ",
  //      Units: "100.0000",
  //      UseCode: "00 ",
  //      Zone: "5700",
  //      RollYear: 2012
  //    },{
  //      AdjustedUnitPrice: "278.1547",
  //      CalculatedValue: "27817",
  //      Depth: 0,
  //      FrontFeet: 0,
  //      LandUse: "GENERAL",
  //      LandlineType: "C",
  //      MuniZone: "T3 O",
  //      PercentCondition: 1,
  //      TotalAdjustments: 1.0307,
  //      UnitType: "F ",
  //      Units: "100.0000",
  //      UseCode: "00 ",
  //      Zone: "5700",
  //      RollYear: 2013
  //    }]}};
  //    
  //
  //    var expectedProperty = {land:};
  //    
  //
  //    var property = new propertyService.Property(givenProperty);
  //    expect(property.land).toEqual(expectedProperty.land);
  //
  //  });



  //Benefit
  it('Benefit not exists maps to benefit empty object', function(){
    var property = new propertyService.Property({Benefit:{}});
    expect(property.benefit).toEqual({benefits:{}, messages:{}});
  });

  it('Benefit null maps to benefit empty object', function(){
    var property = new propertyService.Property({Benefit:null});
    expect(property.benefit).toEqual({benefits:{}, messages:{}});
  });

  it('map incoming Benefits fields to our benefitsInfo model fields',function(){
    var givenProperty = {Benefit:{
      BenefitInfos: [
        {
          Description: "Non-Homestead Cap",
          Message: null,
          TaxYear: 2011,
          Type: "Assessment Reduction",
          Url: "http://www.miamidade.gov/pa/property_value_cap.asp",
          Value: 3344
        },
        {
          Description: "Non-Homestead Cap",
          Message: null,
          TaxYear: 2013,
          Type: "Assessment Reduction",
          Url: "http://www.miamidade.gov/pa/property_value_cap.asp",
          Value: 3345
        },
        {
          Description: "Save Our Homes",
          Message: null,
          TaxYear: 2011,
          Type: "Assessment Reduction",
          Url: "http://www.miamidade.gov/pa/amendment_10.asp",
          Value: 89595
        }],
      Messages: []
    }};
    

    var expectedProperty = {benefit:{
      benefits:[{type:"Assessment Reduction",
                 description:"Non-Homestead Cap",
                 sequence:1,
                 url:"http://www.miamidade.gov/pa/property_value_cap.asp",
                 years:{2011:{
                   description: "Non-Homestead Cap",
                   message: null,
                   year: 2011,
                   type: "Assessment Reduction",
                   url: "http://www.miamidade.gov/pa/property_value_cap.asp",
                   value: 3344
                 },2013:{description: "Non-Homestead Cap",
                         message: null,
                         year: 2013,
                         type: "Assessment Reduction",
                         url: "http://www.miamidade.gov/pa/property_value_cap.asp",
                         value: 3345}}}, 
                {type:"Assessment Reduction",
                 description:"Save Our Homes",
                 sequence:2,
                 url: "http://www.miamidade.gov/pa/amendment_10.asp",
                 years:{2011:{description: "Save Our Homes",
                              message: null,
                              year: 2011,
                              type: "Assessment Reduction",
                              url: "http://www.miamidade.gov/pa/amendment_10.asp",
                              value: 89595}}}],
      messages:{}
    }};
    

    var property = new propertyService.Property(givenProperty);
    expect(property.benefit).toEqual(expectedProperty.benefit);

  });



})
