'use strict';

angular.module('propertySearchApp')
  .filter('noCentsCurrency', ['$filter', '$locale', function (filter, locale) {
    
	var currencyFilter = filter('currency');
	var formats = locale.NUMBER_FORMATS;

	return function(amount, currencySymbol) {
	  if(amount === undefined)
		return amount;
	  var value = currencyFilter(amount, currencySymbol);
	  var sep = value.indexOf(formats.DECIMAL_SEP);
	  if(amount >= 0 ) {
	    return value.substring(0, sep);
	  }
	  return value.substring(0, sep) + ')';
	};

  }]);
