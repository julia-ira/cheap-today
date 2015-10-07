'use strict';

angular.module('cheapTodayApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [/*{ 'title': 'Товари', 'link': '/goods' }*/];

    $scope.isActive = function (route) {
      return route === $location.path();
    };
  });
