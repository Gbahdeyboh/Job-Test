const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
  db.settings(settings);
db.collection('workUser').get().then(fetchData => {
    fetchData.docs.forEach(data => {
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
            <input type="button" value="Charge" class="btn waves-effect hide-on-med-and-down" data-email='${data.data().email}' 
            data-id="${data.id}" onclick="chargeAgain(this)"/>
        </div>
        <div class="col s12 hide-on-med-and-up smallBtn">
            <div class="row">
                <div class="col s8">
                    <div class="flow-text center-align">&#8358;${data.data().monthlySavings}</div>
                </div>
                <div class="col s4">
                    <input type="button" value="Charge" class="btn waves-effect" id="charge" data-email='${data.data().email}' 
                    data-id="${data.id}" onclick="chargeAgain(this)"/>
                </div>
            </div>
        </div>
    </div>
        `;
    })
}).catch(err => {
    console.log("Error fetching data : ", err);
});

    function charge(){
        //show Loader when charged button is clicked
        const loader = document.querySelector('#pageLoading'); //page loader body
        const loaderBody = document.querySelector('#pageLoadingOverlay'); //pages loader overlay
        const success = document.querySelector("#success"); //successs icon
        const waiting = document.querySelector("#waiting"); //waiting icon
        const pagePromptBody = document.querySelector('#pagePromptBody'); //charge prompt body
        const pageOverlay = document.querySelector('#pageOverlay'); // page overlay body
        loader.style.display = "flex"; //show loader
        loaderBody.style.display = "block"; //show loaders overlay
        const token = JSON.parse(sessionStorage.getItem("token"));
        const price = sessionStorage.getItem("price");
        const email = sessionStorage.getItem("email");
        const name = sessionStorage.getItem("name");
        const doc = sessionStorage.getItem("id");
        //Object to send to server
        var obj = {
            "currency":"NGN",
            "SECKEY":"FLWSECK-8bcd3e7010447a43a2c8b1b8548add9a-X",
            "token": token,
            "country":"NG",
            "amount": price,
            "email": email,
            "firstname": name,
            "lastname": "",
            "IP":"190.233.222.1",
            "txRef":"MC-7666-YU"
         };
        var data = JSON.stringify(obj);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){ //when server responds okay
                console.log(this.responseText);
                var response = JSON.parse(this.responseText); //store response as an object
                const newToken = response.data.chargeToken.embed_token;  //get new toke from response
                //if transaction was successful 
                if(response.data.status == "successful" && response.data.chargeResponseCode == "00"){
                    //if transaction is successful
                    //Update new token to collection
                    const db = firebase.firestore();
                    db.collection('userTokens').doc(doc).update({
                        token : newToken
                    });
                    //Then show successful icon
                    waiting.style.display = "none"; //close waiting loader
                    success.style.display = "block"; //show success icon
                    setTimeout(function(){
                        loader.style.display ="none"; //close loader
                        loaderBody.style.display ="none"; //close loader body
                        success.style.display ="none"; //close success icon
                        waiting.style.display ="none"; //close waiting 
                        pagePromptBody.style.display ="none"; //close page prompt body 
                        pageOverlay.style.display ="none"; //close page overlay body 
                    }, 2000);
                }
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
    }
    function chargeAgain(val){
        const usersEmail = val.dataset.email; //Customer to charge email
        sessionStorage.setItem("email", usersEmail); //store email as a session Storage
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
            values.docs.forEach(token => { //only one token per email must be found
                chargedUserToken = token.data().token; //iterate declared token
                sessionStorage.setItem("token", chargedUserToken);
                //Save the doc id of the charged user in a session Storage
                sessionStorage.setItem("id", token.id);
            });
            //select users email and Price to charge from database
            db.collection('workUser').where('email', '==', usersEmail)
            .get()
            .then(getData => {
                getData.forEach(datas => {
                    chargedUserName = datas.data().fullname; //iterate charged users name
                    chargedPrice = datas.data().monthlySavings //iterate charged price
                    sessionStorage.setItem("name", chargedUserName); //store charged ysers name in a session storage
                    sessionStorage.setItem("price", chargedPrice); //store price to be charged
                    //console.log(datas.data().fullname);
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
                    //console.log(chargedUserToken);
                });
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch()
    }
    //close the prompt modal
    function closeModal(){
        const modal = document.querySelector('#pagePromptBody'); //page modal
        const overlay = document.querySelector('#pageOverlay'); //page overlay
        //close modal
        modal.style.display = "none";
        //close overlay
        overlay.style.display = "none";
    }
    var t = typeof("flw-t0-a00712f3b96947877acc1e91028e4580-m03k");
    var s = sessionStorage.getItem('token');
console.log(t)

    /*charge succcessget new token object format
    var response = JSON.parse(responseText);
    response.data.chargeToken.embed_token;  

    Verify that transaction was successful
    if(response.data.status == "successful" && response.data.chargeResponseCode == "00"){
        //do something
    }


    new token for seyi is      flw-t0-c35b85204ef26f761a2cc64f99731038-m03k
    */