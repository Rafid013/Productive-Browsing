window.onload = load;
var toolbar;
var log_in_div;
var mark_div;
var unmark_div;
function load() {
    toolbar = document.getElementById("Tool_Bar");
    log_in_div = document.getElementById("log_in");
    mark_div = document.getElementById("Mark_Site");
    unmark_div = document.getElementById("Unmark_Site");
    toolbar.style.display="none";
    log_in_div.style.display = "none";
    mark_div.style.display= "none";
    unmark_div.style.display ="none";
    var tmp= {
        type : "isSignedIn"
    }
    chrome.runtime.sendMessage(tmp, function(response) {
        isLoggedIn = response;
        if(isLoggedIn==="true")
        {
            toolbar.style.display = "block";
            log_in_div.style.display ="none";
            chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

                // since only one tab should be active and in the current window at once
                // the return variable should only have one entry
                var activeTab = arrayOfTabs[0];
                var activeTabId = activeTab.url; // or do whatever you need
                var tmp= {
                    url : activeTabId,
                    type : "isMarked"
                }
                chrome.runtime.sendMessage(tmp, function(response) {
                    var isMarked = response;
                    if(isMarked==="true")
                    {
                        mark_div.style.display= "none";
                        unmark_div.style.display ="block";
                    }
                    else
                    {
                        mark_div.style.display= "block";
                        unmark_div.style.display ="none";
                    }
                });
            });
        }
        else
        {
            toolbar.style.display="none";
            log_in_div.style.display = "block";
            mark_div.style.display= "none";
            unmark_div.style.display ="none";
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
        var tmp = {
            url : activeTabId,
            type : "mark_site"
        };
        chrome.runtime.sendMessage(tmp);

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
        var tmp = {
            url : activeTabId,
            type : "un_mark_site"
        };
        chrome.runtime.sendMessage(tmp);

    });
    toolbar.style.display="block";
    log_in_div.style.display = "none";
    mark_div.style.display= "block";
    unmark_div.style.display ="none";
    return false;
}
function log_out() {
    var tmp = {
        type : "signed_out"
    };
    chrome.runtime.sendMessage(tmp);
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