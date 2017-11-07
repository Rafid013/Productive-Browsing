var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var admin = require('../server/connect_firebase');
    var db = admin.database();
    var ref = db.ref('fb');
    ref.on('value', function (snapshot) {
        console.log('yo ' + snapshot.val());
    }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
    });
    res.render('extension_home', { title: 'Productive Browsing' });
});

module.exports = router;
