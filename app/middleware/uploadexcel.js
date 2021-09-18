const multer = require("multer");

const excelFilter = (req, file, cb) => {
  console.log('File Type', file);
  if (file.mimetype.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
    cb(null, true);
  } else {
    cb("Please upload only xlsx file.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });

module.exports = uploadFile;