//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const mailchimp = require('@mailchimp/mailchimp_marketing');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const first_name = req.body.fname;
  const last_name = req.body.lname;
  const emailid = req.body.email;

  const userData = {
    members: [{
      email_address: emailid,
      status: "subscribed",
      merge_fields: {
        FNAME: first_name,
        LNAME: last_name
      }
    }]
  };

  mailchimp.setConfig({
    apiKey: "bdbd6e925ca42391da23479e13f5460b-us1",
    server: "us1",
  });

  const run = async () => {
    try {
      const response = await mailchimp.lists.batchListMembers("bd9f7350b6", userData);
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    }
    catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };

  run();

  //res.send("<p>Thanks for your submission</p>")
})

app.post("/failure", function(req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});

// //api key
// //bdbd6e925ca42391da23479e13f5460b-us1
//
// //list id
// //bd9f7350b6
