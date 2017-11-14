var express = require('express');
var router = express.Router();
var auth = require('../server/authentication_queries');
var db = require('../server/database_queries');

router.post('/', function (req, res) {
    if (req.body.type === "sign_up") {
        auth.sign_up(req.body.name, req.body.email, req.body.password, function (data) {
            db.add_UID(data.token);
            res.json(data);
            res.end();
        });
    }
    else if(req.body.type === "sign_in") {
        auth.sign_in(req.body.email, req.body.password, function (data) {
            res.json(data);
            res.end();
        });
    }
    else if(req.body.type === "mark_site") {

    }
    else if(req.body.type === "de_mark site") {

    }
    else if(req.body.type === "up_image") {

    }
    else if(req.body.type === "del_image") {

    }
    else if(req.body.type === "add_task") {

    }
    else if(req.body.type === "task_done") {

    }
    else if(req.body.type === "delete_task") {

    }
    else if(req.body.type === "update_task") {

    }
    else if(req.body.type === "account_delete") {

    }
    else if(req.body.type === "change_name") {

    }
    else if(req.body.type === "get_to_do") {

    }
});

module.exports = router;