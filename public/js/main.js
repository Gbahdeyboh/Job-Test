//Show Loading animation when page loads
document.addEventListener('DOMContentLoaded', function(){
    //localStorage.clear();
    const overlay = document.querySelector('.pageOverlay');
    const overlayContent = document.querySelector('.overlayContent');
    const loadText = document.querySelector('#loadText');
    overlay.style.display = "block";
    overlayContent.style.display = "flex";
    loadText.innerHTML = "Loading Please Wait ......";
    setTimeout(function(){
        overlay.style.display = "none";
        overlayContent.style.display = "none";
    } ,4000);
});
//The below append spaces in between inputed card numbers
function appendSpace(val){
    if(val.length == 4 || val.length == 9 || val.length == 14){
        document.querySelector('#cardNumber').value += " ";
    }
}
//The below appends dash to cards expiry date
function appendDash(val){
    if(val.length == 2){
        document.querySelector('#expDate').value += "/";
    }
}
//the function below shows the password in plain text when the ey-open icon is clicked
function showPass(){
    const eyeOpen = document.querySelector('#eyeOpen'); //eye open icon
    const eyeSlash = document.querySelector('#eyeSlash'); //eyeslash icon
    const password = document.querySelector('#password'); //password input
    const passwordConfirm = document.querySelector('#passwordConfirm'); //confirm password input
    eyeOpen.style.display = 'none'; //hide eye open icon
    eyeSlash.style.display = 'flex'; //show eye slash icon
    password.type = 'text'; //change password to text
    passwordConfirm.type = 'text'; //change password to text
}
//The function below returns the password to its normal password form
function hidePass(){
    const eyeOpen = document.querySelector('#eyeOpen');
    const eyeSlash = document.querySelector('#eyeSlash');
    eyeOpen.style.display = 'flex'; //show eye open icon
    eyeSlash.style.display = 'none'; // hide eye slash icon
    password.type = 'password'; //show password in its normal format
    passwordConfirm.type = 'password';
}
//The function below validates all the users input in the sign up page
function validateInputs(){
    //declareing all variables
    const fullname = document.querySelector('#fullname');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const passwordConfirm = document.querySelector('#passwordConfirm');
    const mobile = document.querySelector('#mobile');
    const monthlySavings = document.querySelector('#monthlySavings');
    const cardNumber = document.querySelector('#cardNumber');
    const expDate = document.querySelector('#expDate');
    const cvv = document.querySelector('#cvv');
    const accountName = document.querySelector('#accountName');
    const workType = document.querySelector('#formSelect');
    const cardSelect = document.querySelector('#cardSelect');
    //check if all fields are filled out
    function notEmpty(){
        if(fullname.value == ""){ //if fullname is empty display errors
            fullname.style.borderBottomColor = "red";
            fullNameError.style.display = " block";
        }
        if(email.value == ""){//if email is empty display errors
            email.style.borderBottomColor = "red";
            emailError.style.display = " block";
        }
        if(password.value == ""){//if password is empty display errors
            password.style.borderBottomColor = "red";
            passwordError.style.display = " block";
        }
        if(passwordConfirm.value == ""){
            passwordConfirm.style.borderBottomColor = "red";
            passwordConfirmError.style.display = " block";
        }
        if(monthlySavings.value == ""){//if business name is empty display errors
            monthlySavings.style.borderBottomColor = "red";
            monthlySavingsError.style.display = "block";
        }
        if(cardNumber.value == ""){//if card number is empty display errors
            cardNumber.style.borderBottomColor = "red";
            cardNumberError.style.display = "block";
        }
        if(mobile.value == ""){
            mobile.style.borderBottomColor = "red";
            mobileError.style.display = "block";
        }
        if(password.value !== passwordConfirm.value){
            document.querySelector('#passwordConfirmError').style.display = "block";
            document.querySelector('#passwordConfirmError').innerHTML = "Password mismatched";
        }
        if(expDate.value == ""){
            expDate.style.borderBottomColor = "red";
            expDateError.style.display = "block";
        }
        if(cvv.value == ""){
            cvv.style.borderBottomColor = "red";
            cvvError.style.display = "block";
        }
        if(accountName.value == ""){
            accountName.style.borderBottomColor = "red";
            cardHolderError.style.display = "block";
        }
        if(workType.value == 0){ //check if selected value is a number
            document.querySelector('#workTypeError').style.display = "block"; //display error if no bank was selected
        }
        if(cardSelect.value == 0){ //check if selected value is a number
            document.querySelector('#cardTypeError').style.display = "block"; //display error if no bank was selected
        }
        var emailValid; //to be later used to validate email
            const db = firebase.firestore();
            const settings = {/* your settings... */ timestampsInSnapshots: true};
            db.settings(settings);
            db.collection('workUser').get().then(fetchData => {
                fetchData.forEach(data => {
                    if(email.value == data.data().email){
                        email.style.borderBottomColor = "red";
                        emailError.innerHTML = "Email already exist";
                        emailError.style.display = " block"; 
                        emailValid = "emailExists";
                    }
                    else if(email.value == ""){
                        email.style.borderBottomColor = "red";
                        emailError.innerHTML = "Enter Email";
                        emailError.style.display = " block";
                    }
                });
            }).catch(err => {
                console.log("Something went wrong :", err);
            });
        ///check if user has not been registered before
        //when all fields are filled out
        if(fullname.value !== "" && email.value !== "" && emailValid !== "emailExists" && password.value !== "" && expDate.value !== "" && cvv.value !== "" && accountName.value !== "" &&
        passwordConfirm.value !== "" && monthlySavings.value !== "" && cardNumber.value !== "" && password.value == passwordConfirm.value){
        return "NotEmpty"; //return a string when no field is left out
        }
    }
    if(notEmpty() == "NotEmpty"){ //compare the strings
        //If they match, compare passwords
        (function comparePasswords(){
            if(password.value !== passwordConfirm.value){
                //display password error message
                passwordConfirmError.style.display = "block";
                passwordConfirmError.innerHTML = "Password mismatched";
            }
            else{
                //Make sure user makes an initial payment before Creating an account for user
                const API_publicKey = "FLWPUBK-90d0372aa025bdfab6050c9b7b11d92d-X";//Api public key
                var raveData = {
                    PBFPubKey: API_publicKey,
                    customer_email: email.value,
                    amount: monthlySavings.value,
                    customer_phone: mobile.value,
                    currency: "NGN",
                    payment_method: "both",
                    txref: "rave-123456",
                    meta: [{
                        metaname: "Initial Payment",
                        metavalue: "AP1234"
                    }],
                    onclose: function() {
                        //display loading animation
                        const overlay = document.querySelector('.pageOverlay');
                        const overlayContent = document.querySelector('.overlayContent');
                        overlay.style.display = "block";
                        overlayContent.style.display = "flex";
                        setTimeout(function(){
                            window.location.assign('homepage.html');
                        }, 3000);
                    },
                    callback: function(response) {
                        var txref = response.tx.txRef; // collect flwRef returned and pass to a server page to complete status check.
                        console.log("This is the response returned after a charge", response);
                        const res = response.tx.chargeToken.embed_token;
                        const db = firebase.firestore();
                        const settings = {/* your settings... */ timestampsInSnapshots: true};
                        db.settings(settings);
                        db.collection("userTokens").add({
                            email : email.value, //save the email
                            token : res //Saves the token to the database for later use
                        }).then(ref => {
                            console.log("Token Added ", ref.id);
                            console.log("Email is : ", email.value)
                            console.log("Token is : ", res);
                        }).catch(err => console.log("An error occured ", error));
                        if (
                            response.tx.chargeResponseCode == "00" ||
                            response.tx.chargeResponseCode == "0"
                        ) {
                            createUser(); //create an acount for customer when payment is succeeful
                        } else {
                            console.log("Payment failed, did not create account");
                            // redirect to a failure page.
                        }
                    }
                }
                function payWithRave(){
                    var x = getpaidSetup(raveData);
                };
                payWithRave(); //make payment
            }
        })();
    }
}
//The below makes sure the password inputed is Strong
function validatePass(password){
    const passwordStats = document.querySelector('.passwordStats'); //password status div
    const passStatus = document.querySelector('#status'); //password status text
    const passLevel = document.querySelector('.level'); //password status indicator
    //if password does not start with a capital letter
    if(password.charAt(0).search(/[A-Z]/g) == -1){
        passwordStats.style.display = "block";
        passStatus.innerHTML = "Weak! Password must start with a capital letter";
        passStatus.style.color = "#f44336";
        passLevel.style.width = "10%";
        passLevel.style.backgroundColor = "#f44336";
    }
    //If password contains no numbers
    else if(password.search(/[0-9]/g) == -1){
        passwordStats.style.display = "block";
        passStatus.innerHTML = "Fair! Password must contain atleast a digit";
        passStatus.style.color = "#ffeb3b";
        passLevel.style.width = "40%";
        passLevel.style.backgroundColor = "#ffeb3b";
    }
    //if password is lesser than 10 characters
    else if(password.length < 10){
        passwordStats.style.display = "block";
        passStatus.innerHTML = "Almost there! Password must be atleast 10 characters long";
        passStatus.style.color = "#ff9800";
        passLevel.style.width = "75%";
        passLevel.style.backgroundColor = "#ff9800";//#4caf50
    }
    //if password is Okay
    else if(password.length > 10){
        passwordStats.style.display = "block";
        passStatus.innerHTML = "Strong!";
        passStatus.style.color = "#4caf50";
        passLevel.style.width = "100%";
        passLevel.style.backgroundColor = "#4caf50";
    }
}
function login(){
    //if(Some parameters are right){Let server handle login}
    const overlay = document.querySelector('.pageOverlay');
    const overlayContent = document.querySelector('.overlayContent');
    const loadText = document.querySelector('#loadText');
    overlay.style.display = "block";
    overlayContent.style.display = "flex";
    loadText.innerHTML = "Creating your account ......";
}
document.querySelector('#file').addEventListener('change', function(){
    var files = this.files;
    var fileName = files[0].name;
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var fileToUpload = storageRef.child('profilePics/' + fileName);
    fileToUpload.put(files[0]).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
      });
    console.log(fileToUpload.fullPath);
});