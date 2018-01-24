var database = firebase.database();
var ref = database.ref('USERS');


function delete_from_array(array, elem) {
    var index = array.indexOf(elem);
    if(index > -1)
    {
        array.splice(index, 1);
    }
    return index;
}


function get_Minutes(str)
{
    str = str.split(":");
    return (Number(str[0])*60 + Number(str[1]));
}

function comparator(a, b) {
    var a_min = get_Minutes(a.military_time);
    var b_min = get_Minutes(b.military_time);
    return a_min - b_min;
}


function add_UID(uid) {
    ref.push({
        UID : uid
    }).then(function() {
        console.log("UID: " + uid + " added successfully in database");
    }).catch(function (error) {
        console.log(error.code);
        console.log(error.message);
    });
}

function mark_task_in_server(uid, task, date, time) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key + '/To_Do_List/' + date).orderByChild("task").equalTo(task);
        taskRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/To_Do_List/' + date + "/" + dataSnapshot1.key)
                .update({done: !dataSnapshot1.child("done").val()})
                .then(function () {
                    console.log("Task: " + task + " marked for uid: " + uid + ", Date: " + date);
                    if(date === date_today)
                    {
                        var hour = parseInt(time.substring(0,2));
                        var min = parseInt(time.substring(3,5));
                        var modifier = time.substring(5,7);
                        if(hour ===  12) hour =0;
                        if(modifier === "PM") hour = hour + 12;
                        var milTime = hour + ":" + min;

                        var tmp = {
                            type : "change_Timer",
                            task : task,
                            time: milTime
                        };
                        chrome.runtime.sendMessage(tmp);

                    }
                }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
            });
        });
    });
}



function delete_fav_link_from_server(uid, link) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Favourite Sites').orderByChild('site').equalTo(link);
        siteRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/Favourite Sites/' + dataSnapshot1.key).set(null)
                .then(function () {
                    console.log("Favourite Site: " + link + " deleted for uid: " + uid);
                    var del_index = favourite_links.indexOf(link);
                    if(del_index > -1) favourite_links.splice(del_index, 1);
                    populateFavouriteLinks();
                }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
            });
        })
    });
}

function add_task_to_server(uid, task, date, normal_time, military_time, priority) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var task_object = {
            task : task,
            normal_time : normal_time,
            military_time : military_time,
            priority : priority,
            done : false
        };
        var dateRef = ref.child(dataSnapshot.key + '/To_Do_List').child(date);
        dateRef.push(task_object).then(function () {
            console.log("Task: " + task_object.task +
                " added for uid: " + uid + ", Date: " + date + ", Time: " + task_object.normal_time);
            if(date === date_To_Do_list)
            {
                to_do_complete.push(task_object);
                to_do_complete.sort(comparator);

                if(date === date_today) {
                    events_today = [];
                    events_today_marked = [];
                }

                events_ToDo_List = [];
                events_ToDo_marked = [];
                for(var i = 0; i < to_do_complete.length; ++i) {
                    var task = to_do_complete[i].task;
                    var normal_time = to_do_complete[i].normal_time;
                    events_ToDo_List.push(task + " " + normal_time);
                    events_ToDo_marked[i]  = to_do_complete[i].done;
                    if(date === date_today) {
                        events_today.push(task);
                        events_today_marked[i] = to_do_complete[i].done;
                    }
                }
                populateToDoList();
                if(date === date_today)
                {
                    Scroll_Events();
                    var tmp = {
                        type : "add_Timer",
                        task : task,
                        time: military_time
                    };
                    chrome.runtime.sendMessage(tmp);
                }
            }
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
        });
    });
}

