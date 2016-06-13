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
            var time = $me.find('.time');

            var item = {
                title: title.text(),
                url: title.attr('href')
            };

            var t = time.text();
            if (t.indexOf('(') > -1) {
                t = t.replace('(', '');
            }
            if (t.indexOf(')') > -1) {
                t = t.replace(')', '');
            }
            item.time = t;

            // 取出文章ID
            var s = item.url.match(/blog_([a-zA-Z0-9]+)\.html/);
            if (Array.isArray(s)) {
                item.id = s[1];
                list.push(item);
            }
        });

        cb(null, list);
    });
};

/**
 * 获取博文内容
 *
 * @param url
 * @param cb
 */
exports.articleDetail = function (url, cb) {
    request(url, function (err, res) {
        if (err) {
            return cb(err);
        }

        var $ = cheerio.load(res.body.toString());

        var tags = [];
        $('.articalTag .blog_tag h3').each(function () {
            var $me = $(this);
            var tag = $me.find('a').text();
            if (tag) {
                tags.push(tag.trim());
            }
        });

        var content = $('.articalContent').html().trim();
        cb(null, {tags: tags, content: content});
    });
};