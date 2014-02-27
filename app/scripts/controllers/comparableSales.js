'use strict';

angular.module('propertySearchApp')
  .controller('ComparableSalesCtrl', ['$scope', '$routeParams', function ($scope, $routeParams){

    $scope.folio = $routeParams.folio || "";
    
    var postwith = function (to, d, target) {
      console.log(d);
      var form = document.createElement("form");

      form.method = "post";
      form.target = target;
      form.action = to;

      for (var k in d) {
        var input = document.createElement("input");
        input.setAttribute("id", k);
        input.setAttribute("name", k);
        input.setAttribute("value", d[k]);
        form.appendChild(input);
      }


      document.body.appendChild(form);

      form.submit();

      document.body.removeChild(form);

    }


    postwith("http://gisims2.miamidade.gov/Myneighborhood/salesmap.asp",
            {"folio":$scope.folio,"Cmd":"FOLIO"},
             "iframeComparableSales"
            );

  }]);
