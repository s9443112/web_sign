var app = require('express')();
var express = require('express');

var http = require('http').Server(app);

var routers = require('./routers');
var cookie = require('cookie-parser');

app.set('trust proxy', 'loopback');
app.set('view engine', 'ejs');  
app.use('/static', express.static('static'));
app.set('port', process.env.PORT || 8000);// 設定環境port
routers.setRequestUrl(app); //設定路徑

http.listen(app.get('port'), '0.0.0.0', function () { 
    console.log("The server started in " + '127.0.0.1:' + app.get('port'));
    console.log('---------------------------------------');
});