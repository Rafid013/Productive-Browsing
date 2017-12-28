var favourite_links=[];
var lastTab;
var lasturl;
var start_time;
var end_time;

/*setTimeout(sayHi, 5000);
function sayHi() {
    alert('Hello');
}*/
var options = {
    type : "basic",
    title : "You have a task to complete",
    message : "eat me",
    iconUrl : "icon.png"
}

chrome.notifications.create(options,notificationCallback);


chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

    // since only one tab should be active and in the current window at once
    // the return variable should only have one entry
    var activeTab = arrayOfTabs[0];
    lastTab = activeTab.id;
    var a = document.createElement('a');
    a.href = activeTab.url;// or do whatever you need
    lasturl = a.hostname;
    start_time = performance.now();
});


chrome.windows.onRemoved.addListener(window_close_handler);
chrome.tabs.onUpdated.addListener(start_tab);
chrome.tabs.onRemoved.addListener(close_tab);
chrome.tabs.onActivated.addListener(activateHandler);

function start_tab(tabId, changeInfo, tab) {
    end_time = performance.now();
    var b = document.createElement('a');
    b.href = tab.url;// or do whatever you need
    var currUrl = b.hostname;
    var total_time = (end_time-start_time)/1000;
    total_time = round(total_time, 2);
    if(tabId !== lastTab)
    {
        lastTab = tabId;
        console.log(lastTab);
        console.log(lasturl);
        console.log(total_time);
        lasturl = currUrl;
        start_time = end_time;
    }
    else if(lasturl !== currUrl)
    {
        console.log(lastTab);
        console.log(lasturl);
        console.log(total_time);
        lasturl = currUrl;
        start_time = end_time;
    }
    //start_time = performance.now();
}

function close_tab(tabId , removeInfo) {

    /*chrome.tabs.query({windowType:"normal"}, function(tabs) {
            if(tabs.length===1)
            {
                end_time = performance.now();
                var total_time = (end_time-start_time)/1000;
                total_time = round(total_time,2);
                console.log(lastTab);
                console.log(lasturl);
                console.log(total_time);
            }
    });*/
    //end_time = performance.now();
    //console.log("Call to doSomething took " + (end_time - start_time) + " milliseconds.")
}

function activateHandler(activeInfo) {
    if(activeInfo.tabId !== lastTab)
    {
        end_time = performance.now();
        var total_time = (end_time-start_time)/1000;
        total_time = round(total_time,2);
        console.log(lastTab);
        console.log(lasturl);
        console.log(total_time);
        lastTab=activeInfo.tabId;
        start_time = end_time;
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = arrayOfTabs[0];
            var a = document.createElement('a');
            a.href = activeTab.url;// or do whatever you need
            lasturl = a.hostname;
        });
    }
}

function window_close_handler() {
    end_time = performance.now();
    var total_time = (end_time-start_time)/1000;
    total_time = round(total_time,2);
    console.log(lastTab);
    console.log(lasturl);
    console.log(total_time);
}


chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === -1) {
        window_close_handler();
        console.log("out of focus");
    } else {
        chrome.windows.get(windowId, function(chromeWindow) {
            if (chromeWindow.state === "minimized") {
                //window_close_handler();
                console.log("minimized");
            } else {
                chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
                    console.log("maximized");
                    // since only one tab should be active and in the current window at once
                    // the return variable should only have one entry
                    var activeTab = arrayOfTabs[0];
                    lastTab = activeTab.id;
                    var a = document.createElement('a');
                    a.href = activeTab.url;// or do whatever you need
                    lasturl = a.hostname;
                    start_time = performance.now();
                });
                // Window is not minimized (maximized, fullscreen or normal)
            }
        });
    }
});

function round(value, decimals) {
    return Number(Math.round(Number(value+'e'+decimals)) + 'e-' + decimals);
}


chrome.contextMenus.create({
    "title": "Add this link to your Favourite Links",
    "contexts": ["link"],
    "onclick" : fav_link
});

chrome.contextMenus.create({
    "title": "Add this page to your Favourite Links",
    "contexts": ["page"],
    "onclick" : fav_page
});


function fav_link(data) {
    const index = favourite_links.indexOf(data.linkUrl);
    if (index === -1) {
        favourite_links.push(data.linkUrl);
        var uid;
        chrome.storage.sync.get("uid", function (obj) {
            if(obj.uid === undefined) {
                //do nothing
            }
            else {
                uid = obj.uid;
                add_fav_link_in_server(uid, data.linkUrl);
            }
        });
    }
    console.log(favourite_links);
}


function fav_page(data, tab) {
    const index = favourite_links.indexOf(tab.url);
    if (index === -1) {
        favourite_links.push(tab.url);
        var uid;
        chrome.storage.sync.get("uid", function (obj) {
            if(obj.uid === undefined) {
                //do nothing
            }
            else {
                uid = obj.uid;
                add_fav_link_in_server(uid, tab.url);
            }
        });
    }
    console.log(favourite_links);
}

chrome.runtime.onMessage.addListener(function (req/*, sender, res*/) {
    if(req.type === "open_new_tab") {
        //open new tab of the link in req.link
        chrome.tabs.create({url:req.link},function (response) {

        });
    }
});