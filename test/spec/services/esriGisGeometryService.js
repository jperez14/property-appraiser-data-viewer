'use strict';

describe('Service: esriGisGeometryService', function () {

  // load the service's module
  beforeEach(module('propertySearchApp'));

  var mockGeometryResult = {
    geometryType: "esriGeometryPoint",
    geometries: [
      {
        x: -80.3875648099658,
        y: 25.6774122000178
      }
    ]
  };

  // instantiate service
  var esriGisGeometryService;
  var $httpBackend;
  var $rootScope;
  beforeEach(inject(function (_esriGisGeometryService_, _$httpBackend_, _$rootScope_) {
    esriGisGeometryService = _esriGisGeometryService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    $httpBackend.when('JSONP', 'http://gisweb.miamidade.gov/ArcGIS/rest/services/Geometry/GeometryServer/project?callback=JSON_CALLBACK&f=json&geometries=%7B%22geometryType%22:%22esriGeometryPoint%22,%22geometries%22:%5B%7B%22x%22:857869.753,%22y%22:488913.937%7D%5D%7D&inSR=2236&outSR=4326').respond(mockGeometryResult);

  }));


  it('lets switch xy to latitude longitude', function () {
    var x = 857869.753;
    var y = 488913.937;

    var promise = esriGisGeometryService.xyToLatitudeLongitude(x, y);
    promise.then(function(location){
      expect(location.latitude).toEqual(25.6774122000178);
      expect(location.longitude).toEqual(-80.3875648099658);
    }, function(response){expect(true).toBe(false);}
       );

    $httpBackend.flush();
    $rootScope.$apply();
  });


});

