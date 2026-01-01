const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail,sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Generate verification token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        const user = await User.create({
            name,
            email,
            password,
            verificationToken: hashedToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
        });
       
        console.log(user);
        console.log(rawToken);
        try {
            // Send verification email with proper template
            console.log('Sending verification email...');
            await sendVerificationEmail(user, rawToken);
            console.log('Verification email sent successfully');
           
            res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email to verify your account.'
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Account created, but verification email failed. Please contact support.'
            });
        }
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Server error during signup.' });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: 'Please verify your email to log in.' });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1h
        await user.save();

        try {
            await sendPasswordResetEmail(user, rawToken);
            res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
