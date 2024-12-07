import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Contoh file db.js
console.log('DB_HOST:', process.env.DB_HOST);  // Menampilkan host database
console.log('DB_USER:', process.env.DB_USER);  // Menampilkan user database

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306, // Default to 3306 if not specified
});

export { pool };