'use strict';

angular.module('propertySearchApp')
  .service('esriGisService',['$q',  function ($q) {

    var greet = function(){return 1};
    
    var urlPointFolio = "http://s0142357.miamidade.gov/ArcGIS/rest/services/MD_PropertySearchApp_Test/MapServer/17";
    var pointFromFolio = function(folio){
      
      var queryTask = new esri.tasks.QueryTask(urlPointFolio);

      var query = new esri.tasks.Query();
      query.returnGeometry = false;
      query.where = "CHILD=" + folio;
      query.outFields = ["*"];

      var deferred = $q.defer();
      queryTask.execute(query).then(
        function (featureSet) {
          console.log("esriGIS featureset", featureSet);
          deferred.resolve(featureSet);
          //deferred.resolve("hello world");
        },
        function (error) {
          deferred.reject(error);
        });


      return deferred.promise;

      //      queryTask.execute(query, function(results){
      //        console.log(results);
      //      });

    };
    
    
    // public API
    return {greet:greet,
            getPointFromFolio:pointFromFolio
           };

  }]);
