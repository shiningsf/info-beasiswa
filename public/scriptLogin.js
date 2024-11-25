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
document.getElementById("register-button").addEventListener("click", () => {
    const nama = document.getElementById("register-nama").value;
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    fetch("https://informasi-beasiswa.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.message) {
                alert(data.message); // Pesan registrasi sukses
            } else {
                console.error(data.error); // Error saat registrasi
            }
        })
        .catch((err) => console.error(err));
});

// Script Untuk Login
document.getElementById("login-button").addEventListener("click", () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    fetch("https://informasi-beasiswa.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                // Login berhasil: arahkan ke dashboard
                window.location.href = "dashboard.html";
            } else {
                // Tampilkan pesan error jika login gagal
                alert(data.error);
            }
        })
        .catch((err) => console.error("Error during login:", err));
});