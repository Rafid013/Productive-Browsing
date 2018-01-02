var admin = require("./firebase_app_initializer");

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

/*function delete_UID(uid, callback) {
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
}*/

function mark_site(uid, site, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var tmp = {
            site : site,
            num_of_days : 0,
            daily_time : 0, //in minutes
            weekly_time : 0, //in hours
            monthly_time : 0, //in hours
            total_time_this_month : 0,
            total_time_this_week : 0,
            num_of_months : 0,
            num_of_weeks : 0
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
        var siteRef = ref.child(dataSnapshot.key + '/Time Killer Sites').orderByChild('site').equalTo(site);
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


function update_site_time(uid, site, time_spent_today, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Time Killer Sites').orderByChild('site').equalTo(site);
        siteRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + "/Time Killer Sites/" + dataSnapshot1.key).once("value")
            .then(function (data) {
                var daily_time = data.val().daily_time;
                var weekly_time = data.val().weekly_time;
                var monthly_time = data.val().monthly_time;
                var total_time_this_month = data.val().total_time_this_month;
                var total_time_this_week = data.val().total_time_this_week;
                var num_of_days = data.val().num_of_days;
                var num_of_months = data.val().num_of_months;
                var num_of_weeks = data.val().num_of_weeks;

                //update daily time
                daily_time = (daily_time*num_of_days + time_spent_today)/(++num_of_days);

                //update weekly time
                total_time_this_week += time_spent_today;
                if(num_of_days%7 === 0) {
                    weekly_time = (weekly_time*num_of_weeks + total_time_this_week)/(++num_of_weeks);
                    total_time_this_week = 0;
                }

                //update monthly time
                total_time_this_month += time_spent_today;
                if(num_of_days%30 === 0) {
                    monthly_time = (monthly_time*num_of_months + total_time_this_month)/(++num_of_months);
                    total_time_this_month = 0;
                }
                ref.child(dataSnapshot.key + "/Time Killer Sites/" + dataSnapshot1.key)
                .update({
                    daily_time : daily_time,
                    num_of_days : num_of_days,
                    weekly_time : weekly_time,
                    num_of_weeks : num_of_weeks,
                    total_time_this_week : total_time_this_week,
                    monthly_time : monthly_time,
                    num_of_months : num_of_months,
                    total_time_this_month : total_time_this_month
                }).then(function () {
                    console.log("Times updated for site: " + site);
                    callback("success");
                }).catch(function(error){
                    console.log(error.code);
                    console.log(error.message);
                    callback(error.code);
                });
            })
        })
    });
}

function add_task(uid, task, date, normal_time, military_time, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var tmp = {
            task : task,
            normal_time : normal_time,
            military_time : military_time,
            done : false
        };
        var dateRef = ref.child(dataSnapshot.key + '/To_Do_List').child(date);
        dateRef.push(tmp).then(function () {
            console.log("Task: " + task + " added for uid: " + uid + ", Date: " + date + ", Time: " + normal_time);
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
            ref.child(dataSnapshot.key + '/To_Do_List/' + date + "/" + dataSnapshot1.key).set(null)
            .then(function () {
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
            site : link
        };
        ref.child(dataSnapshot.key + '/Favourite Sites').push(tmp)
        .then(function () {
            console.log("Site: " + link + " favoured for uid: " + uid);
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
        var siteRef = ref.child(dataSnapshot.key + '/Favourite Sites').orderByChild('site').equalTo(link);
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
        var taskRef = ref.child(dataSnapshot.key + '/Favourite Sites').orderByChild("site");
        taskRef.once("value").then(function (dataSnapshot1) {
            var sites = [];
            dataSnapshot1.forEach(function(indexSnapshot) {
                sites.push(indexSnapshot.val());
            });
            callback(sites);
        })
    });
}

function get_marked_sites(uid, callback) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Time Killer Sites');
        siteRef.once("value").then(function (data) {
            var sites = [];
            data.forEach(function (index) {
                sites.push(index.val());
            });
            callback(sites);
        });
    });
}

module.exports = {
    admin : admin,
    add_UID : add_UID,
    mark_site : mark_site,
    unmark_site : unmark_site,
    update_site_time : update_site_time,
    add_task : add_task,
    mark_task : mark_task,
    delete_task : delete_task,
    get_to_do : get_to_do,
    add_fav_link : add_fav_link,
    delete_fav_link : delete_fav_link,
    get_fav_link : get_fav_link,
    get_marked_sites : get_marked_sites
};