import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    // host: 'localhost',
    // user: 'root',
    // password: '123',
    // database: 'ang',

    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beasiswa',
})

export { pool };
