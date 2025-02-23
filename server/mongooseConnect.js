const mongoose = require("mongoose");

const mongodb = async () => {
    try {
        // Connect to MongoDB with necessary options
        await mongoose.connect("mongodb+srv://user1:hCHt58AfgDP5X@foodapp.vquc4.mongodb.net/foodapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("DB connected");

        // Access food items collection
        const foodCollection = mongoose.connection.db.collection("food");
        const foodData = await foodCollection.find({}).toArray();
        global.food_items = foodData;

        // Access category collection
        const categoryCollection = mongoose.connection.db.collection("category");
        const catData = await categoryCollection.find({}).toArray();
        global.food_category = catData;

        const userCollection = mongoose.connection.db.collection("users");
        const userData = await userCollection.find({}).toArray();
        global.user_data = userData;

         // Access orders collection
        const OrderCollection = mongoose.connection.db.collection("allcustorders");
        const OrderData = await OrderCollection.find({}).toArray(); // Fixed: using OrderCollection instead of foodCollection
        global.order_items = OrderData;

    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); // Exit the process if the connection fails
    }
};

module.exports = mongodb;
