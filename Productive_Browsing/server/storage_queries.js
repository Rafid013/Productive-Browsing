var admin = require('./firebase_app_initializer');

var ref = admin.storage().bucket();


function upload_file(uid, file, callback) {
    ref.upload(file)
        .then(function () {
            ref.file(file.name).move(uid + "/background.jpeg")
                .then(function () {
                    callback("success");
                })
                .catch(function (error) {
                    callback(error.message);
                })
        })
        .catch(function (error) {
            callback(error.message);
        });
}

function download_file(uid, callback) {
    /*ref.file(uid + "/background.jpeg").download({
        destination : "background.jpeg"
    })
        .then(function () {
            callback("success");
        })
        .catch(function (error) {
            callback(error.message);
        });*/
    ref.file(uid + "/background.jpeg").getSignedUrl({
        action : 'read',
        expires: '03-09-2491'
    }).then(function (signedUrls) {
        callback(signedUrls[0]);
    }).catch(function (error) {
        callback(error.message);
    })
}


module.exports = {
    upload_file : upload_file,
    download_file : download_file
};