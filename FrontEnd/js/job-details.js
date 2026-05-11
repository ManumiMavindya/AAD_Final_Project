
    // --- Navbar Logic (Updated to Match Dashboard) ---
    function updateNavbar() {
    const navbarCollapse = document.getElementById('navbarNav');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    let content = `<ul class="navbar-nav mx-auto gap-2">
            <li class="nav-item"><a class="nav-link fw-semibold" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link fw-semibold active" href="jobs.html">Find Jobs</a></li>`;

    if (token) {
    if (userRole === 'EMPLOYER') {
    content += `
                    <li class="nav-item"><a class="nav-link fw-semibold" href="employer-dashboard.html">Employer Portal</a></li>
                    <li class="nav-item"><a class="nav-link fw-semibold" href="post-job.html">Post a Job</a></li>`;
} else {
    content += `<li class="nav-item"><a class="nav-link fw-semibold" href="seeker-dashboard.html">Dashboard</a></li>`;
}
    content += `</ul>
                <div class="d-flex align-items-center gap-3">
                    <button class="btn btn-outline-danger btn-sm fw-bold px-4" style="border-radius: 10px;" onclick="logout()">Sign Out</button>
                </div>`;
} else {
    content += `</ul>
                <div class="d-flex align-items-center gap-2">
                    <a class="nav-link fw-semibold px-3 text-secondary" href="login.html" style="text-decoration:none;">Login</a>
                    <a class="btn btn-primary btn-sm fw-bold px-4 text-white" href="register.html" style="border-radius: 10px; background: #0d6efd; border:none;">Register</a>
                </div>`;
}
    navbarCollapse.innerHTML = content;
}

    function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be signed out from your account!",
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

    // --- Job Logic (UNCHANGED) ---
    let currentJobId = null;

    document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    const urlParams = new URLSearchParams(window.location.search);
    currentJobId = urlParams.get('id');

    if (currentJobId) {
    fetchJobDetails(currentJobId);
    checkIfSaved();
} else {
    window.location.href = 'jobs.html';
}
});

    async function fetchJobDetails(id) {
    try {
    const response = await fetch(`http://localhost:8080/api/jobs/${id}`);
    if (!response.ok) throw new Error("Job not found");

    const job = await response.json();

    document.getElementById('detTitle').textContent = job.title;
    document.getElementById('breadcrumbJobTitle').textContent = job.title;
    document.getElementById('detCompany').innerHTML = `${job.companyName || 'Verified Employer'} <i class="bi bi-check-circle-fill text-primary ms-1 small"></i>`;

    document.getElementById('detLocation').innerHTML = `<i class="bi bi-geo-alt me-1"></i>${job.location}`;
    document.getElementById('detType').innerHTML = `<i class="bi bi-clock me-1"></i>${job.jobType.replace('_', ' ')}`;
    document.getElementById('detSalary').innerHTML = `LKR ${job.salary.toLocaleString()}`;

    document.getElementById('detDescription').textContent = job.description;

    document.getElementById('sideJobType').textContent = job.jobType.replace('_', ' ');
    document.getElementById('sideSalary').textContent = `LKR ${job.salary.toLocaleString()}`;
    document.getElementById('sideLocation').textContent = job.location;
    document.getElementById('sideExperience').textContent = job.experienceLevel || 'Not Specified';

    const workModeText = job.workArrangement || 'Not Specified';
    document.getElementById('sideWorkMode').textContent = workModeText.replace('_', ' ');

    if (job.postedDate) {
    let date;
    if (Array.isArray(job.postedDate)) {
    date = new Date(job.postedDate[0], job.postedDate[1]-1, job.postedDate[2]);
} else {
    date = new Date(job.postedDate);
}
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('sidePostedDate').textContent = date.toLocaleDateString('en-US', options);
} else {
    document.getElementById('sidePostedDate').textContent = "Recently Posted";
}

} catch (error) {
    console.error("Error:", error);
    document.body.innerHTML = `<div class="container py-5 text-center"><h3>Job Not Found</h3><a href="jobs.html" class="btn btn-primary mt-3">Back to Jobs</a></div>`;
}
}

    function toggleSaveJob() {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const btn = document.getElementById('saveJobBtn');
    const icon = document.getElementById('saveIcon');

    const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
});

    if (savedJobs.includes(currentJobId)) {
    savedJobs = savedJobs.filter(id => id !== currentJobId);
    btn.classList.remove('active');
    icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
    Toast.fire({ icon: 'info', title: 'Removed from saved list' });
} else {
    savedJobs.push(currentJobId);
    btn.classList.add('active');
    icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
    Toast.fire({ icon: 'success', title: 'Job saved successfully!' });
}
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
}

    function checkIfSaved() {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const btn = document.getElementById('saveJobBtn');
    const icon = document.getElementById('saveIcon');
    if (savedJobs.includes(currentJobId)) {
    btn.classList.add('active');
    icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
}
}

    document.getElementById('applyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loggedInUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // 1. User Login වෙලා නැත්නම් Login පේජ් එකට යවන්න
    if (!loggedInUserId) {
    Swal.fire({
    title: 'Login Required',
    text: "Please login to apply for this job!",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#0d6efd',
    confirmButtonText: 'Login Now'
}).then((result) => {
    if (result.isConfirmed) {
    window.location.href = 'login.html';
}
});
    return;
}

    // 2. Loading එක පෙන්වන්න (AI Analysis)
    Swal.fire({
    title: 'Gemini AI Analysis...',
    text: 'Please wait while our AI checks your resume compatibility with the job requirements.',
    allowOutsideClick: false,
    didOpen: () => {
    Swal.showLoading();
}
});

    try {
    const formData = new FormData();
    formData.append('jobId', currentJobId);
    formData.append('userId', loggedInUserId);
    formData.append('contactNo', document.getElementById('applicantPhone').value);
    formData.append('file', document.getElementById('resumeFile').files[0]);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // 3. Backend එකට Request එක යැවීම
    const response = await fetch('http://localhost:8080/api/apply/submit-with-cv', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
});

    const data = await response.json(); // Backend එකෙන් එන JSON එක

    if (response.ok) {
    // 4. සාර්ථකව Submit වුණොත් (Score 60+)
    Swal.fire({
    icon: 'success',
    title: 'Application Success!',
    text: `ATS Score: ${data.score}% - Your application has been submitted successfully! ✅`,
    confirmButtonColor: '#0d6efd'
});

    // Modal එක වසා Form එක Reset කිරීම
    const modalElement = document.getElementById('applyModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
    e.target.reset();

} else if (response.status === 406) {
    // 5. ATS Score එක අඩු නිසා Reject වුණොත්
    Swal.fire({
    icon: 'warning',
    title: `Low ATS Score: ${data.score}%`,
    html: `
                    <div style="text-align: left; background: #fff5f5; padding: 15px; border-radius: 10px; border: 1px solid #feb2b2;">
                        <p style="color: #c53030; font-weight: bold; margin-bottom: 8px;">Improvement Needed:</p>
                        <p style="color: #4a5568; font-size: 0.95rem; line-height: 1.5;">${data.feedback}</p>
                    </div>
                    <p style="margin-top: 15px; font-weight: 500;">කරුණාකර ඉහත සඳහන් Skills ඔබේ Resume එකට ඇතුළත් කර නැවත උත්සාහ කරන්න.</p>
                `,
    confirmButtonText: 'Understand',
    confirmButtonColor: '#0d6efd'
});

} else {
    // 6. වෙනත් කිසියම් Error එකක් ආවොත්
    Swal.fire({
    icon: 'error',
    title: 'Oops!',
    text: data.message || 'Something went wrong during submission.',
    confirmButtonColor: '#d33'
});
}

} catch (error) {
    console.error("Error:", error);
    Swal.fire({
    icon: 'error',
    title: 'Connection Error',
    text: 'Server connection failed! Please check if the backend is running.',
    confirmButtonColor: '#d33'
});
} finally {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
}
});
