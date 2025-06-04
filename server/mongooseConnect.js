const mongoose = require("mongoose");

const refreshGlobalData = async () => {
    try {
        const db = mongoose.connection.db;
        global.food_items = await db.collection("food").find({}).toArray();
        global.food_category = await db.collection("category").find({}).toArray();
        global.user_data = await db.collection("users").find({}).toArray();
        global.order_items = await db.collection("allcustorders").find({}).toArray();
        console.log("✅ Global data refreshed successfully");
    } catch (err) {
        console.error("❌ Error refreshing global data:", err);
    }
};

const mongodb = async () => {
    try {
        // Prevent multiple connections
        if (mongoose.connection.readyState === 1) {
            console.log("✅ MongoDB already connected.");
            return;
        }

        await mongoose.connect("mongodb+srv://user1:hCHt58AfgDP5X@foodapp.vquc4.mongodb.net/foodapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ MongoDB connected successfully.");

        // Initial load of collections into global variables
        await refreshGlobalData();

    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = { mongodb, refreshGlobalData };
