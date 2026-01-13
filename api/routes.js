const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};

// --- PUBLIC ROUTES ---

// Get Archive Events (past events) - Must come before /events
router.get('/events/archive', async (req, res) => {
    console.log('Archive events route hit');
    try {
        const [rows] = await db.query('SELECT * FROM events WHERE event_date < NOW() ORDER BY event_date DESC LIMIT 10');
        console.log('Archive events found:', rows.length);
        res.json(rows);
    } catch (err) {
        console.error('Archive events error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get Upcoming Events List - Must come before /events
router.get('/events/upcoming', async (req, res) => {
    console.log('Upcoming events route hit');
    try {
        const [rows] = await db.query('SELECT * FROM upcoming_events WHERE end_date >= NOW() ORDER BY start_date ASC LIMIT 10');
        console.log('Upcoming events found:', rows.length);
        res.json(rows);
    } catch (err) {
        console.error('Upcoming events error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get single event by ID - Must come before /events
router.get('/events/:id', async (req, res) => {
    console.log('Single event route hit with id:', req.params.id);
    try {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        console.log('Event query result:', rows.length, 'rows found');
        if (rows.length === 0) {
            console.log('Event not found for id:', req.params.id);
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get all events
router.get('/events', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events ORDER BY event_date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get About Info
router.get('/about', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM about_info LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Sections
router.get('/sections', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM sections');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Contact Info
router.get('/contact', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM contact_info LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Upcoming Event
router.get('/upcoming-event', async (req, res) => {
    try {
        // Fetch the event with the latest end_date in the future, or just the latest one added
        const [rows] = await db.query('SELECT * FROM upcoming_events ORDER BY start_date ASC LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Activities
router.get('/activities', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM activities ORDER BY activity_date DESC LIMIT 10');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all activities (for admin) - Must come before /activities/:id
router.get('/activities/all', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM activities ORDER BY activity_date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single activity by ID - Must come before /activities
router.get('/activities/:id', async (req, res) => {
    console.log('Single activity route hit with id:', req.params.id);
    try {
        const [rows] = await db.query('SELECT * FROM activities WHERE id = ?', [req.params.id]);
        console.log('Activity query result:', rows.length, 'rows found');
        if (rows.length === 0) {
            console.log('Activity not found for id:', req.params.id);
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching activity:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get single upcoming event by ID
router.get('/upcoming-events/:id', async (req, res) => {
    console.log('Single upcoming event route hit with id:', req.params.id);
    try {
        const [rows] = await db.query('SELECT * FROM upcoming_events WHERE id = ?', [req.params.id]);
        console.log('Upcoming event query result:', rows.length, 'rows found');
        if (rows.length === 0) {
            console.log('Upcoming event not found for id:', req.params.id);
            return res.status(404).json({ message: 'Upcoming event not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching upcoming event:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// --- ADMIN ROUTES ---

// Admin Login
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



// Add Event
router.post('/events', verifyToken, upload.single('image'), async (req, res) => {
    const { title_geo, title_eng, details_geo, details_eng, event_date } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Debug logging for custom fields
    console.log('Received custom_fields:', req.body.custom_fields);

    let formattedCustomFields = null;
    if (req.body.custom_fields) {
        try {
            // Check if it's already a valid JSON string
            if (typeof req.body.custom_fields === 'string') {
                JSON.parse(req.body.custom_fields); // Validate
                formattedCustomFields = req.body.custom_fields;
            } else {
                formattedCustomFields = JSON.stringify(req.body.custom_fields);
            }
        } catch (e) {
            console.error('Error parsing custom_fields:', e);
            formattedCustomFields = null;
        }
    }

    try {
        await db.query(
            'INSERT INTO events (title_geo, title_eng, image_url, event_date, custom_fields) VALUES (?, ?, ?, ?, ?)',
            [title_geo, title_eng, image_url, event_date, formattedCustomFields]
        );
        res.status(201).json({ message: 'Event added successfully' });
    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
    }
});

// Update Event
router.put('/events/:id', verifyToken, upload.single('image'), async (req, res) => {
    const { title_geo, title_eng, event_date } = req.body;

    let formattedCustomFields = null;
    if (req.body.custom_fields) {
        try {
            if (typeof req.body.custom_fields === 'string') {
                JSON.parse(req.body.custom_fields);
                formattedCustomFields = req.body.custom_fields;
            } else {
                formattedCustomFields = JSON.stringify(req.body.custom_fields);
            }
        } catch (e) {
            console.error('Error parsing custom_fields for update:', e);
            formattedCustomFields = null;
        }
    }

    try {
        let updateQuery = 'UPDATE events SET title_geo = ?, title_eng = ?, event_date = ?, custom_fields = ?';
        let params = [title_geo, title_eng, event_date, formattedCustomFields];

        if (req.file) {
            updateQuery += ', image_url = ?';
            params.push(`/uploads/${req.file.filename}`);
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.params.id);

        await db.query(updateQuery, params);
        res.json({ message: 'Event updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Event
router.delete('/events/:id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Upcoming Events Admin Routes ---

// Get all upcoming events (for admin)
router.get('/upcoming-events', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM upcoming_events ORDER BY start_date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Upcoming Event
router.post('/upcoming-events', verifyToken, upload.single('image'), async (req, res) => {
    const { title_geo, title_eng, location_geo, location_eng, start_date, end_date } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await db.query(
            'INSERT INTO upcoming_events (title_geo, title_eng, location_geo, location_eng, start_date, end_date, image_url, custom_fields) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title_geo, title_eng, location_geo, location_eng, start_date, end_date, image_url, req.body.custom_fields ? JSON.stringify(JSON.parse(req.body.custom_fields)) : null]
        );
        res.status(201).json({ message: 'Upcoming event added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Upcoming Event
router.put('/upcoming-events/:id', verifyToken, upload.single('image'), async (req, res) => {
    const { title_geo, title_eng, location_geo, location_eng, start_date, end_date } = req.body;
    try {
        let updateQuery = 'UPDATE upcoming_events SET title_geo = ?, title_eng = ?, location_geo = ?, location_eng = ?, start_date = ?, end_date = ?, custom_fields = ?';
        let params = [title_geo, title_eng, location_geo, location_eng, start_date, end_date, req.body.custom_fields ? JSON.stringify(JSON.parse(req.body.custom_fields)) : null];

        if (req.file) {
            updateQuery += ', image_url = ?';
            params.push(`/uploads/${req.file.filename}`);
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.params.id);

        await db.query(updateQuery, params);
        res.json({ message: 'Upcoming event updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Upcoming Event
router.delete('/upcoming-events/:id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM upcoming_events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Upcoming event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Activities Admin Routes ---



// Create Activity
router.post('/activities', verifyToken, upload.single('image'), async (req, res) => {
    const { title_geo, title_eng, details_geo, details_eng, activity_date } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Debug logging
    console.log('Received activity custom_fields:', req.body.custom_fields);

    let formattedCustomFields = null;
    if (req.body.custom_fields) {
        try {
            if (typeof req.body.custom_fields === 'string') {
                JSON.parse(req.body.custom_fields);
                formattedCustomFields = req.body.custom_fields;
            } else {
                formattedCustomFields = JSON.stringify(req.body.custom_fields);
            }
        } catch (e) {
            console.error('Error parsing activity custom_fields:', e);
            formattedCustomFields = null;
        }
    }

    try {
        await db.query(
            'INSERT INTO activities (title_geo, title_eng, image_url, activity_date, custom_fields) VALUES (?, ?, ?, ?, ?)',
            [title_geo, title_eng, image_url, activity_date, formattedCustomFields]
        );
        res.status(201).json({ message: 'Activity added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Activity
router.put('/activities/:id', verifyToken, upload.single('image'), async (req, res) => {
    const { title_geo, title_eng, activity_date } = req.body;

    let formattedCustomFields = null;
    if (req.body.custom_fields) {
        try {
            if (typeof req.body.custom_fields === 'string') {
                JSON.parse(req.body.custom_fields);
                formattedCustomFields = req.body.custom_fields;
            } else {
                formattedCustomFields = JSON.stringify(req.body.custom_fields);
            }
        } catch (e) {
            console.error('Error parsing activity custom_fields for update:', e);
            formattedCustomFields = null;
        }
    }

    try {
        let updateQuery = 'UPDATE activities SET title_geo = ?, title_eng = ?, activity_date = ?, custom_fields = ?';
        let params = [title_geo, title_eng, activity_date, formattedCustomFields];

        if (req.file) {
            updateQuery += ', image_url = ?';
            params.push(`/uploads/${req.file.filename}`);
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.params.id);

        await db.query(updateQuery, params);
        res.json({ message: 'Activity updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Activity
router.delete('/activities/:id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM activities WHERE id = ?', [req.params.id]);
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- About Info Admin Routes ---

// Update About Info
router.put('/about', verifyToken, async (req, res) => {
    const { title_geo, title_eng, content_geo, content_eng } = req.body;
    try {
        // Check if record exists
        const [existing] = await db.query('SELECT * FROM about_info LIMIT 1');

        if (existing.length > 0) {
            await db.query(
                'UPDATE about_info SET title_geo = ?, title_eng = ?, content_geo = ?, content_eng = ? WHERE id = ?',
                [title_geo, title_eng, content_geo, content_eng, existing[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO about_info (title_geo, title_eng, content_geo, content_eng) VALUES (?, ?, ?, ?)',
                [title_geo, title_eng, content_geo, content_eng]
            );
        }
        res.json({ message: 'About info updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Sections Admin Routes ---

// Create Section
router.post('/sections', verifyToken, async (req, res) => {
    const { title_geo, title_eng } = req.body;
    try {
        await db.query('INSERT INTO sections (title_geo, title_eng) VALUES (?, ?)', [title_geo, title_eng]);
        res.status(201).json({ message: 'Section added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Section
router.put('/sections/:id', verifyToken, async (req, res) => {
    const { title_geo, title_eng } = req.body;
    try {
        await db.query('UPDATE sections SET title_geo = ?, title_eng = ? WHERE id = ?', [title_geo, title_eng, req.params.id]);
        res.json({ message: 'Section updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Section
router.delete('/sections/:id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM sections WHERE id = ?', [req.params.id]);
        res.json({ message: 'Section deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Contact Info Admin Routes ---

// Update Contact Info
router.put('/contact', verifyToken, async (req, res) => {
    const { phone, email, address_geo, address_eng } = req.body;
    try {
        // Check if record exists
        const [existing] = await db.query('SELECT * FROM contact_info LIMIT 1');

        if (existing.length > 0) {
            await db.query(
                'UPDATE contact_info SET phone = ?, email = ?, address_geo = ?, address_eng = ? WHERE id = ?',
                [phone, email, address_geo, address_eng, existing[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO contact_info (phone, email, address_geo, address_eng) VALUES (?, ?, ?, ?)',
                [phone, email, address_geo, address_eng]
            );
        }
        res.json({ message: 'Contact info updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- User Management Routes ---

// Get all users
router.get('/admin/users', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new user
router.post('/admin/users', verifyToken, async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if username exists
        const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, password_hash]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user (change password)
router.put('/admin/users/:id', verifyToken, async (req, res) => {
    const { password } = req.body;
    try {
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const password_hash = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, req.params.id]);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/admin/users/:id', verifyToken, async (req, res) => {
    try {
        // Prevent deleting yourself
        if (parseInt(req.params.id) === req.userId) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
