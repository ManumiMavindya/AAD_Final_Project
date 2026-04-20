// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REGISTRATION LOGIC ---
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const userData = {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                role: document.getElementById('regRole').value
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
                            title: 'Success!',
                            text: 'Registration Successful. Please Login!',
                        }).then(() => {
                            // Modal එක මාරු කරනවා
                            const regModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                            regModal.hide();
                            const logModal = new bootstrap.Modal(document.getElementById('loginModal'));
                            logModal.show();
                        });
                    } else {
                        Swal.fire('Error', 'Registration Failed!', 'error');
                    }
                })
                .catch(err => Swal.fire('Error', 'Server Error!', 'error'));
        });
    }

    // --- 2. LOGIN LOGIC ---
    const logForm = document.getElementById('loginForm');
    if (logForm) {
        logForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            Swal.fire({ title: 'Signing in...', didOpen: () => Swal.showLoading() });

            fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Unauthorized');
                })
                .then(data => {
                    // Backend එකෙන් එන විස්තර ටික Save කරමු
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.name);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userId', data.userId);

                    const userRole = data.role;

                    Swal.fire({ icon: 'success', title: 'Welcome!', timer: 1500, showConfirmButton: false })
                        .then(() => {
                            // Role එක අනුව Dashboard වලට යවනවා
                            if (userRole === "ADMIN") {
                                window.location.href = "admin-dashboard.html"; // Admin Dashboard එකට යනවා
                            } else if (userRole === "EMPLOYER") {
                                window.location.href = "employer-dashboard.html";
                            } else {
                                window.location.href = "seeker-dashboard.html";
                            }
                        });
                })
                .catch(err => Swal.fire('Error', 'Invalid Credentials!', 'error'));
        });
    }
});

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