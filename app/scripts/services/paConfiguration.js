'use strict';

angular.module('propertySearchApp')
  .constant('paConfiguration', {
    wkidJson:{wkid:2236},               
    urlCoordFromFolio:"/ArcGIS/rest/services/MD_PropertySearchApp_Test/MapServer/17",
    urlAerialMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer",
    //urlAerialMap:"http://arcgis.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer",
    urlStreetMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/BaseMap/MapServer",
    urlParcelLayer:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/57",
    urlMunicipalityLayer:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/31",

    layerSymbol:{"color":[255,0,0,64],"outline":{"color":[0,0,0,255],
                                                 "width":1,"type":"esriSLS","style":"esriSLSSolid"},
                 "type":"esriSFS","style":"esriSFSSolid"},

    propertyMarkerSymbol:{"color":[255,0,0,128],
			  "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS",
			  "style":"esriSMSSquare",
			  "outline":{"color":[0,0,0,255],"width":1,"type":"esriSLS","style":"esriSLSSolid"}
			 }
  });
