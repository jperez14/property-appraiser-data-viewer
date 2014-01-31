'use strict';

angular.module('propertySearchApp')
  .controller('PictometryCtrl', ['$scope', '$routeParams', 'esriGisGeometryService', function ($scope, $routeParams, esriGisGeometryService){

    $scope.parentWindow = "hello";//window.opener.$windowScope;
    
    $scope.$watch('parentWindow', function(){
      //console.log("the value of x is ",
      //$scope.parentWindow.property.location.x);

      // get latitude and longitude
      var geometry = esriGisGeometryService.xyToLatitudeLongitude($routeParams.x, 
                                                                  $routeParams.y);
      
      // open new window
      geometry.then(function(location){
        initMe(location.latitude, location.longitude);
      });

    })
    
    
    var initMe = function(latitude, longitude) {

      //var addressPoint = '{"lat": 25.627247, "lon": -80.419588}';
      var addressPoint = '{"lat":' +  latitude + ',' + '"lon":' + longitude + '}';

      //IE Check. Works for IE6 and on
      if (/*@cc_on!@*/false || !!document.documentMode) {
	var myWindow = window.open("", "windowGISMap", "width=800,height=800");
	postwith("http://gisweb.miamidade.gov/MDCPictometry/index.aspx", { 'addressPoint': addressPoint }, "windowGISMap");

      } else {
        postwith("http://gisweb.miamidade.gov/MDCPictometry/index.aspx",{'addressPoint': addressPoint}, "iframeGisMap");


      }

      


    }


    var postwith = function (to, d, target) {

      var myForm = document.createElement("form");

      myForm.method = "post";
      myForm.target = target;
      myForm.action = to;

      for (var k in d) {
        var input = document.createElement("input");
        input.setAttribute("id", k);
        input.setAttribute("name", k);
        input.setAttribute("value", d[k]);
        myForm.appendChild(input);
      }


      document.body.appendChild(myForm);

      myForm.submit();

      document.body.removeChild(myForm);

    }
    

    
  }]); 
