import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    // host: 'localhost',
    // user: 'root',
    // password: '123',
    // database: 'ang',

    host: '8a49b.h.filess.io',
    user: 'beasiswa_openfallen',
    password: '2595b80ccf658d7435ba377a3c5374b4a775549c',
    database: 'beasiswa_openfallen',
    port: 3307,
})

export { pool };
