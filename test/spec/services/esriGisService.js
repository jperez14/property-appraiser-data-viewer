'use strict';

describe('Service: esriGisService', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  var mockFeatures = {
    "features":[{"attributes":{"PARENT":"3059010240100",
                               "CHILD":"3059010240100",
                               "X_COORD":858110,
                               "Y_COORD":488923.7}
                }]
  };
  

  // instantiate service
  var esriGisService;
  var $httpBackend;
  beforeEach(inject(function (_esriGisService_, _$httpBackend_) {
    esriGisService = _esriGisService_;
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', '/ArcGIS/rest/services/MD_PropertySearchApp_Test/MapServer/17/query?f=json&where=CHILD%3D3059010240100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*').respond(mockFeatures);

  }));

//  it('pointFromFolio from an existing folio, produce a point', function () {
//    var point = esriGisService.getPointFromFolio(null, '3059010240100');
//    point.then(function(features){
//      expect(features.features).toEqual([]);
//    }, function(response){expect(true).toBe(false);}
//       );
//
//    $httpBackend.flush();
//    $rootScope.$apply();
//  });


});
