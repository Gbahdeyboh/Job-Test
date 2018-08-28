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
            /*********Getting the value of workType*************/
            var workOptions = {
                 1 : "Shop owner",
                 2 : "Start up founder/Co-founder",
                 3 : "Freelancer",
                 4 : "Big business owner",
                 5 : "Employee of a company",
                 6 : "Not yet working"
            }
            //Getting the value of what was selected
            //initialize materialize plugin for getting selected card type
            var workInstance = M.FormSelect.getInstance(document.querySelector('#formSelect'));
            var card = workInstance.getSelectedValues(); //get arrays of selected work
            var selectedWork = card[0];//get value of selected work from array
            const workType = workOptions[selectedWork]; //Gets the value for the type of job selected
            /************Getting the value of cardType **************/
            var cardOptions = {
                1 : "Mastercard",
                2 : "Visa"
            }
            var cardInstance = M.FormSelect.getInstance(document.querySelector('#cardSelect'));
            var card = cardInstance.getSelectedValues(); //get arrays of selected bank
            var selectedCard = card[0];//get value of selected bank from array
            const cardType = cardOptions[selectedCard]; //Gets the value for the type of bank selected*/
            // add data to database
            db.collection("workUser").add({
                fullname: fullname.value,
                email: email.value,
                mobileNo: mobileNo.value,
                workType: workType,
                monthlySavings: monthlySavings.value,
                cardType: cardType,
                cardNumber: cardNumber.value,
                expiryDate: expiryDate.value,
                cvv: cvv.value,
                cardHoldersName: cardHoldersName.value,
                password: password.value,
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