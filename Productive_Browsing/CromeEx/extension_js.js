var type = 0;
var events_today;
var events_ToDo_List = ["Stuffs to do ","Places to go","People to meet","Chicks to fuck","Joints to smoke"];
var date_of_current_list;
var favourite_links;
var date_today;
var curTask ="";
var curLink ="";

var tmp= {
    type : "isSignedIn"
}
//chrome.runtime.sendMessage(tmp);
//eikhane wiat kore na nonblocking statement . ejonnoi problem
chrome.runtime.sendMessage(tmp, function(response) {
    isLoggedIn = response;
    //for now hard coded and returning true
    var body = document.getElementById("homepage_body");
    body.style.display="block";
    if(isLoggedIn==="true")
    {
        body.style.backgroundColor ="#6d7c62";
        body.style.color = "white";
        document.getElementById("signup_page").style.display="none";
        document.getElementById("home_page").style.display="block";
    }
    else
    {
        body.style.backgroundColor ="#76b852";
        document.getElementById("signup_page").style.display="block";
        document.getElementById("home_page").style.display="none";
    }
});

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
		type=1;
	}
	else
	{
		type=0;
	} 
}

function selectBackground() {
	var input = document.getElementById('finput');
	input.click();
}
function fileInput() {
	var image = document.getElementById('finput').files[0];
    var tmp= {
        type : "upload image",
        file: image
    }
    //chrome.runtime.sendMessage(tmp);
    chrome.runtime.sendMessage(tmp, function(response) {
        //get image form server as url link
    });
	//these are dummy code. this file will be uploaded in the server. and then it will be set as background
	var element = document.getElementById('homepage_body');
	element.style.backgroundImage = "url('background.jpeg')";
	element.style.backgroundSize = "cover";
}


function Scroll_Events() {
    var line = events_today.join(", ");
	document.getElementById("ShowEventScroll").textContent = line ;
}

function add_new_task()
{
	var form= document.getElementById("Task_Input");
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
        timeValue= "" + hours;
    } else if (hours > 12)
    {
        timeValue= "" + (hours - 12);
    }
    else if (hours == 0)
    {
        timeValue= "12";
    }

    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? "PM" : "AM";  // get AM/PM
	//alert(timeValue);
	var tmp = {
		task : document.getElementById('to_do').value,
		date : document.getElementById('date').value,
		time : timeValue,
        type : "add_task"
	};
	if(tmp.date=="")
    {
        tmp.date = date_today;
    }
    chrome.runtime.sendMessage(tmp, function(response) {
        events_ToDo_List = response;
        populateToDoList();
    });
	form.reset();
	return false;
}

