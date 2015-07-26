'use strict';

angular.module('cheapTodayApp')
  .service('goods', function ($q, $http) {

    return {
      findGoods: function () {
        var deferred = $q.defer();
        $http.get('/api/goods/')
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }
    }
  });
