require('dotenv').config();
const db = require('../config/db');

async function setupNewsTable() {
    try {
        console.log('Creating news table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS news (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title_geo VARCHAR(255) NOT NULL,
                title_eng VARCHAR(255) NOT NULL,
                content_geo LONGTEXT,
                content_eng LONGTEXT,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await db.query(createTableQuery);
        console.log('News table created successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error creating news table:', err);
        process.exit(1);
    }
}

setupNewsTable();
