'use strict';

angular.module('propertySearchApp')
  .constant('paConfiguration', {
    wkidJson:{wkid:2236},               
    urlCoordFromFolio:"/ArcGIS/rest/services/MD_PropertySearchApp_Test/MapServer/18",
    urlAerialMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer",
    //urlAerialMap:"http://arcgis.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer",
    urlStreetMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/BaseMap/MapServer",
    urlParcelLayer:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/57",
    urlParcelBoundariesLayer:"/ArcGIS/rest/services/MD_PropertySearchApp/MapServer/0",
    urlMunicipalityLayer:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/31",
    urlGeometryService:"/ArcGIS/rest/services/Geometry/GeometryServer/",

    layers:[{label:"Municipality", value:false, url:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/31"},
            {label:"Commission District", value:false, url:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/11"},
            {label:"Elementary School", value:false, url:"http://311arcgis.miamidade.gov/ArcGIS/rest/services/Gic/MapServer/18"}],


    layerSymbol:{"color":[255,0,0,64],
                 "outline":{"color":[0,0,0,255],
                            "width":1,
                            "type":"esriSLS",
                            "style":"esriSLSSolid"},
                 "type":"esriSFS",
                 "style":"esriSFSSolid"},

    propertyMarkerSymbol:{"color":[255,0,0,128],
			  "size":6,
                          "angle":0,
                          "xoffset":0,
                          "yoffset":0,
                          "type":"esriSMS",
			  "style":"esriSMSSquare",
			  "outline":{"color":[0,0,0,255],
                                     "width":1,
                                     "type":"esriSLS",
                                     "style":"esriSLSSolid"}
    },
    propertyMarkerPictureSymbol:{
    "url":"http://static.arcgis.com/images/Symbols/Shapes/RedCircleLargeB.png", 
    "height":10,
    "width":10,
    "type":"esriPMS",
    "angle": 0
  },
    propertyBoundarySymbol:{"color":[0,0,0,0],
                            "outline":{"color":[255,0,0,255],
                                       "width":1,
                                       "type":"esriSLS",
                                       "style":"esriSLSSolid"},
                            "type":"esriSFS",
                            "style":"esriSFSSolid"}
  });
