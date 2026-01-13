const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gaaci_db'
};

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Remove details columns from events
        try {
            console.log('Dropping details columns from events...');
            await connection.query('ALTER TABLE events DROP COLUMN details_geo, DROP COLUMN details_eng');
            console.log('Successfully dropped details columns from events.');
        } catch (err) {
            console.log('Error dropping columns from events (might not exist):', err.message);
        }

        // Remove details columns from activities
        try {
            console.log('Dropping details columns from activities...');
            await connection.query('ALTER TABLE activities DROP COLUMN details_geo, DROP COLUMN details_eng');
            console.log('Successfully dropped details columns from activities.');
        } catch (err) {
            console.log('Error dropping columns from activities (might not exist):', err.message);
        }

        console.log('Migration completed successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
