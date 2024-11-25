const container = document.querySelector(".container"),
    register = document.querySelector(".register-link"),
    login = document.querySelector(".login-link");

// Memunculkan form login dan registration
register.addEventListener("click", () => {
    container.classList.add("activate");
});
login.addEventListener("click", () => {
    container.classList.remove("activate");
});

// Script Untuk Register
// Script Register yang sudah diperbaiki
document.getElementById("register-button").addEventListener("click", () => {
    const nama = document.getElementById("register-nama").value;
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    // Validasi input dasar
    if (!nama || !username || !password) {
        alert("Semua field harus diisi");
        return;
    }

    fetch("https://informasi-beasiswa.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, username, password }),
    })
        .then(async (res) => {
            if (!res.ok) {
                // Jika status bukan 2xx, tangkap error message
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            if (data.message) {
                alert(data.message);
                // Opsional: Redirect ke halaman login setelah registrasi berhasil
                container.classList.remove("activate");
            }
        })
        .catch((err) => {
            console.error("Error:", err);
            alert("Terjadi kesalahan saat registrasi: " + err.message);
        });
});

// Script Login yang sudah diperbaiki
document.getElementById("login-button").addEventListener("click", () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    // Validasi input dasar
    if (!username || !password) {
        alert("Username dan password harus diisi");
        return;
    }

    fetch("https://informasi-beasiswa.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then(async (res) => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            if (data.token) {
                // Simpan token jika diperlukan
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            }
        })
        .catch((err) => {
            console.error("Error:", err);
            alert("Terjadi kesalahan saat login: " + err.message);
        });
});