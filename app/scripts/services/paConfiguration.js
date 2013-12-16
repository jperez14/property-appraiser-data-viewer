'use strict';

angular.module('propertySearchApp')
  .constant('paConfiguration', {
    wkidJson:{wkid:2236},               
    urlCoordFromFolio:"/ArcGIS/rest/services/MD_PropertySearchApp_Test/MapServer/17",
    urlAerialMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer",
    //urlAerialMap:"http://arcgis.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer",
    urlStreetMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/BaseMap/MapServer",
    urlParcelLayer:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/57"

  });
