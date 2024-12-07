// Form toggle functionality
const logregBox = document.querySelector('.logreg-box')
const loginLink = document.querySelector('.login-link')
const registerLink = document.querySelector('.register-link')

// Show Register Form
registerLink.addEventListener('click', () => {
    logregBox.classList.add('active')
})

// Show Login Form
loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active')
})

// Tambahkan baseURL untuk production dan development
const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://informasi-beasiswa.vercel.app/' // Ganti dengan URL Vercel Anda
    : 'http://localhost:5000';

// Register functionality
document.getElementById("register-button").addEventListener("click", async (e) => {
    e.preventDefault(); // Mencegah form submit default

    const nama = document.getElementById("register-nama").value.trim();
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!nama || !username || !password) {
        alert("Kolom tidak boleh kosong!");
        return;
    }

    try {
        const response = await fetch('https://informasi-beasiswa.vercel.app/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ nama, username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registrasi berhasil!");
            // Redirect ke halaman login
            document.querySelector('.login-link').click();
        } else {
            alert(data.error || "Terjadi kesalahan saat registrasi");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan pada server");
    }
});

// Login functionality
document.getElementById("login-button").addEventListener("click", async (e) => {
    e.preventDefault(); // Mencegah form submit default

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        alert("Kolom tidak boleh kosong!");
        return;
    }

    try {
        const response = await fetch('https://informasi-beasiswa.vercel.app/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            // Simpan token
            localStorage.setItem('token', data.token);
            // Redirect ke dashboard
            window.location.href = "dashboard.html";
        } else {
            alert(data.error || "Username atau password salah");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Terjadi kesalahan pada server");
    }
});
