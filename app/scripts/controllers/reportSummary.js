'use strict';

angular.module('propertySearchApp')
  .controller('ReportSummaryCtrl', ['$scope', 'SharedDataService', function ($scope, SharedData){

    $scope.property = SharedData.property;

  }]);
