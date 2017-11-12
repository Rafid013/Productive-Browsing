var firebase = require('../server/connect_firebase');
var db = firebase.database();
var ref = db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Sabbir");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    var tmp = {
      Name : 'Taskin'
    };
    ref.child(dataSnapshot.key).update(tmp);
});


