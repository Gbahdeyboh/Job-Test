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
        <div class="col s3 m2 l2 userBtn center hide-on-small-and-down">
            <div class="flow-text sm">N${data.data().monthlySavings}</div>
            <input type="button" value="Charge" class="btn waves-effect hide-on-med-and-down"/>
        </div>
        <div class="col s12 hide-on-med-and-up smallBtn">
            <div class="row">
                <div class="col s8">
                    <div class="flow-text center-align">N${data.data().monthlySavings}</div>
                </div>
                <div class="col s4">
                    <input type="button" value="Charge" class="btn waves-effect" id="charge"/>
                </div>
            </div>
        </div>
    </div>
        `;
    })
}).catch(err => {
    console.log("Error fetching data : ", error);
});



    const API_publicKey = "FLWPUBK-0de1459e79282d5be827985bc74983bd-X";//Api public key
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
            var txref = response.tx.txRef; // collect flwRef returned and pass to a 					server page to complete status check.
            console.log("This is the response returned after a charge", response);
            const res = JSON.stringify(response.tx.chargeToken.embed_token);
            const db = firebase.firestore();
            const settings = {/* your settings... */ timestampsInSnapshots: true};
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
    }
    const ravesData = localStorage.getItem("raveResponse");
    const raveObject = JSON.parse(ravesData);
    console.log("RaveObject ", raveObject.tx.chargeToken.embed_token);

    function chargeAgain(){
        var obj = {
            "currency":"NGN",
            "SECKEY":"FLWSECK-356444680790d181e47397113672bd69-X",
            "token": "flw-t0-d3e128029715e2f03d2ee2e2e28d85b0-m03k",
            "country":"NG",
            "amount":1000,
            "email": "BelloSeun@gmail.com",
            "firstname":"Seun",
            "lastname":"Bello",
            "IP":"190.233.222.1",
            "txRef":"MC-7666-YU"
         };
        var data = JSON.stringify(obj);
        console.log("data is : ", data)
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            console.log(this.responseText);
          }
        });
        
        xhr.open("POST", "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/tokenized/charge");
        
        xhr.send(data);
    }