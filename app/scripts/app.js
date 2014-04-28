'use strict';

angular.module('propertySearchApp', ['ngResource', 'ngRoute', 'LocalStorageModule', 'ui.mask', 'ui.keypress', 'notificationWidget'])
  .config(['$routeProvider','localStorageServiceProvider',function ($routeProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/pictometry/:x/:y',{
        templateUrl: 'views/pictometry.html',
        controller: 'PictometryCtrl'
      })
      .when('/report/:type',{
        templateUrl: 'views/report/report.html',
        controller: 'ReportCtrl'
      })
      .when('/comparablesales/:folio?',{
        templateUrl: 'views/comparablesales.html',
        controller: 'ComparableSalesCtrl'
      })
      .when('/detachmap', {
        templateUrl: 'views/detachmap.html',
        controller: 'DetachMapCtrl'
      })
      .when('/', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    localStorageServiceProvider.setPrefix('mdcpropertysearch');

  }]);
