require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('MongoDB Connected');
		app.listen(process.env.PORT, () => {
			console.log(`Server running on port ${process.env.PORT}`);
		});
	})
	.catch((err) => console.error(err));
