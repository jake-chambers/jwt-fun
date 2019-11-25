const express = require('express');
const parser = require('body-parser')
const config = require("config");
const fs = require('fs');
var https = require('https')
const mongoose = require("mongoose");
const usersRoute = require("./routes/user-route");

const app = express();
app.use(express.static('static'))


const options = {
  key: fs.readFileSync('./config/key.pem'),
  cert: fs.readFileSync('./config/cert.pem')
};


//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

//connect to our dbz
mongoose
  .connect("mongodb://localhost/javascript-authentication", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));

app.use(parser.json());
app.use("/users", usersRoute)

https.createServer(options, app)
.listen(3000, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})