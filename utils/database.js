import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

let pool;

export async function connect() {
    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,  // Ensure the database name is specified here
    }).promise();
}

export async function getAllProjects() {
    const [rows] = await pool.query('SELECT * FROM projects;');
    return rows;
}