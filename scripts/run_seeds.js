const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function runSeeds() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        const sqlPath = path.join(__dirname, '..', 'sql', 'logical_seeds.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const aiSqlPath = path.join(__dirname, '..', 'sql', 'ai_seeds.sql');
        const aiSql = fs.readFileSync(aiSqlPath, 'utf8');

        console.log('Executing logical seeds...');
        await connection.query(sql);
        console.log('Logical seeds executed successfully!');

        console.log('Executing AI seeds...');
        await connection.query(aiSql);
        console.log('AI seeds executed successfully!');
    } catch (err) {
        console.error('Error executing seeds:', err);
    } finally {
        await connection.end();
    }
}

runSeeds();
