'use strict';

angular.module('propertySearchApp', ['ngResource', 'ui.mask', 'ui.keypress', 'notificationWidget'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:folio', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl'
      })
      .when('/pictometry/:x/:y',{
        templateUrl: 'views/pictometry.html',
        controller: 'PictometryCtrl'
      })
      .when('/reportSummary',{
        templateUrl: 'views/report/reportsummary.html',
        controller: 'ReportSummaryCtrl'
      })
      .when('/reportDetails',{
        templateUrl: 'views/reportdetails.html',
        controller: 'ReportSummaryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });


  });
