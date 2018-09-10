document.addEventListener('DOMContentLoaded', function(){
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            console.log(user) 
            if(user.emailVerified == true){
                document.querySelector('#verifyMessage').innerHTML = "Your email has been successfully verified";
            }
            else if(user.emailVerified == false){
                document.querySelector('#verifyMessage').innerHTML = "You need to verify your email before proceeding";
            }
            console.log("Users email is ", user.email);
            const userEmail = user.email;
            const db = firebase.firestore();
            const settings = {/* your settings... */ timestampsInSnapshots: true};
            db.settings(settings);                        
            db.collection('workUser').where('email', '==', userEmail)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(data => {
                    document.querySelector('#usersName').innerHTML = data.data().fullname;
                    console.log(data.data().fullname);
                });
            }).catch(err => {
                console.log("Error ", err.message);
            });
          // User is signed in.
        } else {
          // No user is signed in.
          console.log("no user is signed in");
          //window.location.assign('login/user-login.html');
        }
    });
    //for profile pics uploads
    document.querySelector("#file").addEventListener("change", function(){
        const uploadBody = document.querySelector("#uploadBody");
        uploadBody.style.display = "block";
        const file = this.files[0];
        console.log(file.name);
    });
});
function uploadProfilePicture(){
    const file = document.querySelector('#file'); //reference to the selected file 
    const fileName = file.files[0].name; // name of the selected image
    const storage = firebase.storage(); //firebase storage
    const storageRef = storage.ref()// create a reference to storage
    const pathToImage = storageRef.child('profilePic/' + fileName);
    const fileMetaData = {
        contentType: 'image/jpeg'
      };
    var uploadFile = pathToImage.put(file.files[0], fileMetaData);
    uploadFile.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        document.querySelector('#progressBody').style.display = "block";
        document.querySelector('#progress').style.width = `${progress}%`;
        document.querySelector('#uploadedBytes').innerHTML = snapshot.bytesTransferred;
        document.querySelector('#totalBytes').innerHTML = snapshot.totalBytes;
    }, function(error){
        console.log("Did not upload : ", error);
    }, function(){
        uploadFile.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
          });
    });
}
function logOut(){
    firebase.auth().signOut().then(function() {
        console.log("signed out user");
        window.location.assign('login/user-login.html');
      }).catch(function(error) {
        // An error happened.
      });
}
function verify(){
    var auth = firebase.auth();
    var emailAddress = "gbahdeybohbello@gmail.com";
    
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      console.log("email sent");
    }).catch(function(error) {
      // An error happened.
      console.log("email not sent");
    });
}
