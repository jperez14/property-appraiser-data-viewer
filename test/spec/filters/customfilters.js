'use strict';

describe('filter: customfilters', function () {

  beforeEach(module('propertySearchApp'));
 
    it('should return currency without decimal values ',
        inject(function(noCentsCurrencyFilter) {
      expect(noCentsCurrencyFilter(156620,"$")).toBe('$156,620');
      expect(noCentsCurrencyFilter(99999.00,"$")).toBe('$99,999');
	}));
});