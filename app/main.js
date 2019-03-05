var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

var isDebug = process.argv[2] === "--dev";
var settings = require("./package.json");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() { app.quit(); });

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  if (isDebug) {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      'min-width': 1000,
      'min-height': 700,
      'max-width': 1920,
      'max-height': 1920,
      center: true
    });
  }
  else {

    var width = settings.appWidth;
    var height = setting.appHeight;

    mainWindow = new BrowserWindow({
      width: width,
      height: height,
      'min-width': width,
      'min-height': height,
      'max-width': width,
      'max-height': height,
      center: true
    });
  }

  // mainWindow.isDebug = isDebug;

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  if (isDebug) {
    
    mainWindow.webContents.on('did-finish-load', function () {
      mainWindow.webContents.send('isDebug', true);
    });

    mainWindow.openDevTools();
  }


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
