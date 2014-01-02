'use strict';

describe('Service: candidateService', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  // instantiate service
  var candidateService;
  beforeEach(inject(function (_candidateService_) {
    candidateService = _candidateService_;
  }));

  it('should do something', function () {
    expect(!!candidateService).toBe(true);
  });

  it('data with no MinimumPropertyInfos returns empty candidates []', function(){
    var candidatesList = new candidateService.Candidates({});
    expect(candidatesList.candidates).toEqual([]);
  });

  it('data with null MinimumPropertyInfos returns empty candidates []', function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:null});
    expect(candidatesList.candidates).toEqual([]);
  });

  it("MinimumPropertyInfos first element's Owner1 with empty value makes it null", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner1:""}]});
    expect(candidatesList.candidates[0].firstOwner).toBe(null);
  });

  it("MinimumPropertyInfos first element's Owner1 is not empty and has a value", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner1:"Obama"}]});
    expect(candidatesList.candidates[0].firstOwner).toBe("Obama");
  });

  it("MinimumPropertyInfos first element's Owner2 with empty value makes it null", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner2:""}]});
    expect(candidatesList.candidates[0].secondOwner).toBe(null);
  });

  it("MinimumPropertyInfos first element's Owner2 is not empty and has a value", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner2:"Obama"}]});
    expect(candidatesList.candidates[0].secondOwner).toBe("Obama");
  });

  it("MinimumPropertyInfos first element's Owner3 with empty value makes it null", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner3:""}]});
    expect(candidatesList.candidates[0].thirdOwner).toBe(null);
  });

  it("MinimumPropertyInfos first element's Owner3 is not empty and has a value", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner3:"Obama"}]});
    expect(candidatesList.candidates[0].thirdOwner).toBe("Obama");
  });

  it("MinimumPropertyInfos first element's SiteAddress with empty value makes it null", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{SiteAddress:""}]});
    expect(candidatesList.candidates[0].siteAddress).toBe(null);
  });

  it("MinimumPropertyInfos first element's SiteAddress is not empty and has a value", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{SiteAddress:"2444 OVERBROOK ST"}]});
    expect(candidatesList.candidates[0].siteAddress).toBe("2444 OVERBROOK ST");
  });

  it("MinimumPropertyInfos first element's Municipality with empty value makes it null", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Municipality:""}]});
    expect(candidatesList.candidates[0].municipality).toBe(null);
  });

  it("MinimumPropertyInfos first element's Municipality is not empty and has a value", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Municipality:"Miami"}]});
    expect(candidatesList.candidates[0].municipality).toBe("Miami");
  });

  it('map incoming candidates fields to our candidates model fields',function(){
    var givenProperty = {
      Completed: true,
      Count: 0,
      Message: null,
      Total: 1,
      MinimumPropertyInfos: [
	{
	  Owner1: "MICHAEL A SARASTI",
	  Owner2: "WILLIAM R SCHWARTZ",
	  Owner3: "",
	  SiteAddress: "2444 OVERBROOK ST",
	  Strap: "01-4115-028-0470",
	  Municipality: 'MIAMI'
	}
      ]
    };
    
    var expectedProperty = {
      candidates: [
	{
	  firstOwner: "MICHAEL A SARASTI",
	  secondOwner: "WILLIAM R SCHWARTZ",
	  thirdOwner: null,
	  siteAddress: "2444 OVERBROOK ST",
	  folio: "0141150280470",
	  municipality: 'MIAMI'
	}
      ]
    };
    
    var candidatesList = new candidateService.Candidates(givenProperty);
    expect(candidatesList.candidates).toEqual(expectedProperty.candidates);

  });

  it("isCandidatesFound returns true if at least one candidate is found", function(){
    var candidates = {
      Completed: true,
      Count: 0,
      Message: null,
      Total: 1,
      MinimumPropertyInfos: [
        {
          Municipality: "Miami Beach",
          Owner1: "IRENE NODARSE & JOSE MENENDEZ",
          Owner2: "",
          Owner3: "",
          SiteAddress: "1600 BIARRITZ DR",
          Strap: "02-3210-001-0650"
        }]
    };

    expect(candidateService.isCandidatesFound(candidates)).toBe(true);
    
  });

  it("isCandidatesFound returns false if Completed flag is false", function(){
    var candidates = {"Completed":false,
                      "Message":"Could not find this address.",
                      "MinimumPropertyInfos":[],
                      "Total":0};

    expect(candidateService.isCandidatesFound(candidates)).toBe(false);
    
  });

  it("isCandidatesFound returns false if Total count of candidates is zero", function(){
    var candidates = {"Completed":true,
                      "Count":0,
                      "Message":"Folio not found(Search Total 0). Please verify",
                      "Total":0,
                      "MinimumPropertyInfos":null};

    expect(candidateService.isCandidatesFound(candidates)).toBe(false);
    
  });



});



