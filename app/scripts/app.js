'use strict';

angular.module('propertySearchApp', ['ngResource', 'ui.mask', 'ui.keypress', 'notificationWidget'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl'
      })
      .when('/pictometry',{
        templateUrl: 'views/pictometry.html',
        controller: 'PictometryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });


  });
