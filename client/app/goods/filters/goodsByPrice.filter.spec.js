'use strict';

describe('Filter: goodsByPrice', function () {

  // load the filter's module
  beforeEach(module('cheapTodayApp'));

  // initialize a new instance of the filter before each test
  var goodsByPrice;
  beforeEach(inject(function ($filter) {
    goodsByPrice = $filter('goodsByPrice');
  }));

  it('should return the input prefixed with "goodsByPrice filter:"', function () {
    var text = 'angularjs';
    expect(goodsByPrice(text)).toBe('goodsByPrice filter: ' + text);
  });

});
