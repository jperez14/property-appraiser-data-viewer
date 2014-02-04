'use strict';

angular.module('propertySearchApp', ['ngResource', 'ngRoute', 'ui.mask', 'ui.keypress', 'notificationWidget'])
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
      .when('/detailsSummary',{
        templateUrl: 'views/report/reportDetails.html',
        controller: 'DetailsSummaryCtrl'
      })
      .when('/', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });


  });
