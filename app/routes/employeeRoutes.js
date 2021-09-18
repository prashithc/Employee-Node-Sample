const upload = require("../middleware/upload");
const uploadexl = require("../middleware/uploadexcel");

module.exports = app => {

    const employee = require("../controllers/employeeController.js");

    // Create a new employee using csv
    app.post("/employee", upload.single("file"), employee.create);

    // Create a new employee using excel
    app.post("/employeeExcel", uploadexl.single("file"), employee.createExcel);
  
    // Fetch all employees
    app.get("/allemployees", employee.getAllEmployees);

}