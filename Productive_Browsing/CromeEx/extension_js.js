var type = 0;
var events_today = ["Stuffs to do ","Places to go","People to meet","Chicks to fuck","Stuffs to somke"]


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
	//these are dummy code. this file will be uploded in the server. and then it will be set as background
	var element = document.getElementById('homepage_body');
	element.style.backgroundImage = "url('background.jpeg')";
	element.style.backgroundSize = "cover";
}


function Scroll_Events() {
	var events = "";
	events = events_today.join(", ");
	document.getElementById("ShowEventScroll").textContent = events;
}

function add_new_task()
{
	alert('Form submitted!');
    return false;
}

function load()
{
	document.getElementById("MyClockDisplay").onclick=toggle;
	document.getElementById("finput").onchange=fileInput;
	document.getElementById("edit_icon").onclick=selectBackground;
	document.getElementById("Task_Input").onsubmit=add_new_task;
}

window.onload = load;

Scroll_Events();
showTime();
