//currently it is not doing anything
//chrome.tabs does not give access to content script.
//These works are done on the background script

var start_time;
var end_time;
//chrome.tabs.onCreated.addListener(start_tab);
//chrome.tabs.onUpdated.addListener(close_tab);
function start_tab(tab) {
    start_time = performance.now();
}

function close_tab(tab) {
    end_time = performance.now();
    console.log("Call to doSomething took " + (end_time - start_time) + " milliseconds.")
}