function delete_task_from_server(uid, task, date, time) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key + '/To_Do_List/' + date).orderByChild("task").equalTo(task);
        taskRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/To_Do_List/' + date + "/" + dataSnapshot1.key).set(null)
                .then(function () {
                    console.log("Task: " + task + " deleted for uid: " + uid + ", Date: " + date);
                    var index;
                    if(date === date_To_Do_list)
                    {
                        index = delete_from_array(events_ToDo_List, task + " " + time);
                        //alert(index);
                        if(index > -1)
                        {
                            //events_ToDo_marked.splice(index,1);
                        }
                        populateToDoList();
                        //search_to_do_from_server(uid,date_To_Do_list);
                    }
                    if(date === date_today) {
                        index = delete_from_array(events_today, task);
                        if(index > -1)
                        {
                            //events_today_marked.splice(index,1);
                        }
                        Scroll_Events();
                        var tmp = {
                            type : "delete_Timer",
                            task : task
                        };
                        chrome.runtime.sendMessage(tmp);
                    }
                }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
            })
        })
    })
}

function get_fav_link_from_server(uid) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key + '/Favourite Sites').orderByChild("site");
        taskRef.once("value").then(function (dataSnapshot1) {
            var sites = [];
            dataSnapshot1.forEach(function(indexSnapshot) {
                sites.push(indexSnapshot.val());
            });
            var list_size = sites.length;
            for(var i = 0; i < list_size; ++i) {
                favourite_links.push(sites[i].site);
            }
            populateFavouriteLinks();
        })
    });
}

function get_to_do_from_server(uid, date) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key).child('To_Do_List').child(date);
        taskRef.once("value").then(function (dataSnapshot1) {
            var tasks = [];
            dataSnapshot1.forEach(function(indexSnapshot) {
                tasks.push(indexSnapshot.val());
            });
            tasks.sort(comparator);
            to_do_complete = tasks;
            console.log(to_do_complete);
            var list_size = tasks.length;
            if(date === date_today) {
                events_today = [];
                events_today_marked = [];
            }
            events_ToDo_List = [];
            events_ToDo_marked = [];
            for(var i = 0; i < list_size; ++i) {
                var task = tasks[i].task;
                var normal_time = tasks[i].normal_time;
                events_ToDo_List.push(task + " " + normal_time);
                events_ToDo_marked[i]  = tasks[i].done;
                //var military_time = event_list_server[i].military_time;
                //var priority = event_list_server[i].priority;
                if(date === date_today) {
                    events_today.push(task);
                    events_today_marked[i] = tasks[i].done;
                }
            }
            populateToDoList();
            if(date === date_today)
            {
                Scroll_Events();
            }
            date_To_Do_list = date;
        })
    });
}

function search_to_do_from_server(uid, date, minTime, maxTime) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key).child('To_Do_List').child(date);
        taskRef.once("value").then(function (dataSnapshot1) {
            var tasks = [];
            dataSnapshot1.forEach(function(indexSnapshot) {
                tasks.push(indexSnapshot.val());
            });
            var list_size = tasks.length;

            tasks.sort(comparator);

            to_do_complete = tasks;

            events_ToDo_List = [];
            events_ToDo_marked = [];
            var min = get_Minutes(minTime);
            var max = get_Minutes(maxTime);
            var j = 0;
            for(var i = 0; i < list_size; ++i) {
                var task_time = get_Minutes(tasks[i].military_time);
                if(task_time>=min && task_time <=max) {
                    var task = tasks[i].task;
                    var normal_time = tasks[i].normal_time;
                    events_ToDo_List.push(task + " " + normal_time);
                    events_ToDo_marked[j] = tasks[i].done;
                    j++;
                }
                //var military_time = event_list_server[i].military_time;
                //var priority = event_list_server[i].priority;
            }
            console.log(events_ToDo_List);
            populateToDoList();

            date_To_Do_list = date;
        })
    });
}


function add_fav_link_in_server(uid, link) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var tmp = {
            site : link
        };
        ref.child(dataSnapshot.key + '/Favourite Sites').push(tmp)
            .then(function () {
                console.log("Site: " + link + " favoured for uid: " + uid);
            }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
        });
    });
}


