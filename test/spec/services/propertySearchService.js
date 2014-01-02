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
  var mockProperty = {
    AssessmentInfo: {AssessedValueCurrent: 70067},
    ClassifiedAgInfo: {Acreage: 0},
    Completed: true,
    District: 1,
    ExemptionInfo: {AgDifferentialValueCurrent: 0},
    PropertyInfo: {FolioNumber: "01-3126-042-0370"},
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

  beforeEach(inject(function (_propertySearchService_, _$httpBackend_, _$rootScope_) {
    propertySearchService = _propertySearchService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    $httpBackend.when('GET', '/PaPublicServices/PAGISService.svc/GetPropertySearchByFolio?folioNumber=0131260420370&layerId=4').respond(mockProperty);
    $httpBackend.when('GET', '/PaPublicServices/PAGISService.svc/GetPropertySearchByFolio?folioNumber=1111111111111&layerId=4').respond(mockFolioDoesNotExistResponse);
    $httpBackend.when('GET', '/PaPublicServices/PAGISService.svc/GetOwners?from=1&ownerName=Michael+Sarasti&to=200').respond(mockCandidatesList);
    $httpBackend.when('GET', '/PaPublicServices/PAGISService.svc/GetAddress?from=1&myAddress=7244+SW+72+St&myUnit=&to=200').respond(mockCandidatesList);
  }));

  it('should do something', function () {
    expect(!!propertySearchService).toBe(true);
  });

  it('propertyByFolio success', function(){
    var property = propertySearchService.getPropertyByFolio('0131260420370');
    property.then(function(myProperty){
      expect(myProperty.propertyInfo.folioNumber).toBe("01-3126-042-0370");
      expect(myProperty.legalDescription.parsedDescription).toEqual(["A","B","C"]);
    },function(response){
      expect(true).toBe(false);
    });

    $httpBackend.flush();
    $rootScope.$apply();
  });

  it('propertyByFolio folio does not exist, returns an error message', function(){
    var property = propertySearchService.getPropertyByFolio('1111111111111');
    property.then(function(myProperty){
      expect(true).toBe(false);
    },function(response){
      expect(response.message).toBe("Folio does not exist");
    });

    $httpBackend.flush();
    $rootScope.$apply();
  });

  it('propertyByOwnerName callback executed', function() {
    var candidatesList = propertySearchService.getCandidatesByOwner('Michael Sarasti', 1, 200, function(candidates){
      expect(candidatesList.candidates[0].folio).toBe("0123456789012");
      expect(candidatesList.candidates[0].firstOwner).toBe("Barack Obama");
    });
    $httpBackend.flush();
  });

  it('propertyByAddress callback executed', function() {
    var candidatesList = propertySearchService.getCandidatesByAddress('7244 SW 72 St', '', 1, 200, function(candidates){
      expect(candidatesList.candidates[0].siteAddress).toBe("10 DOWNING ST");
      expect(candidatesList.candidates[0].secondOwner).toBe("George Bush");
    });
    $httpBackend.flush();
  });

  
  //  it('propertyByFolio noendpoint error', function(){
  //    var property = propertySearchService.getPropertyByFolio('nofolio');
  //    $httpBackend.flush();
  //    expect(property.PropertyInfo.FolioNumber).toBe("01-3126-042-0370");
  //  });

});