function load()
{
    showTime();
    var tmp= {
        type : "get_to_do"
    }
    //chrome.runtime.sendMessage(tmp);
    chrome.runtime.sendMessage(tmp, function(response) {
        events_today = response;
        Scroll_Events();
        events_ToDo_List = response;
        populateToDoList();
    });
    var tmp1= {
        type : "get_fev_links"
    }
    //chrome.runtime.sendMessage(tmp);
    chrome.runtime.sendMessage(tmp1, function(response) {
        favourite_links = response;
        populateFavouriteLinks();
    });

    var date = new Date();
    date_of_current_list=(date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
    date_today =(date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
    var e = document.getElementById("task_list_ul");
    e.style.display = 'none';
    e = document.getElementById("favourite_list_ul");
    e.style.display = 'none';
	document.getElementById("MyClockDisplay").onclick=toggle;
	document.getElementById("finput").onchange=fileInput;
	document.getElementById("edit_icon").onclick=selectBackground;
    document.getElementById("remove_icon").onclick=delete_background;
	document.getElementById("Task_Input").onsubmit=add_new_task;
	document.getElementById("show_hide").onclick=toggle_visibility;
    document.getElementById("show_hide_fav").onclick=toggle_visibility_fav;
    document.getElementById("log_out").onclick=log_out;
    document.getElementById("rgister_Form").style.display = 'none';
    document.getElementById("go_to_login").onclick=logInPage;
    document.getElementById("go_to_register").onclick=RegisterPage;
    document.getElementById("logIn_Form").onsubmit=loggedIn;
    document.getElementById("rgister_Form").onsubmit=registered;
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

function newFevLink()
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
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var i;
    for (i = 0; i < favourite_links.length; i++)
    {
        curLink = favourite_links[i];
        newFevLink();
    }

    var close = document.getElementsByClassName("close_fev");
    for (i = 0; i < close.length; i++)
    {
        close[i].onclick = function() {
            var div = this.parentElement;
            //div.style.display = "none";
            var tmp = {
                link : div.textContent.substring(0,div.textContent.length-1),
                type : "delete_fev_link"
            };
            chrome.runtime.sendMessage(tmp, function(response) {
                favourite_links = response;
                populateFavouriteLinks();
            });
        }
    }
    //var list = document.querySelector('ul');
    ul.addEventListener('click', function(ev) {
        if (ev.target.tagName === 'LI') {
            var div = ev.target;
            var tmp = {
                link : div.textContent.substring(0,div.textContent.length-1),
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
            var tmp = {
                task : div.textContent.substring(0,div.textContent.lastIndexOf(" ")),
                date : date_of_current_list,
                time : div.textContent.substring(div.textContent.lastIndexOf(" ")+1,div.textContent.length-1),
                type : "delete to do"
            };
            chrome.runtime.sendMessage(tmp, function(response) {
                events_ToDo_List = response;
                populateToDoList();
            });
    	}
	}
	//var list = document.querySelector('ul');
	ul.addEventListener('click', function(ev) {
  		if (ev.target.tagName === 'LI') {
    		ev.target.classList.toggle('checked');
    		var div = ev.target;
            var tmp = {
                task : div.textContent.substring(0,div.textContent.lastIndexOf(" ")),
                date : date_of_current_list,
                time : div.textContent.substring(div.textContent.lastIndexOf(" ")+1,div.textContent.length-1),
                type : "to do completed"
            };
            chrome.runtime.sendMessage(tmp);
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
    var tmp = {
        type : "signed_out"
    };
    chrome.runtime.sendMessage(tmp);
    var body = document.getElementById("homepage_body");
    body.style.background = "none";
    body.style.backgroundColor ="#76b852";
    body.style.color = "black";
    logInPage();
    document.getElementById("signup_page").style.display="block";
    document.getElementById("home_page").style.display="none";
    return false;
}

function delete_background() {
    var tmp= {
        type : "del_image",
    }
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
    var b = document.getElementById("rgister_Form");
    a.style.display = 'block';
    b.style.display = 'none';
}

function RegisterPage()
{
    var a = document.getElementById("logIn_Form");
    var b = document.getElementById("rgister_Form");
    b.style.display = 'block';
    a.style.display = 'none';
}

function loggedIn()
{
    var tmp = {
        email : document.getElementById("login_email").value,
        password : document.getElementById("login_password").value,
        type : "sign_in"
    };
    chrome.runtime.sendMessage(tmp, function(response) {
        //if ok load home page
        isLoggedIn = response;
        if(isLoggedIn==="true")
        {
            var body = document.getElementById("homepage_body");
            body.style.backgroundColor ="#6d7c62";
            body.style.color = "white";
            document.getElementById("signup_page").style.display="none";
            document.getElementById("home_page").style.display="block";
        }
    });
    document.getElementById("logIn_Form").reset();
    return false;
}

function registered()
{
    var tmp = {
        name : document.getElementById("reg_name").value,
        email : document.getElementById("reg_password").value,
        password : document.getElementById("reg_email").value,
        type : "register"
    };
    chrome.runtime.sendMessage(tmp, function(response) {
        //if ok load home page
        isLoggedIn = response;
        if(isLoggedIn==="true")
        {
            var body = document.getElementById("homepage_body");
            body.style.backgroundColor ="#6d7c62";
            body.style.color = "white";
            document.getElementById("signup_page").style.display="none";
            document.getElementById("home_page").style.display="block";
        }
    });
    document.getElementById("rgister_Form").reset();
    return false;
}

window.onload = load;

