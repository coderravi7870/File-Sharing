// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null, "uploads/");
//     },

//     filename: (req,file,cb)=>{
//         const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(file.originalname)}`;

//         cb(null,uniqueName);
//     }
// })

// exports.upload = multer({storage,
//     limits:{fileSize:1000000*100}
// }); 



const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
  });


module.exports = cloudinary;