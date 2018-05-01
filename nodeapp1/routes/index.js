var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Exchange rate app' });
});

/* GET rates from db. */
router.get('/list', function(req, res) {
    var mysqldb = req.mysqldb;
    var rawData = [];

    let sql = `select selector.id, selector.name from selector`;

    query_database( sql, req, res);
});

/* GET rates from db. */
router.get('/rates/:selected', function(req, res) {

    let sql = `select selector.id, selector.name, main_exchange.date, main_exchange.rate, main_exchange.sum, main_exchange.updated, selector.currency from main_exchange inner join selector on main_exchange.id=selector.id where selector.id=`;
    
    sql = sql + req.params.selected

    query_database( sql, req, res);
});

function query_database( query_string, req, res ){
    var mysqldb = req.mysqldb;
    var rawData = [];

    let promise = new Promise((resolve, reject) => {
        console.log("Connected!");
        mysqldb.query(query_string, function (err, result) {
            if (err) {
                reject("failure");
                throw err;
            }
                rawData = result;
                resolve("success");
        });
    });
    promise.then((successMessage) => {
        //console.log("list promise: " + JSON.stringify(rawData));
        res.json(rawData);
    });
   
}


module.exports = router;
