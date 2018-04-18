var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ratesRouter = require('./routes/rates');
var mysqlRatesRouter = require('./routes/mysqlrates')

var app = express();
// database 

let mysqldb = mysql.createConnection({
    host: "scraperdb.c1mkc0degkxm.eu-central-1.rds.amazonaws.com",
    user: "scraper_admin",
    password: "scraper%admin",
    database: "scraper_preprod"
});

let db = new sqlite3.Database('./data/scraper.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the file based SQlite database.');
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
    req.db = db;
    next();
});

app.use(function(req,res,next){
    req.mysqldb = mysqldb;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rates', ratesRouter);
app.use('/mysqlrates', mysqlRatesRouter);

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

module.exports = app;
