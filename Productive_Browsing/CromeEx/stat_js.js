window.onload = load;
var marked_sites = [];
var curSite;
function load() {
    chrome.storage.sync.get(["uid", "name"], function (obj) {
        if (obj.uid === undefined) {

        }
        else {
            get_marked_sites_stat(obj.uid);
        }
    });
    document.getElementById("mark_sites_ul").style.display = "none";
    document.getElementById("show_hide").onclick = toggle_visibility_sites;
}

function newSite()
{
    var li = document.createElement("li");
    var inputValue = curSite;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("mark_sites_ul").appendChild(li);
    }

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
}

function populateMarkedSites() {
    var ul=document.getElementById("mark_sites_ul");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var i;
    for (i = 0; i < marked_sites.length; i++)
    {
        curSite = marked_sites[i];
        newSite();
    }

    var close = document.getElementsByClassName("close");
    for (i = 0; i < close.length; i++)
    {
        close[i].onclick = function() {
            var div = this.parentElement;
            //div.style.display = "none";
            alert("unmark: "+div.textContent.substring(0, div.textContent.length - 1)+" ?");
        }
    }
    //var list = document.querySelector('ul');
    ul.addEventListener('click', function(ev) {
        // noinspection JSUnresolvedVariable
        if (ev.target.tagName === 'LI') {
            var div = ev.target;
            alert(div.textContent.substring(0, div.textContent.length - 1));
        }
    }, false);

}

function get_marked_sites_stat(uid) {
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
            for(var i = 0; i < site_list.length; ++i) {
                marked_sites[i] = site_list[i].site;
            }

            populateMarkedSites();
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(get_marked_sites_req));
}

function toggle_visibility_sites() {
    var e = document.getElementById("mark_sites_ul");
    if(e.style.display === 'none')
        e.style.display = 'block';
    else
        e.style.display = 'none';
    return false;
}