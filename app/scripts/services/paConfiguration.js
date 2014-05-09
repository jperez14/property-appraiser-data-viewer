'use strict';

angular.module('propertySearchApp')
  .constant('paConfiguration', {
    clientAppName:"PropertySearch",
    clientAppNameGeo :"PropertySearch_Geo",
    initialExtentJson:{"xmin":807259.5478381776,"ymin":451155.83217993786,"xmax":965259.5478381779,"ymax":570822.4988466047,"spatialReference":{"wkid":2236}},
    wkidJson:{wkid:2236},
    urlPropertyAppraiser:"/PApublicServiceProxy/PaServicesProxy.ashx",
    urlAerialMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/MDCImagery/MapServer",
    urlStreetMap:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MapCache/BaseMap/MapServer",
    urlCoordFromFolio:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MD_PA_PropertySearch/MapServer/19",
    urlParcelLayer:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MD_PA_PropertySearch/MapServer/8",
    urlParcelBoundariesLayer:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MD_PA_PropertySearch/MapServer/1",
    urlMunicipalityLayer:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MD_PA_PropertySearch/MapServer/2",
    urlGeometryService:"http://gisweb.miamidade.gov/ArcGIS/rest/services/Geometry/GeometryServer/",
    urlLocatorService:"http://gisws.miamidade.gov/ArcGIS/rest/services/MDC_Locators/",
    additionalInfoUrls:{
      'Community Services Near Property':{label:'Community Services Near Property',
                                          url:'http://gisweb.miamidade.gov/communityservices/CommunityServicesAll.html',
                                          params:{x:null,y:null,bufferDistance:5,address:null}},
      'Community Services Application': {label:'Community Services Application',
                                         url:'http://gisweb.miamidade.gov/communityservices',
                                         params:{address:null}},
      'Business Incentives':{label:'Business Incentives',
                             url:'http://gisweb.miamidade.gov/businessincentive/default.aspx',
                             params:{searchType:'address', paramvalue:null}},
      'Environmental Considerations':{label:'Environmental Considerations',
                                      url:'http://gisweb.miamidade.gov/environmentalconsiderations/default.aspx',
                                      params:{searchtype:'address', paramvalue:null}}
    },
    additionalInfoLayers:[{label:"Community Development District", 
                           url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/BIECService/MD_BIECService/MapServer/4",
                           attributes:["NAME"]},
                          {label:"Community Redevelopment Area",
                           url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/BIECService/MD_BIECService/MapServer/5",
                           attributes:["LOCATION"]},
                          {label:"Empowerment Zone",
                           url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/BIECService/MD_BIECService/MapServer/7",
                           attributes:["NAME"]},
                          {label:"Enterprise Zone",
                           url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/BIECService/MD_BIECService/MapServer/8",
                           attributes:["NAME"]},
                          {label:"Zoning Land Use",
                           url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/BIECService/MD_BIECService/MapServer/9",
                           attributes:["LU"]},
                          //                         {label:"Zoning Land Use Description",
                          //                          url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/MD_PropertySearchApp/MapServer/5",
                          //                          attributes:["LUDESC"]},
                          {label:"Urban Development",
                           url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/BIECService/MD_BIECService/MapServer/15",
                           attributes:["UDB"]},
                          {label:"Zoning",
                           url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/MD_PropertySearchApp/MapServer/",
                           attributes:["ZONE"]}

                         ],
    layers:[{label:"Municipality", value:false, url:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MD_PA_PropertySearch/MapServer/2", layerSymbol:{"color":[0,34,102,100],
                                                                                                                                                      "outline":{"color":[0,34,102,255],
                                                                                                                                                                 "width":1,
                                                                                                                                                                 "type":"esriSLS",
                                                                                                                                                                 "style":"esriSLSSolid"},
                                                                                                                                                      "type":"esriSFS",
                                                                                                                                                      "style":"esriSFSSolid"},
             attributes:['NAME']},
            {label:"Zip Code", value:false, url:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MD_PA_PropertySearch/MapServer/3", layerSymbol:{"color":[0,255,217,100],
                                                                                                                                                  "outline":{"color":[0,255,217,255],
                                                                                                                                                             "width":1,
                                                                                                                                                             "type":"esriSLS",
                                                                                                                                                             "style":"esriSLSSolid"},
                                                                                                                                                  "type":"esriSFS",
                                                                                                                                                  "style":"esriSFSSolid"},
             attributes:['ZIPCODE']},

            {label:"Commission District", value:false, url:"http://gisweb.miamidade.gov/ArcGIS/rest/services/MD_PA_PropertySearch/MapServer/9",layerSymbol:{"color":[166,42,42, 100],
                                                                                                                                                            "outline":{"color":[166,42,42,255],
                                                                                                                                                                       "width":1,
                                                                                                                                                                       "type":"esriSLS",
                                                                                                                                                                       "style":"esriSLSSolid"},
                                                                                                                                                            "type":"esriSFS",
                                                                                                                                                            "style":"esriSFSSolid"},
             attributes:['ID']}
            //            {label:"PA Zoning", value:false, url:"http://s0142357.miamidade.gov/ArcGIS/rest/services/MD_PropertySearchApp_test/MapServer/9", layerSymbol:{"color":[0,100,0,100],
            //                                      "outline":{"color":[0,100,0,255],
            //                                                 "width":1,
            //                                                 "type":"esriSLS",
            //                                                 "style":"esriSLSSolid"},
            //                                      "type":"esriSFS",
            //                                      "style":"esriSFSSolid"},
            //            attributes:['ZONEDESC']}
           ],


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
                                       "width":2,
                                       "type":"esriSLS",
                                       "style":"esriSLSSolid"},
                            "type":"esriSFS",
                            "style":"esriSFSSolid"}
  });
