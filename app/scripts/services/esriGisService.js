'use strict';

angular.module('propertySearchApp')
  .service('esriGisService',['$q',  function ($q) {

    

    var pointFromFolio = function($scope, folio){
      var urlPointFolio = "http://s0142357.miamidade.gov/ArcGIS/rest/services/MD_PropertySearchApp_Test/MapServer/17";      
      var queryTask = new esri.tasks.QueryTask(urlPointFolio);

      var query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.where = "CHILD=" + folio;
      query.outFields = ["*"];

      var deferred = $q.defer();
      queryTask.execute(query,function (featureSet) {
          deferred.resolve(featureSet);
          $scope.$apply();
        }, function (error) {
          deferred.reject(error);
          $scope.$apply();
        });


      return deferred.promise.then(function(featureSet){console.log("featureSet",featureSet);return featureSet}, function(error){console.log('Getting pointFromFolio ERROR: ',error);return error;});


    };
    
    

    // public API
    return {getPointFromFolio:pointFromFolio
           };

  }]);
