'use strict';

angular.module('propertySearchApp')
  .constant('paConfiguration', {
    initialExtentJson:{"xmin":807259.5478381776,"ymin":451155.83217993786,"xmax":965259.5478381779,"ymax":570822.4988466047,"spatialReference":{"wkid":2236}},
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
            {label:"Zoning", value:false, url:"/ArcGIS/rest/services/MD_PropertySearchApp_Test/MapServer/8"}],


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
    "url":"images/map-pin-64.png", 
    "height":40,
    "width":40,
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
