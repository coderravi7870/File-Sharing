const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = () => {
    // Database connection
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Database connected.");
        })
        .catch((err) => {
            console.log("Connection failed:", err);
        });
}

module.exports = connectDB;
