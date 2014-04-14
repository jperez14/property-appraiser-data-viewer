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
        attributes: {Loc_name: "GeoStreet-20"}
      },
      {
        address: "111 NW 1ST ST, 1, 33128",
        location: {
          x: 920433.6240632683,
          y: 525114.8120848984
        },
        score: 87.35,
        attributes: {Loc_name: "GeoAddress-20"}
      },
      {
        address: "111 SE 1ST AVE, 1, 33131",
        location: {
          x: 922158.318335224,
          y: 524039.3575015813
        },
        score: 78.32,
        attributes: {Loc_name: "GeoAddress-20"}
      },
      {
        address: "111 E 1ST CT, 2, 33139",
        location: {
          x: 932792.6862868555,
          y: 527581.3743536472
        },
        score: 78.32,
        attributes: {Loc_name: "GeoStreet-20"}
      },
      {
        address: "111 NE 1ST ST, 1, 33132",
        location: {
          x: 922158.2474401817,
          y: 524872.9999192283
        },
        score: 78.32,
        attributes: {Loc_name: "GeoStreet-20"}
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

    $httpBackend.when('JSONP', 'http://gisws.miamidade.gov/ArcGIS/rest/services/MDC_Locators/MD_Locator-20/GeocodeServer/findAddressCandidates?Street=111+nw+1st&callback=JSON_CALLBACK&f=json&outFields=*').respond(mockLocator20Result);

  }));


  it('lets get candidates for scores over 20', function () {
    
    var address = "111 nw 1st";

    var promise = esriGisLocatorService.locator20(address);
    promise.then(function(result){
      expect(result.candidates.length).toEqual(1);
      expect(result.candidates[0].address).toEqual("111 NW 1ST ST, 1, 33128");
    }, function(error){expect(true).toBe(false);}
       );

    $httpBackend.flush();
    $rootScope.$apply();
  });

  
  it('handle the request of the server return a 500', function(){
    var url = 'http://gisws.miamidade.gov/ArcGIS/rest/services/MDC_Locators/MD_Locator-20/GeocodeServer/findAddressCandidates?Street=112+nw+1st&callback=JSON_CALLBACK&f=json&outFields=*';

    var address = "112 nw 1st";
    $httpBackend.expect('JSONP', url).respond(500,'');

    var promise = esriGisLocatorService.locator20(address);
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


  it('delete duplicate candidates by address', function(){
    var candidates = esriGisLocatorService.deleteDuplicateCandidates(mockLocator20Result.candidates);
    expect(candidates.length).toBe(mockLocator20Result.candidates.length - 1);
    expect(candidates[0].address).toBe("111 NW 1ST ST, 1, 33128");
    expect(candidates[0].attributes.Loc_name).toBe("GeoAddress-20");
  });

  it('cleanCandidates when there is no candidates return empty', function(){
    var result = esriGisLocatorService.cleanCandidates(null);
    expect(result.candidates).toEqual([]);

    result = esriGisLocatorService.cleanCandidates([]);
    expect(result.candidates).toEqual([]);

    result = esriGisLocatorService.cleanCandidates(undefined);
    expect(result.candidates).toEqual([]);

  });

  it('when there is geoAddress candidates with 100 return just those are picked', function(){
    var candidates = [
      {
        address: "111 NW 1ST ST, 1, 33128",
        score: 100,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 2ND ST, 1, 33128",
        score: 100,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 3RD ST, 1, 33128",
        score: 87.35,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 4TH ST, 1, 33128",
        score: 100,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 6TH ST, 1, 33128",
        score: 100,
        attributes: {Loc_name: "GeoAddress-20"}
      }
    ];

    var result = esriGisLocatorService.cleanCandidates(candidates);
    expect(result.found).toBe(true);
    expect(result.candidates.length).toEqual(2);
    expect(result.candidates[0].address).toBe("111 NW 2ND ST, 1, 33128");
    expect(result.candidates[1].address).toBe("111 NW 6TH ST, 1, 33128");
  });

  it('when there are geoStreet candidates with 100 pick those, if no geoAddress 100', function(){
    var candidates = [
      {
        address: "111 NW 1ST ST, 1, 33128",
        score: 100,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 2ND ST, 1, 33128",
        score: 99,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 3RD ST, 1, 33128",
        score: 87.35,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 4TH ST, 1, 33128",
        score: 100,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 6TH ST, 1, 33128",
        score: 98,
        attributes: {Loc_name: "GeoAddress-20"}
      }
    ];

    var result = esriGisLocatorService.cleanCandidates(candidates);
    expect(result.found).toBe(false);
    expect(result.candidates.length).toEqual(2);
    expect(result.candidates[0].address).toBe("111 NW 1ST ST, 1, 33128");
    expect(result.candidates[1].address).toBe("111 NW 4TH ST, 1, 33128");
  });

  it('no 100 scores, if 1 geoAddress more than 85 return that candidate', function(){
    var candidates = [
      {
        address: "111 NW 1ST ST, 1, 33128",
        score: 87,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 2ND ST, 1, 33128",
        score: 88,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 3RD ST, 1, 33128",
        score: 84,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 4TH ST, 1, 33128",
        score: 86,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 6TH ST, 1, 33128",
        score: 80,
        attributes: {Loc_name: "GeoAddress-20"}
      }
    ];

    var result = esriGisLocatorService.cleanCandidates(candidates);
    expect(result.found).toBe(true);
    expect(result.candidates.length).toEqual(1);
    expect(result.candidates[0].address).toBe("111 NW 2ND ST, 1, 33128");
    expect(result.candidates[0].score).toBe(88);
  });

  it('no 100 scores, no 1 geoAddress more than 85 return, return largest geoStreet score', function(){
    var candidates = [
      {
        address: "111 NW 1ST ST, 1, 33128",
        score: 87,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 2ND ST, 1, 33128",
        score: 84,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 3RD ST, 1, 33128",
        score: 84,
        attributes: {Loc_name: "GeoAddress-20"}
      },          {
        address: "111 NW 4TH ST, 1, 33128",
        score: 86,
        attributes: {Loc_name: "GeoStreet-20"}
      },          {
        address: "111 NW 6TH ST, 1, 33128",
        score: 80,
        attributes: {Loc_name: "GeoAddress-20"}
      }
    ];

    var result = esriGisLocatorService.cleanCandidates(candidates);
    expect(result.found).toBe(false);
    expect(result.candidates.length).toEqual(1);
    expect(result.candidates[0].address).toBe("111 NW 1ST ST, 1, 33128");
    expect(result.candidates[0].score).toBe(87);
  });

 

});

