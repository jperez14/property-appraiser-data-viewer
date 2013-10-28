'use strict';

/**
* propertyFactory - Contains all services hosted by property appraisal dept
*/
angular.module('dataviewer2App')
	.service('propertyService', ['$resource', function($resource){
		var urlBase = "PaPublicServices/PAGISService.svc/";
		this.getFolio = function(folio) {
			return $resource(urlBase+'GetPropertySearchByFolio', {folioNumber:folio,layerId:'4'}, {retrieve:{method:'GET'}});
		};
		this.getAddress = function(address, unit) {
			return $resource(urlBase+'GetAddress', {myAddress:address,myUnit:unit}, {retrieve:{method:'GET'}});
		};
		this.getOwner = function(fName, lName) {
			return $resource(urlBase+'GetOwners', {firstName:fName,lastName:lName}, {retrieve:{method:'GET'}});
		};
}]);