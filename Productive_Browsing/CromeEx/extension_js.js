var type = 0;
var events_today = [];
var events_today_marked = [];
var events_ToDo_List = [];
var events_ToDo_marked = [];

var to_do_complete = [];

var favourite_links = [];
var date_today;
var date_To_Do_list;
var curTask = "";
var curLink = "";
var uid;
var name;
var priority = 2;
var search_by_priority = 2;

function showBackground(url) {
    var element = document.getElementById('homepage_body');
    if(url === "none") element.style.backgroundImage = "none";
    else element.style.backgroundImage = "url(" + url + ")";
    element.style.backgroundSize = "cover";
    document.getElementById("loading").style.display = "none";
}

function loadPage() {
    firebase.auth().onAuthStateChanged(function(user) {
        var body = document.getElementById("homepage_body");
        body.style.display = "block";
        if (user) {
            // User is signed in.
            //body.style.backgroundColor = "#6d7c62";
            body.style.color = "white";
            document.getElementById("signup_page").style.display = "none";
            document.getElementById("home_page").style.display = "block";
            uid = user.uid;
            name = user.displayName;

            document.getElementById("Things_To_DO").innerText = "Hello " + name
                                + "\n Your Tasks Today";

            get_to_do_from_server(uid, date_today);
            get_fav_link_from_server(uid);
            get_marked_sites(uid);

            chrome.storage.sync.get(["image_url","color"], function (item) {
                if(item.image_url !== undefined) showBackground(item.image_url);
                else getBackgroundDownloadURL(uid, showBackground);
                if(item.color === undefined)
                {
                    chrome.storage.sync.set({"color" : "white"});
                }
                else
                {
                    body.style.color = item.color;
                    if(item.color === "white" )
                    {
                        document.getElementById("white").style.display = "block";
                        document.getElementById("black").style.display = "none";

                    }
                    else
                    {
                        document.getElementById("white").style.display = "none";
                        document.getElementById("black").style.display = "block";

                    }
                }
            });
        } else {
            // No user is signed in.
            //body.style.backgroundColor = "#76b852";
            //body.style.color = "black";
            logInPage();
            document.getElementById("signup_page").style.display = "block";
            document.getElementById("home_page").style.display = "none";
            showBackground("backgrounds/background1.jpeg");
        }
    });
}


function showTime(){
	var date = new Date();
	var h = date.getHours(); // 0 - 23
	var m = date.getMinutes(); // 0 - 59
	var s = date.getSeconds(); // 0 - 59
	var session = "AM";


	if(h === 0 && type === 0){
		h = 12;
	}

	if(h > 12 && type === 0){
		h = h - 12;
		session = "PM";
	}

	h = (h < 10) ? "0" + h : h;
	m = (m < 10) ? "0" + m : m;
	s = (s < 10) ? "0" + s : s;

	var time = h + ":" + m + ":" + s;
	if(type === 0)
	{
		time = time + " " + session;
	}
	document.getElementById("MyClockDisplay").innerText = time;
	document.getElementById("MyClockDisplay").textContent = time;

	setTimeout(showTime, 1000);
}

function toggle() {
	if(type === 0)
	{
		type = 1;
	}
	else
	{
		type = 0;
	} 
}

function selectBackground() {
	var input = document.getElementById('finput');
	input.click();
}

function deleteBackground() {
    delete_image(uid);

    //gets one of the default backgrounds available
    getBackgroundDownloadURL(uid, showBackground);
}



function fileInput() {
	var image = document.getElementById('finput').files[0];
    document.getElementById("upload_progress_bar").style.display = "block";
    upload_image(uid, image, function (downloadURL) {
        console.log(downloadURL);
        chrome.storage.sync.set({"image_url": downloadURL});
        document.getElementById("upload_progress_bar").style.display = "none";
        showBackground(downloadURL);
    });
}


function Scroll_Events() {
	document.getElementById("ShowEventScroll").textContent = events_today.join(", ");
}

function add_new_task()
{
	var form = document.getElementById("Task_Input");
	var task = document.getElementById('to_do').value;
	var time = document.getElementById('time').value;



    var militaryTimeValue = time;
    time = time.split(':');// convert to array
    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    // calculate
    var timeValue;

    if (hours > 0 && hours <= 12)
    {
        timeValue = "" + hours;
    } else if (hours > 12)
    {
        timeValue = "" + (hours - 12);
    }
    else if (hours === 0)
    {
        timeValue = "12";
    }

    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? "PM" : "AM";  // get AM/PM


    var date = document.getElementById('date').value;
    if(date === "") date = date_today;
    add_task_to_server(uid, task, date, timeValue, militaryTimeValue, Number(priority));
	form.reset();
	return false;
}

