'use strict';

angular.module('propertySearchApp')
  .service('propertySearchService', ['$resource', function($resource){
  
  var urlBase = "/PaPublicServices/PAGISService.svc/";

  var PropertyResource = $resource(urlBase + ":endPoint", 
                                   {endPoint:""},
                                   {propertyByFolio:{method:'GET'}}
                                  );

  
  var propertyByFolio = function(folio, callback){

    var endPoint = 'GetPropertySearchByFolio';
    var params = {folioNumber:folio, layerId:'4', "endPoint":endPoint};         
         
    var property = PropertyResource.propertyByFolio(params, function(){
      var legalDescription = property.LegalDescription.Description.split(",");
      property.LegalDescription.Description = legalDescription;
      if(callback){
        callback(property);
      }

    }, function(){});

    return property;

  };
   
   

  return {getPropertyByFolio:propertyByFolio};
    

}]);

