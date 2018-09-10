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
                    document.querySelector('#img').src = data.data().profilePic;
                    document.querySelector('#profilePhotoFrame').innerHTML = `
                    <img src="${data.data().profilePic}" id="profilePic"/>`;
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
    const fileMetaData = { //file metadata
        contentType: 'image/jpeg'
      };
    var uploadFile = pathToImage.put(file.files[0], fileMetaData); //upload file
    uploadFile.on('state_changed', function(snapshot){ //Get information regarding upload progress
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //upload progress in percent
        console.log('Upload is ' + progress + '% done');
        document.querySelector('#progressBody').style.display = "block"; //show upload progress bar
        document.querySelector('#progress').style.width = `${progress}%`; //update the progress bar
        document.querySelector('#uploadedBytes').innerHTML = (snapshot.bytesTransferred/1000); //show how many kilobytes has been transferred
        document.querySelector('#totalBytes').innerHTML = (snapshot.totalBytes/1000); //show totla amount of kilobytes
        document.querySelector('#progreePercent').innerHTML = `&nbsp;(${progress.toFixed(0)}%)`; //show progress in percent
    }, function(error){
        console.log("Did not upload : ", error); // when file does not upload
        alert("Please make sure your email is verified before you try to upload a profile photo");
    }, function(){
        //If file uploads, get the url of uploaded file
        uploadFile.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            const firestore = firebase.firestore();
            const settings = {timestampsInSnapshots: true};
            firestore.settings(settings);
            const currentUser = firebase.auth().currentUser;
            const userEmail =  currentUser.email; //crete a reference to logged in users email
            //Get data of the logged in user
            firestore.collection('workUser').where('email', '==', userEmail)
            .get()
            .then(response => {
                //since only one user has theat email, get his ID
                response.docs.forEach(responseData => {
                    const doc = responseData.id;
                    //use the users ID to update his profilepics
                    firestore.collection('workUser').doc(doc).update({
                        profilePic : downloadURL
                    });
                    console.log('Id of data to update is ', doc);
                    //hide Profile tab after update
                    document.querySelector('#Profile').style.display = "none";
                });
            })
            .catch(err => {
                console.log("ERROR : ", err);
            });
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
function showProfile(){
    const profile = document.querySelector('#Profile');
    profile.style.display = 'flex';
}
function closeProfile(){
    const profile = document.querySelector('#Profile');
    profile.style.display = 'none';
}