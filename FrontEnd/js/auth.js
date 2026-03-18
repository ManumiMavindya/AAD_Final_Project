// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. USER REGISTRATION LOGIC ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            const userData = {
                name: name,
                email: email,
                password: password,
                role: role
            };

            fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
                .then(response => {
                    if (response.ok) {
                        alert('Registration Successful! Please login.');
                        window.location.href = 'login.html';
                    } else {
                        alert('Registration failed. Email might already exist.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Server error. Please try again later.');
                });
        });
    }

    // --- 2. USER LOGIN LOGIC ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            })
                .then(response => {
                    if (response.ok) return response.json();
                    else throw new Error('Invalid Credentials');
                })
                .then(data => {
                    // 🛑 මේ කොටස තමයි වැදගත්ම!
                    // Backend එකෙන් 'userId' කියලා ආවේ නැත්නම් 'id' කියලා හරි ගන්නවා.
                    const finalUserId = data.userId || data.id;

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.name);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userId', finalUserId);

                    console.log("Login Successful! Data received:", data);
                    console.log("Saved User ID:", finalUserId);

                    alert('Welcome back, ' + data.name + '!');

                    if (data.role === 'JOB_SEEKER') {
                        window.location.href = 'seeker-dashboard.html';
                    } else if (data.role === 'EMPLOYER') {
                        // කෙලින්ම checkEmployerCompany එකට ID එක යවනවා
                        checkEmployerCompany(finalUserId, data.token);
                    } else {
                        alert('Undefined Role!');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Login failed! Please check your email and password.');
                });
        });
    }

    // Employer ට Company එකක් තියෙනවද කියලා බලන Function එක
    function checkEmployerCompany(userId, token) {
        // මෙතනදී userId එක 'undefined' ද කියලා තදින්ම පරීක්ෂා කරනවා
        if (!userId || userId === "undefined") {
            console.error("Critical Error: userId is missing!");
            alert("System error: User identification failed. Please login again.");
            window.location.href = 'login.html';
            return;
        }

        fetch(`http://localhost:8080/api/company/user/${userId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(res => {
                if (res.ok) {
                    window.location.href = 'employer-dashboard.html';
                } else {
                    // 404 ආවොත් කියන්නේ Company එකක් නැහැ කියන එක
                    window.location.href = 'create-company.html';
                }
            })
            .catch(err => {
                console.error("Company check error:", err);
                window.location.href = 'create-company.html';
            });
    }

});

// --- 3. LOGOUT FUNCTION ---
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}