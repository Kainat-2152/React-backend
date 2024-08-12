// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const auth = require('../middleware/auth');

// Signup endpoint
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already in use.' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: 'Error during signup.' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


// Reset Password endpoint
router.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: 'Email and new password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Assuming you have a method to update the password
        user.password = password;
        await user.save();

        res.send({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Error resetting password.' });
    }
});


// Logout endpoint
router.get('/logout', async (req, res) => {
    try {
        console.log("OK: ", req.user);

        res.send("OkLogout ABC");
    } catch (err) {
        res.status(500).send();
    }
});

// Profile endpoint
router.get('/profile',auth, async (req, res) => {
    try {
        // `req.user` comes from the `auth` middleware
        res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching profile.' });
    }                                                                                                           
});

module.exports = router;