function mark_site_in_server(uid, site) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var site_obj = {
            site : site,
            num_of_days : 0,
            daily_time : 0, //in minutes
            weekly_time : 0, //in minutes
            monthly_time : 0, //in minutes
            total_time_this_month : 0,
            total_time_this_week : 0,
            num_of_months : 0,
            num_of_weeks : 0
        };
        ref.child(dataSnapshot.key + '/Time Killer Sites').push(site_obj).then(function () {
            console.log("Site: " + site + " marked for uid: " + uid);
            var tmp = {
                type : "mark_site",
                site : site
            };
            chrome.runtime.sendMessage(tmp, function(response) {

            });
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
        });
    });
}

function unmark_site_in_server(uid, link) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Time Killer Sites').orderByChild('site').equalTo(link);
        siteRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/Time Killer Sites/' + dataSnapshot1.key).set(null)
                .then(function () {
                    console.log("Site: " + link + " unmarked for uid: " + uid);
                    var tmp = {
                        type :"unmark_site",
                        site :link
                    };
                    chrome.runtime.sendMessage(tmp, function(response) {

                    });
                }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
            })
        })
    });
}


function unmark_site_in_server_from_stat(uid, link) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Time Killer Sites').orderByChild('site').equalTo(link);
        siteRef.once("child_added").then(function (dataSnapshot1) {
            ref.child(dataSnapshot.key + '/Time Killer Sites/' + dataSnapshot1.key).set(null)
                .then(function () {
                    console.log("Site: " + link + " unmarked for uid: " + uid);
                    var tmp = {
                        type :"unmark_site",
                        site :link
                    };
                    chrome.runtime.sendMessage(tmp, function(response) {

                    });
                    location.reload();
                }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
            })
        })
    });
}


function update_site_time_in_server(uid, site, time_spent_today) {
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
                }).catch(function(error){
                    console.log(error.code);
                    console.log(error.message);
                });
            })
        })
    });
}

function get_marked_sites(uid) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var siteRef = ref.child(dataSnapshot.key + '/Time Killer Sites');
        siteRef.once("value").then(function (data) {
            var site_list = [];
            data.forEach(function (index) {
                site_list.push(index.val());
            });
            var sites_to_be_stored = {};
            for(var i = 0; i < site_list.length; ++i) {
                sites_to_be_stored[site_list[i].site] = 0;
                marked_sites_complete[i] = site_list[i];
                total_monthly_time += (site_list[i].monthly_time * site_list[i].num_of_months)
                    + site_list[i].total_time_this_month;
                //total_monthly_time += site_list[i].monthly_time;
            }
            populate_fields(marked_sites_complete);
            chrome.storage.sync.set({"marked_sites" : sites_to_be_stored},function () {
                var tmp = {
                    type : "update_marked_sites_object"
                };
                chrome.runtime.sendMessage(tmp);

            });
        });
    });
}


function get_fav_link_from_server_background(uid, url) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.once("child_added").then(function (dataSnapshot) {
        var taskRef = ref.child(dataSnapshot.key + '/Favourite Sites').orderByChild("site");
        taskRef.once("value").then(function (dataSnapshot1) {
            var sites = [];
            dataSnapshot1.forEach(function(indexSnapshot) {
                sites.push(indexSnapshot.val());
            });
            var list_size = sites.length;
            var links = [];

            var randomNumber, options;

            for(var i = 0; i < list_size; ++i) {
                links.push({title: "Check this link", message: sites[i].site});
            }

            randomNumber = Math.floor(Math.random() * list_size);

            if(list_size === 0)
            {
                //alert("inside");
                links.push({title:"No task in To-Do List",message:""},
                    {title:"No Favourite List Found",message:""});
                options = {
                    type : "list",
                    title : "You are using " + url + " too long",
                    message : "You are using " + url + " too long",
                    iconUrl : "icon.png",
                    items: links
                };
                chrome.notifications.create(options);
            }
            else
            {
                randomNumber = Math.floor(Math.random() * list_size);
                suggest_link = sites[randomNumber].site;
                options = {
                    type : "basic",
                    title : "You are using " + url + " too long",
                    message : "You may want to visit this site",
                    buttons : [{
                        title: suggest_link
                    }],
                    iconUrl : "icon.png"
                };
                chrome.notifications.create(options);
            }
        })
    });

}
