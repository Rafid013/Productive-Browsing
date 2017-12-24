var admin = require('firebase-admin');
var serviceAccount = require('../productive-browsing-firebase-adminsdk-v616k-45e6bfc484.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://productive-browsing.firebaseio.com",
    authDomain: "productive-browsing.firebaseapp.com"
});

module.exports = admin;