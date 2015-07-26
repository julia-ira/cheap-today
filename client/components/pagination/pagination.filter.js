'use strict';

angular.module('cheapTodayApp')
  .filter('pagination', function () {
    return function (input, start) {
      if (input) {
        start = +start;
        return input.slice(start);
      }
      return [];
    };
  });
