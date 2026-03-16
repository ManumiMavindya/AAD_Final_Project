// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. USER REGISTRATION LOGIC ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(response => {
                    if (response.ok) {
                        alert('Registration Successful! Please login.');
                        window.location.href = 'login.html'; // ලොගින් පිටුවට යවනවා
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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json(); // සාර්ථක නම් Response එක JSON කරනවා
                    } else {
                        throw new Error('Invalid Credentials');
                    }
                })
                .then(data => {
                    // 1. data එක ඇතුළේ තියෙන දේවල් variable වලට වෙන් කරගන්න
                    const { token, name, role } = data;

                    // 2. දැන් data.token වෙනුවට කෙලින්ම variable එක පාවිච්චි කරන්න
                    localStorage.setItem('token', token);
                    localStorage.setItem('userName', name);
                    localStorage.setItem('userRole', role);

                    alert('Welcome back, ' + name + '!');

                    // --- Role එක අනුව Redirect කිරීම ---
                    if (data.role === 'JOB_SEEKER') {
                        window.location.href = 'seeker-dashboard.html';
                    } else if (data.role === 'EMPLOYER') {
                        window.location.href = 'employer-dashboard.html';
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
});

// --- 3. LOGOUT FUNCTION (පස්සේ පාවිච්චි කරන්න පුළුවන්) ---
function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}