const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv = require('dotenv').config();

// Importing routes
const authRoutes = require("./src/routes/authRoute.js");
const userRoutes = require("./src/routes/userRoutes.js");
const departmentRoutes = require("./src/routes/departmentRoutes.js");
//const protectedRoutes = require("./routes/protectedRoutes.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/empdatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((error) => console.error('❌ MongoDB Connection Error:', error));

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Employee Management API');
});

// Authentication routes (login, register)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/departments', departmentRoutes);

// Protected routes (admin dashboard, finance dashboard, employee dashboard)
//app.use("/", protectedRoutes);

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
