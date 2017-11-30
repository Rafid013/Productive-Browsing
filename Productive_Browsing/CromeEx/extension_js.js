var type = 0;
var events_today = [];
var events_ToDo_List = [];
var date_of_current_list;
var favourite_links = [];
var date_today;
var curTask = "";
var curLink = "";

function checkLoggedIn() {
    //check if UID is stored
    //if stored return true
    //else false
    return false;
}

function delete_fav_link_from_server(uid, link) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var delete_fav_link_req = {
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
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(delete_fav_link_req));
}


function add_task_to_server(uid, task, date, time) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var add_task_req = {
        uid : "C8eNsKA1oNRRnGyihDMtNxyrGRI3",
        task : task,
        date : date,
        time : time,
        type : "add_task"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            alert(senderToServer.responseText);
            if(senderToServer.responseText === "success") {
                //if(dataToSend.date === date_today) events_ToDo_List.push(dataToSend.task + " " + dataToSend.time);
                events_today.push(task);
                Scroll_Events();
                events_ToDo_List.push(task + " " + time);
                populateToDoList();
            }
            else {
                //to be implemented
            }
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(add_task_req));
}

function delete_task_from_server(uid, task, date, time) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var delete_task_req = {
        uid : "C8eNsKA1oNRRnGyihDMtNxyrGRI3",
        task : task,
        date : date,
        time : time,
        type : "delete_task"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            alert(senderToServer.responseText);
            if(senderToServer.responseText === "success") {
                //if(dataToSend.date === date_today) events_ToDo_List.push(dataToSend.task + " " + dataToSend.time);
                var del_index = events_ToDo_List.indexOf(task + " " + time);
                if(del_index > -1) events_ToDo_List.splice(del_index, 1);
            }
            else {
                //to be implemented
            }
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
        type : "get_fav_link"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            favourite_links.push("something");
            populateFavouriteLinks();
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(get_fav_link_req));
}

function get_to_do_from_server(uid) {
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    var getToDoReq = {
      uid : uid,
      type : "get_to_do"
    };
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var event_list_server = JSON.parse(senderToServer.responseText);
            var list_size = event_list_server.length;
            for(var i = 0; i < list_size; ++i) {
                var data = event_list_server[i].task.split(",");
                var task = data[0];
                var date = data[1];
                var time = data[2];
                events_today.push(task);
                events_ToDo_List.push(task + " " + time);
            }
            Scroll_Events();
            populateToDoList();
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(getToDoReq));
}

