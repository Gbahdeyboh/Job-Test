document.addEventListener('DOMContentLoaded', function(){
	document.querySelector('#username').addEventListener('focusin', function(){
		document.querySelector('#userIcon').color = 'green!important';
	});
});