// const mongoose=require('mongoose');


// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,
//     minLength: 3,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // email should be unique
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   cart: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//       quantity: {
//         type: Number,
//         default: 1,
//       },
//     },
//   ],
//   phone: { type: String },
//   address: { type: String },
//   profileImage: Buffer , // ← this is correct

//   orders: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//     },
//   ],

// });

// module.exports = mongoose.model("User", userSchema);



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minLength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // email should be unique
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  phone: { type: String },
  address: { type: String },
  profileImage: Buffer, // ← already correct

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],

  // ------------------ Forgot Password / OTP ------------------
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
