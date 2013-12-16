'use strict';

describe('Service: paConfiguration', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  // instantiate service
  var paConfiguration;
  beforeEach(inject(function (_paConfiguration_) {
    paConfiguration = _paConfiguration_;
  }));

  it('should do something', function () {
    expect(!!paConfiguration).toBe(true);
  });

});
