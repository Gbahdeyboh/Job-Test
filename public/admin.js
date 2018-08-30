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



    const API_publicKey = "FLWPUBK-90d0372aa025bdfab6050c9b7b11d92d-X";

    function payWithRave(){
        var x = getpaidSetup({
            PBFPubKey: API_publicKey,
            customer_email: "gbahdeybohbello@gmail.com",
            amount: 2000,
            customer_phone: "08133282428",
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
                if (
                    response.tx.chargeResponseCode == "00" ||
                    response.tx.chargeResponseCode == "0"
                ) {
                    // redirect to a success page
                } else {
                    // redirect to a failure page.
                }//<ADD YOUR PUBLIC KEY HERE>

                x.close(); // use this to close the modal immediately after payment.
            }
        });
    }