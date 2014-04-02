'use strict';

describe('Service: esriGisLocatorService', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  var mockLocator20Result = {
    spatialReference: {
      wkid: 2236
    },
    candidates: [
      {
        address: "111 NW 1ST ST, 1, 33128",
        location: {
          x: 920433.6240632683,
          y: 525114.8120848984
        },
        score: 87.35,
        attributes: { }
      },
      {
        address: "111 SE 1ST AVE, 1, 33131",
        location: {
          x: 922158.318335224,
          y: 524039.3575015813
        },
        score: 78.32,
        attributes: { }
      },
      {
        address: "111 E 1ST CT, 2, 33139",
        location: {
          x: 932792.6862868555,
          y: 527581.3743536472
        },
        score: 78.32,
        attributes: { }
      },
      {
        address: "111 NE 1ST ST, 1, 33132",
        location: {
          x: 922158.2474401817,
          y: 524872.9999192283
        },
        score: 78.32,
        attributes: { }
      }
    ]
  };


  // instantiate service
  var esriGisLocatorService;
  var $httpBackend;
  var $rootScope;
  beforeEach(inject(function (_esriGisLocatorService_, _$httpBackend_, _$rootScope_) {
    esriGisLocatorService = _esriGisLocatorService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    $httpBackend.when('JSONP', 'http://gisws.miamidade.gov/ArcGIS/rest/services/MDC_Locators/GeoAddress-20/GeocodeServer/findAddressCandidates?Single+Line+Input=111+nw+1st&callback=JSON_CALLBACK&f=json&outFields=*').respond(mockLocator20Result);

  }));


  it('lets get candidates for scores over 20', function () {
    var address = "111 nw 1st";

    var promise = esriGisLocatorService.candidates20(address);
    promise.then(function(result){
      expect(result.candidates.length).toEqual(4);
      expect(result.candidates[0].address).toEqual("111 NW 1ST ST, 1, 33128");
    }, function(error){expect(true).toBe(false);}
       );

    $httpBackend.flush();
    $rootScope.$apply();
  });

  
  it('handle the request of the server return a 500', function(){
    var url = 'http://gisws.miamidade.gov/ArcGIS/rest/services/MDC_Locators/GeoAddress-20/GeocodeServer/findAddressCandidates?Single+Line+Input=112+nw+1st&callback=JSON_CALLBACK&f=json&outFields=*';

    var address = "112 nw 1st";
    $httpBackend.expect('JSONP', url).respond(500,'');

    var promise = esriGisLocatorService.candidates20(address);
    promise.then(function(result){
      expect(true).toBe(false);
    }, function(error){
      expect(true).toBe(true);
      expect(error.message).toEqual("");
      expect(error.error.status).toBe(500);
    });
   
    $httpBackend.flush();
    $rootScope.$apply();  

  });


});

