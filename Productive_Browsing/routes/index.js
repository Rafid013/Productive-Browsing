var express = require('express');
var router = express.Router();
var sign_up = require('../server/authentication_queries/sign_up');

router.post('/', function (req, res) {
    console.log(req.body.task);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("HELLO");
    res.end();
    /*if (req.body.type === "sign_up") {
        var sign_up_message = sign_up(req.body.name, req.body.email, req.body.password);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(sign_up_message);
        res.end();
    }
    else if(req.body.type === "sign_in") {

    }*/
});