// ============================================
// Express Server with MongoDB Integration
// ============================================

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// ============================================
// Middleware Configuration
// ============================================

// CORS middleware - allows frontend to make requests to this backend
// This enables cross-origin requests from your frontend (running on different port)
app.use(cors());

// Express JSON middleware - parses incoming JSON requests
// This allows the server to understand JSON data sent in request body
app.use(express.json());

// ============================================
// MongoDB Connection
// ============================================

// Get MongoDB connection string from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Successfully connected to MongoDB');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    // Exit the process if database connection fails
    process.exit(1);
});

// ============================================
// Mongoose Schema Definition
// ============================================

// Define the User schema - this describes the structure of user documents in MongoDB
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // This field must be provided
        trim: true // Remove whitespace from beginning and end
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, // Convert email to lowercase
        unique: true // Ensure each email is unique in the database
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set when user is created
    }
});

// Create the User model based on the schema
// This model allows us to perform CRUD operations on users collection
const User = mongoose.model('User', userSchema);

// ============================================
// Contact Schema Definition
// ============================================

// Define the Contact schema - this describes the structure of contact messages in MongoDB
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    }
});

// Create the Contact model
const Contact = mongoose.model('Contact', contactSchema);

// ============================================
// API Routes
// ============================================

// Root route - test if backend is running
app.get('/', (req, res) => {
    res.json({ message: 'Backend running!' });
});

// POST route to create a new user
// This endpoint receives user data from frontend and saves it to MongoDB
app.post('/api/users', async (req, res) => {
    try {
        // Extract name and email from request body
        const { name, email } = req.body;

        // Validate that required fields are provided
        if (!name || !email) {
            return res.status(400).json({ 
                error: 'Name and email are required' 
            });
        }

        // Create a new user instance using the User model
        const newUser = new User({
            name: name,
            email: email
        });

        // Save the user to MongoDB
        // await is used because save() returns a Promise
        const savedUser = await newUser.save();

        // Send success response with the saved user data
        res.status(201).json({
            message: 'User created successfully!',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt
            }
        });

    } catch (error) {
        // Handle errors (e.g., duplicate email, validation errors)
        if (error.code === 11000) {
            // MongoDB duplicate key error (email already exists)
            return res.status(400).json({ 
                error: 'Email already exists in the database' 
            });
        }
        
        // Other errors
        console.error('Error creating user:', error);
        res.status(500).json({ 
            error: 'Failed to create user. Please try again.' 
        });
    }
});

// Optional: GET route to retrieve all users
// This is useful for testing - you can access it at http://localhost:5000/api/users
app.get('/api/users', async (req, res) => {
    try {
        // Find all users in the database
        const users = await User.find().sort({ createdAt: -1 }); // Sort by newest first
        
        res.json({
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            error: 'Failed to fetch users' 
        });
    }
});

// ============================================
// Contact Form API Routes
// ============================================

// POST route to create a new contact message
// This endpoint receives contact form data from frontend and saves it to MongoDB
app.post('/api/contacts', async (req, res) => {
    try {
        // Extract contact data from request body
        const { name, email, subject, message } = req.body;

        // Validate that required fields are provided
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'All fields (name, email, subject, message) are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }

        // Create a new contact instance using the Contact model
        const newContact = new Contact({
            name: name,
            email: email,
            subject: subject,
            message: message
        });

        // Save the contact message to MongoDB
        const savedContact = await newContact.save();

        // Send success response with the saved contact data
        res.status(201).json({
            message: 'Contact message received successfully!',
            contact: {
                id: savedContact._id,
                name: savedContact.name,
                email: savedContact.email,
                subject: savedContact.subject,
                message: savedContact.message,
                createdAt: savedContact.createdAt,
                status: savedContact.status
            }
        });

    } catch (error) {
        // Handle errors
        console.error('Error creating contact:', error);
        res.status(500).json({ 
            error: 'Failed to submit contact message. Please try again.' 
        });
    }
});

// Optional: GET route to retrieve all contact messages
// This is useful for admin purposes - you can access it at http://localhost:5000/api/contacts
app.get('/api/contacts', async (req, res) => {
    try {
        // Find all contacts in the database
        const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by newest first
        
        res.json({
            count: contacts.length,
            contacts: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            error: 'Failed to fetch contacts' 
        });
    }
});

// ============================================
// Server Startup
// ============================================

// Get port number from environment variables, default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Ready to receive API requests!`);
});




