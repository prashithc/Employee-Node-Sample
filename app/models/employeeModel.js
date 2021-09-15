const pool = require("../config/db.config");

// constructor
const Employee = function(employee) {
    this.emp_id = employee.emp_id;    
    this.emp_join_date = employee.emp_join_date;
    this.emp_name = employee.emp_name;
    this.emp_address = employee.emp_address;    
    this.exl_id = employee.exl_id;
};


// constructor
const ExcelDetails = function(excelDetails) {
  //this.exl_id = excelDetails.exl_id;
  this.exl_name = excelDetails.exl_name;    
  this.exl_details = excelDetails.exl_details;
  this.exl_uploaded_date = excelDetails.exl_uploaded_date;   
  
};


//export CSV file
ExcelDetails.exportCSV = (newExcelDetails, result) => {
  console.log('newExcelDetails',newExcelDetails);
  const {exl_name, exl_details, exl_uploaded_date}=newExcelDetails;             //access object from ExcelDetails
  pool.query("INSERT INTO export_excel (exl_name, exl_details, exl_uploaded_date) VALUES($1, $2, $3)", [exl_name, exl_details, exl_uploaded_date], (err, res) => {
    try {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          
          //console.log(res);
          console.log("created excel: ", {...newExcelDetails });
          result(null, { ...newExcelDetails });
    } catch (error) {
      result(error, null);
    }
    
  });
};



//Create a new Employee
Employee.create = (newEmployee, result) => {
    console.log('newEmployee',newEmployee);
    const {emp_id, emp_join_date, emp_name, emp_address, exl_id}=newEmployee;             //access object from newEmployee
    pool.query("INSERT INTO employee_details (emp_id, emp_join_date, emp_name, emp_address, exl_id) VALUES($1, $2, $3, $4, $5)", [emp_id, emp_join_date, emp_name, emp_address, exl_id], (err, res) => {
      try {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            
            //console.log(res);
            console.log("created employee: ", {...newEmployee });
            result(null, { ...newEmployee });
      } catch (error) {
        result(error, null);
      }
      
    });
};


//Fetch all employees from DB
Employee.getAllEmployees = async () => {  
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM employee_details');
        return res.rows;
    } catch (error) {
        return error;
    }    
};

//exports the constructor otherwise constructor undefined error occured
module.exports = Employee;

module.exports = ExcelDetails;