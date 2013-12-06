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

  }])
  .filter('emptyCurrency', ['$filter', '$locale', function(filter, locale) {
    var currencyFilter = filter('currency');
	
	return function(amount, currencySymbol) {
	  if(amount === "")
	    return amount;
	  return currencyFilter(amount, currencySymbol);
	};
  }])
  .filter('negativeNumber', ['$filter', '$locale', function(filter, locale) {
	var numberFilter = filter('number');
	return function(number, decimals) {
	  if(number === -1)
	    return "";
	  if(decimals != undefined)
	    return numberFilter(number, decimals);
	  return numberFilter(number);
	}
  }]);
