var express = require('express');
var router = express.Router();

let sql = `SELECT * FROM exchange`;

/* GET userlist. */
router.get('/', function(req, res) {
    var db = req.db;
    res.set('Content-Type', 'text/plain');
    let rawData;
    let ret = db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            rawData = {id: row.id, name: row.name, rate: row.rate};
            console.log(JSON.stringify(rawData));
        });
    });
    res.json = JSON.stringify(rawData);
    console.log("XXXXXXXXX" + JSON.stringify(rawData));
});

module.exports = router;
