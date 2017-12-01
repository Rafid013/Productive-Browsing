var express = require('express');
var router = express.Router();
var auth = require('../server/authentication_queries');
var db = require('../server/database_queries');

router.post('/', function (req, res) {
    if (req.body.type === "sign_up") {
        auth.sign_up(req.body.name, req.body.email, req.body.password, function (data) {
            if(data.message === "success") {
                db.add_UID(data.uid, function (msg) {
                    if(msg === "success") {
                        res.json(data);
                        res.end();
                    }
                    else {
                        auth.delete_user(req.body.email, req.body.password, function (data1){
                           console.log(data1);
                            res.json({
                                message : msg
                            });
                            res.end();
                        });
                    }
                });
            }
            else {
                res.json(data);
                res.end();
            }
        });
    }
    else if(req.body.type === "sign_in") {
        auth.sign_in(req.body.email, req.body.password, function (data) {
            res.writeHead(200);
            res.write(JSON.stringify(data));
            res.end();
        });
    }
    else if(req.body.type === "mark_site") {
        db.mark_site(req.body.uid, req.body.link, function (msg) {
            res.json({
                message : msg
            });
            res.end();
        });
    }
    else if(req.body.type === "unmark site") {
        db.unmark_site(req.body.uid, req.body.link, function (msg) {
            res.json({
                message : msg
            });
            res.end();
        });
    }
    else if(req.body.type === "up_image") {

    }
    else if(req.body.type === "del_image") {

    }
    else if(req.body.type === "add_task") {
        db.add_task(req.body.uid, req.body.task, req.body.date, req.body.time, function (msg) {
            res.writeHead(200);
            res.write(msg);
            res.end();
        });
    }
    else if(req.body.type === "mark_task") {
        db.mark_task(req.body.uid, req.body.task, req.body.date, req.body.time, function (msg) {
            res.json({
                message : msg
            });
            res.end();
        });
    }
    else if(req.body.type === "delete_task") {
        db.mark_task(req.body.uid, req.body.task, req.body.date, req.body.time, function (msg) {
            res.json({
                message : msg
            });
            res.end();
        })
    }
    else if(req.body.type === "update_task") {

    }
    else if(req.body.type === "account_delete") {
        auth.delete_user(req.body.email, req.body.password, function (data) {
            if(data.message === "success") {
                db.delete_UID(data.uid, function (msg) {
                    if(msg === "success") {
                        res.json(data);
                        res.end();
                    }
                    else {
                        auth.sign_up(data.name, data.email, data.password, function (data1) {
                            console.log(data1);
                            res.json({
                                uid : data1.uid,
                                message : msg
                            });
                            res.end();
                        });
                    }
                });
            }
            else {
                res.json(data);
                res.end();
            }
        });
    }
    else if(req.body.type === "change_name") {
        auth.change_name(req.body.email, req.body.password, req.body.name, function (data) {
            res.json(data);
            res.end();
        });
    }
    else if(req.body.type === "get_to_do") {
        db.get_to_do(req.body.uid, function (list) {
            res.writeHead(200);
            res.write(JSON.stringify(list));
            res.end();
        })
    }
    else if(req.body.type === "add_fav_link") {
        db.add_fav_link(req.body.uid, req.body.link, function (data) {
            res.writeHead(200);
            res.write(data);
            res.end();
        })
    }
    else if(req.body.type === "delete_fav_link") {
        db.delete_fav_link(req.body.uid, req.body.link, function (data) {
            res.writeHead(200);
            res.write(data);
            res.end();
        })
    }
    else if(req.body.type === "get_fav_link") {
        db.get_fav_link(req.body.uid, function (list) {
            res.writeHead(200);
            res.write(JSON.stringify(list));
            res.end();
        })
    }
});

module.exports = router;