var express = require('express');
var router = express.Router();
var url = require('url');


router.get('/', function (req, res) {
    console.log('fg\n');
    console.log(url.parse(req.url));
    res.render('extension_home', { title: 'Productive Browsing' });
});

router.post('/', function (req, res) {
   console.log("RAF");
    res.render('extension_home', { title: 'Productive Browsing' });
});

module.exports = router;
