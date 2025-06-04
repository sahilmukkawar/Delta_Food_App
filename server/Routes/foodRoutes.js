const express = require('express');
const router = express.Router();
const addFoodItem = require('./addFood'); // Import the addFood function
const { MongoClient, ObjectId } = require("mongodb");
const { refreshGlobalData } = require('../mongooseConnect');

// MongoDB Atlas Connection URL
const uri = "mongodb+srv://user1:hCHt58AfgDP5X@foodapp.vquc4.mongodb.net/foodapp";

// Add food item route
router.post('/addfood', async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        // Validate required fields
        const { name, description, CategoryName, img, price, half } = req.body;
        if (!name || !description || !CategoryName || !img || !price) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Call function to insert data
        const result = await addFoodItem(req.body);

        if (result.success) {
            // Refresh global data after successful insertion
            await refreshGlobalData();
            res.json({ success: true, message: 'Food item added successfully', insertedId: result.insertedId });
        } else {
            res.status(500).json({ success: false, message: 'Failed to add food item', error: result.error });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update food item route
router.put('/updateFoodItem', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        const { id, name, description, CategoryName, img, options } = req.body;

        // Validate required fields
        if (!id || !name || !description || !CategoryName || !img || !options) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid food item ID format'
            });
        }

        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("foodapp");
        const collection = database.collection("food");

        // Update the food item
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name,
                    description,
                    CategoryName,
                    img,
                    options,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'No changes were made'
            });
        }

        // Refresh global data after successful update
        await refreshGlobalData();

        res.json({
            success: true,
            message: 'Food item updated successfully'
        });

    } catch (error) {
        console.error('Error updating food item:', error);
        // Log the full error details
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await client.close();
    }
});

// Delete food item route
router.delete('/deleteFoodItem', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Food item ID is required'
            });
        }

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid food item ID format'
            });
        }

        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("foodapp");
        const collection = database.collection("food");

        // Delete the food item
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        // Refresh global data after successful deletion
        await refreshGlobalData();

        res.json({
            success: true,
            message: 'Food item deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting food item:', error);
        // Log the full error details
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await client.close();
    }
});

module.exports = router;
