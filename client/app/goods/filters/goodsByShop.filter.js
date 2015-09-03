'use strict';

angular.module('cheapTodayApp')
  .filter('goodsByShop', function () {
    return function (input, store) {
      _.remove(input, function(good) {
        return !(good.store === store);
      });
      return input;
    };
  });
