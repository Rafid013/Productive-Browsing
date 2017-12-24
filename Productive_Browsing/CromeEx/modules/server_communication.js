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
                alert("Marked");
                //also mark in storage
            }
            else {
                alert("Not Marked");
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
                if(date === date_today) {
                    events_today.push(task);
                    Scroll_Events();
                    events_ToDo_List.push(task + " " + normal_time);
                    populateToDoList();
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
                if(date === date_today) {
                    delete_from_array(events_today, task);
                    delete_from_array(events_ToDo_List, task + " " + time);
                    populateToDoList();
                    Scroll_Events();
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
            for(var i = 0; i < list_size; ++i) {
                var task = event_list_server[i].task;
                var normal_time = event_list_server[i].normal_time;
                //var military_time = event_list_server[i].military_time;
                //var done = event_list_server[i].done;
                if(date === date_today) {
                    events_today.push(task);
                    events_ToDo_List.push(task + " " + normal_time);
                    Scroll_Events();
                    populateToDoList();
                }
            }
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