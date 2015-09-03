'use strict';

angular.module('cheapTodayApp')
  .filter('goodsByCategory', function ($http) {
    return function (input, id) {
      var keywords = [];

      function checkTitleForKeywords(title) {
        var inCategory = false;
        title = title ? title.toLowerCase().split(' ') : [];

        title.forEach(function (word) {
          keywords.forEach(function (key) {
            if (_.includes(word, key)) {
              inCategory = true;
              return inCategory;
            }
          });
        });

        return inCategory;
      }

      $http.get('/resources/categories.json').then(function (res) {
        var noCategory = _.result(_.find(res.data, function (data) {
          return data.keywords.length === 0;
        }), 'id');

        if (id !== noCategory) {
          keywords = _.result(_.find(res.data, {'id': id}), 'keywords');
        } else {
          keywords = _.flatten(_.pluck(res.data, 'keywords'));
        }

        _.remove(input, function (good) {
          return id !== noCategory ? !checkTitleForKeywords(good.title) : checkTitleForKeywords(good.title);
        });

        return input;
      });
    };
  });
