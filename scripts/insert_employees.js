const mysql = require('mysql2/promise');
require('dotenv').config();

const employees = [
    {
        name_geo: 'აკადემიკოსი რევაზ სეფიაშვილი',
        name_eng: 'Academician Revaz Sepiashvili',
        details_geo: 'პრეზიდენტი',
        details_eng: 'President',
        order_index: 1
    },
    {
        name_geo: 'მანანა ჩიხლაძე',
        name_eng: 'Manana Chikhladze',
        details_geo: 'გენერალური მდივანი',
        details_eng: 'General Secretary',
        order_index: 2
    },
    {
        name_geo: 'თინათინ ჩიქოვანი',
        name_eng: 'Tinatin Chikovani',
        details_geo: 'ყოფილი პრეზიდენტი',
        details_eng: 'Past President',
        order_index: 3
    },
    {
        name_geo: 'ელენე ხურციძე',
        name_eng: 'Elene Khurtsidze',
        details_geo: 'დირექტორი',
        details_eng: 'Director',
        order_index: 4
    },
    {
        name_geo: 'ია ფანცულაია',
        name_eng: 'Ia Pantsulaia',
        details_geo: 'ვიცე-პრეზიდენტი',
        details_eng: 'Vice-President',
        order_index: 5
    },
    {
        name_geo: 'მანანა ჟღენტი',
        name_eng: 'Manana Zhgenti',
        details_geo: 'ხაზინადარი',
        details_eng: 'Treasurer',
        order_index: 6
    }
];

async function insertEmployees() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Creating employees table if not exists...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name_geo VARCHAR(255) NOT NULL,
                name_eng VARCHAR(255) NOT NULL,
                image_url VARCHAR(255),
                details_geo TEXT,
                details_eng TEXT,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Clearing existing employees...');
        await connection.execute('TRUNCATE TABLE employees');

        console.log('Inserting new employees...');
        for (const emp of employees) {
            await connection.execute(
                'INSERT INTO employees (name_geo, name_eng, details_geo, details_eng, order_index, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                [emp.name_geo, emp.name_eng, emp.details_geo, emp.details_eng, emp.order_index, 'images/logo.png']
            );
        }
        console.log('Employees inserted successfully!');
    } catch (error) {
        console.error('Error inserting employees:', error);
    } finally {
        await connection.end();
    }
}

insertEmployees();
