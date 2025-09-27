const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or path
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Product", productSchema);
