var express = require('express');
var router = express.Router();
var sign_up = require('../server/authentication_queries/sign_up');
var sign_in = require('../CromeEx/authentication_queries/sign_in');

router.post('/', function (req, res) {
    if (req.body.type === "sign_up") {
        var sign_up_ret = sign_up(req.body.name, req.body.email, req.body.password);
        res.json(sign_up_ret);
        res.end();
    }
    else if(req.body.type === "sign_in") {
        var sign_in_ret = sign_in(req.body.email, req.body.password);
        res.json(sign_in_ret);
        res.end();
    }
});

module.exports = router;