'use strict';

angular.module('cheapTodayApp')
  .filter('goodsByPrice', function () {

    return function (input, minMax) {
      var opt;

      if (!minMax.min && minMax.max) {
        opt = 'lessThan';
      } else if (minMax.min && !minMax.max) {
        opt = 'moreThan';
      } else if (minMax.min === minMax.max) {
        opt = 'equals';
      } else {
        opt = 'between';
      }

      function checkGood(good) {
        var price = parseInt(good.price, 10);
        switch (opt) {
          case 'lessThan':
            return price < minMax.max;
          case 'between':
            return price >= minMax.min && price <= minMax.max;
          case 'moreThan':
            return price > minMax.min;
          case 'equals':
            return price === minMax.min;
        }
      }

      _.remove(input, function(good) {
        return !checkGood(good);
      });

      return input;
    };
  });