function loadPage() {
    var body = document.getElementById("homepage_body");
    body.style.display="block";
    if(checkLoggedIn()) {
        body.style.backgroundColor ="#6d7c62";
        body.style.color = "white";
        document.getElementById("signup_page").style.display="none";
        document.getElementById("home_page").style.display="block";
    }
    else {
        body.style.backgroundColor ="#76b852";
        document.getElementById("signup_page").style.display="block";
        document.getElementById("home_page").style.display="none";
    }
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
		time = time + " "+session;	
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
function fileInput() {
	var image = document.getElementById('finput').files[0];
    var tmp = {
        type : "upload image",
        file: image
    };
	//these are dummy code. this file will be uploaded in the server. and then it will be set as background
	var element = document.getElementById('homepage_body');
	element.style.backgroundImage = "url('background.jpeg')";
	element.style.backgroundSize = "cover";
}


function Scroll_Events() {
	document.getElementById("ShowEventScroll").textContent = events_today.join(", ");
}

function add_new_task()
{
	var form = document.getElementById("Task_Input");
	var task = document.getElementById('to_do').value;
	var time = document.getElementById('time').value;
    time = time.split(':'); // convert to array
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
	//alert(timeValue);

    //
    // read uid here, uid will be stored from the moment a user logs in or registers
    //

    var date = document.getElementById('date').value;
    if(date === "") date = date_today;
    add_task_to_server("C8eNsKA1oNRRnGyihDMtNxyrGRI3", task, date, timeValue);
	form.reset();
	return false;
}

function load()
{
    loadPage();
    showTime();

    //
    // read uid here, uid will be stored from the moment a user logs in or registers
    //
    get_to_do_from_server("C8eNsKA1oNRRnGyihDMtNxyrGRI3"); //parameter will be changed to uid
    get_fav_link_from_server("C8eNsKA1oNRRnGyihDMtNxyrGRI3");



    var date = new Date();
    date_of_current_list=(date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
    date_today =(date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
    var e = document.getElementById("task_list_ul");
    e.style.display = 'none';
    e = document.getElementById("favourite_list_ul");
    e.style.display = 'none';
    document.getElementById("MyClockDisplay").onclick = toggle;
    document.getElementById("finput").onchange = fileInput;
    document.getElementById("edit_icon").onclick = selectBackground;
    document.getElementById("remove_icon").onclick = delete_background;
    document.getElementById("Task_Input").onsubmit = add_new_task;
    document.getElementById("show_hide").onclick = toggle_visibility;
    document.getElementById("show_hide_fav").onclick = toggle_visibility_fav;
    document.getElementById("log_out").onclick = log_out;
    document.getElementById("register_Form").style.display = 'none';
    document.getElementById("go_to_login").onclick = logInPage;
    document.getElementById("go_to_register").onclick = RegisterPage;
    document.getElementById("logIn_Form").onsubmit = logIn;
    document.getElementById("register_Form").onsubmit = register;
}

//adding elements in to do list
function newElement() 
{
  var li = document.createElement("li");
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
    span.className = "close_fav";
    span.appendChild(txt);
    li.appendChild(span);
}

function populateFavouriteLinks() {
    var ul=document.getElementById("favourite_list_ul");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var i;
    for (i = 0; i < favourite_links.length; i++)
    {
        curLink = favourite_links[i];
        newFavLink();
    }

    var close = document.getElementsByClassName("close_fav");
    for (i = 0; i < close.length; i++)
    {
        close[i].onclick = function() {
            var div = this.parentElement;
            //div.style.display = "none";

            //read uid here

            delete_fav_link_from_server("C8eNsKA1oNRRnGyihDMtNxyrGRI3",
                div.textContent.substring(0, div.textContent.length - 1));
        }
    }
    //var list = document.querySelector('ul');
    ul.addEventListener('click', function(ev) {
        if (ev.target.tagName === 'LI') {
            var div = ev.target;
            var tmp = {
                link : div.textContent.substring(0, div.textContent.length - 1),
                type : "open_new_tab"
            };
            chrome.runtime.sendMessage(tmp);
        }
    }, false);
}

function populateToDoList()
{
    var ul=document.getElementById("task_list_ul");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

	var i;
	for (i = 0; i < events_ToDo_List.length; i++)
	{
		curTask = events_ToDo_List[i];
		newElement();
	}

	var close = document.getElementsByClassName("close");
	for (i = 0; i < close.length; i++)
	{
  		close[i].onclick = function() {
    	    var div = this.parentElement;
    	    //div.style.display = "none";

            //read uid here

            delete_task_from_server(
                "C8eNsKA1oNRRnGyihDMtNxyrGRI3",
                div.textContent.substring(0, div.textContent.lastIndexOf(" ")),
                date_of_current_list,
                div.textContent.substring(div.textContent.lastIndexOf(" ") + 1, div.textContent.length - 1)
            );
    	}
	}
	//var list = document.querySelector('ul');
	ul.addEventListener('click', function(ev) {
  		if (ev.target.tagName === 'LI') {
    		ev.target.classList.toggle('checked');
    		var div = ev.target;

    		//read uid here
    		//mark_task_in_server(uid, task, date, time);
            /*var tmp = {
                task : div.textContent.substring(0,div.textContent.lastIndexOf(" ")),
                date : date_of_current_list,
                time : div.textContent.substring(div.textContent.lastIndexOf(" ")+1,div.textContent.length-1),
                type : "to do completed"
            };*/
  		}
	}, false);
}

function toggle_visibility() {	
  var e = document.getElementById("task_list_ul");
  if(e.style.display === 'none')
    e.style.display = 'block';
  else
    e.style.display = 'none';
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

    var body = document.getElementById("homepage_body");
    body.style.background = "none";
    body.style.backgroundColor ="#76b852";
    body.style.color = "black";
    logInPage();
    document.getElementById("signup_page").style.display = "block";
    document.getElementById("home_page").style.display = "none";
    return false;
}

function delete_background() {
    var tmp= {
        type : "del_image"
    };
    //chrome.runtime.sendMessage(tmp);
    chrome.runtime.sendMessage(tmp, function(response) {
        //get image form server as url link
    });
    //these are dummy code. this file will be uploaded in the server. and then it will be set as background
    var element = document.getElementById('homepage_body');
    element.style.backgroundImage = "url('background.jpeg')";
    element.style.backgroundSize = "cover";
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
    var log_in_req = {
        email : document.getElementById("login_email").value,
        password : document.getElementById("login_password").value,
        type : "sign_in"
    };
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var receivedData = JSON.parse(senderToServer.responseText);
            if(receivedData.message === "success") {
                var name = receivedData.name;
                var uid = receivedData.uid;
                //store name and uid
                alert(name);
                alert(uid);
                var body = document.getElementById("homepage_body");
                body.style.backgroundColor = "#6d7c62";
                body.style.color = "white";
                document.getElementById("signup_page").style.display = "none";
                document.getElementById("home_page").style.display = "block";
            }
            else {
                //to be implemented
            }
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(log_in_req));
    document.getElementById("logIn_Form").reset();
    return false;
}

function register()
{
    var register_req = {
        name : document.getElementById("reg_name").value,
        email : document.getElementById("reg_password").value,
        password : document.getElementById("reg_email").value,
        type : "sign_up"
    };
    var senderToServer = new XMLHttpRequest();
    senderToServer.open("POST", 'http://localhost:3000/', true);
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            var receivedData = JSON.parse(senderToServer.responseText);
            if(receivedData.message === "success") {
                var name = receivedData.name;
                var uid = receivedData.uid;
                //store name and uid
                alert(name);
                alert(uid);
                var body = document.getElementById("homepage_body");
                body.style.backgroundColor = "#6d7c62";
                body.style.color = "white";
                document.getElementById("signup_page").style.display = "none";
                document.getElementById("home_page").style.display = "block";
            }
            else {

            }
        }
    };
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(register_req));
    document.getElementById("register_Form").reset();
    return false;
}

window.onload = load;

