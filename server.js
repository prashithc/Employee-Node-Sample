const express = require("express");
const bodyParser = require("body-parser");    //for set content type & datatype to convert JSON format

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

//base directory in project folder
global.__basedir = __dirname + "/";

//middleware
app.use(express.urlencoded({ extended: true }));    
app.use(express.static('public'));

// simple route
app.get("/index", (req, res) => {
  res.json({ message: "Welcome to NodeJS Employee Details Application" });
});

require("./app/routes/employeeRoutes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});