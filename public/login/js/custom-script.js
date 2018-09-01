document.addEventListener('DOMContentLoaded', function(){
	"use strict";
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
});