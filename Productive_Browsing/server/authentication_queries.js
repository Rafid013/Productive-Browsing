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
        console.log("Error when signing in for email: " + email);
        console.log(error.code);
        console.log(error.message);
        callback({
            message : error.code
        });
    })
}

function sign_up(name, email, password, callback) {
    console.log(email);
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
        console.log("Error when signing up for email: " + email + " and name: " + name);
        console.log(error.code);
        console.log(error.message);
        callback({
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
                console.log("Error changing name for email: " + email + " and name: " + name);
                console.log(error.code);
                console.log(error.message);
                callback({
                    message: error.code
                });
            })
        }
        else {
            console.log("Error changing name for email: " + email + " and name: " + name);
            console.log(data.message);
            callback({
                message: data.message
            })
        }
    });

}

function delete_user(email, password, callback) {
    sign_in(email, password, function (data) {
        if(data.message === "success") {
            firebase_admin.auth().deleteUser(data.uid)
            .then(function () {
                console.log("User deleted");
                console.log("Name: " + data.name);
                callback({
                    name : data.name,
                    uid : data.uid,
                    message : "success"
                })
            }).catch(function (error) {
                console.log("Error deleting user for email: " + email);
                console.log(error.code);
                console.log(error.message);
                callback({
                    message: error.code
                });
            })
        }
        else {
            console.log("Error deleting user for email: " + email);
            console.log(data.message);
            callback({
                message: data.message
            })
        }
    });
}


module.exports = {
    sign_up : sign_up,
    sign_in : sign_in,
    change_name : change_name,
    delete_user : delete_user
};