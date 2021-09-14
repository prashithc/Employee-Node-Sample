const employeeModel = require("../models/employeeModel.js");


//Create employee
exports.createEmployee= (employee, data) => {
    console.log("Create new employee: ", employee);
    employeeModel.create(employee, (err, result) => {
        if (err) {
            console.log("error: ", err);
            data(err, null);
            return;
        }    
        //console.log("employee: ", result);
        data(null, result);
    })
};


//Fetch all Employees 
exports.getAllEmployees= async () => {
    console.log('getAllEmployees');
    let allEmployees = await employee.getAllEmployees();      
    return allEmployees; 
};

