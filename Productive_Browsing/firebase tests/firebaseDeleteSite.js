var firebase = require('../server/connect_firebase-admin');
var ref = firebase.db.ref('USERS');
var userRef = ref.orderByChild("Name").equalTo("Rafid");
userRef.on("child_added", function (dataSnapshot) {
    console.log(dataSnapshot.val().Name);
    var tmp = {
        Site : 'www.faltu.com'
    };
    var siteRef = ref.child(dataSnapshot.key).child('Sites').orderByChild('Site').equalTo(tmp.Site);
    siteRef.on("child_added", function (dataSnapshot1) {
        console.log(dataSnapshot1.val().Site);
        ref.child(dataSnapshot.key).child('Sites').child(dataSnapshot1.key).set(null);
    })
});