var path = require('path');
var config = require('./config');
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(config.port, function (err) {
    if(err){
        return console.error(err);
    }

    console.log('server success port ' + config.port);
});

// 捕捉异常
process.on('uncaughtException', function (err) {
    console.error(err);
});