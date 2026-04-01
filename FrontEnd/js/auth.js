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
                        Swal.fire({
                            icon: 'success',
                            title: 'Registration Successful!',
                            text: 'Please login to continue.',
                            confirmButtonColor: '#0d6efd'
                        }).then(() => {
                            window.location.href = 'login.html';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Registration Failed',
                            text: 'Email might already exist. Please try another.',
                            confirmButtonColor: '#d33'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: 'Please try again later.',
                        confirmButtonColor: '#d33'
                    });
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

            // පටන් ගද්දීම loading එකක් පෙන්නමු
            Swal.fire({
                title: 'Signing in...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

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
                    const finalUserId = data.userId || data.id;

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.name);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userId', finalUserId);

                    Swal.fire({
                        icon: 'success',
                        title: 'Welcome back!',
                        text: 'Hello ' + data.name + ', redirecting...',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        if (data.role === 'JOB_SEEKER') {
                            window.location.href = 'seeker-dashboard.html';
                        } else if (data.role === 'EMPLOYER') {
                            checkEmployerCompany(finalUserId, data.token);
                        } else {
                            Swal.fire('Error', 'Undefined Role!', 'error');
                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Invalid email or password!',
                        confirmButtonColor: '#d33'
                    });
                });
        });
    }

    function checkEmployerCompany(userId, token) {
        if (!userId || userId === "undefined") {
            Swal.fire({
                icon: 'error',
                title: 'System Error',
                text: 'User identification failed. Please login again.',
                confirmButtonColor: '#d33'
            }).then(() => {
                window.location.href = 'login.html';
            });
            return;
        }

        fetch(`http://localhost:8080/api/company/user/${userId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(res => {
                if (res.ok) {
                    window.location.href = 'employer-dashboard.html';
                } else {
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
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be signed out from your account!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    });
}