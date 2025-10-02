// routes/ownersRouter.js

const express = require("express");
const router = express.Router();
const ownerModel = require("../models/admin-model");
const bcrypt = require("bcrypt"); // Make sure bcrypt is required

if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    try {
      let owners = await ownerModel.find();
      if (owners.length > 0) {
        // CORRECTED: Use .status() instead of chaining .send()
        return res
          .status(503)
          .send("You don't have permission to create a new owner.");
      }

      let { fullname, email, password } = req.body;

      // HASH THE PASSWORD before saving
      bcrypt.genSalt(10, function (err, salt) {
        if (err) return res.status(500).send("Salt generation failed.");
        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) return res.status(500).send("Error hashing password.");

          let createdOwner = await ownerModel.create({
            fullname,
            email,
            password: hash, // SAVE THE HASHED PASSWORD
          });
          res.status(201).send(createdOwner);
        });
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
}

router.get("/", function (req, res) {
  res.send("hey");
});

module.exports = router;