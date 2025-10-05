const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout } = require("../controllers/authController");
const productModel = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require('../models/user-model');

router.get("/", function (req, res) {
  res.send("hey it's working");
});

router.post("/register", registerUser);

// -----------------------------------------------------------------
// CHANGE 1: REMOVED 'isLoggedIn' so anyone can browse the shop.
// -----------------------------------------------------------------
// In your routes/index.js (or wherever your /shop route is)

router.get("/shop", async (req, res) => {
  try {
    let filterQuery = {};
    let sortQuery = {};

    // --- Filtering Logic (from your previous setup) ---
    if (req.query.filter === 'discounted') {
      filterQuery.discount = { $gt: 0 };
    } else if (req.query.filter === 'new') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filterQuery.createdAt = { $gte: thirtyDaysAgo };
    }

    // --- Sorting Logic ---
    const sortByValue = req.query.sortby;
    if (sortByValue === 'newest') {
      sortQuery = { createdAt: -1 }; // Sort by creation date, descending
    
    // 👇 ADD THESE TWO CONDITIONS FOR PRICE SORTING 👇
    } else if (sortByValue === 'price-low-high') {
      sortQuery = { price: 1 }; // 1 for ascending (low to high) 📈
    } else if (sortByValue === 'price-high-low') {
      sortQuery = { price: -1 }; // -1 for descending (high to low) 📉
    }

    // Find products based on the filter and then sort them
    let products = await productModel.find(filterQuery).sort(sortQuery);
    
    res.render("shop", { 
      products, 
      success: req.flash('success'), 
      error: req.flash('error') 
    });
    
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Something went wrong, please try again later.");
  }
});

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

router.get("/cart/add/:productid", isLoggedIn, async function (req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    
    // -----------------------------------------------------------------
    // CHANGE 2: ADDED a check in case the user isn't found.
    // -----------------------------------------------------------------
    if (!user) {
      req.flash("error", "User not found. Please log in again.");
      return res.redirect("/users/shop");
    }

    const productId = req.params.productid;

    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
      req.flash("success", "Item quantity updated in your cart.");
    } else {
      user.cart.push({ productId: productId, quantity: 1 });
      req.flash("success", "Item added to your cart.");
    }

    await user.save();
    res.redirect("/users/shop");

  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/users/shop");
  }
});

// In routes/usersRouter.js or routes/index.js

// This route displays the user's cart
// This would go in your usersRouter.js or indexRouter.js

router.get("/cart" , isLoggedIn , async function(req , res){
  let user=await userModel.find({email:req.user.email}).populate("cart.productId");


  res.render("cart" , {user});
})
router.post("/login", loginUser);
router.get('/logout', logout);

module.exports = router;
