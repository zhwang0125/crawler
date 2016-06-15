var async = require('async');
var save = require('./save');
var read = require('./read');
var config = require('../config');

var classList = [];
var articleList = {};

async.series([
    // 获取文章分类
    function (done) {
        console.log('======>1');
        read.classList(config.url, function (err, list) {
            if (err) {
                return done(err);
            }

            classList = list;

            save.saveClassList(classList, function (err) {
                done(err);
            });
        });
    },
    // 查询文章列表
    function (done) {
        console.log('======>2');
        async.eachSeries(classList, function (c, next) {
            read.articleList(c.url, function (err, list) {
                articleList[c.id] = list;
                next(err);
            });

        }, function (err) {
            if (err) {
                return done(err);
            }

            // 保存文章列表
            async.eachSeries(Object.keys(articleList), function (key, next) {
                save.saveArticleList(key, articleList[key], next);
            }, done);
        });
    },
    // 去掉重复文章列表
    function (done) {
        var articles = {};

        Object.keys(articleList).forEach(function (key) {
            articleList[key].forEach(function (item) {
                articles[item.id] = item;
            });
        });

        articleList = [];
        Object.keys(articles).forEach(function (key) {
            articleList.push(articles[key]);
        });

        done();
    },
    // 读取文章并保存
    function (done) {
        console.log('articleList ======>' + articleList.length);
        async.eachSeries(articleList, function (item, next) {
            save.isArticleExists(item.id, function (err, exist) {
                if (err) {
                    return next(err);
                }

                if (exist) {
                    return next(err);
                }

                read.articleDetail(item.url, function (err, det) {
                    if (err) {
                        return next(err);
                    }

                    save.saveArticleDetail(item.id, det.tags, det.content, function (err) {
                        if (err) {
                            return next(err);
                        }

                        save.saveArticleTags(item.id, det.tags, next)
                    });
                });
            });
        }, done);
    }
], function (err) {
    console.log(err);
    console.log('success');
});