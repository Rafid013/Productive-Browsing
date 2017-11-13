chrome.runtime.onMessage.addListener(function (req, sender, res) {
    /*var tmp = {
      task : req.task,
      date : req.date,
      time : req.time,
      type : req.type
    };*/
    tmp = req;
    var senderToServer = new XMLHttpRequest();
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4 && senderToServer.status === 200) {
            alert(senderToServer.responseText);
        }
    };
    senderToServer.open("POST", 'http://localhost:3000/', true);
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(tmp));
});