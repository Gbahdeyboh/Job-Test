
        function createUser(){
            //declare firestore database
            const db = firebase.firestore(); 
            const settings = {/* your settings... */ timestampsInSnapshots: true};
            db.settings(settings);
            //declare all datas to be stroed in database
            const fullname = document.querySelector('#fullname');
            const email = document.querySelector('#email');
            const mobileNo = document.querySelector('#mobile'); 
            const monthlySavings = document.querySelector('#monthlySavings');  
            //const cardType = document.querySelector('#fullname');
            const cardNumber = document.querySelector('#cardNumber');
            const expiryDate = document.querySelector('#expDate');
            const cvv = document.querySelector('#cvv');
            const  cardHoldersName = document.querySelector('#accountName');
            const password = document.querySelector('#passwordConfirm');
            const selectedWork = document.querySelector('#formSelect');
            const selectedCard = document.querySelector('#cardSelect');
            /*********Getting the value of workType*************/
            var workOptions = {
                 0 : "No work selected",
                 1 : "Shop owner",
                 2 : "Start up founder/Co-founder",
                 3 : "Freelancer",
                 4 : "Big business owner",
                 5 : "Employee of a company",
                 6 : "Not yet working"
            }
            /************Getting the value of cardType **************/
            var cardOptions = {
                0 : "No card selected",
                1 : "Mastercard",
                2 : "Visa"
            }
            // add data to database
           db.collection("workUser").add({
                fullname: fullname.value,
                email: email.value,
                mobileNo: mobileNo.value,
                workType: workOptions[selectedWork.value],
                monthlySavings: monthlySavings.value,
                cardType: cardOptions[selectedCard.value],
                cardNumber: cardNumber.value,
                expiryDate: expiryDate.value,
                cvv: cvv.value,
                cardHoldersName: cardHoldersName.value,
                password: password.value,
                profilePic : "https://firebasestorage.googleapis.com/v0/b/debo-d791b.appspot.com/o/male_avatar.png?alt=media&token=4e9238d2-3352-4aaf-98df-d2710080255b"
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                //Create user with firebase auth
                firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function(task){
                    //Send a verification email to created user
                    var user = firebase.auth().currentUser;

                    user.sendEmailVerification().then(function() {
                      console.log('Verification email has been set');
                    }).catch(function(error) {
                      // An error happened.
                      console.log('Something went wrong, email not sent');
                    });
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("Error ", errorCode, " : ", errorMessage);
                    // ...
                  });
            })
            .catch(function(error) {
                console.error("Error creating account : ", error);
            });
        }