import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    // host: 'localhost',
    // user: 'root',
    // password: '123',
    // database: 'ang',

    host: 'qmmdn.h.filess.io',
    user: 'beasiswa_policeman',
    password: '43529ebe035e73d7773df3fd059827640aa33579',
    database: 'beasiswa_policeman',
})

export { pool };
