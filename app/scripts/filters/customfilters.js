'use strict';

angular.module('propertySearchApp')
  .filter('noCentsCurrency', ['$filter', '$locale', function (filter, locale) {
    
	var currencyFilter = filter('currency');
	var formats = locale.NUMBER_FORMATS;

	return function(amount, currencySymbol) {
	  if(amount === undefined || amount === null)
		return amount;
	  var value = currencyFilter(amount, currencySymbol);
	  var sep = value.indexOf(formats.DECIMAL_SEP);
	  if(amount >= 0 ) {
	    return value.substring(0, sep);
	  }
	  return value.substring(0, sep) + ')';
	};

  }])
  .filter('centsCurrency', ['$filter', '$locale', function (filter, locale) {
    
	var currencyFilter = filter('currency');
	var formats = locale.NUMBER_FORMATS;

	return function(amount, currencySymbol) {
	  if(amount === undefined || amount === null)
		return amount;
	  return currencyFilter(amount, currencySymbol);
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
  }])
  .filter('folioMask', ['$filter', '$locale', function (filter, locale) {
	return function(folio, currencySymbol) {
		var f1 = folio.substr(0,2);
		var f2 = folio.substr(2,4);
		var f3 = folio.substr(6,3);
		var f4 = folio.substr(9,4);
		return f1+'-'+f2+'-'+f3+'-'+f4;
	};
  }]);
