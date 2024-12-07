// Form toggle functionality
const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

// Show Register Form
registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});

// Show Login Form
loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});

// Base URL configuration
const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://informasi-beasiswa.vercel.app' // Hapus trailing slash
    : 'http://localhost:5000';

// Register functionality
document.getElementById("register-button").addEventListener("click", async (e) => {
    e.preventDefault();
    
    const nama = document.getElementById("register-nama").value.trim();
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    
    if (!nama || !username || !password) {
        alert("Kolom tidak boleh kosong!");
        return;
    }

    try {
        const response = await fetch(`${baseURL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // Tambahkan credentials
            mode: 'cors', // Explicit CORS mode
            body: JSON.stringify({ nama, username, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            alert("Registrasi berhasil!");
            document.querySelector('.login-link').click();
        } else {
            alert(data.error || "Terjadi kesalahan saat registrasi");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
    }
});

// Login functionality
document.getElementById("login-button").addEventListener("click", async (e) => {
    e.preventDefault();
    
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    
    if (!username || !password) {
        alert("Kolom tidak boleh kosong!");
        return;
    }

    try {
        const response = await fetch(`${baseURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // Tambahkan credentials
            mode: 'cors', // Explicit CORS mode
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = "dashboard.html";
        } else {
            alert(data.error || "Username atau password salah");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Terjadi kesalahan pada server. Silakan periksa koneksi internet Anda.");
    }
});