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
      .when('/aerials/:year?',{
        templateUrl: 'views/aerials/aerials.html',
        controller: 'AerialsCtrl'
      .when('/candidatesPrint',{
        templateUrl: 'views/candidatesPrint.html',
        controller: 'CandidatesCtrl'
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
