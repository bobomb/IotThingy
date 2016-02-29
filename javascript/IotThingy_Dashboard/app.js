var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var mongodb;
var assert = require('assert');
var dbConfig = require('./config/dbconfig').development;
const util = require('util');

//route handlers
var routes = require('./routes/index');
//includes the data file, which will later be mapped
//to /data via the app.use
var dataRoutes = require('./routes/data');
//main app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongodb
const connectURI = util.format('mongodb://%s:%s/%s', dbConfig.host, dbConfig.port, dbConfig.db);
MongoClient.connect(connectURI, function(err, db) {
  assert.equal(null, err); //verify we didn't get an error or fail
  console.log("Connected correctly to server %s", connectURI);
  mongodb = db;
});

//global route handler, adds mongodb object
app.use(function(req, res, next){
  req.db = mongodb;
  next();
});

//setup route handlers
//index route
app.use('/', routes);
//route for all data
app.use('/data', dataRoutes);

// third route (basically if it doesn't match any of the above routes)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
