var express = require('express');
var router = express.Router();

let sql = `SELECT * FROM exchange`;

/* GET userlist. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.name);
        });
    });
});

module.exports = router;
