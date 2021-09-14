const employeeService = require("../services/employeeService.js");
//to read CSV file
const fs = require("fs");
const fastcsv = require("fast-csv");


// Create and Save a new employee
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    
    //upload csv file

    

    //parse the csv file
    let stream = fs.createReadStream("Emp Details.csv");
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .on("data", function(data) {
        console.log('parse-data',data);
        csvData.push(data);
      })
      .on("end", function() {
            // remove the first line: header
            csvData.shift();        

            const employee;

            // save csvData
            employeeService.createEmployee(employee, (err, data) => { 
              console.log('createEmployee',employee);
              if (err)
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the employee."
              });
              else 
                res.send(data);    
            });


      });

    stream.pipe(csvStream);

}

// Fetch all employees from DB
exports.getAllEmployees = async (req, res) => {
    try {
        let allEmployees = await employeeService.getAllEmployees().then(employeeService.getAllEmployees()).catch(err => console.error(err));
        //console.log('allEmployees', allEmployees); 
        res.send(allEmployees);
    } catch (error) {
      res.send(error);
    }  
};