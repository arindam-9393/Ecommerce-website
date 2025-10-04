const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;

// // The safer, recommended configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/uploads'); // Saves to the hard drive 
//   },
//   filename: function (req, file, cb) {
//     // Creates a unique filename
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });