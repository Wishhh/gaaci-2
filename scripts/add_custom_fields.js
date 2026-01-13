const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database.db');

// Check if database exists
if (!fs.existsSync(dbPath)) {
    console.error('Database file not found at:', dbPath);
    process.exit(1);
}

const db = new sqlite3.Database(dbPath);

const addColumnIfNotExists = (tableName, columnName, columnDef) => {
    return new Promise((resolve, reject) => {
        db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
            if (err) {
                console.error(`Error getting table info for ${tableName}:`, err);
                return reject(err);
            }

            const columnExists = rows.some(row => row.name === columnName);

            if (columnExists) {
                console.log(`Column ${columnName} already exists in ${tableName}`);
                return resolve();
            }

            console.log(`Adding column ${columnName} to ${tableName}...`);
            db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`, (err) => {
                if (err) {
                    console.error(`Error adding column ${columnName} to ${tableName}:`, err);
                    return reject(err);
                }
                console.log(`Successfully added ${columnName} to ${tableName}`);
                resolve();
            });
        });
    });
};

const migrate = async () => {
    try {
        await addColumnIfNotExists('events', 'custom_fields', 'JSON DEFAULT NULL');
        await addColumnIfNotExists('activities', 'custom_fields', 'JSON DEFAULT NULL');
        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        db.close();
    }
};

migrate();
