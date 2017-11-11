var firebase = require('../server/connect_firebase');
var ref = firebase.db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Rafid");
userRef.on("child_added", function (dataSnapshot) {
   console.log(dataSnapshot.val().Name);
   var activity = 'Do 2';
   var date = '10 jan';
   var time = '10 am';
   var tmp = {
       task : activity + ':' + date + ':' + time
   };
   ref.child(dataSnapshot.key).child('To_Do_List').push(tmp);
});


