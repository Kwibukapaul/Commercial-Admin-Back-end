
// users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add a new user
router.post('/', async (req, res) => {
    const { name, email, password,  } = req.body;
    try {
        const newUser = new User({
            name,
            email,
            password,
            logs: [`User ${name} created on ${new Date().toISOString()}`]
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error adding user', error });
    }
});

// List all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching users', error });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, password },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting user', error });
    }
});

module.exports = router;
