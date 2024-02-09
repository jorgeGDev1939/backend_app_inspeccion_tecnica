// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
