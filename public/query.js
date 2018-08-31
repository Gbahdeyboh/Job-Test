//When Dom loads, execute script 
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#createAccount').addEventListener('click', function(){
        if(localStorage.getItem('inputedDataStatus') == "Good"){
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
                 0 : "Non work selected",
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
                password: password.value
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id)
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
        else{
            //Do nothing
            console.log("An Error Occured, some data where not properly inputted")
        }
    });
});