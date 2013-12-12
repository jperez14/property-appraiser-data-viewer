'use strict';

describe('Service: esriGisService', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  // instantiate service
  var esriGisService;
  beforeEach(inject(function (_esriGisService_) {
    esriGisService = _esriGisService_;
  }));

  it('should do something', function () {
    expect(!!esriGisService).toBe(true);
  });


});
