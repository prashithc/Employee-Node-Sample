const pool = require("../config/db.config");

// constructor
const Employee = function(employee) {
    this.emp_id = employee.emp_id;    
    this.emp_join_date = employee.emp_join_date;
    this.emp_name = employee.emp_name;
    this.emp_address = employee.emp_address;    
    this.exl_id = employee.exl_id;
};


//Create a new Employee
Employee.create = (newEmployee, result) => {
    console.log('newEmployee',newEmployee);
    const {emp_id, emp_join_date, emp_name, emp_address, exl_id}=newStudent;             //access object from newEmployee
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