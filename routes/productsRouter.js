// routes/productsRouter.js
const express = require('express');
const router = express.Router();
// Assuming your memoryStorage config is in the path below
const upload = require('../config/multer-config'); 
const productModel = require('../models/product-model');

// ✅ Correct Code
router.post('/create', upload.single('image'), async function(req, res) {
  try {
    // Add 'description' here to get it from the form data
    const { name, price, discount, bgcolor, panelcolor, textcolor, description } = req.body;

    const newProduct = await productModel.create({
      name: name,
      description: description, // ✅ Now this will work
      price: price,
      discount: discount,
      bgcolor: bgcolor,
      panelcolor: panelcolor,
      textcolor: textcolor,
      image: req.file.filename
    });
    
    req.flash("success", "Product created successfully.");
    res.redirect("/owners/admin");
    
  } catch(err) {
    res.send(err.message);
  }
});
module.exports = router;