import mysql from 'mysql2';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    ssl: {
        ca: fs.readFileSync(process.env.CA_CERT_PATH)
    }
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database successfully');
    }
    connection.end();
});
