var request = require('request');
var cheerio = require('cheerio');

/**
 * 获取文章分类列表
 *
 * @param url
 * @param cb
 */
exports.classList = function (url, cb) {
    request(url, function (err, res) {
        if (err) {
            return cb(err);
        }

        var $ = cheerio.load(res.body.toString());
        var list = [];
        $('.classList li a').each(function () {
            var $me = $(this);
            var item = {
                name: $me.text(),
                url: $me.attr('href')
            };

            // 获取ID
            var s = item.url.match(/articlelist_\d+_(\d+)_\d\.html/);
            if (Array.isArray(s)) {
                item.id = s[1];
                list.push(item);
            }
        });

        cb(null, list);
    });
};

/**
 * 获取文章列表
 *
 * @param url
 * @param cb
 */
exports.articleList = function (url, cb) {
    request(url, function (err, res) {
        if (err) {
            return cb(err);
        }

        var $ = cheerio.load(res.body.toString());
        var list = [];

        $('.SG_connBody .blog_title_h').each(function () {
            var $me = $(this);
            var title = $me.find('.blog_title a');
            var time = $me.find('time SG_txtc');

            var item = {
                title: title.text(),
                url: title.attr('href'),
                time: time.text()
            };
            console.log(item);
            list.push(item);
        });

        cb(null, list);
    });
};