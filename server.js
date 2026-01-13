const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use(express.static(path.join(__dirname, '.'))); // Serve current directory files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const apiRoutes = require('./api/routes');

// Debug: Log all API requests (before routes)
app.use('/api', (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.path}`);
    next();
});

app.use('/api', apiRoutes);

// Database check
const db = require('./config/db');
db.getConnection()
    .then(conn => {
        console.log("Connected to database");
        conn.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
