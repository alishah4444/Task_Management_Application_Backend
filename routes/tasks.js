const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');

// Create Task
router.post('/', protect, async (req, res) => {
	try {
		const task = new Task({ ...req.body, user: req.user._id });
		const savedTask = await task.save();
		res.status(201).json(savedTask);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Get All Tasks for Logged-In User
router.get('/', protect, async (req, res) => {
	try {
		const tasks = await Task.find({ user: req.user._id });
		res.json(tasks);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get Task by ID
router.get('/:id', protect, async (req, res) => {
	try {
		const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
		if (!task) return res.status(404).json({ message: 'Task not found' });
		res.json(task);
	} catch (err) {
		res.status(400).json({ message: 'Invalid ID' });
	}
});

// Update Task
router.put('/:id', protect, async (req, res) => {
	try {
		const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!task) return res.status(404).json({ message: 'Task not found' });
		res.json(task);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Delete Task
router.delete('/:id', protect, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
		if (!task) return res.status(404).json({ message: 'Task not found' });
		res.json({ message: 'Task deleted' });
	} catch (err) {
		res.status(400).json({ message: 'Invalid ID' });
	}
});

module.exports = router;
