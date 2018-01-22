const total_pics = 4;

var storageRef = firebase.storage().ref();

function upload_image(uid, file, callback) {
    // Create the file metadata
    var metadata = {
        contentType: 'image/jpeg'
    };

    // noinspection JSCheckFunctionSignatures
    var uploadTask = storageRef.child(uid + "/background.jpeg").put(file, metadata);

// Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // noinspection JSUnresolvedVariable
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            document.getElementById("progress").value = progress;
            // noinspection JSUnresolvedVariable
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function(error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        }, function() {
            // Upload completed successfully, now we can get the download URL
            var downloadURL = uploadTask.snapshot.downloadURL;
            callback(downloadURL);
        });
}


function delete_image(uid) {
    var delRef = storageRef.child(uid + "/background.jpeg");
    delRef.delete()
        .then(function() {
            // File deleted successfully
            chrome.storage.sync.remove("image_url");
        })
        .catch(function(error) {
            // Uh-oh, an error occurred!
        });
}


function getBackgroundDownloadURL(uid, callback) {
    storageRef.child(uid + "/background.jpeg").getDownloadURL()
        .then(function (url) {
            callback(url);
            chrome.storage.sync.set({"image_url": url});
        })
        .catch(function (error) {
            console.log(error.message);
            console.log(error.code);
            var backgroundNo = Math.floor(Math.random()*total_pics) + 1;
            var path = "backgrounds/background" + backgroundNo + ".jpeg";
            callback(path);
        });
}