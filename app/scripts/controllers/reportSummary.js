'use strict';

angular.module('propertySearchApp')
  .controller('ReportSummaryCtrl', ['$scope', function ($scope){

    $scope.property = window.opener.property;

  }]);
