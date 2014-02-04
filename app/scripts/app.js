'use strict';

angular.module('propertySearchApp', ['ngResource', 'ngRoute', 'ui.mask', 'ui.keypress', 'notificationWidget'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/pictometry/:x/:y',{
        templateUrl: 'views/pictometry.html',
        controller: 'PictometryCtrl'
      })
      .when('/report/:type',{
        templateUrl: 'views/report/report.html',
        controller: 'ReportCtrl'
      })
      .when('/', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });


  });
