var admin = require('firebase-admin');
var serviceAccount = require('../productive-browsing-firebase-adminsdk-v616k-45e6bfc484.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://productive-browsing.firebaseio.com"
});

var database = admin.database();
var ref = database.ref('USERS');

function add_UID(uid) {
    ref.push({
        UID : uid
    })
}

function delete_UID(uid) {
    var userRef = ref.orderByChild("UID").equalTo(uid);
    userRef.on("child_added", function (dataSnapshot) {
        ref.child(dataSnapshot.key).set(null);
    });
}

function mark_site(uid, site) {
    
}


module.exports = {
    admin : admin,
    add_UID : add_UID,
    mark_site : mark_site,
    delete_UID : delete_UID
};