const express = require('express');
const router = express.Router();
const addFoodItem = require('./addFood'); // Import the addFood function

// Add food item route
router.post('/addfood', async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        // Validate required fields
        const { name, description, CategoryName, img, price } = req.body;
        if (!name || !description || !CategoryName || !img || !price) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Call function to insert data
        const result = await addFoodItem(req.body);

        if (result.success) {
            res.json({ success: true, message: 'Food item added successfully', insertedId: result.insertedId });
        } else {
            res.status(500).json({ success: false, message: 'Failed to add food item', error: result.error });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
