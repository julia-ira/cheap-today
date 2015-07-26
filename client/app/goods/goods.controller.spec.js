'use strict';

describe('Controller: GoodsCtrl', function () {

  // load the controller's module
  beforeEach(module('cheapTodayApp'));

  var GoodsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GoodsCtrl = $controller('GoodsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
