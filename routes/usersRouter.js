const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout } = require("../controllers/authController");
const productModel = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require('../models/user-model');
const upload=require("../config/multer-config");

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

    // --- Filtering Logic ---
    if (req.query.filter === 'discounted') {
      filterQuery.discount = { $gt: 0 };
    } else if (req.query.filter === 'new') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filterQuery.createdAt = { $gte: thirtyDaysAgo };
    }

    // --- Search Logic ---
    if (req.query.search) {
      filterQuery.name = { $regex: req.query.search, $options: "i" }; // case-insensitive
    }

    // --- Sorting Logic ---
    const sortByValue = req.query.sortby;
    if (sortByValue === 'newest') {
      sortQuery = { createdAt: -1 };
    } else if (sortByValue === 'price-low-high') {
      sortQuery = { price: 1 };
    } else if (sortByValue === 'price-high-low') {
      sortQuery = { price: -1 };
    }

    // --- Fetch Products ---
    let products = await productModel.find(filterQuery).sort(sortQuery);

    res.render("shop", { 
      products, 
      success: req.flash('success'), 
      error: req.flash('error'),
      user: req.user // pass user for navbar cart
    });
    
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Something went wrong, please try again later.");
  }
});


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

// Remove item from cart
router.get("/cart/remove/:productId",isLoggedIn, async (req, res) => {
  try {
    
    const productId = req.params.productId;

   

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.redirect("/");
    }

    // Filter out the product from cart
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    res.redirect("/users/cart");
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).send("Server error");
  }
});

router.get("/product/:productId", async function (req, res) {
  try {
    const product = await productModel.findById(req.params.productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // console.log(product);
    res.render("product", { product }); // render the product page (EJS)
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server Error");
  }
});

// GET Profile
router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/users/login");
    }
    res.render("userProfile", { user });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
});

// GET Edit Profile
router.get("/profile/edit", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.render("editProfile", { user });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/users/profile");
  }
});

// POST Edit Profile
router.post(
  "/profile/edit",
  isLoggedIn,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id);

      user.name = req.body.name;
      user.phone = req.body.phone;
      user.address = req.body.address;

      if (req.file) {
        user.profileImage = req.file.buffer;
      }

      await user.save();
      req.flash("success", "Profile updated successfully");
      res.redirect("/users/profile");
    } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong");
      res.redirect("/users/profile/edit");
    }
  }
);

router.get("/orders" , isLoggedIn , function(req , res){
  res.render("usersOrders");
})

router.post("/login", loginUser);
router.get('/logout', logout);

module.exports = router;
