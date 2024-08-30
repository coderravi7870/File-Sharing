const File = require("../modle/modelSchema");
const { v4: uuid4 } = require("uuid");
const sendMail = require("../services/emailService");
const fs = require("fs");
const cloudinary = require("../multer/multer")

exports.uploadFile = async (req, res) => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Store file information in database
    const response = await File.create({
      filename: req.file.originalname, // Use original file name
      uuid: uuid4(),
      path: result.secure_url, // Store Cloudinary URL
      size: req.file.size,
    });

    // Remove the file from local storage after uploading to Cloudinary
    fs.unlink(req.file.path, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete file from server" });
      }
    });

    return res.json({ uuid: response.uuid });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "Something went wrong..." });
  }
};


exports.showFile = async (req, res) => {
  try {
      const {uuid}  = req.params;

    const file_data = await File.findOne({uuid});
    
    if (!file_data) {
        return res.render("download",{error:"Link has expired."});
    }
    return res.render("download",{uuid:file_data.uuid,
        fileName:file_data.filename,
        fileSize:file_data.size,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file_data.uuid}`
    });

  } catch (error) {
    return res.render("download",{error:"something went wrong..."});
  }
};


exports.downloadFile = async (req, res) => {
  try {
    const {uuid}  = req.params;
    const file_data = await File.findOne({uuid});
    // console.log("uuid: " + uuid);
    
    
    if (!file_data) {
        return res.render("download",{error:"Link has been expired."});
    }
    
     // Modify the Cloudinary URL to force download
     const downloadUrl = file_data.path.replace('/upload/', '/upload/fl_attachment/');

     // Redirect to the modified URL
     return res.redirect(downloadUrl);

  } catch (error) {
    console.error("Error downloading file:", error);
    return res.render("download",{error:"something went wrong..."});
  }
};

exports.sendEmail = async (req, res) => {

  // validation check
  const {uuid,emailTo,emailFrom} = req.body;
  
  
  if(emailFrom === emailTo){
    return res.send({error:"emailFrom and emailTo mail should be differnt."});
  }

  if(!uuid || !emailTo || !emailFrom) {
    return res.status(402).send({error:"All fields are required."});
  }

   // Regex pattern to validate email format
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   // Validate email format for emailTo and emailFrom
   if (!emailRegex.test(emailTo) || !emailRegex.test(emailFrom)) {
     return res.status(402).send({ error: "Invalid email format." });
   }

   // get data from database

   const file_data = await File.findOne({uuid});

   if(!file_data){
    return res.status(402).send({ error: "file does not exist" });
   }

   if(file_data.sender){
    return res.status(402).send({ error: "Email already sent." });
   }

   file_data.sender = emailFrom;
   file_data.reciever = emailTo;

   const response = await file_data.save();

   // send email
   sendMail({from: emailFrom, to: emailTo,subject:"inShare file sharing",
    text:`${emailFrom} shared a file with you`,
    html: require("../services/emailTemplate")({emailFrom:emailFrom,
      downloadLink:`${process.env.APP_BASE_URL}/files/showfile/${uuid}`,
      size: parseInt(file_data.size/1000)+"KB",
      expires: "24 hours"
    })
   });

   return res.send({success: true}) ;
   
}
