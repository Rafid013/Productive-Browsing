var type = 0;
var events_today = ["Stuffs to do ","Places to go","People to meet","Chicks to fuck","Joints to smoke"];
var events_ToDo_List = ["Stuffs to do ","Places to go","People to meet","Chicks to fuck","Joints to smoke"];
var curTask ="";

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
	//these are dummy code. this file will be uploaded in the server. and then it will be set as background
	var element = document.getElementById('homepage_body');
	element.style.backgroundImage = "url('background.jpeg')";
	element.style.backgroundSize = "cover";
}


function Scroll_Events() {
	document.getElementById("ShowEventScroll").textContent =  events_today.join(", ");
}

function add_new_task()
{
	var form= document.getElementById("Task_Input");
	var task = form.Text.value;
	alert(task);
	var tmp = {
		task : document.getElementById('to_do').value,
		date : document.getElementById('date').value,
		time : document.getElementById('time').value,
        type : "add_task"
	};
	chrome.runtime.sendMessage(tmp);
}

function load()
{
	populateToDoList();
	document.getElementById("MyClockDisplay").onclick=toggle;
	document.getElementById("finput").onchange=fileInput;
	document.getElementById("edit_icon").onclick=selectBackground;
	document.getElementById("Task_Input").onsubmit=add_new_task;
	document.getElementById("show_hide").onclick=toggle_visibility;
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

function populateToDoList()
{
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
    	div.style.display = "none";
    	}
	}
	var list = document.querySelector('ul');
	list.addEventListener('click', function(ev) {
  		if (ev.target.tagName === 'LI') {
    		ev.target.classList.toggle('checked');
  		}
	}, false);
}

function toggle_visibility() {	
  var e = document.getElementById("task_list_ul");
  if(e.style.display === 'none')
    e.style.display = 'block';
  else
    e.style.display = 'none';
}

window.onload = load;

Scroll_Events();
showTime();
