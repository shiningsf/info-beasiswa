const container = document.querySelector(".container"),
    register = document.querySelector(".register-link"),
    login = document.querySelector(".login-link");

// Fungsi helper untuk menampilkan loading state
function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    button.disabled = isLoading;
    button.innerHTML = isLoading ? 
        '<span class="spinner"></span> Loading...' : 
        buttonId === 'register-button' ? 'Register' : 'Login';
}

// Fungsi untuk retry logic
async function fetchWithRetry(url, options, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, i) * 1000)
            );
            console.log(`Retry attempt ${i + 1} of ${maxRetries}`);
        }
    }
}

// Memunculkan form login dan registration
register.addEventListener("click", () => {
    container.classList.add("activate");
});

login.addEventListener("click", () => {
    container.classList.remove("activate");
});

// Script Untuk Register
document.getElementById("register-button").addEventListener("click", async () => {
    const nama = document.getElementById("register-nama").value;
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    // Validasi input yang lebih ketat
    if (!nama || !username || !password) {
        alert("Semua field harus diisi");
        return;
    }

    if (password.length < 6) {
        alert("Password harus minimal 6 karakter");
        return;
    }

    if (username.length < 4) {
        alert("Username harus minimal 4 karakter");
        return;
    }

    try {
        setButtonLoading("register-button", true);

        const data = await fetchWithRetry(
            "https://informasi-beasiswa.vercel.app/register",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama, username, password }),
            }
        );

        alert(data.message || "Registrasi berhasil");
        // Clear form
        document.getElementById("register-nama").value = "";
        document.getElementById("register-username").value = "";
        document.getElementById("register-password").value = "";
        // Switch to login form
        container.classList.remove("activate");

    } catch (err) {
        console.error("Error:", err);
        alert("Terjadi kesalahan saat registrasi: " + err.message);
    } finally {
        setButtonLoading("register-button", false);
    }
});

// Script Login dengan session handling
document.getElementById("login-button").addEventListener("click", async () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    // Validasi input
    if (!username || !password) {
        alert("Username dan password harus diisi");
        return;
    }

    try {
        setButtonLoading("login-button", true);

        const data = await fetchWithRetry(
            "https://informasi-beasiswa.vercel.app/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            }
        );

        if (data.token) {
            // Simpan data user di localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userData", JSON.stringify({
                username: username,
                lastLogin: new Date().toISOString()
            }));

            // Redirect ke dashboard
            window.location.href = "dashboard.html";
        }

    } catch (err) {
        console.error("Error:", err);
        // More specific error messages
        if (err.message.includes("not found")) {
            alert("Username tidak ditemukan");
        } else if (err.message.includes("Invalid credentials")) {
            alert("Password salah");
        } else {
            alert("Terjadi kesalahan saat login: " + err.message);
        }
    } finally {
        setButtonLoading("login-button", false);
    }
});

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Auto login check
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        const { lastLogin } = JSON.parse(userData);
        const loginTime = new Date(lastLogin);
        const now = new Date();
        
        // Check if token is less than 1 hour old
        if ((now - loginTime) < (60 * 60 * 1000)) {
            window.location.href = 'dashboard.html';
        } else {
            // Clear expired session
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
        }
    }
});

// Prevent form submission on enter key
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => e.preventDefault());
});

// Cleanup function for when user logs out
window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
};