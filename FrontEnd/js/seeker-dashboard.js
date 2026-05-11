
    const USER_ID = localStorage.getItem('userId');
    const TOKEN = localStorage.getItem('token');

    document.addEventListener('DOMContentLoaded', () => {
    if (!USER_ID) {
    window.location.href = 'login.html';
    return;
}
    const USER_NAME = localStorage.getItem('userName');
    if (USER_NAME && document.getElementById('displayUserName')) {
    document.getElementById('displayUserName').textContent = USER_NAME;
}
    loadDashboardData();
    setupProfileUpdate();
});

    async function loadDashboardData() {
    try {
    const appResponse = await fetch(`http://localhost:8080/api/apply/user/${USER_ID}`, {
    headers: {
    'Authorization': 'Bearer ' + TOKEN,
    'Content-Type': 'application/json'
}
});
    const applications = await appResponse.json();
    const savedJobIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    updateStats(applications, savedJobIds);
    renderApplications(applications);
    renderSavedJobs(savedJobIds);
} catch (error) { console.error("Error loading dashboard data:", error); }
}

    function updateStats(apps, saved) {
    if(document.getElementById('totalApps'))
    document.getElementById('totalApps').textContent = apps.length.toString().padStart(2, '0');
    if(document.getElementById('totalSaved'))
    document.getElementById('totalSaved').textContent = saved.length.toString().padStart(2, '0');
    const interviews = apps.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW' || a.status === 'APPROVED').length;
    if(document.getElementById('totalInterviews'))
    document.getElementById('totalInterviews').textContent = interviews.toString().padStart(2, '0');
}

    function renderApplications(apps) {
    const container = document.getElementById('applicationsList');
    if (!container) return;
    if (apps.length === 0) {
    container.innerHTML = '<div class="dashboard-card p-5 text-center text-muted fw-500">You haven\'t applied for any jobs yet.</div>';
    return;
}
    container.innerHTML = apps.map(app => `
            <div class="dashboard-card p-3 d-flex align-items-center justify-content-between shadow-sm">
                <div class="d-flex align-items-center">
                    <div class="company-logo-box me-3"><i class="bi bi-building"></i></div>
                    <div>
                        <h6 class="fw-bold mb-0">${app.jobTitle}</h6>
                        <small class="text-muted fw-bold d-block">${app.companyName}</small>
                        <small class="text-muted" style="font-size: 0.75rem;">Applied: ${new Date(app.applicationDate).toLocaleDateString()}</small>
                    </div>
                </div>
                <div><span class="status-badge bg-${app.status.toLowerCase()}">${app.status}</span></div>
            </div>
        `).join('');
}

    async function renderSavedJobs(ids) {
    const container = document.getElementById('savedJobsList');
    if (!container) return;
    if (ids.length === 0) {
    container.innerHTML = '<div class="dashboard-card p-4 text-center text-muted small fw-500">No saved jobs in your wishlist.</div>';
    return;
}
    try {
    const res = await fetch('http://localhost:8080/api/jobs/all');
    const allJobs = await res.json();
    const savedJobs = allJobs.filter(j => ids.includes(j.id.toString()));
    container.innerHTML = savedJobs.map(job => `
                <div class="dashboard-card p-3 shadow-sm mb-3">
                    <div class="d-flex align-items-center mb-3">
                        <div class="company-logo-box me-3" style="width: 42px; height: 42px; font-size: 1.2rem;">
                            <i class="bi bi-building text-warning"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-0" style="font-size: 0.9rem;">${job.title}</h6>
                            <small class="text-muted d-block" style="font-size: 0.8rem;">${job.companyName}</small>
                        </div>
                    </div>
                    <a href="job-details.html?id=${job.id}" class="btn btn-sm btn-apply-now w-100 py-2">Apply Now</a>
                </div>
            `).join('');
} catch (e) { container.innerHTML = '<div class="text-danger small">Failed to load saved jobs.</div>'; }
}

    function setupProfileUpdate() {
    const modalElement = document.getElementById('editProfileModal');
    const formElement = document.getElementById('updateProfileForm');
    if (modalElement) {
    modalElement.addEventListener('show.bs.modal', () => {
    document.getElementById('editName').value = localStorage.getItem('userName') || "";
    document.getElementById('editEmail').value = localStorage.getItem('userEmail') || "";
    document.getElementById('editContact').value = localStorage.getItem('userContact') || "";
});
}
    if (formElement) {
    formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedData = { name: document.getElementById('editName').value, contactNo: document.getElementById('editContact').value };
    try {
    const response = await fetch(`http://localhost:8080/api/users/update/${USER_ID}`, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
});
    if (response.ok) {
    Swal.fire({
    title: 'Success!',
    text: 'Profile updated successfully! ✅',
    icon: 'success',
    confirmButtonColor: '#0d6efd'
}).then(() => {
    localStorage.setItem('userName', updatedData.name);
    localStorage.setItem('userContact', updatedData.contactNo);
    location.reload();
});
}
} catch (err) {
    Swal.fire({
    title: 'Error!',
    text: 'Update failed! ❌',
    icon: 'error',
    confirmButtonColor: '#d33'
});
}
});
}
}

    function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be signed out of your account!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    });
}

