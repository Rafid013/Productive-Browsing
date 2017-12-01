var favourite_links=[];
var events_today = [];
var isloggedIn="true";


var activeTabIds=[];
var lastTab;
var lasturl;
var start_time;
var end_time;

chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

    // since only one tab should be active and in the current window at once
    // the return variable should only have one entry
    var activeTab = arrayOfTabs[0];
    lastTab = activeTab.id;
    var a= document.createElement('a');
    a.href = activeTab.url;// or do whatever you need
    lasturl=a.hostname;
    start_time = performance.now();
});


chrome.windows.onRemoved.addListener(window_close_handler);
chrome.tabs.onUpdated.addListener(start_tab);
chrome.tabs.onRemoved.addListener(close_tab);
chrome.tabs.onActivated.addListener(activateHandler);

function start_tab(tabId, changeInfo, tab) {
    var b= document.createElement('a');
    b.href = tab.url;// or do whatever you need
    var currUrl=b.hostname;
    var total_time = (end_time-start_time)/1000;
    total_time = round(total_time, 2);
    if(tabId !== lastTab)
    {
        lastTab=tabId;
        end_time = performance.now();
        console.log(lastTab);
        console.log(lasturl);
        console.log(total_time);
        lasturl = currUrl;
        start_time = end_time;
    }
    else if(lasturl !== currUrl)
    {
        end_time = performance.now();
        console.log(lastTab);
        console.log(lasturl);
        console.log(total_time);
        lasturl=currUrl;
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
            var a= document.createElement('a');
            a.href = activeTab.url;// or do whatever you need
            lasturl=a.hostname;
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
                    var a= document.createElement('a');
                    a.href = activeTab.url;// or do whatever you need
                    lasturl=a.hostname;
                    start_time = performance.now();
                });
                // Window is not minimized (maximized, fullscreen or normal)
            }
        });
    }
});

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
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
    }
    console.log(favourite_links);
}
function fav_page(data, tab) {
    const index = favourite_links.indexOf(tab.url);
    if (index === -1) {
        favourite_links.push(tab.url);
    }
    console.log(favourite_links);
}

chrome.runtime.onMessage.addListener(function (req, sender, res) {
    var dataToSend;
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    if(req.type === "get_to_do")
    {
        dataToSend = {
          uid : "C8eNsKA1oNRRnGyihDMtNxyrGRI3",
          type : "get_to_do"
        };
        senderToServer.onreadystatechange = function () {
            if (senderToServer.readyState === 4 && senderToServer.status === 200) {
                //res(senderToServer.responseText);
            }
        };
        res(events_today);
    }

    else if(req.type === "delete to do")
    {
        //delete task from database
        //this is test and works fine
        var str = req.task+" "+req.time;
        const index = events_today.indexOf(str);
        if (index !== -1) {
            events_today.splice(index, 1);
            alert(str);
        }
        res(events_today);
    }

    else if(req.type === "to do completed")
    {
        //task completed operation on database
        //this is test and works fine
        var str = req.task+" "+req.date+" "+req.time;
        alert(str);
    }

    else if(req.type === "upload image")
    {
        //upload req.file in server and send the url as response
    }

    else if(req.type === "del_image")
    {
        //delete image and send default image url as response
    }

    else if(req.type === "isSignedIn")
    {
        res(isloggedIn);
    }

    else if(req.type === "sign_in")
    {
        //check if sign in is successful or not
        alert(req.email);
        var tmp = "false";
        res(tmp);
    }

    else if(req.type === "register")
    {
        //create new ID
        isloggedIn="true";
        res(isloggedIn);
    }
    else if(req.type === "isMarked")
    {
        //check if the domain is marked as time killer and send back status
        var a= document.createElement('a');
        a.href = req.url; // getting domain name from url
        var tmp = "false";
        res(tmp);
    }
    else if(req.type === "signed_out")
    {
        isloggedIn="false";
    }
    else if(req.type === "mark_site")
    {

    }
    else if(req.type === "un_mark_site")
    {

    }

    else if(req.type === "delete_fev_link")
    {
        //delete link in req.link
        const index = favourite_links.indexOf(req.link);
        if (index !== -1) {
            favourite_links.splice(index, 1);
        }
        res(favourite_links);
    }

    else if(req.type === "open_new_tab")
    {
        //open new tab of the link in req.link
        chrome.tabs.create({url:req.link},function (response) {
        });
    }

    else if(req.type === "get_fev_links")
    {
        res(favourite_links);
    }

    else if(req.type === "add_task")
    {
        events_today.push(req.task + " " + req.time);
        dataToSend = {
            task : {
                activity : req.task,
                date : req.date,
                time : req.time
            },
            uid : "C8eNsKA1oNRRnGyihDMtNxyrGRI3",
            type : "add_task"
        };
        senderToServer.onreadystatechange = function () {
           if(senderToServer.readyState === 4 && senderToServer.status === 200) {
                if(senderToServer.responseText === "success") {

                }
                else {
                    //to be implemented
                }
           }
        };
    }
    //senderToServer.setRequestHeader("Content-Type", "application/json");
    //senderToServer.send(JSON.stringify(dataToSend));
});