'use strict';

describe('Filter: goodsByShop', function () {

  // load the filter's module
  beforeEach(module('cheapTodayApp'));

  // initialize a new instance of the filter before each test
  var goodsByShop;
  beforeEach(inject(function ($filter) {
    goodsByShop = $filter('goodsByShop');
  }));

  it('should return the input prefixed with "goodsByShop filter:"', function () {
    var text = 'angularjs';
    expect(goodsByShop(text)).toBe('goodsByShop filter: ' + text);
  });

});
