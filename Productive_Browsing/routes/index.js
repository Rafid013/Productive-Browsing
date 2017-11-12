var express = require('express');
var router = express.Router();
var sign_up = require('../server/authentication_queries/sign_up');

router.post('/', function (req, res) {
    /*console.log(req.body.task);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("HELLO");
    res.end();*/
    if(req.body.type === "sign_up") {
        sign_up.cr
    }
});

module.exports = router;
