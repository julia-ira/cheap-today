'use strict';

angular.module('cheapTodayApp')
  .controller('GoodsCtrl', function ($scope, $filter, $http, goods) {

    $scope.filteredGoods = [];
    $scope.allGoods = [];
    $scope.categories = [];
    $scope.currentPage = 0;
    $scope.itemsPerPage = 20;
    $scope.stores = [{name:"Comfy",id:"comfy"},{name:"Ельдорадо",id:"eldorado"},{name:"КТС",id:"ktc"},{name:"Фокстрот",id:"foxtrot"},{name:"Алло",id:"allo"},{name:"Метро",id:"metro"}];

    $(function() {
       $(".filtering-nav li").click(function() {
          $(".filtering-nav li").not(this).removeClass("active");
          $(this).toggleClass("active");
          var navitem = "#filtering-expand-" + $(this).attr("data-expand");
          $(".filtering-expand").not(navitem).slideUp("normal");
          $(navitem).slideToggle("normal");
       });
       $("#filterPrice").ionRangeSlider({
          onChange: function (data){
            $scope.filterGoodsByPrice(data.from,data.to);
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
      $scope.allGoods = val;
      $scope.setPages();
      $scope.categories();
    }

    $scope.categories = function() {
      $http.get('/resources/categories.json').then(function (categories) {
        $scope.categories = categories.data;
      });
    };

    $scope.setPages = function () {
      $scope.pages = formArrayFrom1toN(Math.ceil($scope.filteredGoods.length / $scope.itemsPerPage));
    };

    $scope.setCurrentPage = function (p) {
      $scope.currentPage = p;
      window.scrollTo(0,0);
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
      console.log(min);
      console.log(max);
      $scope.filteredGoods = $filter('goodsByPrice')($scope.allGoods, {min: min, max: max}, false);
      $scope.resetPagination();
    };

    $scope.filterGoodsByStore = function (store) {
      console.log($scope.filteredGoods);
      console.log($scope.allGoods);
      $scope.filteredGoods = $filter('goodsByShop')($scope.allGoods, store, false);
      $scope.resetPagination();
    };

    $scope.filterGoodsByCategory = function (categoryId) {
        $scope.filteredGoods = $filter('goodsByCategory')($scope.allGoods, {
          categoryId: categoryId,
          categories: $scope.categories
        }, false);
        $scope.resetPagination();
    };

    loadGoods();

  });

