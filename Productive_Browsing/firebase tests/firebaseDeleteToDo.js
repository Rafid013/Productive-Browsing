var firebase = require('../server/connect_firebase');
var ref = firebase.db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Rafid");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    var tmp = {
        activity : 'Do 4',
        date : '11 feb',
        time : '10 pm'
    };
    var tmp1 = tmp.activity + ':' + tmp.date + ':' + tmp.time;
    var toDoRef = ref.child(dataSnapshot.key).child('To_Do_List').orderByChild('task').equalTo(tmp1);
    toDoRef.on("child_added", function (dataSnapshot1) {
        ref.child(dataSnapshot.key).child('To_Do_List').child(dataSnapshot1.key).set(null);
    })
});


