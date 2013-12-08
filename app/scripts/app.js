'use strict';

angular.module('propertySearchApp', ['ngResource', 'ui.mask', 'ui.keypress'])
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
