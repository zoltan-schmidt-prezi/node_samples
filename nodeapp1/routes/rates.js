var express = require('express');
var router = express.Router();

let sql = `SELECT * FROM exchange`;

/* GET userlist. */
router.get('/rates_list', function(req, res) {
    var db = req.db;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        let rawData = [];
        rows.forEach((row) => {
            rawData.push({"id":row.id,"name":row.name,"rate":row.rate});
        });
        console.log(rawData);
        let json = JSON.parse(rawData[0]);
        res.json = json;
    });
});

module.exports = router;
