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

// Function to show loading state
const setLoadingState = (button, isLoading) => {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = "Loading...";
    } else {
        button.disabled = false;
        button.innerHTML = "Login";
    }
};

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
        const registerButton = document.getElementById("register-button");
        setLoadingState(registerButton, true);

        const response = await fetch('https://info-beasiswa.vercel.app/register', {
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
            // Log more information about the error
            console.error("Registration error:", data);
            alert(data.error || "Terjadi kesalahan saat registrasi");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
    } finally {
        setLoadingState(document.getElementById("register-button"), false);
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
        const loginButton = document.getElementById("login-button");
        setLoadingState(loginButton, true);

        const response = await fetch('https://info-beasiswa.vercel.app/login', {
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
            // Log more information about the error
            console.error("Login error:", data);
            alert(data.error || "Username atau password salah");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Terjadi kesalahan pada server. Silakan periksa koneksi internet Anda.");
    } finally {
        setLoadingState(document.getElementById("login-button"), false);
    }
});
