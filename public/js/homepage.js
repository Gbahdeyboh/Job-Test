document.addEventListener('DOMContentLoaded', function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //if a user is signed in
          console.log("signed in  ", user.email);
          const db = firebase.firestore();
          const settings = {/* your settings... */ timestampsInSnapshots: true};
          db.settings(settings);
          db.collection('workUser').where('email', '==', user.email).get().then(fetchData => {
            fetchData.forEach(data => {
                document.querySelector('#usersName').innerHTML = data.data().fullname;
            });
        }).catch(err => {
            console.log("Something went wrong :", err);
        });
        } else {
            //if no user is signed in
           console.log("None signed in");
           window.location.assign('login/user-login.html');
        }
      });   
});