const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise"); // Ganti ke mysql2
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { executeQuery, pool } = require('./dbMonitor');
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Perbaikan CORS
const corsOptions = {
    origin: ["https://informasi-beasiswa.vercel.app", "http://localhost:3000"],
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Helper function untuk database queries
async function executeQuery(query, params) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// Register Endpoint dengan error handling yang lebih baik
app.post("/register", async (req, res) => {
    try {
        const { nama, username, password } = req.body;

        // Validasi input
        if (!nama || !username || !password) {
            return res.status(400).json({ error: "Semua field harus diisi" });
        }

        // Cek apakah username sudah ada
        const existingUser = await executeQuery(
            "SELECT id FROM tabel_beasiswa WHERE username = ?",
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ error: "Username sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await executeQuery(
            "INSERT INTO tabel_beasiswa (nama, username, password) VALUES (?, ?, ?)",
            [nama, username, hashedPassword]
        );

        res.status(201).json({ message: "Registrasi berhasil" });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            error: "Terjadi kesalahan saat registrasi",
            details: error.message 
        });
    }
});

// Login Endpoint dengan error handling yang lebih baik
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({ error: "Username dan password harus diisi" });
        }

        const users = await executeQuery(
            "SELECT * FROM tabel_beasiswa WHERE username = ?",
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Password salah" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            "secret_key",
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                nama: user.nama,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: "Terjadi kesalahan saat login",
            details: error.message 
        });
    }
});

// Health check endpoint
app.get("/health", async (req, res) => {
    try {
        await executeQuery("SELECT 1");
        res.json({ status: "ok", message: "Database connection is healthy" });
    } catch (error) {
        res.status(500).json({ 
            status: "error",
            message: "Database connection issue",
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "Terjadi kesalahan pada server",
        details: err.message 
    });
});

const startServer = async () => {
    try {
        // Test database connection
        await executeQuery("SELECT 1");
        console.log("Database connection successful");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

export default app;