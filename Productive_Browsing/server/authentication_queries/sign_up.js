var auth = require('../connect_firebase').auth;
function createUser(name, email, password) {
    auth.createUser({
        displayName : name,
        email : email,
        password : password,
        disabled : false
    }).then(function (userRecord) {
        console.log("Successfully created new user: " + userRecord.uid + "\n");
        console.log("Name: " + userRecord.displayName + "\n");
        console.log("Email: " + userRecord.email + "\n");
        return true;
    }).catch(function (error) {
        console.log("Error creating new user:", error);
        return false;
    });
}

createUser("Rafid", "haisam@gmail.com", "rafid123");

module.exports = createUser;