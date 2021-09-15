const upload = require("../middleware/upload");

module.exports = app => {

    const employee = require("../controllers/employeeController.js");

    // Create a new employee
    app.post("/employee", upload.single("file"), employee.create);
  
    // Fetch all employees
    app.get("/allemployees", employee.getAllEmployees);

}