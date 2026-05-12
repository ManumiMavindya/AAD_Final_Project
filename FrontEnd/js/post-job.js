let currentCompanyId = null;

async function getCompanyId() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!userId || userId === "undefined") {
        console.error("User ID found as undefined. Please login again.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/company/user/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentCompanyId = data.id;
            console.log("Found Company ID:", currentCompanyId);
        } else {
            console.warn("No company found for this user.");
        }
    } catch (err) {
        console.error("Cant get company ID :", err);
    }
}

document.addEventListener('DOMContentLoaded', getCompanyId);

document.getElementById('postJobForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!currentCompanyId) {
        Swal.fire({
            icon: 'warning',
            title: 'Profile Incomplete',
            text: 'Please set up your company profile first!',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }

    const jobData = {
        title: document.getElementById('jobTitle').value,
        category: document.getElementById('category').value,
        workArrangement: document.getElementById('workArrangement').value,
        experienceLevel: document.getElementById('experienceLevel').value,
        jobType: document.getElementById('jobType').value,
        location: document.getElementById('location').value,
        salary: document.getElementById('salary').value,
        description: document.getElementById('description').value,

        company: { id: parseInt(localStorage.getItem('companyId')) },
        user: { id: parseInt(localStorage.getItem('userId')) },
        companyId: currentCompanyId
    };

    Swal.fire({
        title: 'Publishing Job...',
        text: 'Please wait a moment.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch('http://localhost:8080/api/jobs/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(jobData)
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Job published successfully! 🚀',
                    confirmButtonColor: '#0d6efd'
                }).then(() => {
                    window.location.href = 'employer-dashboard.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Publish Failed',
                    text: 'Failed to publish job. Check your connection or login again.',
                    confirmButtonColor: '#d33'
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.',
                confirmButtonColor: '#d33'
            });
        });
});

    function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be signed out of your session!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    });
}

