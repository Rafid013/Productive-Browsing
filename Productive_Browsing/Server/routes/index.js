var express = require('express');
var router = express.Router();
var auth = require('../server/authentication_queries');
var db = require('../server/database_queries');

// noinspection JSUnresolvedFunction
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
                        res.json({
                            message : msg
                        });
                        res.end();
                    }
                });
            }
            else {
                res.json(data);
                res.end();
            }
        });
    }
    else if(req.body.type === "mark_site") {
        db.mark_site(req.body.uid, req.body.link, function (msg) {
            res.write(msg);
            res.end();
        });
    }
    else if(req.body.type === "unmark_site") {
        db.unmark_site(req.body.uid, req.body.link, function (msg) {
            res.write(msg);
            res.end();
        });
    }
    else if(req.body.type === "get_marked_sites") {
        db.get_marked_sites(req.body.uid, function (data) {
            res.json(data);
            res.end();
        });
    }
    else if(req.body.type === "update_site_time") {
        db.update_site_time(req.body.uid, req.body.site, req.body.time, function (msg) {
            res.write(msg);
            res.end();
        });
    }
    else if(req.body.type === "add_task") {
        db.add_task(req.body.uid, req.body.task, req.body.date, req.body.normal_time, req.body.military_time,
        req.body.priority,
        function (msg) {
            res.write(msg);
            res.end();
        });
    }
    else if(req.body.type === "mark_task") {
        db.mark_task(req.body.uid, req.body.task, req.body.date, function (msg) {
            res.write(msg);
            res.end();
        });
    }
    else if(req.body.type === "delete_task") {
        db.delete_task(req.body.uid, req.body.task, req.body.date, function (msg) {
            res.write(msg);
            res.end();
        });
    }
    else if(req.body.type === "get_to_do") {
        db.get_to_do(req.body.uid, req.body.date, function (list) {
            res.json(list);
            res.end();
        })
    }
    else if(req.body.type === "add_fav_link") {
        db.add_fav_link(req.body.uid, req.body.link, function (data) {
            res.write(data);
            res.end();
        })
    }
    else if(req.body.type === "delete_fav_link") {
        db.delete_fav_link(req.body.uid, req.body.link, function (data) {
            res.write(data);
            res.end();
        })
    }
    else if(req.body.type === "get_fav_links") {
        db.get_fav_link(req.body.uid, function (list) {
            res.json(list);
            res.end();
        })
    }
});

module.exports = router;