var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var https = require('https');

var indexRouter = require('./routes/index');
var https_options = {};// { key: key, cert: cert };
var PORT = 3000;
var HOST = 'localhost';

var app = express();
// database 

let mysqldb = mysql.createConnection({
    host: "35.205.186.100",
    user: "reader",
    password: "read%only%1A",
    //database: "scraper_preprod"
    database: "scraper"
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.mysqldb = mysqldb;
    next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//server = https.createServer(https_options, app).listen(HOST, PORT); 
//console.log('HTTPS Server listening on %s:%s',HOST, PORT);
app.listen(3000, () => console.log('App listening on port!'))

module.exports = app;
