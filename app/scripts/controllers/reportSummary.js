'use strict';

angular.module('propertySearchApp')
  .controller('ReportSummaryCtrl', ['$scope', function ($scope){

    $scope.property = window.opener.property;
	
	$scope.doPrint = function() {
		window.print();
	};
	
	$scope.getCurrentDate = function() {
		var dt = new Date();
		return dt.getMonth() + 1 + '/' + dt.getDate() + '/' + dt.getFullYear();
	};
	
	$scope.showBenefitsMessages = function(){
		return $scope.property.benefit.messages[$scope.property.rollYear1] != undefined || 
		$scope.property.benefit.messages[$scope.property.rollYear2] != undefined || 
		$scope.property.benefit.messages[$scope.property.rollYear3] != undefined;
	};	
  }]);