function search_to_do() {
    var date = document.getElementById("Search_date").value;
    var maxTime = document.getElementById("maxTime").value;
    var minTime = document.getElementById("minTime").value;
    search_to_do_from_server(uid, date, minTime, maxTime);
    //get_to_do_from_server(uid,date);
    return false;
}

function load()
{
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if(month < 10) month = "0" + month;
    if(day < 10) day = "0" + day;
    date_today = year + "-" + month + "-" + day;
    date_To_Do_list = year + "-" + month + "-" + day;
    loadPage();
    showTime();
    priority_selection_handler();

    var e = document.getElementById("task_list_ul");
    e.style.display = 'none';
    e = document.getElementById("favourite_list_ul");
    e.style.display = 'none';
    document.getElementById("error_message_reg").style.display = "none";
    document.getElementById("error_message_logIn").style.display = "none";
    document.getElementById("configure_profile").style.display = "none";
    document.getElementById("white").style.display = "block";
    document.getElementById("black").style.display = "none";
    document.getElementById("loading").style.display = "block";
    document.getElementById("search_container").style.display = "none";
    document.getElementById("upload_progress_bar").style.display = "none";
    document.getElementById("MyClockDisplay").onclick = toggle;
    document.getElementById("finput").onchange = fileInput;
    document.getElementById("edit_icon").onclick = selectBackground;
    document.getElementById("invert_color").onclick = invert_color;
    document.getElementById("remove_icon").onclick = deleteBackground;
    document.getElementById("Task_Input").onsubmit = add_new_task;
    document.getElementById("show_hide").onclick = toggle_visibility;
    document.getElementById("stat_page").onclick = show_stat_page;
    document.getElementById("show_hide_fav").onclick = toggle_visibility_fav;
    document.getElementById("log_out").onclick = log_out;
    document.getElementById("register_Form").style.display = 'none';
    document.getElementById("go_to_login").onclick = logInPage;
    document.getElementById("go_to_register").onclick = RegisterPage;
    document.getElementById("logIn_Form").onsubmit = logIn;
    document.getElementById("register_Form").onsubmit = register;
    document.getElementById("search_form").onsubmit = search_to_do;
}
function show_stat_page() {
    window.location.href = "stat.html";
    return false;
}
//adding elements in to do list
function newElement(isDone,curr_priority)
{
      var li = document.createElement("li");
      if(curr_priority === 1)
      {
          li.style.color = "#4ff441";
          li.title = "Low Priority"
      }
      else if(curr_priority === 2)
      {
          li.style.color = "#e5db6b";
          li.title = "Medium Priority"
      }
      else
      {
          li.style.color = "#f4a142";
          li.title = "High Priority"
      }
      var inputValue = curTask;
      var t = document.createTextNode(inputValue);
      li.appendChild(t);
      if (inputValue === '') {
        alert("You must write something!");
      } else {
        document.getElementById("task_list_ul").appendChild(li);
      }

      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);
      if(isDone)
      {
          li.classList.toggle('checked');
      }
}

function newFavLink()
{
    var li = document.createElement("li");
    var inputValue = curLink;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("favourite_list_ul").appendChild(li);
    }

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close_fev";
    span.appendChild(txt);
    li.appendChild(span);
}

function populateFavouriteLinks() {
    var ul=document.getElementById("favourite_list_ul");
    ul.removeEventListener('click',favourite_link_onclick_listener,false);
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var i;
    for (i = 0; i < favourite_links.length; i++)
    {
        curLink = favourite_links[i];
        newFavLink();
    }

    var close = document.getElementsByClassName("close_fev");
    for (i = 0; i < close.length; i++)
    {
        close[i].onclick = function() {
            var div = this.parentElement;
            //div.style.display = "none";
            delete_fav_link_from_server(uid,
                div.textContent.substring(0, div.textContent.length - 1));
        }
    }
    //var list = document.querySelector('ul');
    ul.addEventListener('click', favourite_link_onclick_listener , false);
}

function favourite_link_onclick_listener(ev) {
    if (ev.target.tagName === 'LI') {
        var div = ev.target;
        var tmp = {
            link : div.textContent.substring(0, div.textContent.length - 1),
            type : "open_new_tab"
        };
        chrome.runtime.sendMessage(tmp);
    }
}

