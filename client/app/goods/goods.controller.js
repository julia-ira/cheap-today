'use strict';

angular.module('cheapTodayApp')
  .controller('GoodsCtrl', function ($scope, $filter, $http, goods) {

    $scope.filteredGoods = [];
    $scope.categories = [];
    $scope.numOfGoods = 0;
    $scope.currentPage = 0;
    $scope.itemsPerPage = 20;
    $scope.stores = [
      {name: "Comfy", id: "comfy"},
      {name: "Ельдорадо", id: "eldorado"},
      {name: "КТС", id: "ktc"},
      {name: "Фокстрот", id: "foxtrot"},
      {name: "Алло", id: "allo"},
      {name: "Метро", id: "metro"}
    ];

    $(function () {
      $(".filtering-nav li").click(function () {
        $(".filtering-nav li").not(this).removeClass("active");
        $(this).toggleClass("active");
        var navitem = "#filtering-expand-" + $(this).attr("data-expand");
        $(".filtering-expand").not(navitem).slideUp("normal");
        $(navitem).slideToggle("normal");
      });
      $("#filterPrice").ionRangeSlider({
        onFinish: function (data) {
          if (!_.isUndefined($scope.filterStrategy)) { // should be a better solution to assign data.from and data.to
            $scope.filterStrategy.price = {
              min: data.from,
              max: data.to
            };
          } else {
            $scope.filterStrategy = {
              price: {
                min: data.from,
                max: data.to
              }
            };
          }
          $scope.filterGoods($scope.filterStrategy);
        }
      });
    });

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
      $scope.numOfGoods = val.length;
      $scope.setPages();
      $scope.categories();
    }

    $scope.cleanFilterStrategy = function () { // should also be cleaned ionRangeSlider!!
      $scope.filterStrategy = {};
      $scope.filteredGoods = loadFromLocalStorage();
    };

    $scope.categories = function () {
      $http.get('/resources/categories.json').then(function (categories) {
        $scope.categories = categories.data;
      });
    };

    $scope.setPages = function () {
      $scope.pages = formArrayFrom1toN(Math.ceil($scope.filteredGoods.length / $scope.itemsPerPage));
    };

    $scope.setCurrentPage = function (p) {
      $scope.currentPage = p;
      window.scrollTo(0, 0);
    };

    $scope.resetPagination = function () {
      $scope.setCurrentPage(0);
      $scope.setPages();
    };

    $scope.findGoods = function (txt) { // doesn't work
      $scope.cleanFilterStrategy();
      $filter('filter')($scope.filteredGoods, txt, false);
      $scope.resetPagination();
    };

    $scope.filterGoods = function () {
      console.log($scope.filterStrategy);
      $scope.filteredGoods = loadFromLocalStorage();

      if (!_.isUndefined($scope.filterStrategy.price)) { // UI is not refreshed after this filter
        $filter('goodsByPrice')($scope.filteredGoods, {
          min: $scope.filterStrategy.price.min,
          max: $scope.filterStrategy.price.max
        }, false);
      }

      if (!_.isUndefined($scope.filterStrategy.store)) {
        $filter('goodsByShop')($scope.filteredGoods, $scope.filterStrategy.store.id, false);
      }

      if (!_.isUndefined($scope.filterStrategy.category)) {
        $filter('goodsByCategory')($scope.filteredGoods, {
          categoryId: $scope.filterStrategy.category.id,
          categories: $scope.categories
        }, false);
      }

      $scope.resetPagination();
    };

    loadGoods();

  });

