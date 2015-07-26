'use strict';

var _ = require('lodash'),
  request = require('request'),
  cheerio = require('cheerio'),
  async = require('async');

function comfyParser(callback) {
  var url = "http://comfy.ua/specials-proposals.html", $, pages = 1;
  async.series([
      function (callback) { // get pages
        request.get(url, function (error, response, html) {
          if (!error && response.statusCode == 200) {
            $ = cheerio.load(html);
            pages = $('#categoryToolbar').find('div.pager__i ul').children().length / 2 - 2;
            callback();
          }
        });
      },
      function (callback) {
        var urls = _.range(1, pages + 1, 1),
          parser = function (page, callback) {
            var goods = [];
            request.get(url + "?p=" + page, function (error, response, html) {
              if (!error && response.statusCode == 200) {
                $ = cheerio.load(html);
                $('#productItems').find('td.content-header').each(function (index, element) {
                  goods.push({
                    title: $(element).find('.products-tiles__cell__name a').first().attr('title'),
                    img: $(element).find('.products-tiles__cell__img img').first().attr('src'),
                    price: $(element).parent().parent().find('.price__special span').first().text().trim().slice(0, -5),
                    link: $(element).find('.products-tiles__cell__name a').first().attr('href'),
                    store: 'comfy'
                  });
                });
                callback(null, goods);
              }
            });
          };
        async.map(urls, parser, function (err, results) {
          callback(err, [].concat.apply([], results));
        });
      }
    ],
    function (err, results) {
      callback(err, [].concat.apply([], results.filter(empty)));
    });
}

function eldoradoParser(callback) {
  var url = "http://www.eldorado.com.ua/best_offers/", $, goods = [];
  request.get(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(html);
      $('#hide-city-products').find('div.one-city-element').each(function (index, element) {
        goods.push({
          title: $(element).find('.g-i-title a').first().text(),
          img: $(element).find('img.tips').first().attr('src'),
          price: $(element).find('.g-i-price-buy .price').first().text().trim().replace(/ /g, '').slice(0, -2),
          link: $(element).find('.g-i-title a').first().attr('href'),
          store: 'eldorado'
        });
      });
      callback(null, goods);
    }
  });
}

function ktcParser(callback) {
  var url = "http://www.ktc-ua.com/", $, goods = [];
  request.get(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(html);
      $('#views_slideshow_cycle_teaser_section_product_grid_new-block').find('div.views-slideshow-cycle-main-frame-row-item ').each(function (index, element) {
        goods.push({
          title: $(element).find('.views-field-title span').first().text(),
          img: url + $(element).find('img.image-style-new-product-block-style').first().attr('src'),
          price: $(element).find('td.component-total').first().text().trim().slice(0, -4),
          link: url + $(element).find('img.image-style-new-product-block-style').first().parent().attr('href'),
          store: 'ktc'
        });
      });
      callback(null, goods);
    }
  });
}

function foxtrotParser(callback) {
  var url = "http://www.foxtrot.com.ua", $, goods = [];
  request.get(url + '/ru/Home/new', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(html);
      $('.item').each(function (index, element) {
        goods.push({
          title: $(element).find('h5').first().text(),
          img: url + $(element).find('img').first().attr('src'),
          price: $(element).find('.price').children().first().text().trim().slice(0, -3),
          link: url + $(element).find('a.img').first().attr('href'),
          store: 'foxtrot'
        });
      });
      callback(null, goods);
    }
  });
}

function alloParser(callback) {
  var url = "http://new.allo.ua/gif/pages/view/", urls = _.range(32, 42, 1), $, goods = [],
    parser = function (page, callback) {
      var goods = [];
      request.get(url + page + '?xdm_e=http://allo.ua&xdm_c=default7522&xdm_p=1', function (error, response, html) {
        if (!error && response.statusCode == 200) {
          $ = cheerio.load(html);
          $('#tovar-item').find('li.imagess').each(function (index, element) {
            goods.push({
              title: $(element).find('a.title').first().text(),
              img: $(element).find('img').first().attr('src'),
              price: $(element).find('.price strong big').first().text().trim().replace(/ /g, ''),
              link: $(element).find('a.title').first().attr('href'),
              store: 'allo'
            });
          });
        }
        callback(null, goods);
      });
    };
  async.map(urls, parser, function (err, results) {
    callback(err, [].concat.apply([], results));
  });
}

function metroParser(callback) {
  var url = "http://promo.metro.ua", $, goods = [];
  request.get(url + "/ua/catalog/list/1?categoryId=62", function (error, response, html) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(html);
      $('ul.item-list li').each(function (index, element) {
        goods.push({
          title: $(element).find('h4 a').first().text(),
          img: url + $(element).find('a img').first().attr('src'),
          price: $(element).find('.price span').first().text().trim().slice(0, -2),
          link: url + $(element).find('h4 a').first().attr('href'),
          store: 'metro'
        });
      });
      callback(null, goods);
    }
  });
}

exports.index = function (req, res) {
  async.parallel([
    comfyParser,
    eldoradoParser,
    ktcParser,
    foxtrotParser,
    alloParser,
    //metroParser
  ], function (err, results) {
    res.json([].concat.apply([], results));
  });
};

function empty(element) {
  return element !== null && element !== undefined;
}
