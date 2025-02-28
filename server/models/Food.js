const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String
});

module.exports = mongoose.model("Food", FoodSchema);
