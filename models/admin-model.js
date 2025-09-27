const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  number:Number,
  createorders:{
    type: Array,
    default:[],
  }
});

module.exports = mongoose.model("Admin", adminSchema);
