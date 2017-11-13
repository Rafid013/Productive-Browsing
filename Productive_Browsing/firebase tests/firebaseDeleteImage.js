var firebase = require('../server/connect_firebase-admin');
var ref = firebase.db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Rafid");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    ref.child(dataSnapshot.key).child('Image').set(null);
});