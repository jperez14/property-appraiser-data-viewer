'use strict';

angular.module('propertySearchApp', ['ngRoute', 'ngResource', 'ui.mask'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });


  });
