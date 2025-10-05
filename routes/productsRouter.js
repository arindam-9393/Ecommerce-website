const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config'); // Your memoryStorage config
const productModel = require('../models/product-model');

router.post('/create', upload.single('image'), async function(req, res) {
  try {
    // First, check if a file was uploaded
    if (!req.file) {
      req.flash("error", "Product image is required.");
      return res.redirect("/owners/admin"); // Or wherever the form is
    }

    const { name, price, discount, bgcolor, panelcolor, textcolor, description } = req.body;

    const newProduct = await productModel.create({
      name: name,
      description: description,
      price: price,
      discount: discount,
      bgcolor: bgcolor,
      panelcolor: panelcolor,
      textcolor: textcolor,
      // Change 'filename' to 'buffer' to match memoryStorage
      image: req.file.buffer 
    });
    
    req.flash("success", "Product created successfully.");
    res.redirect("/owners/admin");
    
  } catch(err) {
    // This error will happen if the image is > 16MB
    console.error(err);
    res.send(err.message);
  }
});

module.exports = router;