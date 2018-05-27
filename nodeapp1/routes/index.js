var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Exchange rate app' });
});

/* GET rates from db. */
router.get('/list', function(req, res) {
    var mysqldb = req.mysqldb;

    let sql = `select selector.id, selector.name from selector`;

    runQueryOnDatabase( sql, req, res);
});

/* GET ids from db for a given portfolio. */
router.get('/list/:date', function(req, res) {
    var mysqldb = req.mysqldb;

    let sql = `select * from portfolio where buydate=`;
    sql = sql + '\'' + req.params.date + '\'';

    runQueryOnDatabase( sql, req, res);
});

/* get all item names and ids for existing bonds*/
router.get('/list_all', function(req, res) {
    var mysqldb = req.mysqldb;

    let sql = `select distinct portfolio.id, selector.name from portfolio inner join selector on portfolio.id=selector.id`;

    runQueryOnDatabase( sql, req, res);
});


/* GET rates from db. */
router.get('/rates/:selected', function(req, res) {

    let sql = `select selector.id, selector.name, main_exchange.date, main_exchange.rate, main_exchange.sum, main_exchange.updated, selector.currency from main_exchange inner join selector on main_exchange.id=selector.id where selector.id=`;
    
    sql = sql + req.params.selected;
    sql = sql + ` order by date`;

    runQueryOnDatabase( sql, req, res);
});

/* GET rates from db. */
router.get('/rates/:selected/:fromdate', function(req, res) {

    let sql = `select selector.id, selector.name, main_exchange.date, main_exchange.rate, main_exchange.sum, main_exchange.updated, selector.currency from main_exchange inner join selector on main_exchange.id=selector.id where selector.id=`;
    
    sql = sql + req.params.selected;
    sql = sql + ` and main_exchange.date >= `
              + '\'' + req.params.fromdate + '\'';
    sql = sql + ` order by date`;

    runQueryOnDatabase( sql, req, res);
});

router.get('/portfolio/:selected', function(req, res) {
    let sql = `select * from portfolio where id=`;

    sql = sql + req.params.selected;

    runQueryOnDatabase( sql, req, res);
});

router.get('/count', function(req, res) {
    let sql = `select distinct buydate from portfolio order by buydate`;
    runQueryOnDatabase( sql, req, res);
});

function runQueryOnDatabase( query_string, req, res ){
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
    }).catch((reason) => {
        console.log('Handle rejected promise: ' + reason); 
    });
    
   
}

module.exports = router;
