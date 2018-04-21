var express = require('express');
var router = express.Router();

//let sql = `SELECT * FROM main_exchange`;
let sql = `select selector.id, selector.name, main_exchange.rate, selector.currency from main_exchange inner join selector on main_exchange.id=selector.id where selector.id=`;



/* GET rates from db. */
router.get('/:selected', function(req, res) {
    var mysqldb = req.mysqldb;
    var rawData = [];

    query = sql + req.params.selected
    console.log("query: " + query);

    let promise = new Promise((resolve, reject) => {
        console.log("Connected!");
        mysqldb.query(query, function (err, result) {
            if (err) {
                reject("failure");
                throw err;
            }
                rawData = result;
                resolve("success");
        });
    });
    promise.then((successMessage) => {
        //console.log("promise: " + JSON.stringify(rawData));
        res.json(rawData);
    });
    //console.log("XXXXXXXXXXXXXXXX" + req.params.selected);
    //res.send(req.params);
});

module.exports = router;
