var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyDWIgzbaNxKJ9HIxIrKTPI02jAXd2KDr-I",
    authDomain: "productive-browsing.firebaseapp.com"
};
firebase.initializeApp(config);


var firebase_admin = require('./database_queries').admin;


function sign_in(email, password, callback) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userRecord) {
            console.log("Signed In");
            console.log("UID: " + userRecord.uid);
            console.log("Name: " + userRecord.displayName);
            callback({
                name : userRecord.displayName,
                uid : userRecord.uid,
                message : "success"
            });
        }).catch(function (error) {
        console.log(error.code);
        console.log(error.message);
        callback({
            name : null,
            uid : null,
            message : error.code
        });
    })
}

function sign_up(name, email, password, callback) {
    firebase_admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
        disabled: false
    }).then(function (userRecord) {
        console.log("Created New User");
        console.log("Name: " + userRecord.displayName);
        console.log("UID: " + userRecord.uid);
        callback({
            name : userRecord.displayName,
            uid: userRecord.uid,
            message: "success"
        })
    }).catch(function (error) {
        console.log(error.code);
        console.log(error.message);
        callback({
            name : null,
            uid: null,
            message: error.code
        });
    });
}

function change_name(email, password, name, callback) {
    sign_in(email, password, function (data) {
        if(data.message === "success") {
            firebase_admin.auth().updateUser(data.uid, {
                displayName : name
            }).then(function (userRecord) {
                console.log("Changed Name");
                console.log("Name: " + userRecord.displayName);
                console.log("UID: " + userRecord.uid);
                callback({
                    name : userRecord.displayName,
                    uid : userRecord.uid,
                    message : "success"
                })
            }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
                callback({
                    name : null,
                    uid: null,
                    message: error.code
                });
            })
        }
        else {
            callback({
                name : null,
                uid: null,
                message: data.message
            })
        }
    });

}

change_name('haisam@gmail.com', "rafid12", "Mukit", function (data) {
   console.log(data.name);
});

module.exports = {
    sign_up : sign_up,
    sign_in : sign_in,
    change_name : change_name
};