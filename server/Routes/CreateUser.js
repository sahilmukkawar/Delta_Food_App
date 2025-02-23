const express = require("express");
const User = require("../models/User")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "SHIVANSHYahaKuchBhiLikhLoBassBadaHoJisseSecureRhe"

router.post("/createuser",
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let salt = bcrypt.genSaltSync(10);
            let secPassword = bcrypt.hashSync(req.body.password, salt);

            await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location,
                role: req.body.role || 'user' // Default to 'user' if not specified
            })
            
            res.json({ success: true })
        } catch (err) {
            res.json({ success: false })
        }
    })

router.post("/loginuser", 
    body('email').isEmail(),
    body('password').isLength({ min: 5 }), 
    async (req, res) => {
        let email = req.body.email
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "Invalid Email" });
            }
            
            const pwdCompare = bcrypt.compareSync(req.body.password, userData.password);
            if (!pwdCompare) {
                return res.status(400).json({ errors: "Incorrect Password" });
            }

            const payloadData = {
                user: {
                    id: userData.id,
                    role: userData.role // Include role in JWT payload
                }
            }
            const authToken = jwt.sign(payloadData, jwtSecret);
            return res.json({ 
                success: true,
                authToken: authToken,
                role: userData.role // Send role back to client
            })
        } catch (err) {
            console.log(err)
            res.json({ success: false })
        }
    })

// New route to get user info
router.post("/getUserInfo", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, jwtSecret);
        const userData = await User.findOne({ email: req.body.email });
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                name: userData.name,
                email: userData.email,
                role: userData.role || 'user'
            }
        });
    } catch (error) {
        console.error("Error in getUserInfo:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;