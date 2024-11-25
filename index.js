const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
    origin: "https://informasi-beasiswa.vercel.app/",
    optionSuccessStatus: 200
}

app.get("/user/:id",
    cors(corsOptions), function(req, res, next){
        res.json({msg: "enable for only https://informasi-beasiswa.vercel.app/"})
    }
)

// Sajikan file statis dari folder "public"
app.use(express.static(path.join(__dirname, "public")));

// Database Connection
const db = mysql.createPool({
    host: "qmmdn.h.filess.io",
    user: "beasiswa_policeman",
    password: "43529ebe035e73d7773df3fd059827640aa33579",
    database: "beasiswa_policeman",
    port: "3307",
    connectionLimit: 5,
});

// db.connect((err) => {
//     if (err) {
//         console.error("Database connection failed:", err);
//         return;
//     }
//     console.log("Connected to MySQLconnection Database.");
// });


// Default route untuk menampilkan login.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Register Endpoint
app.post("/register", async (req, res) => {
    const { nama, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO tabel_beasiswa (nama, username, password) VALUES (?, ?, ?)";
        db.query(query, [nama, username, hashedPassword], (err, result) => {
            if (err) {
                res.status(500).json({ error: "Failed to register user." });
            } else {
                res.status(201).json({ message: "User registered successfully." });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error hashing password." });
    }
});

// Login Endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM tabel_beasiswa WHERE username = ?";
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });


        
        res.status(200).json({ message: "Login successful", token });
    });
});


// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.export = app