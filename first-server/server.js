const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Load environment variables from .env file early so other modules can use them
dotenv.config();
const cors = require('cors'); // Import the cors middleware
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json()); // Allows the server to parse JSON bodies
app.use(cors({ origin: process.env.FRONTEND_URL })); // Enable CORS for the specified frontend URL
// Database connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loginpage';
        await mongoose.connect(mongoUri);
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
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));