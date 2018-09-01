document.addEventListener('DOMContentLoaded', function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("signed in");
        } else {
           console.log("None signed in");
        }
      });
});