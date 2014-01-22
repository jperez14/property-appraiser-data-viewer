'use strict';

angular.module('propertySearchApp', ['ngResource', 'ui.mask', 'ui.keypress', 'notificationWidget'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/pictometry/:x/:y',{
        templateUrl: 'views/pictometry.html',
        controller: 'PictometryCtrl'
      })
      .when('/reportSummary',{
        templateUrl: 'views/report/reportSummary.html',
        controller: 'ReportSummaryCtrl'
      })
      .when('/reportDetails',{
        templateUrl: 'views/reportdetails.html',
        controller: 'ReportSummaryCtrl'
      })
      .when('/:folio', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });


  });
