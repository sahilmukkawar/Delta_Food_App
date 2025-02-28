const { MongoClient } = require("mongodb");

// MongoDB Atlas Connection URL
const uri = "mongodb+srv://user1:hCHt58AfgDP5X@foodapp.vquc4.mongodb.net/foodapp";

async function addFoodItem(foodData) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Select Database and Collection
        const database = client.db("foodapp");
        const collection = database.collection("food");

        // Insert Food Data
        const newFood = {
            name: foodData.name,
            description: foodData.description,
            CategoryName: foodData.CategoryName,
            img: foodData.img,
            options: [
                {
                    half: parseFloat(foodData.halfPrice) || 0,
                    full: parseFloat(foodData.price)
                }
            ],
            createdAt: new Date()
        };

        const result = await collection.insertOne(newFood);
        console.log("Food item inserted with ID:", result.insertedId);
        return { success: true, insertedId: result.insertedId };
    } catch (error) {
        console.error("Error inserting food item:", error);
        return { success: false, error: error.message };
    } finally {
        await client.close();
    }
}

module.exports = addFoodItem;
