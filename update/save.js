var async = require('async');
var mysql = require('mysql');
var config = require('../config');
var db;

function handleError(err) {
    if (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        } else {
            console.error(err.stack || err);
        }
    }
}

// 连接数据库
function connect() {
    db = mysql.createConnection(config);
    db.connect(handleError);
    db.on('error', handleError);
}

connect();

/**
 * 保存文章分类
 *
 * @param list
 * @param cb
 */
exports.saveClassList = function (list, cb) {
    async.eachSeries(list, function (item, next) {
        db.query('select * from `class_list` where id=? limit 1', [item.id], function (err, data) {
            if (err) {
                return next(err);
            }

            if (Array.isArray(data) && data.length >= 1) {
                db.query('update `class_list` set `name`=?, `url`=? where `id`=?', [item.id], next);
            }
            else {
                db.query('insert into `class_list`(`id`, `name`, `url`) values (?, ?, ?)', [item.id, item.name, item.url], next);
            }
        });
    }, cb);
};

/**
 * 保存文章
 *
 * @param class_id
 * @param list
 * @param cb
 */
exports.saveArticleList = function (class_id, list, cb) {
    async.eachSeries(list, function (item, next) {
        db.query('select * from `article_list` where id=? and class_id=? limit 1', [item.id, class_id], function (err, data) {
            if (err) {
                return next(err);
            }

            // 将发布时间转成时间戳（秒）
            var created_time = new Date(item.time).getTime() / 1000;

            if (Array.isArray(data) && data.length >= 1) {
                db.query('update `article_list` SET `title`=?, `url`=?, `class_id`=?, `created_time`=? where `id`=? and `class_id`=?',
                    [item.title, item.url, class_id, created_time, item.id, class_id], next);
            }
            else {
                db.query('insert into `article_list`(`id`, `title`, `url`, `class_id`, `created_time`) values (?, ?, ?, ?, ?)',
                    [item.id, item.title, item.url, class_id, created_time], next);
            }
        });
    }, cb);
};

