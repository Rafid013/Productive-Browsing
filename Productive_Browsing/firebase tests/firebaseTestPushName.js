var firebase = require('../server/connect_firebase-admin');
var db = firebase.database();
var ref = db.ref('USERS');
ref.push({
    Name : "Sabbir"
});


