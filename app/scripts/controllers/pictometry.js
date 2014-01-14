'use strict';

angular.module('propertySearchApp')
  .controller('PictometryCtrl', ['$scope', '$routeParams', 'esriGisGeometryService', function ($scope, $routeParams, esriGisGeometryService){

  $scope.parentWindow = "hello";//window.opener.$windowScope;
  
  $scope.$watch('parentWindow', function(){
    console.log("The latitude is ", $routeParams.latitude);
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
      console.log("THIS IS A TETST");
      //for Pictometry Test
      //var addressPoint = '{"lat": 25.627247, "lon": -80.419588}';
      var addressPoint = '{"lat":' +  latitude + ',' + '"lon":' + longitude + '}';
      
      
      postwith("http://s0142357.miamidade.gov/MDCPictometry/index.aspx", { 'addressPoint': addressPoint });

    }


    var postwith = function (to, d) {

      var myForm = document.createElement("form");

      myForm.method = "post";
      myForm.target = "iframeGisMap";
      myForm.action = to;

      for (var k in d) {
        console.log("d[k] is ", d[k]);
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
