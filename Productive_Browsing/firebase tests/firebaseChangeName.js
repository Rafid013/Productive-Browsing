var firebase = require('../server/connect_firebase');
var ref = firebase.db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("New Rafid");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    var tmp = {
      Name : 'Rafid'
    };
    ref.child(dataSnapshot.key).update(tmp);
});


