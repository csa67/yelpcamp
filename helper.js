const cloudinary = require("cloudinary").v2;
const multer = require('multer')
const storage = multer.memoryStorage()  // store image in memory
const storeInCloud = multer({ storage: storage })
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadToCloud = async (fileBuffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "YelpCamp",
            allowed_formats: ['jpeg', 'png', 'jpg'],
            resource_type: "auto",
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
            } else {
                resolve(result);
            }
        });

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(stream);
    });
};

module.exports = { uploadToCloud, storeInCloud }