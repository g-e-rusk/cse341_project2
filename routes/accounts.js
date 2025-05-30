const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');
const mongodb = require('../database/database'); 
const { ObjectId } = require('mongodb'); 

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const db = mongodb.getDatabase().db();
        const user = await db.collection('users').findOne({
            _id: new ObjectId(req.session.user._id)
        });

        res.json({
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
});

router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { displayName, email } = req.body;
        const db = mongodb.getDatabase();

        await db.collection('users').updateOne(
            {_id: new ObjectId(req.session.user._id) },
            {
                $set: {
                    displayName,
                    email,
                    updatedAt: new Date()
                }
            }
        );

        req.session.user.displayName = displayName;
        req.session.user.email = email;

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;