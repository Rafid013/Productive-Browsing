
chrome.runtime.onMessage.addListener(function (req, sender, res) {
    /*var tmp = {
      task : req.task,
      date : req.date,
      time : req.time,
      type : req.type
    };*/
    tmp = req;

    if(req.type == "get_to_do")
    {
        //get to do list of today from server and send as response
        //In the server append time with each task. When a task is marked as done or deleted task and time will
        //I will send task time and date separately
        var events_today = ["Get a Haircut 12PM","Finish Offline 11AM","Date with Rupanzel 8:30PM","Read a Book 6AM","Joints to smoke 3AM"];
        res(events_today);
    }

    else if(req.type =="delete to do")
    {
        //delete task from databse
        //this is test and works fine
        var str = req.task+" "+req.date+" "+req.time;
        alert(str);
    }

    else if(req.type =="to do completed")
    {
        //task completed operation on database
        //this is test and works fine
        var str = req.task+" "+req.date+" "+req.time;
        alert(str);
    }

    else if(req.type=="upload image")
    {
        //upload req.file in server and send the url as response
    }

    else if(req.type == "del_image")
    {
        //delete image and send default image url as response
    }

    else if(req.type == "isSignedIn")
    {
        var tmp = "true";

        res(tmp);
    }

    else if(req.type == "sign_in")
    {
        //check if sign in is successful or not
        alert(req.email);
        var tmp = "false";
        res(tmp);
    }

    else if(req.type == "register")
    {
        //create new ID
        var tmp = "true";
        alert(req.name);
        res(tmp);
    }
    else if(req.type == "isMarked")
    {
        //check if the domain is marked as time killer and send back status
        var a= document.createElement('a');
        a.href = req.url; // getting domain name from url
        var tmp = "false";
        res(tmp);
    }
    else if(req.type == "signed_out")
    {

    }
    else if(req.type == "mark_site")
    {

    }
    else if(req.type == "un_mark_site")
    {

    }

    var senderToServer = new XMLHttpRequest();
    senderToServer.onreadystatechange = function () {
        if (senderToServer.readyState === 4) {
            alert(JSON.parse(senderToServer.responseText));
        }
    };
    senderToServer.open("POST", 'http://localhost:3000/', true);
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(tmp));

});