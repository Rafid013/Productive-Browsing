window.onload = load;
var marked_sites = [];
var sites_for_bar_chart = ["www.facebook.com","www.twitter.com","www.google.com","www.abc.com","www.def.com"];
var site_times_in_min =[100,86,89,233,29];
var total_time = 537;
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
    document.getElementById("next_button").onclick = nextButtonClickListener;
    document.getElementById("prev_button").onclick = prevButtonClickListener;
    populate_bar_chart(sites_for_bar_chart,site_times_in_min,total_time);
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

function round(value, decimals) {
    return Number(Math.round(Number(value+'e'+decimals)) + 'e-' + decimals);
}

function min_to_hour(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    h = h === 0 ? "" : h.toString() + " Hour(s) ";
    m = m < 10 ? "0" + m.toString() +" Minutes(s)" : m.toString() + " Minutes(s)";
    return h+m ;
}

function populate_bar_chart(bar_title_array, bar_value_array, total_min) {
    var bars = document.getElementsByClassName("progress-fill");
    var labels =document.getElementsByClassName("bar_chart_inside_text");
    var length = bar_title_array.length;
    for(var i = 0; i<length && i<5; i++)
    {
        var percent = (bar_value_array[i]*100.0)/total_min;
        var round_up_value = round(percent,2);
        percent = percent.toString() + "%";
        var text = bar_title_array[i] + " " + min_to_hour(bar_value_array[i])+" " + round_up_value.toString() +"%";
        bars[i].style.width = percent;
        labels[i].innerText = text;
    }
}

function populate_bar_test() {
    var bars = document.getElementsByClassName("progress-fill");
    var labels =document.getElementsByClassName("bar_chart_inside_text");
    for(var i = 0; i<5; i++)
    {
        var percent = 10*(i+1)+ "%";
        bars[i].style.width = percent;
        labels[i].innerText = "abcdef";
    }
}

function prevButtonClickListener() {
    alert("prev clicked");
}

function nextButtonClickListener() {
    alert("next clicked");
}