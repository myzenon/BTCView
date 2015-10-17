var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var router = express.Router();
var favicon = require('serve-favicon');

var sendError = function (from, error) {
	console.error('Error : ' + error.message + ' [' + from + ']');
};

// Start GET Price Server
require('./price.js')(io, sendError);

app.use(favicon('public/favicon.ico'));
app.use('/btc', express.static('public'));

// Start HTTP Server
http.listen(80, function() { console.log('MSG : Start HTTP Server at ' + http.address().address + ' via port ' + http.address().port); });
