window.onload = load;
var toolbar;
var log_in_div;
var mark_div;
var unmark_div;
var uid;
var name;
function load() {
    toolbar = document.getElementById("Tool_Bar");
    log_in_div = document.getElementById("log_in");
    mark_div = document.getElementById("Mark_Site");
    unmark_div = document.getElementById("Unmark_Site");
    toolbar.style.display = "none";
    log_in_div.style.display = "none";
    mark_div.style.display = "none";
    unmark_div.style.display = "none";

    chrome.storage.sync.get(["uid","name"], function (obj) {
        if(obj.uid === undefined)
        {
            toolbar.style.display="none";
            log_in_div.style.display = "block";
            mark_div.style.display= "none";
            unmark_div.style.display ="none";
        }
        else
        {
            uid = obj.uid;
            name = obj.name;
            toolbar.style.display = "block";
            log_in_div.style.display ="none";
            chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

                // since only one tab should be active and in the current window at once
                // the return variable should only have one entry
                var activeTab = arrayOfTabs[0];
                var activeTabId = activeTab.url; // or do whatever you need

                //check from storage if it's marked or not
                var isMarked = true;
                if(isMarked) {
                    mark_div.style.display= "none";
                    unmark_div.style.display ="block";
                }
                else {
                    mark_div.style.display= "block";
                    unmark_div.style.display ="none";
                }
                /*chrome.runtime.sendMessage(tmp, function(response) {
                    var isMarked = response;
                    if(isMarked === "true")
                    {
                        mark_div.style.display= "none";
                        unmark_div.style.display ="block";
                    }
                    else
                    {
                        mark_div.style.display= "block";
                        unmark_div.style.display ="none";
                    }
                });*/
            });
        }
    });

    document.getElementById("Log_in_button").onclick = log_in;
    document.getElementById("mark_site_button").onclick = mark_site;
    document.getElementById("unmark_site_button").onclick = unmark_site;
    document.getElementById("home").onclick = home;
    document.getElementById("stat").onclick = stat;
    document.getElementById("LogOut").onclick = log_out;
}
function log_in() {
    chrome.tabs.create({},function (response) {
    });
    return false;
}
function mark_site() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.url; // or do whatever you need
        /*var tmp = {
            link : activeTabId,
            type : "mark_site"
        };*/
        mark_site_in_server(uid, activeTabId);
        //chrome.runtime.sendMessage(tmp);

    });

    toolbar.style.display="block";
    log_in_div.style.display = "none";
    mark_div.style.display= "none";
    unmark_div.style.display ="block";
    return false;
}
function unmark_site() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.url; // or do whatever you need
        /*var tmp = {
            url : activeTabId,
            type : "un_mark_site"
        };
        chrome.runtime.sendMessage(tmp);*/
        unmark_site_in_server(uid, activeTabId);

    });
    toolbar.style.display="block";
    log_in_div.style.display = "none";
    mark_div.style.display= "block";
    unmark_div.style.display ="none";
    return false;
}
function log_out() {
    chrome.storage.sync.remove(["uid","name"]);
    toolbar.style.display="none";
    log_in_div.style.display = "block";
    mark_div.style.display= "none";
    unmark_div.style.display ="none";
    return false;
}
function home() {
    chrome.tabs.create({},function (response) {
    });
    return false;
}
function stat() {
    return false;
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