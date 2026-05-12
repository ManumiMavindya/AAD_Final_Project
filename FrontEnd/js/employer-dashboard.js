
    const API_BASE_URL = "http://localhost:8080/api";
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    document.addEventListener('DOMContentLoaded', () => {
    if (!token || !currentUserId || currentUserId === "undefined") {
    window.location.href = 'login.html';
    return;
}
    fetchCompanyAndJobs();
});

    function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be signed out from your employer account!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    });
}

    async function fetchCompanyAndJobs() {
    try {
    const res = await fetch(`${API_BASE_URL}/company/user/${currentUserId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});
    if (!res.ok) throw new Error("Company not found");
    const company = await res.json();
    document.getElementById('companyNameDisplay').textContent = company.companyName || "Employer";
    fetchEmployerJobs(company.id);
    fetchStats(company.id);
} catch (err) { console.error(err); }
}

    async function fetchStats(companyId) {
    try {
    const res = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});
    const jobs = await res.json();
    document.getElementById('activeJobsCount').textContent = jobs.length.toString().padStart(2, '0');
} catch (err) { console.error(err); }
}

    async function fetchEmployerJobs(companyId) {
    try {
    const res = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});
    const jobs = await res.json();
    const container = document.getElementById('employerJobsList');
    container.innerHTML = '';

    jobs.forEach(job => {
    const iconData = getJobIcon(job.title);
    container.insertAdjacentHTML('beforeend', `
                <div class="col-md-6 col-lg-4">
                    <div class="job-card shadow-sm">
                        <div class="icon-square" style="color: ${iconData.color}; background: ${iconData.bg};">
                            <i class="bi ${iconData.icon}"></i>
                        </div>
                        <h5 class="fw-bold mb-1">${job.title}</h5>
                        <p class="text-muted small mb-3"><i class="bi bi-geo-alt me-1"></i>${job.location}</p>
                        <div class="d-flex gap-2 mt-4">
                            <button onclick="viewApplicants(${job.id}, '${job.title}')" class="btn btn-primary btn-action flex-grow-1">
                                <i class="bi bi-eye me-1"></i> View Applicants
                            </button>
                            <button onclick="deleteJob(${job.id})" class="btn btn-delete btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>`);
});
} catch (err) { console.error(err); }
}

    function getJobIcon(title) {
    const t = title.toLowerCase();
    if (t.includes('java') || t.includes('dev')) return { icon: 'bi-code-slash', color: '#0d6efd', bg: '#f1f5f9' };
    if (t.includes('design') || t.includes('ui')) return { icon: 'bi-palette', color: '#ffc107', bg: '#fff9e6' };
    return { icon: 'bi-briefcase', color: '#198754', bg: '#eef7f1' };
}

    async function viewApplicants(jobId, jobTitle) {
    document.getElementById('modalJobTitle').textContent = jobTitle;
    const tableBody = document.getElementById('applicantsTableBody');
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';

    const modal = new bootstrap.Modal(document.getElementById('applicantsModal'));
    modal.show();

    try {
    const res = await fetch(`${API_BASE_URL}/apply/job/${jobId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});
    const applicants = await res.json();
    tableBody.innerHTML = '';

    if (applicants.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">No applications found for this job.</td></tr>';
    return;
}

    for (const app of applicants) {
    let seekerName = "Loading...";
    let seekerEmail = "Loading...";

    try {
    const userRes = await fetch(`${API_BASE_URL}/apply/user-details/${app.userId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});

    if (userRes.ok) {
    const userData = await userRes.json();
    seekerName = userData.name;
    seekerEmail = userData.email;
}
} catch (userErr) {
    seekerName = "Error Loading";
}

    tableBody.innerHTML += `
<tr>
    <td>
        <div class="fw-bold">${seekerName}</div>
        <div class="small text-muted"><i class="bi bi-envelope me-1"></i>${seekerEmail}</div>
    </td>
    <td><i class="bi bi-telephone me-1 text-muted"></i>${app.contactNo}</td>
    <td>
        <button class="btn btn-sm btn-outline-primary fw-bold" onclick="viewCvWithAuth(${app.id})">
            <i class="bi bi-file-earmark-pdf me-1"></i> View CV
        </button>
     </td>
    <td><span class="badge ${getStatusClass(app.status)}">${app.status}</span></td>
    <td class="text-end">
        <select class="form-select form-select-sm d-inline-block w-auto" onchange="updateStatus(${app.id}, this.value)">
            <option value="PENDING" ${app.status === 'PENDING' ? 'selected' : ''}>Pending</option>
            <option value="APPROVED" ${app.status === 'APPROVED' ? 'selected' : ''}>Approve</option>
            <option value="REJECTED" ${app.status === 'REJECTED' ? 'selected' : ''}>Reject</option>
        </select>
    </td>
</tr>`;

}
} catch (err) {
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading applicants.</td></tr>';
}
}

    async function viewCvWithAuth(appId) {
    try {
    const response = await fetch(`${API_BASE_URL}/apply/view-cv/${appId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});

    if (response.ok) {
    const blob = await response.blob();
    // PDF එකක් විදිහටම එනවා කියලා සහතික කරමු
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
} else {
    Swal.fire({
    icon: 'error',
    title: 'Access Denied',
    text: 'CV file not found or unauthorized access!'
});
}
} catch (err) {
    console.error("Error viewing CV:", err);
    Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Could not connect to the server.'
});
}
}
    function getStatusClass(status) {
    if (status === 'APPROVED') return 'bg-success bg-opacity-10 text-success';
    if (status === 'REJECTED') return 'bg-danger bg-opacity-10 text-danger';
    return 'bg-warning bg-opacity-10 text-warning';
}

    async function updateStatus(appId, newStatus) {
    try {
    const res = await fetch(`${API_BASE_URL}/apply/update-status/${appId}?status=${newStatus}`, {
    method: 'PATCH',
    headers: { 'Authorization': 'Bearer ' + token }
});
    if (res.ok) {
    const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});
    Toast.fire({
    icon: 'success',
    title: `Status updated to ${newStatus}`
});
}
} catch (err) { console.error(err); }
}

    async function deleteJob(jobId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This job post will be permanently deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/jobs/delete/${jobId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (res.ok) {
                    Swal.fire('Deleted!', 'Job post has been deleted.', 'success')
                        .then(() => location.reload());
                }
            } catch (err) { console.error(err); }
        }
    });
}

