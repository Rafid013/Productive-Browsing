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

    var senderToServer = new XMLHttpRequest();
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            //alert(senderToServer.responseText)  ;
        }
    };
    senderToServer.open("POST", 'http://localhost:3000/', true);
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(tmp));

});