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


function mark_task_in_server(uid, task, date, time) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var mark_task_req = {
        uid : uid,
        task : task,
        date : date,
        time : time,
        type : "mark_task"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                //alert("Marked");
                //also mark in storage
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
            }
            else {
                //alert("Not Marked");
                //
            }
        }
        else {
            //server connection fault
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(mark_task_req));
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

function add_task_to_server(uid, task, date, normal_time, military_time) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var add_task_req = {
        uid : uid,
        task : task,
        date : date,
        normal_time : normal_time,
        military_time : military_time,
        type : "add_task"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                if(date === date_To_Do_list)
                {
                    events_ToDo_List.push(task + " " + normal_time);
                    var index = events_ToDo_List.indexOf(task + " " + normal_time);
                    events_ToDo_marked[index] = false;
                    //populateToDoList();
                    get_to_do_from_server(uid,date_To_Do_list);
                }
                if(date === date_today) {
                    events_today.push(task);
                    var index = events_today.indexOf(task);
                    events_today_marked[index] = false;
                    Scroll_Events();

                    var tmp = {
                        type : "add_Timer",
                        task : task,
                        time: military_time
                    };
                    chrome.runtime.sendMessage(tmp);
                }
            }
            else {
                //to be implemented
            }
        }
        else {
            //to be implemented
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(add_task_req));
}

function delete_task_from_server(uid, task, date, time) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var delete_task_req = {
        uid : uid,
        task : task,
        date : date,
        time : time,
        type : "delete_task"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            if(senderToServer.responseText === "success") {
                if(date === date_To_Do_list)
                {
                    var index = delete_from_array(events_ToDo_List, task + " " + time);
                    //alert(index);
                    if(index>-1)
                    {
                        //events_ToDo_marked.splice(index,1);
                    }
                    //populateToDoList();
                    get_to_do_from_server(uid,date_To_Do_list);
                }
                if(date === date_today) {
                    var index;
                    index = delete_from_array(events_today, task);
                    if(index>-1)
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
            }
            else {
                //to be implemented
            }
        }
        else {
            //to be implemented
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(delete_task_req));
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
            //server connection failed
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(get_fav_link_req));
}

function get_to_do_from_server(uid, date) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var getToDoReq = {
        uid : uid,
        date : date,
        type : "get_to_do"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var event_list_server = JSON.parse(senderToServer.responseText);
            var list_size = event_list_server.length;
            if(date === date_today) {
                events_today = [];
                events_today_marked = [];
            }
            events_ToDo_List = [];
            events_ToDo_marked = [];
            for(var i = 0; i < list_size; ++i) {
                var task = event_list_server[i].task;
                var normal_time = event_list_server[i].normal_time;
                events_ToDo_List.push(task + " " + normal_time);
                events_ToDo_marked[i]  = event_list_server[i].done;
                //var military_time = event_list_server[i].military_time;
                if(date === date_today) {
                    events_today.push(task);
                    events_today_marked[i] = event_list_server[i].done;
                }
            }
            populateToDoList();
            if(date === date_today)
            {
                Scroll_Events();
            }
            date_To_Do_list = date;
        }
        else {
            //to be implemented
            //storage
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(getToDoReq));
}

function search_to_do_from_server(uid, date, minTime, maxTime) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var getToDoReq = {
        uid : uid,
        date : date,
        type : "get_to_do"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var event_list_server = JSON.parse(senderToServer.responseText);
            var list_size = event_list_server.length;
            if(date === date_today) {
                events_today = [];
                events_today_marked = [];
            }
            events_ToDo_List = [];
            events_ToDo_marked = [];
            var min = get_Minutes(minTime);
            var max = get_Minutes(maxTime);
            var j = 0;
            for(var i = 0; i < list_size; ++i) {
                var task_time = get_Minutes(event_list_server[i].military_time);
                if(task_time>=min && task_time <=max) {
                    var task = event_list_server[i].task;
                    var normal_time = event_list_server[i].normal_time;
                    events_ToDo_List.push(task + " " + normal_time);
                    events_ToDo_marked[j] = event_list_server[i].done;
                    j++;
                }
                //var military_time = event_list_server[i].military_time;
                if(date === date_today) {
                    events_today.push(task);
                    events_today_marked[i] = event_list_server[i].done;
                }
            }
            console.log(events_ToDo_List);
            populateToDoList();
            if(date === date_today)
            {
                Scroll_Events();
            }
            date_To_Do_list = date;
        }
        else {
            //to be implemented
            //storage
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(getToDoReq));
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
            }
            chrome.storage.sync.set({"marked_sites" : sites_to_be_stored},function () {
                var tmp = {
                    type : "update_marked_sites_object"
                };
                chrome.runtime.sendMessage(tmp);

            });
            /*var tmp = {
                type :"load_marked_sites"
            };
            chrome.runtime.sendMessage(tmp, function(response) {

            });*/
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
            for(var i = 0; i < list_size; ++i) {
                links.push({title:"Check this link",message:link_list[i].site});
            }
            if(list_size === 0)
            {
                //alert("inside");
                links.push({title:"No task in To-Do List",message:""});
            }
            //alert("inside");
            var options = {
                type : "list",
                title : "You are using " + url + " too long",
                message : "You are using " + url + " too long",
                iconUrl : "icon.png",
                items: links
            };
            chrome.notifications.create(options);
        }
        else {
            //server connection failed
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(get_fav_link_req));
}
