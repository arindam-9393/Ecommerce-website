// routes/ownersRouter.js

const express = require("express");
const router = express.Router();
const ownerModel = require("../models/admin-model");
const bcrypt = require("bcrypt");
const { generateToken } = require('../utils/generateToken');
const isLoggedIn = require("../middlewares/isLoggedIn");

// --- OWNER CREATION ROUTE (FOR DEVELOPMENT ONLY) ---
if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    try {
      let owners = await ownerModel.find();
      if (owners.length > 0) {
        return res
          .status(503)
          .send("You don't have permission to create a new owner.");
      }

      let { fullname, email, password } = req.body;
      if (!fullname || !email || !password) {
        req.flash("error", "All fields are required.");
        // Redirecting back to the form is better here
        return res.redirect("/owners/create");
      }

      // Using async/await for cleaner code
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await ownerModel.create({
        fullname,
        email,
        password: hashedPassword,
      });

      // As requested, rendering 'admin.ejs' after creation
      res.status(201).redirect("/owners/admin");

    } catch (err) {
      res.status(500).send(err.message);
    }
  });
}

// --- OWNER LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/owners");
    }

    let owner = await ownerModel.findOne({ email });
    if (!owner) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/owners");
    }

    const isMatch = await bcrypt.compare(password, owner.password);

    if (isMatch) {
      // Login successful
      const token = generateToken(owner);
      res.cookie("token", token, { httpOnly: true });

      // As requested, rendering 'admin.ejs' after login
      return res.redirect("/owners/admin");

    } else {
      // Password did not match
      req.flash("error", "Invalid email or password.");
      return res.redirect("/owners");
    }

  } catch (error) {
    req.flash("error", "An error occurred.");
    return res.redirect("/owners");
  }
});

// --- RENDER FORMS ---
router.get("/", function (req, res) {
  res.render("owner-login", { error: req.flash("error") });
});
router.get("/admin" ,isLoggedIn, (req , res)=>{
  res.render("admin" , {success: req.flash("success"),error: req.flash("error")});
})
router.get("/logout", function (req, res) {
  // 1. Clear the token cookie
  res.clearCookie("token");

  // 2. Provide a success message
  req.flash("success", "You have been logged out successfully.");

  // 3. Redirect to the login page
  res.redirect("/owners");
});

router.get("/createproducts", isLoggedIn , function(req , res){
  res.render("createproducts" ,  { error: req.flash("error"), success: req.flash("success") } );
})
// router.get("/create", isLoggedIn, function(req, res) {
//   // This route shows the create form
//   res.redirect("/owners", { error: req.flash("error") });
// });

module.exports = router;