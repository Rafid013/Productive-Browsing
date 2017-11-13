chrome.runtime.onMessage.addListener(function (req, sender, res) {
    var tmp = {
      task : req.task,
      date : req.date,
      time : req.time,
      type : req.type
    };
    var senderToServer = new XMLHttpRequest();
    senderToServer.onreadystatechange = function () {
        if(senderToServer.readyState === 4) {
            alert(JSON.parse(senderToServer.responseText));
        }
    };
    senderToServer.open("POST", 'http://localhost:3000/', true);
    senderToServer.setRequestHeader("Content-Type", "application/json");
    senderToServer.send(JSON.stringify(tmp));
});