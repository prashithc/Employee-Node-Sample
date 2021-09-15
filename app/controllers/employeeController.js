const employeeService = require("../services/employeeService.js");
const employeeMoedel = require("../models/employeeModel.js");

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
    try {
        if (req.file == undefined) {
          return res.status(400).send("Please upload a CSV file!");
        }
  
        let tutorials = [];
        
        let path = __basedir + "uploads/" + req.file.filename;
        console.log('path ',path);

        //parse csv file
        fs.createReadStream(path)
        .pipe(fastcsv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          tutorials.push(row);
        })
        .on("end", () => {
          console.log('tutorials ',tutorials);        //parsed Employee list
          
          
          //call saveExcel( )
          let exl_name= "Emp_Details";           
          let exl_details="Employee Details";
          let exl_uploaded_date=new Date();

          let excel = {exl_name, exl_details, exl_uploaded_date};
          console.log('save Excel',excel);


          saveExcel(req, res, excel, dataExcel => {
            console.log('saveExcel', dataExcel);


            tutorials.map(row =>{

              let emp_id= row["EMP_ID"]; 
              let emp_join_date=row["Joining_Date"]; 
              let emp_name=row["Name"]; 
              let emp_address = row["Address"]; 
              let exl_id = dataExcel.exl_id;
  
              console.log('emp_id',emp_id);
              let employee = {emp_id, emp_join_date, emp_name, emp_address, exl_id};
              console.log('save Employee',employee);
  
              //save Employee to database
              saveEmployee(req, res, employee, data => {
                  console.log('saveEmployee', data);
              });
  
            });  


        });  

        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Could not upload the file: " + req.file.originalname,
        });
    }

      

}

//save to DB
const saveExcel = (req, res, excel, data) =>{

  employeeService.exportExcel(excel, (err, data) => { 
    console.log('createExcel',excel);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while uploading the excel."
    });
    else 
      res.send(data);    
  });
}


//save Employee
const saveEmployee = (req, res, employee, data) =>{
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