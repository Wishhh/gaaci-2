require('dotenv').config();
const db = require('../config/db');

const addColumnIfNotExists = async (tableName, columnName, columnDef) => {
    try {
        // Check if column exists
        const [columns] = await db.query(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [columnName]);

        if (columns.length > 0) {
            console.log(`Column ${columnName} already exists in ${tableName}`);
            return;
        }

        console.log(`Adding column ${columnName} to ${tableName}...`);
        await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`);
        console.log(`Successfully added ${columnName} to ${tableName}`);

    } catch (err) {
        console.error(`Error processing table ${tableName}:`, err);
        throw err;
    }
};

const migrate = async () => {
    try {
        // Add custom_fields as JSON column, nullable
        await addColumnIfNotExists('events', 'custom_fields', 'JSON DEFAULT NULL');
        await addColumnIfNotExists('activities', 'custom_fields', 'JSON DEFAULT NULL');
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
