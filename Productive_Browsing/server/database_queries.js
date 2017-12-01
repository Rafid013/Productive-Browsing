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
    }, function (error) {
        if(error) {
            console.log(error.code);
            console.log(error.message);
            callback(error.code);
        }
        else {
            console.log("UID: " + uid + " added successfully in database");
            callback("success");
        }
    })
}

function delete_UID(uid, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        ref.child(dataSnapshot.key).set(null, function (error) {
            if(error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            }
            else {
                console.log("UID: " + uid + " deleted successfully from database");
                callback("success");
            }
        });
    });
}

function mark_site(uid, site, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        var tmp = {
            Site : site
        };
        ref.child(dataSnapshot.key).child('Time Killer Sites').push(tmp, function (error) {
            if(error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            }
            else {
                console.log("Site: " + site + " marked for uid: " + uid);
                callback("success");
            }
        });
    });
}

function unmark_site(uid, site, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        var tmp = {
            Site : site
        };
        var siteRef = ref.child(dataSnapshot.key).child('Time Killer Sites').orderByChild('Site').equalTo(tmp.Site);
        siteRef.once("child_added", function (dataSnapshot1) {
            ref.child(dataSnapshot.key).child('Sites').child(dataSnapshot1.key).set(null, function (error) {
                if(error) {
                    console.log(error.code);
                    console.log(error.message);
                    callback(error.code);
                }
                else {
                    console.log("Site: " + site + " unmarked for uid: " + uid);
                    callback("success");
                }
            });
        })
    });
}

function add_task(uid, task, date, time, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        var tmp = {
            task : task + ',' + date + ',' + time,
            done : false
        };
        ref.child(dataSnapshot.key).child('To_Do_List').push(tmp, function (error) {
            if(error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            }
            else {
                console.log("Task: " + task+ " added for uid: " + uid);
                callback("success");
            }
        });
    });
}

function mark_task(uid, task, date, time, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        var tmp = {
            task : task + ',' + date + ',' + time,
            done : false
        };
        var taskRef = ref.child(dataSnapshot.key).child('To_Do_List').orderByChild("task").equalTo(tmp.task);
        taskRef.once("child_added", function (dataSnapshot1) {
            ref.child(dataSnapshot.key).child('To_Do_List').child(dataSnapshot1.key).update({done : true}, function (error) {
                if(error) {
                    console.log(error.code);
                    console.log(error.message);
                    callback(error.code);
                }
                else {
                    console.log("Task: " + task + " marked \'done\' for uid: " + uid);
                    callback("success");
                }
            });
        });
    });
}


function delete_task(uid, task, date, time, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        var tmp = {
            task : task + ',' + date + ',' + time,
            done : false
        };
        var taskRef = ref.child(dataSnapshot.key).child('To_Do_List').orderByChild("task").equalTo(tmp.task);
        taskRef.once("child_added", function (dataSnapshot1) {
            ref.child(dataSnapshot.key).child('To_Do_List').child(dataSnapshot1.key).set(null, function (error) {
                if(error) {
                    console.log(error.code);
                    console.log(error.message);
                    callback(error.code);
                }
                else {
                    console.log("Task: " + task + " deleted for uid: " + uid);
                    callback("success");
                }
            });
        })
    })
}

function get_to_do(uid, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
       var taskRef = ref.child(dataSnapshot.key).child('To_Do_List').orderByChild("task");
       taskRef.once("value", function (dataSnapshot1) {
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
    userRef.once("child_added", function (dataSnapshot) {
        var tmp = {
            Site : link
        };
        ref.child(dataSnapshot.key).child('Favourite Sites').push(tmp, function (error) {
            if(error) {
                console.log(error.code);
                console.log(error.message);
                callback(error.code);
            }
            else {
                console.log("Site: " + link + " favoured  for uid: " + uid);
                callback("success");
            }
        });
    });
}

function delete_fav_link(uid, link, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        var tmp = {
            Site : link
        };
        var siteRef = ref.child(dataSnapshot.key).child('Favourite Sites').orderByChild('Site').equalTo(tmp.Site);
        siteRef.once("child_added", function (dataSnapshot1) {
            ref.child(dataSnapshot.key).child('Favourite Sites').child(dataSnapshot1.key).set(null, function (error) {
                if(error) {
                    console.log(error.code);
                    console.log(error.message);
                    callback(error.code);
                }
                else {
                    console.log("Favourite Site: " + link + " deleted for uid: " + uid);
                    callback("success");
                }
            });
        })
    });
}

function get_fav_link(uid, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added", function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key).child('Favourite Sites').orderByChild("Site");
        taskRef.once("value", function (dataSnapshot1) {
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