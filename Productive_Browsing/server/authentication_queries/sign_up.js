var auth = require('../connect_firebase-admin').auth;
function sign_up(name, email, password) {
    auth.createUser({
        displayName : name,
        email : email,
        password : password,
        disabled : false,
        emailVerified : false
    }).then(function (userRecord) {
        console.log("Successfully created new user: " + userRecord.uid + "\n");
        console.log("Name: " + userRecord.displayName + "\n");
        console.log("Email: " + userRecord.email + "\n");
        return {
           token : userRecord.uid,
           message : "success"
        };
    }).catch(function (error) {
        console.log("Error creating new user:", error.message + "\n" + error.code);
        return {
            token : null,
            message : error.code
        };
    });
}

sign_up("Rafid", "haisamrafid@gmail.com", "rafid123");
sign_up("Rafid", "haisamrafid123@gmail.com", "rafid123");

module.exports = sign_up;