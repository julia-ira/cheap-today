'use strict';

angular.module('cheapTodayApp')
  .filter('goodsByCategory', function () {
    return function (input, filterParams) {
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

      var noCategory = _.result(_.find(filterParams.categories, function (data) {
        return data.keywords.length === 0;
      }), 'id');

      if (filterParams.categoryId !== noCategory) {
        keywords = _.result(_.find(filterParams.categories, {'id': filterParams.categoryId}), 'keywords');
      } else {
        keywords = _.flatten(_.pluck(filterParams.categories, 'keywords'));
      }

      _.remove(input, function (good) {
        return filterParams.categoryId !== noCategory ? !checkTitleForKeywords(good.title) : checkTitleForKeywords(good.title);
      });

      return input;
    };
  });
