var express = require('express');
var router = express.Router();

let sql = `SELECT * FROM exchange`;

/* GET rates from db. */
router.get('/', function(req, res) {
    var db = req.db;
    var rawData = [];

    let promise = new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject("failure");
                throw err;
            }
            rows.forEach((row) => {
                rawData.push({id: row.id, name: row.name, rate: row.rate});
                console.log("rawData: " + JSON.stringify(rawData));
            });
            resolve("success");
        });
    });
    promise.then((successMessage) => {
        console.log("promise: " + JSON.stringify(rawData));
        res.json(rawData);
    });
});

module.exports = router;
