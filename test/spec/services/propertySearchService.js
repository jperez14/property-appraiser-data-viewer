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
  var mockProperty = {
    AssessmentInfo: {AssessedValueCurrent: 70067},
    ClassifiedAgInfo: {Acreage: 0},
    Completed: true,
    District: 1,
    ExemptionInfo: {AgDifferentialValueCurrent: 0},
    PropertyInfo: {FolioNumber: "01-3126-042-0370"},
    LegalDescription: {Description: "A,B,C"}
  }

  beforeEach(inject(function (_propertySearchService_, _$httpBackend_) {
    propertySearchService = _propertySearchService_;
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', '/PaPublicServices/PAGISService.svc/GetPropertySearchByFolio?folioNumber=0131260420370&layerId=4').respond(mockProperty);
  }));

  it('should do something', function () {
    expect(!!propertySearchService).toBe(true);
  });

  it('propertyByFolio is sucessful', function(){
    var property = propertySearchService.getPropertyByFolio('0131260420370');
    $httpBackend.flush();
    expect(property.PropertyInfo.FolioNumber).toBe("01-3126-042-0370");
    expect(property.LegalDescription.Description).toEqualData(["A","B","C"]);
  });

  it('propertyByFolio callback executed', function(){
    var property = propertySearchService.getPropertyByFolio('0131260420370', function(prop){
      expect(property.PropertyInfo.FolioNumber).toBe("01-3126-042-0370");
      expect(property.LegalDescription.Description).toEqualData(["A","B","C"]);
    });

    $httpBackend.flush();      


  });

//  it('propertyByFolio noendpoint error', function(){
//    var property = propertySearchService.getPropertyByFolio('nofolio');
//    $httpBackend.flush();
//    expect(property.PropertyInfo.FolioNumber).toBe("01-3126-042-0370");
//  });

});
