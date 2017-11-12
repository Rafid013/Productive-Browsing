var firebase = require('../server/connect_firebase');
var ref = firebase.database.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Taskin");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    var tmp = {
      Name : 'Mashrafe'
    };
    ref.child(dataSnapshot.key).update(tmp);
});


