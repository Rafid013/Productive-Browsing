var firebase = require('../server/connect_firebase');
var ref = firebase.db.ref('USERS');
ref.push({
    Name : "Rafid"
});


