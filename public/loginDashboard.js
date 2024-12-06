// Kode Memunculkan Form Login dan Form Register
const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

// Memunculkan Form Register
registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});

// Memunculkan Form Login
loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});


// Kode BackEnd JavaScript Untuk Register
document.getElementById("register-button").addEventListener("click", () => {
    const nama = document.getElementById("register-nama").value.trim();
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!nama || !username || !password) {
        alert("Kolom tidak boleh kosong!");
        return;
    }

    fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            alert(data.message || data.error);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});


// Kode BackEnd JavaScript Untuk Login
document.getElementById("login-button").addEventListener("click", () => {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        alert("Kolom tidak boleh kosong!");
        return;
    }

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                alert("Login berhasil!");
                window.location.href = "dashboard.html";
            } else {
                alert(data.error);
            }
        })
        .catch((err) => console.error("Error during login:", err));
});