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

        const tables = ['events', 'upcoming_events', 'activities'];

        for (const table of tables) {
            console.log(`Checking table: ${table}...`);
            const [columns] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE 'custom_fields'`);

            if (columns.length === 0) {
                console.log(`Adding custom_fields to ${table}...`);
                await connection.query(`ALTER TABLE ${table} ADD COLUMN custom_fields JSON DEFAULT NULL`);
                console.log(`Successfully added custom_fields to ${table}.`);
            } else {
                console.log(`custom_fields already exists in ${table}.`);
            }
        }

        console.log('Migration completed successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
