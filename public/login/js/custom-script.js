document.addEventListener('DOMContentLoaded', function(){
	"use strict";
	firebase.auth().onAuthStateChanged(function(user) {
		if(user){ 
			window.location.assign('../homepage.html');
			//redirect to homepage if user is already logged in
		}
		else{
			//log user in
	const email = document.querySelector('#email');
	const password = document.querySelector('#password');
	document.querySelector('#login').addEventListener('click', function(){
		firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(task => {
			// redirect user to homepage after successful logging
			window.location.assign('../homepage.html');
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			document.querySelector('#error').style.display = "block";
			// ...
		});
	});
		}
	});
});
function showResetPrompt(){
	document.querySelector('#passwordResetBody').style.display = "flex"; //close prompt body
	document.querySelector('#pageOverlay').style.display = "block"; //close page Overlay
}
function resetPrompt(){
	var reset = document.querySelector('#resetEmail').value;
	if(reset == ""){
		document.querySelector('#inputError').style.display = "block";
	}
	else{
		document.querySelector('#inputError').style.display = "none";
		var auth = firebase.auth();
		var emailAddress = document.querySelector('#resetEmail').value;
		
		auth.sendPasswordResetEmail(emailAddress).then(function() {
		  // Reset Email sent.
		  const successMessage = document.querySelector('#successPop'); //show success message
		  //close prompt after 2s
		  setTimeout(function(){
			  document.querySelector('#passwordResetBody').style.display = "none"; //close prompt body
			  document.querySelector('#pageOverlay').style.display = "none"; //close page Overlay
			  successMessage.style.display = "none"; //close success message
		  }, 2000);
		  console.log("email sent");
		  successMessage.style.display = "block";
		}).catch(function(error) {
		  // An error happened.
		  console.log("email not sent : ", error);
		});
	}
}
function closePrompt(){
	document.querySelector('#passwordResetBody').style.display = "none"; //close prompt body
	document.querySelector('#pageOverlay').style.display = "none"; //close page Overlay
}