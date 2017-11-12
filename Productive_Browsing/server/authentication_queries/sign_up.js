var auth = require('../connect_firebase').auth;
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
        return "success";
    }).catch(function (error) {
        console.log("Error creating new user:", error.message + "\n" + error.code);
        return error.code;
    });
}

module.exports = sign_up;