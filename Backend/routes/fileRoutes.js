const fileRounter = require("express").Router();
const fileController = require("../controller/fileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

fileRounter.post("/upload",upload.single("myfile"),fileController.uploadFile)
fileRounter.get("/showfile/:uuid",fileController.showFile)
fileRounter.get("/download/:uuid",fileController.downloadFile)
fileRounter.post("/sendemail",fileController.sendEmail);


module.exports = fileRounter;