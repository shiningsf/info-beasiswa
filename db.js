import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // port: process.env.DB_PORT || 3306, // Default to 3306 if not specified
});

export { pool };