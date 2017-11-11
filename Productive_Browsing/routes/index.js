var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.body);
    res.render('extension_home', { title: 'Productive Browsing' });
});

router.post('/', function (req, res) {
    console.log(req.body);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("HELLO");
    res.end();
});

module.exports = router;
