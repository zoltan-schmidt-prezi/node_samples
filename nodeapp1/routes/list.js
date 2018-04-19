var express = require('express');
var router = express.Router();

//let sql = `SELECT * FROM main_exchange`;
let sql = `select selector.id, selector.name from selector`;

/* GET rates from db. */
router.get('/', function(req, res) {
    var mysqldb = req.mysqldb;
    var rawData = [];

    let promise = new Promise((resolve, reject) => {
        console.log("Connected!");
        mysqldb.query(sql, function (err, result) {
            if (err) {
                reject("failure");
                throw err;
            }
                rawData = result;
                resolve("success");
        });
    });
    promise.then((successMessage) => {
        console.log("promise: " + JSON.stringify(rawData));
        res.json(rawData);
    });
});

module.exports = router;
