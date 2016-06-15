var cronJob = require('cron').CronJob;
var spawn = require('child_process').spawn;
var path = require('path');
var config = require('./config');
var express = require('express');
var app = express();

var read = require('./update/read');
var save = require('./update/save');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(config.port, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('server success port ' + config.port);
});

// 定时任务
var job = new cronJob(config.cron, function () {
    var update = spawn(process.execPath, [path.resolve(__dirname, 'update/all.js')]);
    update.stdout.pipe(process.stdout);
    update.stderr.pipe(process.stderr);
    update.on('close', function (code) {
        console.log('更新任务结束，代码=%d', code);
    });
});
job.start();

// 捕捉异常
process.on('uncaughtException', function (err) {
    console.error('uncaughtException: %s', err);
});

