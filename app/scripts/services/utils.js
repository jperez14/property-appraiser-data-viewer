'use strict';

angular.module('propertySearchApp')
  .factory('utils', function () {

    var isUndefinedOrNull = function(val){ return _.isUndefined(val) || _.isNull(val)}
    
    var isTypeUndefined = function(val){return typeof val === "undefined"}

    var isTypeUndefinedOrIsEmpty = function(val){return typeof val === "undefined" || _.isEmpty(val) }
    

    // Public API
    return {
      isUndefinedOrNull:isUndefinedOrNull,
      isTypeUndefined:isTypeUndefined,
      isTypeUndefinedOrIsEmpty:isTypeUndefinedOrIsEmpty
    };    
    
  });
