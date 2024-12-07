import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: 'https://informasi-beasiswa.vercel.app' // Hanya izinkan domain ini untuk mengakses server
}));

app.use(express.json());
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Terjadi kesalahan pada server',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loginDashboard.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { nama, username, password } = req.body;

    // Validation
    if (!nama || !username || !password) {
        return res.status(400).json({ error: "Kolom tidak boleh kosong!" });
    }

    try {
        // Check if username already exists
        const [existingUsers] = await pool.query(
            'SELECT * FROM tabel_beasiswa WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username sudah digunakan' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        await pool.query(
            'INSERT INTO tabel_beasiswa (nama, username, password) VALUES (?, ?, ?)',
            [nama, username, hashedPassword]
        );

        res.status(201).json({
            message: 'Registrasi berhasil',
            success: true
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            error: 'Terjadi kesalahan pada server',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ error: "Kolom tidak boleh kosong!" });
    }

    try {
        // Check if user exists
        const [users] = await pool.query(
            'SELECT * FROM tabel_beasiswa WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        const user = users[0];

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Create token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            process.env.JWT_SECRET || 'azhar123',
            { expiresIn: "24h" }
        );

        // Set cookie with token
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                nama: user.nama
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            error: 'Terjadi kesalahan pada server',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Catch-all route for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Halaman tidak ditemukan' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
