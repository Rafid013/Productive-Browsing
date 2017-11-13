var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    //console.log(req.body.task);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("HELLO");
    res.end();
});

module.exports = router;
