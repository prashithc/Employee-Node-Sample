var apiJSONObject = {
       
    "header": {
        "employee": [
              "emp_name",
              "Employee Name",
              "EMP Name",
              "Employee",
              "employeeName",
              "Employee #",
              "Name"
        ],
        "empAddress": [
              "emp_address",
              "employee address",
              "EmployeeAddress",
              "Address"
        ]
    }
  };

//var empList = apiJSONObject.header.employee;
//var empAddress = apiJSONObject.header.employee_address;
var header = apiJSONObject.header;

module.exports = {header};