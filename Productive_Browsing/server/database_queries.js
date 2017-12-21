var admin = require('firebase-admin');
var serviceAccount = require('../productive-browsing-firebase-adminsdk-v616k-45e6bfc484.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://productive-browsing.firebaseio.com"
});

var database = admin.database();
var ref = database.ref('USERS');

function add_UID(uid, callback) {
    ref.push({
        UID : uid
    }).then(function() {
            console.log("UID: " + uid + " added successfully in database");
            callback("success");
    }).catch(function (error) {
        console.log(error.code);
        console.log(error.message);
        callback(error.code);
    });
}

function delete_UID(uid, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        ref.child(dataSnapshot.key).set(null).then(function () {
            console.log("UID: " + uid + " deleted successfully from database");
            callback("success");
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            callback(error.code);
        });
    });
}

function mark_site(uid, site, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var tmp = {
            Site : site
        };
        ref.child(dataSnapshot.key + '/Time Killer Sites').push(tmp).then(function () {
            console.log("Site: " + site + " marked for uid: " + uid);
            callback("success");
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            callback(error.code);
        });
    });
}

function unmark_site(uid, site, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Time Killer Sites').orderByChild('Site').equalTo(site);
        siteRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/Time Killer Sites/' + dataSnapshot1.key).set(null)
            .then(function () {
                console.log("Site: " + site + " unmarked for uid: " + uid);
                callback("success");
            }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            })
        })
    });
}

function add_task(uid, task, date, time, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var tmp = {
            task : task,
            time : time,
            done : false
        };
        var dateRef = ref.child(dataSnapshot.key + '/To_Do_List').child(date);
        dateRef.push(tmp).then(function () {
            console.log("Task: " + task + " added for uid: " + uid + ", Date: " + date + ", Time: " + time);
            callback("success");
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            callback(error.code);
        });
    });
}

function mark_task(uid, task, date, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key + '/To_Do_List/' + date).orderByChild("task").equalTo(task);
        taskRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/To_Do_List/' + date + "/" + dataSnapshot1.key)
            .update({done: !dataSnapshot1.child("done").val()})
            .then(function () {
                console.log("Task: " + task + " marked for uid: " + uid + ", Date: " + date);
                callback("success");
            }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            });
        });
    });
}


function delete_task(uid, task, date, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key + '/To_Do_List/' + date).orderByChild("task").equalTo(task);
        taskRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/To_Do_List/' + date + "/" + dataSnapshot1.key)
            .set(null).then(function () {
                console.log("Task: " + task + " deleted for uid: " + uid + ", Date: " + date);
                callback("success");
            }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            })
        })
    })
}

function get_to_do(uid, date, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
       var taskRef = ref.child(dataSnapshot.key).child('To_Do_List').child(date);
       taskRef.once("value").then(function (dataSnapshot1) {
           var tasks = [];
           dataSnapshot1.forEach(function(indexSnapshot) {
              tasks.push(indexSnapshot.val());
           });
           callback(tasks);
       })
    });
}


function add_fav_link(uid, link, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var tmp = {
            Site : link
        };
        ref.child(dataSnapshot.key + '/Favourite Sites').push(tmp)
        .then(function () {
            console.log("Site: " + link + " favoured  for uid: " + uid);
            callback("success");
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            callback(error.code);
        });
    });
}

function delete_fav_link(uid, link, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Favourite Sites').orderByChild('Site').equalTo(link);
        siteRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/Favourite Sites/' + dataSnapshot1.key).set(null)
            .then(function () {
                console.log("Favourite Site: " + link + " deleted for uid: " + uid);
                callback("success");
            }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            });
        })
    });
}

function get_fav_link(uid, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key + '/Favourite Sites').orderByChild("Site");
        taskRef.once("value").then(function (dataSnapshot1) {
            var sites = [];
            dataSnapshot1.forEach(function(indexSnapshot) {
                sites.push(indexSnapshot.val());
            });
            callback(sites);
        })
    });
}

module.exports = {
    admin : admin,
    add_UID : add_UID,
    mark_site : mark_site,
    delete_UID : delete_UID,
    unmark_site : unmark_site,
    add_task : add_task,
    mark_task : mark_task,
    delete_task : delete_task,
    get_to_do : get_to_do,
    add_fav_link : add_fav_link,
    delete_fav_link : delete_fav_link,
    get_fav_link : get_fav_link
};