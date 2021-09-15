const employeeModel = require("../models/employeeModel.js");

//export excel to database
exports.exportExcel= (excel, data) => {
    console.log("Create excel data in DB: ", excel);
    employeeModel.exportCSV(excel, (err, result) => {
        if (err) {
            console.log("error: ", err);
            data(err, null);
            return;
        }    
        //console.log("excel: ", result);
        data(null, result);
    })
};


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

