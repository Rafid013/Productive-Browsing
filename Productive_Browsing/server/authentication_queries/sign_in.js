var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyDWIgzbaNxKJ9HIxIrKTPI02jAXd2KDr-I",
    authDomain: "productive-browsing.firebaseapp.com"
};
firebase.initializeApp(config);


function sign_in(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (userRecord) {
        console.log(userRecord.displayName + "\n" + userRecord.email);
        return {
          token : userRecord.uid,
          message : "success"
        };
    }).catch(function (error) {
        console.log(error.message + "\n" + error.code);
        return {
            token : null,
            message : error.code
        };
    })
}


sign_in("haisamrafid@gmail.com", "rafid123");
module.exports = sign_in;