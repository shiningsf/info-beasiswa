// db-monitor.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || "sql12.freemysqlhosting.net",
    user: process.env.DB_USER || "sql12747052",
    password: process.env.DB_PASSWORD || "K89hYUnDVA",
    database: process.env.DB_NAME || "sql12747052",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Monitor database connection
let consecutiveFailures = 0;
const MAX_FAILURES = 3;

const monitorDatabase = async () => {
    try {
        await executeQuery("SELECT 1");
        console.log(new Date().toISOString(), "Database connection check: OK");
        
        // Reset failures counter on successful connection
        if (consecutiveFailures > 0) {
            console.log("Connection restored after", consecutiveFailures, "failures");
            consecutiveFailures = 0;
        }
    } catch (error) {
        consecutiveFailures++;
        console.error(new Date().toISOString(), "Database connection check failed:", error);
        console.error("Consecutive failures:", consecutiveFailures);

        // Implement additional actions after multiple failures
        if (consecutiveFailures >= MAX_FAILURES) {
            console.error("Critical: Database connection has failed", MAX_FAILURES, "times in a row");
            // Disini bisa ditambahkan notifikasi ke admin, misalnya:
            // - Kirim email
            // - Kirim notifikasi ke Discord/Slack
            // - Log ke service monitoring
        }
    }
};

// Run check every 30 seconds
const monitor = setInterval(monitorDatabase, 30000);

// Handle process termination
process.on('SIGTERM', () => {
    clearInterval(monitor);
    pool.end();
});

process.on('SIGINT', () => {
    clearInterval(monitor);
    pool.end();
});

// Export untuk digunakan di file lain
module.exports = {
    executeQuery,
    pool
};