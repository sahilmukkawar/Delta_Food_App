// foodRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Food Schema
const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    CategoryName: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    options: [{
        half: { type: Number },
        full: { type: Number, required: true }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Food = mongoose.model('Food', FoodSchema);

// Add food item route with detailed error handling
router.post('/addfood', async (req, res) => {
    try {
        // Log the incoming request body
        console.log('Received request body:', req.body);

        // Validate required fields
        const { name, description, CategoryName, img, price } = req.body;
        if (!name || !description || !CategoryName || !img || !price) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                missingFields: {
                    name: !name,
                    description: !description,
                    CategoryName: !CategoryName,
                    img: !img,
                    price: !price
                }
            });
        }

        // Create new food item
        const newFood = new Food({
            name,
            description,
            CategoryName,
            img,
            options: [{
                half: parseFloat((price * 0.6).toFixed(2)),
                full: parseFloat(price)
            }]
        });

        // Log the created food item
        console.log('Created food item:', newFood);

        // Save to database
        const savedFood = await newFood.save();
        console.log('Saved food item:', savedFood);

        // Update global food items
        const foodCollection = mongoose.connection.db.collection("food");
        global.food_items = await foodCollection.find({}).toArray();

        res.status(201).json({
            success: true,
            message: "Food item added successfully",
            item: savedFood
        });

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({
            success: false,
            message: "Server error while adding food item",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Test route to verify API is working
router.get('/test', (req, res) => {
    res.json({ message: 'Food API is working' });
});

module.exports = router;