import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'

import { pool } from './db.js'

const app = express()
const PORT = 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

const corsOptions = {
    origin: 'https://informasi-beasiswa.vercel.app/',
    optionSuccessStatus: 200
}

app.get('/user/:id',
    cors(corsOptions), function(req, res, next){
        res.json({msg: 'enable for only https://informasi-beasiswa.vercel.app/'})
    }
)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loginDashboard.html'))
})

// register
app.post('/register', async (req, res) => {
    const { nama, username, password } = req.body

    // if (!nama || !username || !password) {
    //     return res.status(400).json({ error: "Kolom tidak boleh kosong!" });
    // }

    try {
        // Check if username already exists
        const [rows] = await pool.query('SELECT * FROM tabel_beasiswa WHERE username = ?', [username])

        if (rows.length > 0) {
            return res.status(401).json({ error: 'Username already exists' })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO tabel_beasiswa (nama, username, password) VALUES (?, ?, ?)',
            [nama, username, hashedPassword]
        )

        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


// login
app.post('/login', async (req, res) => {
    const { username, password } = req.body

    // if (!username || !password) {
    //     return res.status(400).json({ error: "Kolom tidak boleh kosong!" });
    // }

    try {
        // Check if user exists
        const [rows] = await pool.query('SELECT * FROM tabel_beasiswa WHERE username = ?', [username])

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        const user = rows[0]

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });

        res.json({ token: token })
    } catch (error) {
        console.error('Error logging in:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


// test
// app.get('/test', (req, res) => {
//     const username = 'hello'

//     // get all data from tabel_beasiswa
//     pool.query('SELECT * FROM tabel_beasiswa WHERE username', [username], (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error)
//             res.status(500).json({ error: 'Internal Server Error' })
//             return
//         }

//         res.json(results)
//     })
// })

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})