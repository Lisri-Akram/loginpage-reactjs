const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware
const authRoutes = require('./routes/authRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allows the server to parse JSON bodies
app.use(cors({ origin: process.env.FRONTEND_URL })); // Enable CORS for the specified frontend URL

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

// Connect to the database
connectDB();

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running and healthy!' });
});

// API Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT ; // || 3001; // Default to 3001 if PORT is not set
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));