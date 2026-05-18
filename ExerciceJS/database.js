const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/TP_js_Users").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;