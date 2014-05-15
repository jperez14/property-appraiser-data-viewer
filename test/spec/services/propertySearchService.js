'use strict';

describe('Service: propertySearchService', function () {


  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expect) {
        return angular.equals(expect, this.actual);
      }
    });
  });

  // load the service's module
  beforeEach(module('propertySearchApp'));

  // instantiate service
  var propertySearchService;
  var $httpBackend;
  var $rootScope;
  var $q;
  var mockProperty = {
    AssessmentInfo: {AssessedValueCurrent: 70067},
    ClassifiedAgInfo: {Acreage: 0},
    Completed: true,
    District: 1,
    ExemptionInfo: {AgDifferentialValueCurrent: 0},
    PropertyInfo: {FolioNumber: "01-3126-042-0370"},
    LegalDescription: {Description: "A|B|C"}
  };

  var mockProperty1 = {
    AssessmentInfo: {AssessedValueCurrent: 70067},
    ClassifiedAgInfo: {Acreage: 0},
    Completed: true,
    District: 1,
    ExemptionInfo: {AgDifferentialValueCurrent: 0},
    PropertyInfo: {FolioNumber: "01-3126-042-0371"},
    LegalDescription: {Description: "A|B|C"}
  };

  var mockProperty2 = {
    AssessmentInfo: {AssessedValueCurrent: 70067},
    ClassifiedAgInfo: {Acreage: 0},
    Completed: true,
    District: 1,
    ExemptionInfo: {AgDifferentialValueCurrent: 0},
    PropertyInfo: {FolioNumber: "01-3126-042-0372"},
    LegalDescription: {Description: "A|B|C"}
  };

  var mockFolioDoesNotExistResponse = {
    Completed:true,
    Message:"Folio does not exist",
    PropertyInfo:{FolioNumber: null}
  };
  
  
  var mockCandidatesList = {
    candidates : [{
      firstOwner : "Barack Obama",
      secondOwner: "George Bush",
      thirdOwner: null,
      folio: "0123456789012",
      siteAddress:"10 DOWNING ST"
    }]
  };

  beforeEach(inject(function (_propertySearchService_, _$httpBackend_, _$q_, _$rootScope_) {
    propertySearchService = _propertySearchService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $q = _$q_;

    $httpBackend.when('GET', '/PApublicServiceProxy/PaServicesProxy.ashx?Operation=GetPropertySearchByFolio&clientAppName=PropertySearch&folioNumber=0131260420370').respond(mockProperty);
    $httpBackend.when('GET', '/PApublicServiceProxy/PaServicesProxy.ashx?Operation=GetPropertySearchByFolio&clientAppName=PropertySearch&folioNumber=0131260420371').respond(mockProperty1);
    $httpBackend.when('GET', '/PApublicServiceProxy/PaServicesProxy.ashx?Operation=GetPropertySearchByFolio&clientAppName=PropertySearch&folioNumber=0131260420372').respond(mockProperty2);
    $httpBackend.when('GET', '/PApublicServiceProxy/PaServicesProxy.ashx?Operation=GetPropertySearchByFolio&clientAppName=PropertySearch&folioNumber=1111111111111').respond(mockFolioDoesNotExistResponse);
    $httpBackend.when('GET', '/PApublicServiceProxy/PaServicesProxy.ashx?Operation=GetOwners&clientAppName=PropertySearch&enPoint=&from=1&ownerName=Michael+Sarasti&to=200').respond(mockCandidatesList);
    $httpBackend.when('GET', '/PApublicServiceProxy/PaServicesProxy.ashx?Operation=GetAddress&clientAppName=PropertySearch&from=1&myAddress=7244+SW+72+St&myUnit=&to=200').respond(mockCandidatesList);

  }));

  it('should do something', function () {
    expect(!!propertySearchService).toBe(true);
  });

  it('propertyByFolio success', function(){
    var property = propertySearchService.getPropertyByFolio('0131260420370');
    property.then(function(myProperty){
      expect(myProperty.propertyInfo.folioNumber).toBe("0131260420370");
      expect(myProperty.legalDescription.parsedDescription).toEqual(["A","B","C"]);
    },function(response){
      expect(true).toBe(false);
    });

    $httpBackend.flush();

  });

  it('propertyByFolio folio does not exist, returns an error message', function(){
    var property = propertySearchService.getPropertyByFolio('1111111111111');
    property.then(function(myProperty){
      expect(true).toBe(false);
    },function(response){
      expect(response.message).toBe("Folio does not exist");
    });

    $httpBackend.flush();

  });

  it('propertyByOwnerName callback executed', function() {
    
    var promise = propertySearchService.getCandidatesByOwner('Michael Sarasti', 1, 200);
    promise.then(function(candidatesList){
      expect(candidatesList.candidates[0].folio).toBe("0123456789012");
      expect(candidatesList.candidates[0].firstOwner).toBe("Barack Obamo");
    },function(error){
      expect(true).toBe(false);
    });

    $httpBackend.flush();

  });

  it('propertyByAddress callback executed', function() {

    var promise = propertySearchService.getCandidatesByAddressFromPA('7244 SW 72 St', '', 1, 200);
    promise.then(function(candidatesList){
      console.log("The candidates List is ", candidatesList);
      expect(candidatesList.candidates[0].siteAddress).toBe("10 DOWNING ST");
      expect(candidatesList.candidates[0].secondOwner).toBe("George Bush");      
    },function(error){
      expect(true).toBe(false);
    });

    $httpBackend.flush();

  });

  it('propertiesByFolios gets several properties in order', function(){
    
    var properties = {
      "0131260420370": {propertyInfo:{folioNumber:"01-3126-042-0370"}},
      "0131260420371": {propertyInfo:{folioNumber:"01-3126-042-0371"}},
      "0131260420372": {propertyInfo:{folioNumber:"01-3126-042-0372"}}
    };

    var deferred1 = $q.defer();
    deferred1.resolve(properties["0131260420370"]);

    var deferred2 = $q.defer();
    deferred2.resolve(properties["0131260420371"]);

    var deferred3 = $q.defer();
    deferred3.resolve(properties["0131260420372"]);

    var deferrers = {
      "0131260420370": deferred1,
      "0131260420371": deferred2,
      "0131260420372": deferred3
    };
    

    spyOn(propertySearchService, 'getPropertyByFolio').andCallFake(function(folio){
      return deferrers[folio].promise;
    });

    
    var promise = propertySearchService.getPropertiesByFolios(["0131260420370","0131260420371","0131260420372"])
    promise.then(function(properties){
      expect(properties.length).toBe(3);
      expect(properties[0].propertyInfo.folioNumber).toEqual("01-3126-042-0370");
      expect(properties[1].propertyInfo.folioNumber).toEqual("01-3126-042-0371");
    });

    $rootScope.$apply();
    

  });

  it('propertiesByFolios when a folio is not found remove it from the list', function(){
    
    var properties = {
      "0131260420370": {propertyInfo:{folioNumber:"01-3126-042-0370"}},
      "0131260420372": {propertyInfo:{folioNumber:"01-3126-042-0372"}}
    };

    var deferred1 = $q.defer();
    deferred1.resolve(properties["0131260420370"]);

    var deferred2 = $q.defer();
    deferred2.reject({});

    var deferred3 = $q.defer();
    deferred3.resolve(properties["0131260420372"]);

    var deferrers = {
      "0131260420370": deferred1,
      "0131260420371": deferred2,
      "0131260420372": deferred3
    };
    

    spyOn(propertySearchService, 'getPropertyByFolio').andCallFake(function(folio){
      return deferrers[folio].promise;
    });

    
    var promise = propertySearchService.getPropertiesByFolios(["0131260420370",
                                                               "0131260420371",
                                                               "0131260420372"])
    promise.then(function(properties){
      expect(properties.length).toBe(2);
      expect(properties[0].propertyInfo.folioNumber).toEqual("01-3126-042-0370");
      expect(properties[1].propertyInfo.folioNumber).toEqual("01-3126-042-0372");
    });

    $rootScope.$apply();
  });

  it('propertiesByFolios when empty array of folios sent the promise returns an empty array', function(){
    var promise = propertySearchService.getPropertiesByFolios([])
    promise.then(function(properties){
      expect(properties).toEqual([]);
    });
    
    $rootScope.$apply();
  });

  it('propertiesByFolios when null array sent the promise returns an empty array', function(){
    var promise = propertySearchService.getPropertiesByFolios(null)
    promise.then(function(properties){
      expect(properties).toEqual([]);
    });
    
    $rootScope.$apply();
  });


  it('lets build url for additional info - Community Services Near Property', function(){
    
    var additionalInfoList = ['Community Services Near Property'];
    var result = propertySearchService.buildAdditionalInfoUrls(additionalInfoList, 
                                                               4, 5, '11826 sw 97th ST');
    expect(result['Community Services Near Property'].isUrl).toBe(true);
    expect(result['Community Services Near Property'].key).
      toBe('Community Services Near Property');
    var url = 'http://gisweb.miamidade.gov/communityservices/CommunityServicesAll.html?x=4&y=5&bufferDistance=5&address=11826 sw 97th ST&';
    expect(result['Community Services Near Property'].value).toBe(url);
  });

  it('lets build url for additional info - Community Services Application', function(){
    
    var additionalInfoList = ['Community Services Application'];
    var result = propertySearchService.buildAdditionalInfoUrls(additionalInfoList, 
                                                               4, 5, '11826 sw 97th ST');
    expect(result['Community Services Application'].isUrl).toBe(true);
    expect(result['Community Services Application'].key).
      toBe('Community Services Application');
    var url = 'http://gisweb.miamidade.gov/communityservices?address=11826 sw 97th ST&';
    expect(result['Community Services Application'].value).toBe(url);
  });

  it('lets build url for additional info - Business Incentives', function(){
    
    var additionalInfoList = ['Business Incentives'];
    var result = propertySearchService.buildAdditionalInfoUrls(additionalInfoList, 
                                                               4, 5, '11826 sw 97th ST');
    expect(result['Business Incentives'].isUrl).toBe(true);
    expect(result['Business Incentives'].key).
      toBe('Business Incentives');
    var url = 'http://gisweb.miamidade.gov/businessincentive/default.aspx?searchType=address&paramvalue=11826 sw 97th ST&';
    expect(result['Business Incentives'].value).toBe(url);
  });

  it('lets build url for additional info - Environmental Considerations', function(){
    
    var additionalInfoList = ['Environmental Considerations'];
    var result = propertySearchService.buildAdditionalInfoUrls(additionalInfoList, 
                                                               4, 5, '11826 sw 97th ST');
    expect(result['Environmental Considerations'].isUrl).toBe(true);
    expect(result['Environmental Considerations'].key).
      toBe('Environmental Considerations');
    var url = 'http://gisweb.miamidade.gov/environmentalconsiderations/default.aspx?searchtype=address&paramvalue=11826 sw 97th ST&';
    expect(result['Environmental Considerations'].value).toBe(url);
  });

  it('buildAdditionalInfoUrls - Empty array should return an empty map', function(){
    
    var additionalInfoList = [];
    var result = propertySearchService.buildAdditionalInfoUrls(additionalInfoList, 
                                                               4, 5, '11826 sw 97th ST');
    expect(result).toEqual({});
  });

  it('buildAdditionalInfoUrls - Empty array should return an empty map', function(){
    
    var additionalInfoList = [];
    var result = propertySearchService.buildAdditionalInfoUrls(additionalInfoList, 
                                                               4, 5, '11826 sw 97th ST');
    expect(result).toEqual({});
  });

  it('buildAdditionalInfoUrls - null list of additional info should return an empty map', function(){
    
    var additionalInfoList = null;
    var result = propertySearchService.buildAdditionalInfoUrls(additionalInfoList, 
                                                               4, 5, '11826 sw 97th ST');
    expect(result).toEqual({});
  });



  

});
