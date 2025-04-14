const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
	const { email, password, name } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: 'User already exists' });

		user = new User({ email, password, name });
		await user.save();

		res.status(201).json({ token: generateToken(user._id) });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user || !(await user.matchPassword(password))) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		res.json({ token: generateToken(user._id) });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
