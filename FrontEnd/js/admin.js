
    const API_BASE_URL = "http://localhost:8080/api";
    const token = localStorage.getItem('token');

    document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentDate').textContent = new Date().toDateString();
    fetchAllJobs();
    updateStats();
});

    async function updateStats() {
    try {
    // 1. Total Users
    const usersRes = await fetch(`${API_BASE_URL}/users/all`, { headers: { 'Authorization': 'Bearer ' + token } });
    const users = await usersRes.json();
    document.getElementById('totalUsers').textContent = users.length;

    // 2. Active Companies
    const companyRes = await fetch(`${API_BASE_URL}/company/all`, { headers: { 'Authorization': 'Bearer ' + token } });
    const companies = await companyRes.json();
    document.getElementById('totalCompanies').textContent = companies.length;

    // 3. Total Applications
    const appRes = await fetch(`${API_BASE_URL}/apply/all`, { headers: { 'Authorization': 'Bearer ' + token } });
    const applications = await appRes.json();
    document.getElementById('totalApps').textContent = applications.length;

} catch (e) { console.error("Stats loading error:", e); }
}

    async function fetchAllJobs() {
    try {
    const res = await fetch(`${API_BASE_URL}/jobs/all`, {
    headers: { 'Authorization': 'Bearer ' + token }
});
    const jobs = await res.json();

    const jobsWithCompanyNames = await Promise.all(jobs.map(async (job) => {
    const cId = (job.company && job.company.id) ? job.company.id : job.companyId;

    if (cId) {
    try {
    const compRes = await fetch(`${API_BASE_URL}/company/${cId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});

    if (compRes.ok) {
    const compData = await compRes.json();
    job.companyDisplayName = compData.companyName || "Name Not Found";
} else {
    job.companyDisplayName = "N/A";
}
} catch (err) {
    job.companyDisplayName = "Error Fetching";
}
} else {
    job.companyDisplayName = "Independent";
}
    return job;
}));

    document.getElementById('adminJobsList').innerHTML = jobsWithCompanyNames.map(job => `
        <tr>
            <td>
                <div class="fw-bold">${job.title}</div>
                <small class="text-muted">${job.location} | ${job.jobType}</small>
            </td>
            <td><span class="text-primary fw-600">${job.companyDisplayName}</span></td>
            <td>${job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="viewJobInfo(${JSON.stringify(job).replace(/"/g, '&quot;')})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteJob(${job.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`).join('');

    if(document.getElementById('totalJobs')) {
    document.getElementById('totalJobs').textContent = jobs.length;
}

} catch (err) {
    console.error("Jobs load error:", err);
}
}

    function viewJobInfo(job) {
    const content = document.getElementById('jobDetailContent');

    const salary = job.salary ? "Rs. " + job.salary.toLocaleString() : 'Unspecified';
    const email = (job.user && job.user.email) ? job.user.email : 'Email Not Found';

    content.innerHTML = `
        <div class="row g-4">
            <div class="col-12">
                <div class="detail-card shadow-sm p-4 bg-light rounded-4">
                    <p class="detail-label mb-3 text-primary" style="font-weight: 700; letter-spacing: 1px;">FULL JOB DESCRIPTION</p>
                    <div class="description-text" style="white-space: pre-line; line-height: 1.8; color: #475569; font-size: 0.95rem;">
                        ${job.description || 'No description provided.'}
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="detail-card shadow-sm p-3 border-start border-4 border-primary bg-white rounded-3">
                    <p class="detail-label mb-1" style="font-size: 0.7rem; color: #64748b;">EMPLOYER EMAIL</p>
                    <p class="fw-bold mb-0 text-dark">${email}</p>
                </div>
            </div>

            <div class="col-md-6">
                <div class="detail-card shadow-sm p-3 border-start border-4 border-success bg-white rounded-3">
                    <p class="detail-label mb-1" style="font-size: 0.7rem; color: #64748b;">SALARY RANGE</p>
                    <p class="fw-bold text-success mb-0">${salary}</p>
                </div>
            </div>

            <div class="col-12">
                <div class="p-3 rounded-3 bg-info bg-opacity-10 border border-info-subtle">
                    <p class="small mb-0 text-info-emphasis">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        Experience Level: <b>${job.experienceLevel || 'N/A'}</b> | Arrangement: <b>${job.workArrangement || 'N/A'}</b>
                    </p>
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('jobDetailModal'));
    modal.show();
}

    async function fetchAllUsers() {
    try {
    const res = await fetch(`${API_BASE_URL}/users/all`, {
    headers: { 'Authorization': 'Bearer ' + token }
});

    if (!res.ok) throw new Error("Users fetch failed");

    const users = await res.json();

    document.getElementById('adminUsersList').innerHTML = users.map(user => `
                <tr>
                    <td>
                        <div class="fw-bold">${user.name || 'User'}</div>
                        <small class="text-muted">${user.email}</small>
                    </td>
                    <td><span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">${user.role}</span></td>
                    <td>ID: ${user.id}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="viewUserFullDetails(${user.id}, '${user.role}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`).join('');
} catch (err) {
    console.error("Fetch Users Error:", err);
}
}

    async function viewUserFullDetails(userId, role) {
    const modalContent = document.getElementById('userDetailContent');
    modalContent.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted small">Fetching activity profile...</p>
        </div>`;

    const userModal = new bootstrap.Modal(document.getElementById('userViewModal'));
    userModal.show();

    const userRole = role.toUpperCase();

    try {
    if (userRole === 'EMPLOYER') {
    const compRes = await fetch(`${API_BASE_URL}/company/user/${userId}`, { headers: {'Authorization': 'Bearer ' + token} });
    const company = await compRes.json();

    let jobsHtml = '<div class="text-center py-3 text-muted small">No jobs posted yet.</div>';
    if (company?.id) {
    const jobsRes = await fetch(`${API_BASE_URL}/jobs/company/${company.id}`, { headers: {'Authorization': 'Bearer ' + token} });
    const jobs = await jobsRes.json();
    jobsHtml = jobs.length > 0 ? jobs.map(j => `
                    <div class="d-flex justify-content-between align-items-center p-3 mb-2 bg-white border rounded shadow-sm">
                        <div>
                            <div class="fw-bold text-dark" style="font-size: 0.9rem;">${j.title}</div>
                            <div class="text-muted" style="font-size: 0.75rem;"><i class="bi bi-geo-alt me-1"></i>${j.location}</div>
                        </div>
                        <span class="badge bg-primary bg-opacity-10 text-primary border-0">${j.jobType}</span>
                    </div>`).join('') : jobsHtml;
}

    modalContent.innerHTML = `
                <div class="mb-4">
                    <label class="text-uppercase text-muted fw-bold mb-2" style="font-size: 0.65rem; letter-spacing: 1px;">Company Overview</label>
                    <div class="p-3 bg-white border rounded-3 shadow-sm mb-3">
                        <h5 class="fw-bold mb-1">${company?.companyName || 'Not Registered'}</h5>
                        <p class="text-primary small mb-0 fw-600">${company?.industry || 'General'}</p>
                    </div>
                </div>
                <div>
                    <label class="text-uppercase text-muted fw-bold mb-2" style="font-size: 0.65rem; letter-spacing: 1px;">Active Job Posts</label>
                    <div style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
                        ${jobsHtml}
                    </div>
                </div>`;

} else if (userRole === 'JOB_SEEKER') {
    const applyRes = await fetch(`${API_BASE_URL}/apply/user/${userId}`, { headers: {'Authorization': 'Bearer ' + token} });
    const applications = await applyRes.json();

    const applicationsHtml = applications.length > 0 ? applications.map(app => {
    let badgeClass = 'bg-warning text-warning';
    if (app.status === 'APPROVED') badgeClass = 'bg-success text-success';
    if (app.status === 'REJECTED') badgeClass = 'bg-danger text-danger';

    return `
                <div class="p-3 mb-3 bg-white border rounded-3 shadow-sm position-relative overflow-hidden" style="border-left: 5px solid ${app.status === 'APPROVED' ? '#198754' : app.status === 'REJECTED' ? '#dc3545' : '#ffc107'} !important;">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="fw-800 text-dark" style="font-size: 1rem;">${app.jobTitle || 'N/A'}</div>
                            <div class="text-primary fw-600 small mb-2">${app.companyName || 'N/A'}</div>
                            <div class="d-flex gap-3">
                                <span class="text-muted" style="font-size: 0.75rem;"><i class="bi bi-calendar3 me-1"></i>${app.applicationDate || 'N/A'}</span>
                                <span class="text-muted" style="font-size: 0.75rem;"><i class="bi bi-telephone me-1"></i>${app.contactNo || 'N/A'}</span>
                            </div>
                        </div>
                        <span class="badge ${badgeClass} bg-opacity-10 border-0 px-3 py-2 fw-bold" style="font-size: 0.7rem;">
                            ${app.status}
                        </span>
                    </div>
                </div>`;
}).join('') : '<div class="text-center py-5 text-muted">No job applications recorded.</div>';

    modalContent.innerHTML = `
                <label class="text-uppercase text-muted fw-bold mb-3" style="font-size: 0.65rem; letter-spacing: 1px;">Application History</label>
                <div style="max-height: 450px; overflow-y: auto; padding-right: 5px;">
                    ${applicationsHtml}
                </div>`;
} else {
    modalContent.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-shield-lock text-muted display-4"></i>
                    <p class="mt-3 fw-bold text-dark">System Administrator</p>
                    <p class="text-muted small">Full access granted. No activity logs required for this role.</p>
                </div>`;
}
} catch (err) {
    modalContent.innerHTML = `
            <div class="alert alert-danger border-0 rounded-3 small">
                <i class="bi bi-exclamation-triangle me-2"></i> Failed to retrieve data.
            </div>`;
}
}

    async function deleteJob(id) {
    if(confirm("Delete this job permanently?")) {
    const res = await fetch(`${API_BASE_URL}/jobs/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
});

    if(res.ok) {
    alert("Job Deleted Successfully!");
    fetchAllJobs();
    updateStats(); // Job එකක් මැකුවම stats update කරනවා
} else {
    alert("Failed to delete job.");
}
}
}

    async function deleteUser(id) {
    if(confirm("Delete this user permanently?")) {
    const res = await fetch(`${API_BASE_URL}/users/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
});

    if(res.ok) {
    alert("User Deleted Successfully!");
    fetchAllUsers();
    updateStats();
} else {
    alert("Could not delete user.");
}
}
}

    function logout() {
    localStorage.clear(); window.location.href = 'index.html';
}
