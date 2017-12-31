var type = 0;
var events_today = [];
var events_today_marked = [];
var events_ToDo_List = [];
var events_ToDo_marked = [];
var favourite_links = [];
var date_today;
var curTask = "";
var curLink = "";
var uid;
var name;

function delete_from_array(array, elem) {
    var index = array.indexOf(elem);
    if(index > -1)
    {
        array.splice(index, 1);
    }
    return index;
}

/*function checkLoggedIn() {
    //check if UID is stored
    //if stored return true
    //else false
    var status = false;
    return status;
}*/
var config = {
    apiKey: "AIzaSyDWIgzbaNxKJ9HIxIrKTPI02jAXd2KDr-I",
    authDomain: "productive-browsing.firebaseapp.com",
    storageBucket: "productive-browsing.appspot.com"
};

firebase.initializeApp(config);


var storageRef = firebase.storage().ref();


function upload_image(uid, file, callback) {
    // Create the file metadata
    var metadata = {
        contentType: 'image/jpeg'
    };

// Upload file and metadata to the object 'images/mountains.jpg'
    // noinspection JSCheckFunctionSignatures
    var uploadTask = storageRef.child(uid + "/background.jpeg").put(file, metadata);

// Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // noinspection JSUnresolvedVariable
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            document.getElementById("progress").value = progress;
            // noinspection JSUnresolvedVariable
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function(error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        }, function() {
            // Upload completed successfully, now we can get the download URL
            var downloadURL = uploadTask.snapshot.downloadURL;
            callback(downloadURL);
        });
}

function delete_image(uid) {
    var delRef = storageRef.child(uid + "/background.jpeg");
    delRef.delete().then(function() {
        // File deleted successfully
    }).catch(function(error) {
        // Uh-oh, an error occurred!
    });
}

function loadPage() {
    firebase.auth().onAuthStateChanged(function(user) {
        var body = document.getElementById("homepage_body");
        body.style.display = "block";
        if (user) {
            // User is signed in.
            body.style.backgroundColor = "#6d7c62";
            body.style.color = "white";
            document.getElementById("signup_page").style.display = "none";
            document.getElementById("home_page").style.display = "block";
            uid = user.uid;
            name = user.displayName;
            get_to_do_from_server(uid, date_today);
            get_fav_link_from_server(uid);
            chrome.storage.sync.get("image_url", function (item) {
                //console.log(item.image_url);
                showBackground(item.image_url);
            });
        } else {
            // No user is signed in.
            body.style.backgroundColor = "#76b852";
            document.getElementById("signup_page").style.display = "block";
            document.getElementById("home_page").style.display = "none";
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
    showBackground("none");
}

function showBackground(url) {
    var element = document.getElementById('homepage_body');
    if(url === "none") element.style.backgroundImage = "none";
    else element.style.backgroundImage = "url(" + url + ")";
    element.style.backgroundSize = "cover";
}

function getBackgroundDownloadURL(uid, callback) {
    storageRef.child(uid + "/background.jpeg").getDownloadURL()
        .then(function (url) {
            callback(url);
            chrome.storage.sync.set({"image_url": url});
        })
        .catch(function (error) {
            console.log(error.message);
            callback("none");
        });
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
    add_task_to_server(uid, task, date, timeValue, militaryTimeValue);
	form.reset();
	return false;
}

function load()
{
    var date = new Date();
    date_today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    loadPage();
    showTime();

    var e = document.getElementById("task_list_ul");
    e.style.display = 'none';
    e = document.getElementById("favourite_list_ul");
    e.style.display = 'none';
    document.getElementById("upload_progress_bar").style.display = "none";
    document.getElementById("MyClockDisplay").onclick = toggle;
    document.getElementById("finput").onchange = fileInput;
    document.getElementById("edit_icon").onclick = selectBackground;
    document.getElementById("remove_icon").onclick = deleteBackground;
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
function newElement(isDone)
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
  if(isDone == true)
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

            delete_fav_link_from_server(uid,
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
    var ul = document.getElementById("task_list_ul");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

	var i;
	for (i = 0; i < events_ToDo_List.length; i++)
	{
		curTask = events_ToDo_List[i];
		newElement(events_ToDo_marked[i]);
	}

	var close = document.getElementsByClassName("close");
	for (i = 0; i < close.length; i++)
	{
  		close[i].onclick = function() {
    	    var div = this.parentElement;
    	    div.style.display = "none";

            var task = div.textContent.substring(0, div.textContent.lastIndexOf(" "));
            var time = div.textContent.substring(div.textContent.lastIndexOf(" ") + 1, div.textContent.length - 1);

            delete_task_from_server(uid, task, date_today, time);
    	}
	}
	//var list = document.querySelector('ul');
	ul.addEventListener('click', function(ev) {
  		if (ev.target.tagName === 'LI') {
    		ev.target.classList.toggle('checked');
    		var div = ev.target;
            var task = div.textContent.substring(0, div.textContent.lastIndexOf(" "));
            var time = div.textContent.substring(div.textContent.lastIndexOf(" ") + 1, div.textContent.length - 1);
            var index;
            index = events_today_marked.indexOf(task);
            if(index>-1)
            {
                if(events_today_marked[index]==true) events_today_marked[index] = false;
                else events_today_marked = true;
            }
            index = events_ToDo_marked.indexOf(task + " " + time);
            if(index>-1)
            {
                if(events_ToDo_marked[index]==true) events_ToDo_marked[index] = false;
                else events_ToDo_marked = true;
            }


    		//read uid here
    		mark_task_in_server(uid, task, date_today, time);
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
    //storage empty
    firebase.auth().signOut()
        .then(function () {
            chrome.storage.sync.remove(["uid", "name"]);
            chrome.storage.sync.remove(["image_url"]);
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
    var body = document.getElementById("homepage_body");
    body.style.background = "none";
    body.style.backgroundColor ="#76b852";
    body.style.color = "black";
    logInPage();
    document.getElementById("signup_page").style.display = "block";
    document.getElementById("home_page").style.display = "none";
    return false;
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
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userRecord) {
            console.log("Signed In");
            console.log("UID: " + userRecord.uid);
            console.log("Name: " + userRecord.displayName);
            name = userRecord.displayName;
            uid = userRecord.uid;
            var tmp = {
                type : "start_timer",
                uid:uid
            };
            chrome.runtime.sendMessage(tmp);
            //store name and uid
            chrome.storage.sync.set({"uid": uid});
            chrome.storage.sync.set({"name": name});
            get_to_do_from_server(uid, date_today);
            get_fav_link_from_server(uid);
            var body = document.getElementById("homepage_body");
            body.style.backgroundColor = "#6d7c62";
            body.style.color = "white";
            document.getElementById("signup_page").style.display = "none";
            document.getElementById("home_page").style.display = "block";
            getBackgroundDownloadURL(uid, showBackground);
        }).catch(function (error) {
            console.log("Error when signing in for email: " + email);
            console.log(error.code);
            console.log(error.message);
        });
    document.getElementById("logIn_Form").reset();
    return false;
}

function register()
{
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
            if(receivedData.message === "success") {
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
                var body = document.getElementById("homepage_body");
                body.style.backgroundColor = "#6d7c62";
                body.style.color = "white";
                document.getElementById("signup_page").style.display = "none";
                document.getElementById("home_page").style.display = "block";
            }
            else {
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

window.onload = load;