function populateToDoList()
{
    var ul = document.getElementById("task_list_ul");
    ul.removeEventListener('click',mark_event_listener,false);
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

	var i;
	for (i = 0; i < events_ToDo_List.length; i++)
	{
		curTask = events_ToDo_List[i];
		var curr_priority = to_do_complete[i].priority;
		newElement(events_ToDo_marked[i],curr_priority);
	}

	var close = document.getElementsByClassName("close");
	for (i = 0; i < close.length; i++)
	{
  		close[i].onclick = function() {
    	    var div = this.parentElement;
    	    div.style.display = "none";

            var task = div.textContent.substring(0, div.textContent.lastIndexOf(" "));
            var time = div.textContent.substring(div.textContent.lastIndexOf(" ") + 1, div.textContent.length - 1);

            delete_task_from_server(uid, task, date_To_Do_list, time);
    	}
	}
	//var list = document.querySelector('ul');
	ul.addEventListener('click',mark_event_listener,false);
}

function populateToDoListByPriority()
{
    var ul = document.getElementById("task_list_ul");
    ul.removeEventListener('click',mark_event_listener,false);
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var i;
    for (i = 0; i < events_ToDo_List.length; i++)
    {
        curTask = events_ToDo_List[i];
        var curr_priority = to_do_complete[i].priority;
        if(curr_priority === Number(search_by_priority))
        {
            newElement(events_ToDo_marked[i],curr_priority);
        }
    }

    var close = document.getElementsByClassName("close");
    for (i = 0; i < close.length; i++)
    {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";

            var task = div.textContent.substring(0, div.textContent.lastIndexOf(" "));
            var time = div.textContent.substring(div.textContent.lastIndexOf(" ") + 1, div.textContent.length - 1);

            delete_task_from_server(uid, task, date_To_Do_list, time);
        }
    }
    //var list = document.querySelector('ul');
    ul.addEventListener('click',mark_event_listener,false);
}

function mark_event_listener(ev) {
    if (ev.target.tagName === 'LI') {
        // noinspection JSUnresolvedVariable
        ev.target.classList.toggle('checked');
        //alert("inside");
        var div = ev.target;
        var task = div.textContent.substring(0, div.textContent.lastIndexOf(" "));
        var time = div.textContent.substring(div.textContent.lastIndexOf(" ") + 1, div.textContent.length - 1);
        var index;

        index = events_ToDo_List.indexOf(task + " " + time);
        if (index > -1) {
            events_ToDo_marked[index] = !events_ToDo_marked[index];
        }

        if (date_To_Do_list === date_today) {
            index = events_today.indexOf(task);
            if (index > -1) {
                events_today_marked[index] = !events_today_marked[index];
            }
        }


        //read uid here
        mark_task_in_server(uid, task, date_To_Do_list, time);

    }
}


function toggle_visibility() {	
    var e = document.getElementById("task_list_ul");
    var searchDiv = document.getElementById("search_container");
    if(e.style.display === 'none'){
        e.style.display = 'block';
        searchDiv.style.display = 'block';
    }
    else{
        e.style.display = 'none';
        searchDiv.style.display = 'none';
    }
    return false;
}

function toggle_visibility_fav() {
    var e = document.getElementById("favourite_list_ul");
    if(e.style.display === 'none')
        e.style.display = 'block';
    else
        e.style.display = 'none';
    return false;
}

function log_out() {

    //delete UID from chrome storage
    //storage empty
    firebase.auth().signOut()
        .then(function () {
            chrome.storage.sync.remove(["uid", "name", "image_url", "marked_sites","color"]);
            events_today = [];
            events_ToDo_List = [];
            favourite_links = [];
            var tmp = {
                type : "delete_all_timers"
            };
            chrome.runtime.sendMessage(tmp);

        })
        .catch(function (error) {
            console.log(error.message);
        });
}


function logInPage()
{
    var a = document.getElementById("logIn_Form");
    var b = document.getElementById("register_Form");
    a.style.display = 'block';
    b.style.display = 'none';
}

function RegisterPage()
{
    var a = document.getElementById("logIn_Form");
    var b = document.getElementById("register_Form");
    b.style.display = 'block';
    a.style.display = 'none';
}


