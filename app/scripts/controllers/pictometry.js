'use strict';

angular.module('propertySearchApp')
  .controller('PictometryCtrl', ['$scope', function ($scope){

  $scope.parentWindow = window.opener.$windowScope;
  
  $scope.$watch('parentWindow', function(){
    console.log("the value of x is ", $scope.parentWindow.property.location.x);
    initMe();
  })
    
 
    var initMe = function() {
      
      //for Pictometry Test
      var addressPoint = '{"lat": 25.627247, "lon": -80.419588}';
      
      
      postwith("http://s0142357.miamidade.gov/MDCPictometry/index.aspx", { 'addressPoint': addressPoint });

    }


    var postwith = function (to, d) {

      var myForm = document.createElement("form");

      myForm.method = "post";
      myForm.target = "iframeGisMap";
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
