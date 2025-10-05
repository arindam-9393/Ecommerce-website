const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedIn");
const productModel=require("../models/product-model")

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error });
});
// In routes/index.js (or wherever your /shop route is)

// router.get('/shop', async (req, res) => {
//   try {
//     let filterQuery = {};
    
//     if (req.query.filter === 'discounted') {
//       filterQuery.discount = { $gt: 0 }; // Find products with discount > 0
//     }
//     // Add more else if blocks for other filters like 'new'

//     const products = await productModel.find(filterQuery);
    
//     res.render('shop', { products });

//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });


module.exports = router;