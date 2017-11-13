var admin = require('firebase-admin');
var serviceAccount = require('../productive-browsing-firebase-adminsdk-v616k-45e6bfc484.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://productive-browsing.firebaseio.com"
});

var database = admin.database();
var auth = admin.auth();

module.exports = {
    database : database,
    auth : auth
};