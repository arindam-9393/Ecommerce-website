const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require('jsonwebtoken');

// Import Routers
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const indexRouter = require('./routes/index');

const db = require("./config/mongoose-connection");
const expressSession = require('express-session');
const flash = require('connect-flash');
require("dotenv").config();

// Middleware
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// // vvvvvv DEBUGGING SECTION vvvvvv
// // This will check your router variables before they are used
// console.log("--- Checking Routers ---");
// console.log("Is indexRouter loaded correctly?", !!indexRouter);
// console.log("Is ownersRouter loaded correctly?", !!ownersRouter);
// console.log("Is usersRouter loaded correctly?", !!usersRouter);
// console.log("Is productsRouter loaded correctly?", !!productsRouter);
// console.log("------------------------");
// // ^^^^^^ DEBUGGING SECTION ^^^^^^

// // Routes
app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);


app.listen(3000, () => {
    console.log("Server started on port 3000.");
});