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

  }]);
