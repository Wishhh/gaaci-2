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

// Sitemap.xml Route
app.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = 'http://localhost:8000'; // Or your actual production domain
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Static Pages
        const staticPages = [
            '',
            'about.html',
            'contact.html',
            'membership.html',
            'publications.html'
        ];

        staticPages.forEach(page => {
            xml += `
    <url>
        <loc>${baseUrl}/${page}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });

        // Dynamic Content
        const db = require('./config/db');

        // Events
        const [events] = await db.query('SELECT id, event_date FROM events');
        events.forEach(event => {
            xml += `
    <url>
        <loc>${baseUrl}/event-detail.html?id=${event.id}&amp;type=event</loc>
        <lastmod>${new Date(event.event_date).toISOString().split('T')[0]}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.6</priority>
    </url>`;
        });

        // Upcoming Events
        const [upcoming] = await db.query('SELECT id, start_date FROM upcoming_events');
        upcoming.forEach(event => {
            xml += `
    <url>
        <loc>${baseUrl}/event-detail.html?id=${event.id}&amp;type=upcoming</loc>
        <lastmod>${new Date(event.start_date).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        // Activities
        const [activities] = await db.query('SELECT id, activity_date FROM activities');
        activities.forEach(activity => {
            xml += `
    <url>
        <loc>${baseUrl}/event-detail.html?id=${activity.id}&amp;type=activity</loc>
        <lastmod>${new Date(activity.activity_date).toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
        });

        xml += `
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error('Sitemap generation error:', err);
        res.status(500).send('Error generating sitemap');
    }
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
