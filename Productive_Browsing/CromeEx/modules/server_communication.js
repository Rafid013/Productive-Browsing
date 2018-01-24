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
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var delete_fav_link_req = {
        uid : uid,
        link : link,
        type : "delete_fav_link"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                var del_index = favourite_links.indexOf(link);
                if(del_index > -1) favourite_links.splice(del_index, 1);
                populateFavouriteLinks();
            }
        }
        else {

        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(delete_fav_link_req));
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
            console.log("Task: " + task + " added for uid: " + uid + ", Date: " + date + ", Time: " + normal_time);
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
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var get_fav_link_req = {
        uid : uid,
        type : "get_fav_links"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var link_list = JSON.parse(senderToServer.responseText);
            var list_size = link_list.length;
            for(var i = 0; i < list_size; ++i) {
                favourite_links.push(link_list[i].site);
            }
            populateFavouriteLinks();
            //store in storage
        }
        else {
            //Server connection failed
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(get_fav_link_req));
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
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var add_fav_link_req = {
        uid : uid,
        link : link,
        type : "add_fav_link"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                //store in storage now
            }
            else {
                //to be implemented
            }
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(add_fav_link_req));
}


function mark_site_in_server(uid, link) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var mark_site_req = {
        uid : uid,
        link : link,
        type : "mark_site"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                //store
                var tmp ={
                    type : "mark_site",
                    site : link
                };
                chrome.runtime.sendMessage(tmp, function(response) {

                });
            }
            else {
                //handle
            }
        }
        else {
            //handle
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(mark_site_req));
}


function unmark_site_in_server(uid, link) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var unmark_site_req = {
        uid : uid,
        link : link,
        type : "unmark_site"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                //delete from storage
               // alert("success");
                var tmp = {
                    type :"unmark_site",
                    site :link
                };
                chrome.runtime.sendMessage(tmp, function(response) {

                });
            }
            else {
                //handle
            }
        }
        else {
            //handle
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(unmark_site_req));
}


function unmark_site_in_server_from_stat(uid, link) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var unmark_site_req = {
        uid : uid,
        link : link,
        type : "unmark_site"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                //delete from storage
                // alert("success");
                var tmp = {
                    type :"unmark_site",
                    site :link
                };
                chrome.runtime.sendMessage(tmp, function(response) {

                });
                location.reload();
            }
            else {
                //handle
            }
        }
        else {
            //handle
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(unmark_site_req));
}


function update_site_time_in_server(uid, site, time) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    console.log(uid);
    console.log(site);
    console.log(time);
    var update_site_time_req = {
        uid : uid,
        site : site,
        time : time,
        type : "update_site_time"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                console.log(senderToServer.responseText);
            }
            else {
                //to be implemented
            }
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(update_site_time_req));
}

function get_marked_sites(uid) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var get_marked_sites_req = {
        uid : uid,
        type : "get_marked_sites"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            //console.log(senderToServer.responseText);
            var site_list = JSON.parse(senderToServer.responseText);
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
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(get_marked_sites_req));
}


function get_fav_link_from_server_background(uid,url) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var get_fav_link_req = {
        uid : uid,
        type : "get_fav_links"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var link_list = JSON.parse(senderToServer.responseText);
            var list_size = link_list.length;
            var links = [];

            var randomNumber, options;

            for(var i = 0; i < list_size; ++i) {
                links.push({title:"Check this link",message:link_list[i].site});
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
                suggest_link = link_list[randomNumber].site;
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
            //alert("inside");
        }
        else {
            //Server connection failed
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(get_fav_link_req));
}
