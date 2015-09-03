'use strict';

describe('Filter: goodsByCategory', function () {

  // load the filter's module
  beforeEach(module('cheapTodayApp'));

  // initialize a new instance of the filter before each test
  var goodsByCategory;
  beforeEach(inject(function ($filter) {
    goodsByCategory = $filter('goodsByCategory');
  }));

  it('should return the input prefixed with "goodsByCategory filter:"', function () {
    var text = 'angularjs';
    expect(goodsByCategory(text)).toBe('goodsByCategory filter: ' + text);
  });

});
