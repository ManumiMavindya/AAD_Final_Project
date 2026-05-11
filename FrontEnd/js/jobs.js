
    // --- Navbar Update Logic ---
    function updateNavbar() {
    const navItems = document.getElementById('navItems');
    const navAuth = document.getElementById('navAuth');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    let menuContent = `<li class="nav-item"><a class="nav-link fw-semibold active" href="jobs.html">Find Jobs</a></li>`;
    let authContent = '';

    if (token) {
    if (userRole === 'EMPLOYER') {
    menuContent += `
                    <li class="nav-item"><a class="nav-link fw-semibold" href="employer-dashboard.html">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link fw-semibold" href="post-job.html">Post a Job</a></li>`;
} else {
    menuContent += `<li class="nav-item"><a class="nav-link fw-semibold" href="seeker-dashboard.html">My Dashboard</a></li>`;
}
    authContent = `<button class="btn btn-outline-danger btn-sm fw-bold px-4" style="border-radius: 10px;" onclick="logout()">Sign Out</button>`;
} else {
    menuContent += `<li class="nav-item"><a class="nav-link fw-semibold" href="login.html">Login</a></li>`;
    authContent = `<a class="btn btn-primary btn-sm fw-bold px-4 text-white" href="register.html" style="border-radius: 10px; border:none;">Register</a>`;
}

    navItems.innerHTML = menuContent;
    navAuth.innerHTML = authContent;
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

    // --- JS LOGIC ---
    let allJobs = [];
    let filteredJobs = [];
    let currentPage = 1;
    const jobsPerPage = 5;

    document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadJobsFromDB();

    document.querySelectorAll('.form-check-input, #salaryRange').forEach(element => {
    element.addEventListener('change', applyFiltersAndSearch);
});

    document.getElementById('jobSearch').addEventListener('input', applyFiltersAndSearch);
    document.getElementById('locationSearch').addEventListener('input', applyFiltersAndSearch);

    document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('filterForm').reset();
    document.getElementById('salaryValue').textContent = '$0';
    applyFiltersAndSearch();
});
});

    document.getElementById('salaryRange').addEventListener('input', function(e) {
    document.getElementById('salaryValue').textContent = '$' + (e.target.value / 1000) + 'K';
});

    async function loadJobsFromDB() {
    try {
    const response = await fetch('http://localhost:8080/api/jobs/all');
    allJobs = await response.json();
    applyFiltersAndSearch();
} catch (error) {
    console.error("Error:", error);
    document.getElementById('jobListings').innerHTML = '<div class="alert alert-danger border-0 rounded-4">Server connection failed.</div>';
}
}

    function applyFiltersAndSearch() {
    const searchText = document.getElementById('jobSearch').value.toLowerCase();
    const minSalary = parseInt(document.getElementById('salaryRange').value);
    const locationText = document.getElementById('locationSearch').value.toLowerCase().trim();

    const getSelectedFilters = (ids) => ids.filter(id => document.getElementById(id).checked);

    const selectedTypes = getSelectedFilters(['ft', 'pt', 'ct']);
    const selectedModes = getSelectedFilters(['remote', 'onsite', 'hybrid']);
    const selectedLevels = getSelectedFilters(['entry', 'mid', 'senior']);

    filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchText) ||
    job.companyName?.toLowerCase().includes(searchText) ||
    job.location.toLowerCase().includes(searchText);

    const matchesLocation = !locationText ||
    job.location?.toLowerCase().includes(locationText);

    const matchesSalary = job.salary >= minSalary;

    const matchesType = selectedTypes.length === 0 || selectedTypes.some(type =>
    (type === 'ft' && job.jobType === 'FULL_TIME') ||
    (type === 'pt' && job.jobType === 'PART_TIME') ||
    (type === 'ct' && job.jobType === 'CONTRACT')
    );

    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(job.experienceLevel?.toLowerCase());
    const matchesMode = selectedModes.length === 0 || selectedModes.includes(job.workArrangement?.toLowerCase());

    return matchesSearch && matchesSalary && matchesLocation && matchesType && matchesLevel && matchesMode;
});

    displayPage(1);
    renderPagination();
}

    async function displayPage(page) {
    currentPage = page;
    const jobContainer = document.getElementById('jobListings');
    jobContainer.innerHTML = '';

    const start = (page - 1) * jobsPerPage;
    const end = start + jobsPerPage;
    const pageItems = filteredJobs.slice(start, end);

    if (pageItems.length === 0) {
    jobContainer.innerHTML = '<div class="text-center py-5 text-muted fw-bold">No jobs found matching your criteria.</div>';
    return;
}

    // හැම job එකකටම අදාළ company name එක fetch කරගන්නවා
    const jobsWithNames = await Promise.all(pageItems.map(async (job) => {
    const cId = (job.company && job.company.id) ? job.company.id : job.companyId;
    if (cId && !job.companyName) {
    try {
    const compRes = await fetch(`http://localhost:8080/api/company/${cId}`, {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
});
    if (compRes.ok) {
    const compData = await compRes.json();
    job.companyName = compData.companyName;
}
} catch (err) {
    console.error("Error fetching company name:", err);
}
}
    return job;
}));

    jobsWithNames.forEach(job => {
    let dateDisplay = "Recently posted";
    if (job.postedDate) {
    let date = Array.isArray(job.postedDate) ?
    new Date(job.postedDate[0], job.postedDate[1]-1, job.postedDate[2]) : new Date(job.postedDate);
    dateDisplay = timeAgo(date);
}

    const logoPath = job.logoUrl ? `http://localhost:8080/uploads/logos/${job.logoUrl}` : null;
    const logoHtml = logoPath
    ? `<img src="${logoPath}" class="rounded-4 shadow-sm" style="width: 65px; height: 65px; object-fit: cover; border: 1px solid #eee;">`
    : `<div class="company-logo bg-primary bg-opacity-10 rounded-4 p-3 me-3 d-flex align-items-center justify-content-center" style="width: 65px; height: 65px;">
            <i class="bi bi-building text-primary fs-3"></i>
           </div>`;

    const jobCard = `
        <div class="job-listing-card border p-4 mb-3 shadow-sm">
            <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex">
                    <div class="me-3">${logoHtml}</div>
                    <div>
                        <h5 class="mb-1 fw-bold">
                            <a href="job-details.html?id=${job.id}" class="text-decoration-none text-dark">${job.title}</a>
                        </h5>
                        <p class="text-muted mb-2 fw-bold small text-uppercase" style="letter-spacing: 0.5px;">${job.companyName || 'Verified Employer'}</p>
                        <div class="d-flex flex-wrap gap-2 mb-2">
                            <span class="badge bg-light text-secondary border-0 px-3 py-2" style="border-radius: 8px;"><i class="bi bi-geo-alt me-1"></i>${job.location}</span>
                            <span class="badge bg-light text-secondary border-0 px-3 py-2" style="border-radius: 8px;"><i class="bi bi-clock me-1"></i>${job.jobType}</span>
                            <span class="badge bg-success bg-opacity-10 text-success border-0 px-3 py-2" style="border-radius: 8px;">LKR ${job.salary.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                <small class="text-muted fw-medium"><i class="bi bi-calendar3 me-2 text-primary"></i>${dateDisplay}</small>
                <div class="d-flex gap-2">
                    <a href="job-details.html?id=${job.id}" class="btn btn-details btn-sm px-4">Details</a>
                    <button class="btn btn-apply-main btn-sm px-4" onclick="handleApplyClick(${job.id})">Apply Now</button>
                </div>
            </div>
        </div>`;
    jobContainer.insertAdjacentHTML('beforeend', jobCard);
});

    document.getElementById('jobCount').textContent = filteredJobs.length;
}

    function renderPagination() {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item mx-1 ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link border-0 rounded-3 shadow-sm fw-bold" href="#">${i}</a>`;
    li.onclick = (e) => {
    e.preventDefault();
    displayPage(i);
    renderPagination();
    window.scrollTo(0, 0);
};
    paginationElement.appendChild(li);
}
}

    function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m ago";
    return "Just now";
}

    function handleApplyClick(id) {
    const token = localStorage.getItem('token');
    if (!token) {
    Swal.fire({
    title: 'Login Required',
    text: 'Please login first to apply for jobs!',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#0d6efd',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Login Now'
}).then((result) => {
    if (result.isConfirmed) {
    window.location.href = 'login.html';
}
});
} else {
    window.location.href = `job-details.html?id=${id}`;
}
}
