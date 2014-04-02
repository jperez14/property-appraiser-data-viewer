'use strict';

describe('Service: candidate', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  // instantiate service
  var candidate;
  var esriGisLocatorService;
  var  $q;
  var $rootScope;

  beforeEach(inject(function (_candidate_, _esriGisLocatorService_, _$q_, _$rootScope_) {
    candidate = _candidate_;
    esriGisLocatorService = _esriGisLocatorService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
//    var deferred = $q.defer();
//    deferred.resolve({candidates:[{
//                                address: "111 NW 1ST ST, 1, 33128",
//                                score: 87.35,
//                                attributes: {Street_ID: "0141370230020"}
//                                }]});
//
//    spyOn(esriGisLocatorService, 'candidates20').andReturn(deferred.promise);

  }));

  it('succeed while getting candidates from the esri locator20 service.',function(){

    var deferred = $q.defer();
    deferred.resolve({candidates:[{
                                address: "111 NW 1ST ST, 1, 33128",
                                score: 87.35,
                                attributes: {Street_ID: "0141370230020"}
                                }]});

    spyOn(esriGisLocatorService, 'candidates20').andReturn(deferred.promise);

    var promise = candidate.getCandidates("11826 sw 97");
    promise.then(function(candidates){
      expect(candidates.completed).toBe(true);
      expect(candidates.total).toBe(1);
      expect(candidates.candidates[0].folio).toEqual("0141370230020");
    });

    $rootScope.$apply();
    
  });

  it('fail while getting candidates from the esri locator20 service.',function(){

    var deferred = $q.defer();
    deferred.reject({message:"", error:"some error"});

    spyOn(esriGisLocatorService, 'candidates20').andReturn(deferred.promise);

    var promise = candidate.getCandidates("11826 sw 97");
    promise.then(function(candidates){
      expect(true).toBe(false);
    }, function(candidates){
      expect(candidates.completed).toBe(false);
    });

    $rootScope.$apply();
    
  });

  it('candidate test starting ...', function () {
    expect(!!candidate).toBe(true);
  });

  it('an empty esri candidate will map into an default candidate',function(){
    var myCandidate = candidate.candidateFromEsriCandidate({});
    expect(myCandidate).toEqual(new candidate.Candidate());
  });

  it('a null esri candidate will map into a default candidate',function(){
    var myCandidate = candidate.candidateFromEsriCandidate(null);
    expect(myCandidate).toEqual(new candidate.Candidate());
  });

  it('lets convert an esri candidate to our candidate model', function(){

    var givenEsriCandidate =         {
      address: "111 NW 1ST ST, 1, 33128",
      location: {
        x: 920433.6240632683,
        y: 525114.8120848984
      },
      score: 87.35,
      attributes: {
        Score: 87.35,
        Match_addr: "111 NW 1ST ST, 1, 33128",
        House: "111",
        Side: "",
        PreDir: "NW",
        PreType: "",
        StreetName: "1ST",
        SufType: "ST",
        SufDir: "",
        City: "1",
        State: "",
        ZIP: "33128",
        Ref_ID: 217634,
        X: 920433.624075,
        Y: 525114.812063,
        Disp_Lon: 0,
        Disp_Lat: 0,
        Street_ID: "0141370230020",
        Addr_type: "StreetAddress"
      }
    };

    var expectedCandidate = {
      siteAddress:'111 NW 1ST ST',
      municipality: 'MIAMI',
      folio:'0141370230020',
      firstOwner: null,
      secondOwner: null,
      thirdOwner: null,
      status: null,
      subdivisionDescription: null
    };
    
    var myCandidate = candidate.candidateFromEsriCandidate(givenEsriCandidate);
    expect(myCandidate).toEqual(expectedCandidate);

  });

  it('an empty array of esri candidates will map into an empty array',function(){
    var myCandidates = candidate.candidatesFromEsriCandidates([]);
    expect(myCandidates).toEqual([]);
  });

  it('a null array of esri candidates will map into an empty array',function(){
    var myCandidates = candidate.candidatesFromEsriCandidates(null);
    expect(myCandidates).toEqual([]);
  });

  it('lets convert esri array of candidates to our candidates model',function(){
    var givenEsriCandidates = [{
      address: "111 NW 1ST ST, 1, 33128",
      location: {
        x: 920433.6240632683,
        y: 525114.8120848984
      },
      score: 87.35,
      attributes: {
        Score: 87.35,
        Match_addr: "111 NW 1ST ST, 1, 33128",
        House: "111",
        Side: "",
        PreDir: "NW",
        PreType: "",
        StreetName: "1ST",
        SufType: "ST",
        SufDir: "",
        City: "1",
        State: "",
        ZIP: "33128",
        Ref_ID: 217634,
        X: 920433.624075,
        Y: 525114.812063,
        Disp_Lon: 0,
        Disp_Lat: 0,
        Street_ID: "0141370230020",
        Addr_type: "StreetAddress"
      }
    },{
      address: "111 SE 1ST AVE, 3, 33131",
      location: {
        x: 922158.318335224,
        y: 524039.3575015813
      },
      score: 78.32,
      attributes: {
        Score: 78.32,
        Match_addr: "111 SE 1ST AVE, 3, 33131",
        House: "111",
        Side: "",
        PreDir: "SE",
        PreType: "",
        StreetName: "1ST",
        SufType: "AVE",
        SufDir: "",
        City: "3",
        State: "",
        ZIP: "33131",
        Ref_ID: 835340,
        X: 922158.318325,
        Y: 524039.35749,
        Disp_Lon: 0,
        Disp_Lat: 0,
        Street_ID: "0101120601050",
        Addr_type: "StreetAddress"
      }
    }];

    var expectedCandidates = [{
      siteAddress:'111 NW 1ST ST',
      municipality: 'MIAMI',
      folio:'0141370230020',
      firstOwner: null,
      secondOwner: null,
      thirdOwner: null,
      status: null,
      subdivisionDescription: null
    },{
      siteAddress:'111 SE 1ST AVE',
      municipality: 'CORAL GABLES',
      folio:'0101120601050',
      firstOwner: null,
      secondOwner: null,
      thirdOwner: null,
      status: null,
      subdivisionDescription: null
    }];
    
    var myCandidates = candidate.candidatesFromEsriCandidates(givenEsriCandidates);
    expect(myCandidates).toEqual(expectedCandidates);

  });


  it('when array of esri candidates has an empty member, drop it from the result array',function(){
    var givenEsriCandidates = [{},
                               {
                                address: "111 NW 1ST ST, 1, 33128",
                                location: {
                                           x: 920433.6240632683,
                                           y: 525114.8120848984
                                           },
                                score: 87.35,
                                attributes: {
                                             Score: 87.35,
                                             Match_addr: "111 NW 1ST ST, 1, 33128",
                                             House: "111",
                                             Side: "",
                                             PreDir: "NW",
                                             PreType: "",
                                             StreetName: "1ST",
                                             SufType: "ST",
                                             SufDir: "",
                                             City: "1",
                                             State: "",
                                             ZIP: "33128",
                                             Ref_ID: 217634,
                                             X: 920433.624075,
                                             Y: 525114.812063,
                                             Disp_Lon: 0,
                                             Disp_Lat: 0,
                                             Street_ID: "0141370230020",
                                             Addr_type: "StreetAddress"
                                             }
                                },{
                                address: "111 SE 1ST AVE, 3, 33131",
                                location: {
                                           x: 922158.318335224,
                                           y: 524039.3575015813
                                           },
                                score: 78.32,
                                attributes: {
                                             Score: 78.32,
                                             Match_addr: "111 SE 1ST AVE, 3, 33131",
                                             House: "111",
                                             Side: "",
                                             PreDir: "SE",
                                             PreType: "",
                                             StreetName: "1ST",
                                             SufType: "AVE",
                                             SufDir: "",
                                             City: "3",
                                             State: "",
                                             ZIP: "33131",
                                             Ref_ID: 835340,
                                             X: 922158.318325,
                                             Y: 524039.35749,
                                             Disp_Lon: 0,
                                             Disp_Lat: 0,
                                             Street_ID: "0101120601050",
                                             Addr_type: "StreetAddress"
                                             }
                                }];

    var expectedCandidates = [{
      siteAddress:'111 NW 1ST ST',
      municipality: 'MIAMI',
      folio:'0141370230020',
      firstOwner: null,
      secondOwner: null,
      thirdOwner: null,
      status: null,
      subdivisionDescription: null
    },{
      siteAddress:'111 SE 1ST AVE',
      municipality: 'CORAL GABLES',
      folio:'0101120601050',
      firstOwner: null,
      secondOwner: null,
      thirdOwner: null,
      status: null,
      subdivisionDescription: null
    }];
    
    var myCandidates = candidate.candidatesFromEsriCandidates(givenEsriCandidates);
    expect(myCandidates).toEqual(expectedCandidates);

  });


  it('ignore esri candidates with empty folio (Street_ID)',function(){
    var givenEsriCandidates = [{
                                address: "111 NW 1ST ST, 1, 33128",
                                score: 87.35,
                                attributes: {
                                             Score: 87.35,
                                             Street_ID: "0141370230020",
                                             }
                                },{
                                address: "123 NW 2ST ST, 1, 33128",
                                score: 0,
                                attributes: {
                                             Score: 87.35,
                                             Street_ID: "",
                                             }
                                }];

    var expectedCandidates = [{
      siteAddress:'111 NW 1ST ST',
      municipality: 'MIAMI',
      folio:'0141370230020',
      firstOwner: null,
      secondOwner: null,
      thirdOwner: null,
      status: null,
      subdivisionDescription: null
    }];
    
    var myCandidates = candidate.candidatesFromEsriCandidates(givenEsriCandidates);
    expect(myCandidates).toEqual(expectedCandidates);

  });

  

});



