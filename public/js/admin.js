const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
  db.settings(settings);
db.collection('workUser').get().then(fetchData => {
    fetchData.forEach(data => {
        document.querySelector('#content').innerHTML += `
    <div class="row white z-depth-2">
        <div class="col s3 m2 l2 userImage"> 
            <img src="images/male_avatar.png"/>
        </div>
        <div class="col s9 m8 l8 userBody">
            <h6>${data.data().fullname}</h6   >
            <span class="">${data.data().email}</span><br />
            <span class="">${data.data().workType}</span><br />
            <span class="">${data.data().mobileNo}</span><br />
        </div>
        <div class="col s3 m2 l2 userBtn center hide-on-small-only">
            <div class="flow-text sm">&#8358;${data.data().monthlySavings}</div>
            <input type="button" value="Charge" class="btn waves-effect hide-on-med-and-down" data-email='${data.data().email}' onclick="chargeAgain(this)"/>
        </div>
        <div class="col s12 hide-on-med-and-up smallBtn">
            <div class="row">
                <div class="col s8">
                    <div class="flow-text center-align">&#8358;${data.data().monthlySavings}</div>
                </div>
                <div class="col s4">
                    <input type="button" value="Charge" class="btn waves-effect" id="charge" data-email='${data.data().email}' onclick="chargeAgain(this)"/>
                </div>
            </div>
        </div>
    </div>
        `;
    })
}).catch(err => {
    console.log("Error fetching data : ", err);
});



    /*const API_publicKey = "FLWPUBK-90d0372aa025bdfab6050c9b7b11d92d-X";//Api public key
    var raveData = {
        PBFPubKey: API_publicKey,
        customer_email: "IsiaqGbadeblo@gmail.com",
        amount: 100,
        customer_phone: "07019174403",
        currency: "NGN",
        payment_method: "both",
        txref: "rave-123456",
        meta: [{
            metaname: "flightID",
            metavalue: "AP1234"
        }],
        onclose: function() {},
        callback: function(response) {
            var txref = response.tx.txRef; // collect flwRef returned and pass to a server page to complete status check.
            console.log("This is the response returned after a charge", response);
            const res = JSON.stringify(response.tx.chargeToken.embed_token);
            const db = firebase.firestore();
            const settings = {timestampsInSnapshots: true};
            db.settings(settings);
            db.collection("userTokens").add({
                email : "BelloSeun@gmail.com", //save the email
                token : res //Save the token to the database for later use
            }).then(ref => {
                console.log("Token Added ", ref.id);
                console.log("Email is : ",)
            }).catch(err => console.log("An error occured ", error));
            if (
                response.tx.chargeResponseCode == "00" ||
                response.tx.chargeResponseCode == "0"
            ) {
                // redirect to a success page
            } else {
                // redirect to a failure page.
            }//<ADD YOUR PUBLIC KEY HERE>
        }
    }
    function payWithRave(){
        var x = getpaidSetup(raveData);
    }*/ 
    //DELETE EVERYTHING IN THE ABOVE COMMENT AFTER IMPLEMENTING PAYMENT
    function chargeAgain(val){
        const usersEmail = val.dataset.email; //Customer to charge email
        //Get the customer to charge previous token
        var db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        db.collection('userTokens').where('email', '==', usersEmail) // use users email to fetch token
        .get()
        .then(values => {
            var chargedUserToken; //declare variable to hold user token
            var chargedUserName; //declare variable to hold users name
            var chargedPrice; //declare variable to hold charged price
            values.forEach(token => { //only one token per email must be found
                chargedUserToken = token.data().token; //iterate declared token
            });
            //select users email and Price to charge from database
            db.collection('workUser').where('email', '==', usersEmail)
            .get()
            .then(getData => {
                getData.forEach(datas => {
                    chargedUserName = datas.data().fullname; //iterate declared Charged users name
                    chargedPrice = datas.data().monthlySavings; //iterate price to be charged
                    console.log(chargedUserName);
                    //Charge the customer after getting the token
                    //show a prompt before charging the customer
                    const modal = document.querySelector('#pagePromptBody'); //page modal
                    const overlay = document.querySelector('#pageOverlay'); //page overlay
                    //close modal
                    modal.style.display = "flex";
                    //close overlay
                    overlay.style.display = "block";
                    //display charged prompt message
                    document.querySelector('#prompt').innerHTML = 
                    `You are about to charge ${chargedUserName} a sum of &#8358;${chargedPrice}, click <b>proceed</b> to continue or <b>cancel</b> to end.`;
                    //If user confirms charge, Charge the customer
                    document.querySelector('#chargeCustomer').addEventListener('click', function(){
                        //Object to send to server
                        console.log(usersEmail)
                        console.log(chargedUserToken);
                        var obj = {
                            "currency":"NGN",
                            "SECKEY":"FLWSECK-8bcd3e7010447a43a2c8b1b8548add9a-X",
                            "token": chargedUserToken,
                            "country":"NG",
                            "amount": chargedPrice,
                            "email": usersEmail,
                            "firstname": chargedUserName,
                            "lastname": "",
                            "IP":"190.233.222.1",
                            "txRef":"MC-7666-YU"
                         };
                        var data = JSON.stringify(obj);
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function(){
                            if(this.readyState == 4 && this.status == 200){
                                console.log(this.responseText);
                            }
                            if(this.status == 400){
                                console.log("Transaction complete", this.responseText);
                            }
                            else{
                                console.log('Something else happened here');
                            }
                        }
                        xhttp.open('POST', "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/tokenized/charge");
                        xhttp.setRequestHeader("Content-type", "application/json");
                        xhttp.send(data);
                    });
                    //console.log(chargedUserToken);
                });
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch()
    }
    /*function chargesAgain(){
        var obj = {
            "currency":"NGN",
            "SECKEY":"FLWSECK-8bcd3e7010447a43a2c8b1b8548add9a-X",
            "token": 'flw-t0-cf78c4552c7e32505306e3806b59fda5-m03k',
            "country":"NG",
            "amount":100,
            "email": "Solape@gmail.com",
            "firstname":"Solape",
            "lastname":"folawe",
            "IP":"190.233.222.1",
            "txRef":"MC-7666-YU"
         };
        var data = JSON.stringify(obj);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                console.log(this.responseText);
            }
            if(this.status == 400){
                const newToken = this.responseText;
                console.log(this.responseText);
            }
            else{
                console.log('Something else happened here');
            }
        }
        xhttp.open('POST', "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/tokenized/charge");
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(data);
    }*/

    //close the prompt modal
    function closeModal(){
        const modal = document.querySelector('#pagePromptBody'); //page modal
        const overlay = document.querySelector('#pageOverlay'); //page overlay
        //close modal
        modal.style.display = "none";
        //close overlay
        overlay.style.display = "none";
    }