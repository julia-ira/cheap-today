'use strict';

angular.module('cheapTodayApp')
  .controller('NavbarCtrl', function ($scope, $location) {

    $scope.menu = [
      /*{'title': 'Знижки та розпродажі', 'link': '/promo'},
      {'title': 'Акційні товари', 'link': '/goods'},
      {'title': 'Контакти', 'link': '/contact'}*/
    ];

    $scope.isActive = function (route) {
      return route === $location.path();
    };

  });
