'use strict';

angular.module('cheapTodayApp')
  .controller('GoodsCtrl', function ($scope, $filter, goods) {

    $scope.filteredGoods = [];
    $scope.allGoods = [];
    $scope.currentPage = 0;
    $scope.itemsPerPage = 20;

    function formArrayFrom1toN(N) {
      var i, arr = [];
      for (i = 0; i < N; i += 1) {
        arr.push(i);
      }
      return arr;
    }

    function saveToLocalStorage(val) {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      localStorage.setItem('ctGoods', JSON.stringify(val));
      localStorage.setItem('ctExpires', JSON.stringify(tomorrow));
    }

    function loadFromLocalStorage() {
      return (new Date(JSON.parse(localStorage.getItem('ctExpires'))) > new Date()) ? JSON.parse(localStorage.getItem('ctGoods')) : null;
    }

    function loadGoods() {
      var ctGoods = loadFromLocalStorage();
      if (!ctGoods || ctGoods.length === 0) {
        goods.findGoods().then(function (good) {
          init(good);
          saveToLocalStorage(good);
        });
      } else {
        init(ctGoods);
      }
    }

    function init(val) {
      $scope.filteredGoods = val;
      $scope.allGoods = val;
      $scope.setPages();
    }

    $scope.setPages = function () {
      $scope.pages = formArrayFrom1toN(Math.ceil($scope.filteredGoods.length / $scope.itemsPerPage));
    };

    $scope.setCurrentPage = function (p) {
      $scope.currentPage = p;
    };

    $scope.resetPagination = function () {
      $scope.setCurrentPage(0);
      $scope.setPages();
    };

    $scope.findGoods = function (txt) {
      $scope.filteredGoods = $filter('filter')($scope.allGoods, txt, false);
      $scope.resetPagination();
    };

    $scope.filterGoodsByPrice = function (min, max) {
      $scope.filteredGoods = $filter('goodsByPrice')($scope.allGoods, {min: min, max: max}, false);
      $scope.resetPagination();
    };

    $scope.filterGoodsByStore = function (store) {
      $scope.filteredGoods = $filter('goodsByShop')($scope.allGoods, store, false);
      $scope.resetPagination();
    };

    $scope.filterGoodsByCategory = function (categoryId) {
      $scope.filteredGoods = $filter('goodsByCategory')($scope.allGoods, categoryId, false);
      $scope.resetPagination();
    };

    loadGoods();
    $scope.filterGoodsByCategory(1);

  });

