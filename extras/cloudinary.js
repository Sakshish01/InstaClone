const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const fs = require("fs");
require("dotenv").config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// console.log(process.env.CLOUDINARY_NAME);
const uploadFile = asyncHandler(async(filePath, res) => {
    if(!filePath){
        return res.status(404).json({
            status: false,
            message: "File is required"
        });
    }

    const response = await cloudinary.uploader.upload(filePath,
    { resource_type: "auto" });


    fs.unlink(filePath, (err) => {
        if(err){
            console.error("Error deleting file.");
            return res.status(404).json({
                status: false,
                message: "Error deleting file"
            });
        }
    });
    return response;

});


module.exports = uploadFile;
