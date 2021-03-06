const employeeService = require("../services/employeeService.js");
const employeeMoedel = require("../models/employeeModel.js");
const {header} = require("../common/common.js");

//to read CSV file
const fs = require("fs");
const fastcsv = require("fast-csv");

//to read & parse Excel file
var XLSX = require("xlsx");

//globally declared
global.columnArr = [];


// Create and Save a new employee
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  //upload csv file
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let employeeList = [];

    let path = __basedir + "uploads/" + req.file.filename;
    //console.log('path ',path);

    //parse csv file
    fs.createReadStream(path)
      .pipe(fastcsv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        employeeList.push(row);
      })
      .on("end", () => {
        //parcing completed
        //console.log('employeeList ',employeeList);        //parsed Employee list

        //call savetoDB
        savetoDB(req, res, employeeList);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

//save Excel to DB
const saveExcel = (excel, dataExcel) => {
  employeeService.exportExcel(excel, (err, data) => {
    //console.log('createExcel',excel);
    if (err) {
      let error =
        err.message || "Some error occurred while uploading the excel.";
      dataExcel(error);
    } else {
      //console.log('data', data);
      dataExcel(data);
    }
  });
};

//save Employee
const saveEmployee = (employee, dataEmployee) => {
  employeeService.createEmployee(employee, (err, data) => {
    //console.log('createEmployee',employee);
    if (err) {
      let error =
        err.message || "Some error occurred while creating the employee.";
      dataEmployee(error);
    } else dataEmployee(data);
  });
};



//common save in excel & employee
const savetoDB = (req, res, employeeList) => {
  if (employeeList.length == 0) {
    return;
  }
  //saveExcel( )
  let path = __basedir + "uploads/" + req.file.filename;
  let exl_name = req.file.filename;
  let exl_details = path;
  let exl_uploaded_date = new Date();

  let excel = { exl_name, exl_details, exl_uploaded_date };
  //console.log('save Excel',excel);

  //call saveExcel( )
  saveExcel(excel, (dataExcel) => {
    console.log("dataExcel");
    if (dataExcel.exl_id == 0) {
      res.send("Error on saveExcel");
    }

    employeeList.map((row, index) => {
      //console.log('row',row);
      let emp_id = "";
      let emp_join_date = "";
      let emp_name = "";
      let emp_address = "";

      //save Employee to database
      console.log('columnArr',columnArr);
      //console.log('checkArray', checkArray);
      if (columnArr != undefined && columnArr.length > 0) {

        emp_id = row[columnArr[0]];
        emp_join_date = row[columnArr[1]];

        header.employee.map((data) => { 
          let index = columnArr.findIndex(p => p == data);        //compare data and columnArr & find index from the array
          if (index != -1) {          // if false -1 or true index
            console.log('index', index);
            emp_name = row[columnArr[index]];
          }
        });       
        
        header.empAddress.map((data) => {       
          let index = columnArr.findIndex(p => p == data);
          if (index != -1){
            emp_address = row[columnArr[index]];
          }
        });
      } 
      /*else {
        emp_id = row["EMP ID"];
        emp_join_date = row["Joining Date"];
        emp_name = row["Name"];
        emp_address = row["Address"];
      } */

      let exl_id = dataExcel.exl_id;

      let employee = { emp_id, emp_join_date, emp_name, emp_address, exl_id };
      console.log('save Employee',employee);

      //call saveEmployee
      saveEmployee(employee, (dataEmployee) => {
        //console.log('saveEmployee', dataEmployee);
        if (!dataEmployee.emp_id) {
          res.send("Error on saveEmployee");
        }
        if (index + 1 == employeeList.length) {       //null comes in the first
          //index and length
          res.send("Excel uploaded successfully");
        }
      });
    });
  });
};



// Fetch all employees from DB
exports.getAllEmployees = async (req, res) => {
  try {
    let allEmployees = await employeeService
      .getAllEmployees()
      .then(employeeService.getAllEmployees())
      .catch((err) => console.error(err));
    //console.log('allEmployees', allEmployees);
    res.send(allEmployees);
  } catch (error) {
    res.send(error);
  }
};



// Create and Save a new employee
exports.createExcel = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  //upload Excel file
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a Excel file!");
    }

    let path = __basedir + "uploads/" + req.file.filename;
    //console.log('path ',path);

    //var exl = XLSX.readFile("Emp Details.xlsx");
    var exl = XLSX.readFile(path);

    var sheet_name_list = exl.SheetNames;
    //console.log(sheet_name_list); // getting as Sheet1

    sheet_name_list.forEach(function (y) {
      var worksheet = exl.Sheets[y];
      //getting the complete sheet


      //excel column header iteration      
      const xlsxFile = require('read-excel-file/node');
      columnArr = [];    //clear columnArr
      xlsxFile(path).then((rows) => {
        for (i in rows) {
            for (j in rows[i]) {
                 if (i == 0 ) {
                    columnArr.push(`${rows[i][j]}`);        //converts to string
                    //console.log('columnArr Push', `${rows[i][j]}`);         
                 }
            }
        }
        //console.log('ColumnArray1', columnArr); 
      }); 

      var headers = {};
      var data = [];
      for (z in worksheet) {
        if (z[0] === "!") continue;

        //parse out the column, row, and value
        var col = z.substring(0, 1);
        // console.log(col);

        var row = parseInt(z.substring(1));
        // console.log(row);

        var value = worksheet[z].v;
        // console.log(value);

        //store header names
        if (row == 1) {
          headers[col] = value;
          // storing the header names
          continue;
        }

        if (!data[row]) data[row] = {};     // if undefined
        data[row][headers[col]] = value;
      }
      //drop those first two rows which are empty
      data.shift();
      //console.log(data);

      //call savetoDB
      savetoDB(req, res, data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
