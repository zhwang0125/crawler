var path = require('path');
var config = require('./config');
var express = require('express');
var app = express();

var read = require('./update/read');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

// 获取分类列表
app.get('/classList', function (req, res) {
    read.classList(config.url, function (err, list) {
        if (err) {
            return res.json(err);
        }

        res.json(list);
    })
});

// 获取文章列表
app.get('/articleList', function (req, res) {
    read.articleList(config.url, function (err, list) {
        if (err) {
            return res.json(err);
        }

        res.json(list);
    })
});

// 获取文章内容
app.get('/articleDetail', function (req, res) {
    read.articleDetail('http://blog.sina.com.cn/s/blog_69e72a420102w0tg.html', function (err, list) {
        if (err) {
            return res.json(err);
        }

        res.json(list);
    })
});

app.listen(config.port, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('server success port ' + config.port);
});

// 捕捉异常
process.on('uncaughtException', function (err) {
    console.error('uncaughtException: %s', err);
});