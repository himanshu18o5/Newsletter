const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");


const app = express(); // app is instance of express

app.use(express.static("public"));  // to include static files - css & img
app.use(bodyParser.urlencoded({encoded:true}));  //to access input data

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){

    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;
          // console.log(firstname, lastname, email);
     var data = {
        members: [
            {
                email_address:email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
     }

     var jsonData = JSON.stringify(data);

     const url = "https://us10.api.mailchimp.com/3.0/lists/e4e740eb28";
     
     const options = {
        method: "POST",
        auth:"himanshu:313173302545fe744e2ae8524969c875-us10"
     }

     const request = https.request(url, options, function(response){

          if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");

          }
          else {
            res.sendFile(__dirname + "/failure.html");
          }
          response.on("data", function(data){
            console.log(JSON.parse(data));
          })
     })

     request.write(jsonData);
     request.end();
      
});  

app.post("/failure",function(req,res){
    res.redirect("/");
})
    

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});


