var firebase_admin = require('./firebase_app_initializer');



function sign_up(name, email, password, callback) {
    console.log(email);
    // noinspection JSUnresolvedFunction
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


module.exports = {
    sign_up : sign_up
};