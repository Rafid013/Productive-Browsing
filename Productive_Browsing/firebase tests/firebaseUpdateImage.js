var firebase = require('../server/connect_firebase');
var ref = firebase.db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Rafid");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    var tmp = {
      ReferenceToImage : 'key1'
    };
    ref.child(dataSnapshot.key).child('Image').set(tmp);
});