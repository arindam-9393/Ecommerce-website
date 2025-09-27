const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB successfully!");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Optional: additional connection error handling
const db = mongoose.connection;

db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

db.once("open", () => {
    console.log("MongoDB connection is open.");
});
