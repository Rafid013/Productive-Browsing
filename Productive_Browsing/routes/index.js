var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('afadf');
    res.render('extension_home', { title: 'Productive Browsing' });
});

module.exports = router;
