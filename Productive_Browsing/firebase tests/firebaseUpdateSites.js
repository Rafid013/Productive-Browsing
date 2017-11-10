var firebase = require('../server/connect_firebase');
var ref = firebase.db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Rafid");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    var tmp = {
        Site : 'www.faltu.com'
    };
    ref.child(dataSnapshot.key).child('Sites').push(tmp);
});