function logIn()
{
    document.getElementById("loading").style.display = "block";
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userRecord) {
            document.getElementById("error_message_logIn").style.display = "none";
            document.getElementById("loading").style.display = "none";
            console.log("Signed In");
            console.log("UID: " + userRecord.uid);
            console.log("Name: " + userRecord.displayName);
            name = userRecord.displayName;
            uid = userRecord.uid;
            var tmp = {
                type : "start_timer",
                uid : uid
            };
            chrome.runtime.sendMessage(tmp);
            //store name and uid
            chrome.storage.sync.set({"uid": uid});
            chrome.storage.sync.set({"name": name});
        }).catch(function (error) {
            document.getElementById("loading").style.display = "none";
            //console.log("Error when signing in for email: " + email);
            var input = document.getElementById("login_email");
            if(error.code === "auth/invalid-email")
            {
                var text = "The email address is improperly formatted";
                document.getElementById("error_message_logIn").innerText =  text;
            }

            else if(error.code === "auth/wrong-password")
            {
                var text = "The password is invalid";
                document.getElementById("error_message_logIn").innerText =  text;
            }
            else if(error.code === "auth/user-not-found")
            {
                var text = "No user record found";
                document.getElementById("error_message_logIn").innerText =  text;
            }
            else if(error.code === "auth/internal-error")
            {
                var text = "Internal Error. Try again.";
                document.getElementById("error_message_logIn").innerText = text;
            }
            document.getElementById("error_message_logIn").style.display = "block";
            //input.setCustomValidity(error.message);
            //console.log(error.code);
            //console.log(error.message);
        });
    document.getElementById("logIn_Form").reset();
    return false;
}

function register()
{
    document.getElementById("loading").style.display = "block";
    var register_req = {
        name : document.getElementById("reg_name").value,
        email : document.getElementById("reg_email").value,
        password : document.getElementById("reg_password").value,
        type : "sign_up"
    };
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var receivedData = JSON.parse(senderToServer.responseText);
            document.getElementById("loading").style.display = "none";
            if(receivedData.message === "success") {
                document.getElementById("error_message_reg").style.display = "none";
                name = receivedData.name;
                uid = receivedData.uid;
                //store name and uid
                var tmp = {
                    type : "start_timer",
                    uid:uid
                };
                chrome.runtime.sendMessage(tmp);
                chrome.storage.sync.set({"uid": uid});
                chrome.storage.sync.set({"name": name});
                firebase.auth().signInWithEmailAndPassword(register_req.email, register_req.password);
            }
            else {

                if(receivedData.message === "auth/invalid-email")
                {
                    var text = "The email address is improperly formatted";
                    document.getElementById("error_message_reg").innerText =  text;
                }

                else if(receivedData.message === "auth/invalid-password")
                {
                    var text = "The password must be a string with at least 6 characters";
                    document.getElementById("error_message_reg").innerText =  text;
                }
                else if(receivedData.message === "auth/email-already-exists")
                {
                    var text = "The email address is already in use";
                    document.getElementById("error_message_reg").innerText =  text;
                }
                else if(receivedData.message === "auth/internal-error")
                {
                    var text = "Internal Error. Try again.";
                    document.getElementById("error_message_reg").innerText = text;
                }
                document.getElementById("error_message_reg").style.display = "block";
                //show the error
            }
        }
        else {
            //show there was a problem while connecting to server, try again later
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(register_req));
    document.getElementById("register_Form").reset();
    return false;
}


function priority_selection_handler() {

    var inputs = document.querySelectorAll("#priority input");
    for(var i=0; i<inputs.length ;i++)
    {
        inputs[i].addEventListener('click',function (event) {
            var div = document.querySelector("#priority > div");
            div.style.transform = "translateX(" + event.target.name + ")";
            priority = event.target.value;
        },false);
    }
    inputs = document.querySelectorAll("#search_priority input");
    for(var i=0; i<inputs.length ;i++)
    {
        inputs[i].addEventListener('click',function (event) {
            var div = document.querySelector("#search_priority > div");
            div.style.transform = "translateX(" + event.target.name + ")";
            search_by_priority = event.target.value;
            populateToDoListByPriority();
        },false);
    }
}

window.onload = load;

function invert_color() {
    var body = document.getElementById("homepage_body");
    if(body.style.color === "white")
    {
        body.style.color = "#000000";
        document.getElementById("white").style.display = "none";
        document.getElementById("black").style.display = "block";
        chrome.storage.sync.set({"color" : "#000000"});
    }
    else
    {
        body.style.color = "white";
        document.getElementById("white").style.display = "block";
        document.getElementById("black").style.display = "none";
        chrome.storage.sync.set({"color" : "white"});
    }
    return false;
}