'use strict';

angular.module('cheapTodayApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('goods', {
        url: '/goods',
        templateUrl: 'app/goods/goods.html',
        controller: 'GoodsCtrl'
      });
  });