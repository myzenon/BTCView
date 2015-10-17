var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('window-all-closed', function() {
  app.quit();
});
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1024, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/html/index.html');
  // mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
var ipc = require('ipc');

var sendError = function (from, error) {
	console.error('Error : ' + error.message + ' [' + from + ']');
};

// Start GET Price Server
require('./price.js')(ipc, sendError);
