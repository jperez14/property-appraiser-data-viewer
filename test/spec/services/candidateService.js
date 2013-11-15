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

  it("MinimumPropertyInfos first element's Owner2 with empty value makes it null", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner2:""}]});
    expect(candidatesList.candidates[0].secondOwner).toBe(null);
  });

  it("MinimumPropertyInfos first element's Owner2 is not empty and has a value", function(){
    var candidatesList = new candidateService.Candidates({MinimumPropertyInfos:[{Owner2:"Obama"}]});
    expect(candidatesList.candidates[0].secondOwner).toBe("Obama");
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
				Strap: "01-4115-028-0470"
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
				folio: "01-4115-028-0470"
			}
		]
	};
    
    var candidatesList = new candidateService.Candidates(givenProperty);
    expect(candidatesList.candidates).toEqual(expectedProperty.candidates);

  });



});
