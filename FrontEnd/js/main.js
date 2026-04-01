// JobHub - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSidebar();
    initJobFilters();
    initSaveJobs();
    initResumeUpload();
    initFormValidation();
    initSearchSuggestions();
    initNotifications();
});

// Sidebar Toggle for Mobile
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            if (overlay) overlay.classList.toggle('show');
        });

        if (overlay) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            });
        }
    }
}

// Job Filters
function initJobFilters() {
    const filterForm = document.getElementById('filterForm');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortJobs');

    if (filterForm) {
        filterForm.addEventListener('change', function() {
            applyFilters();
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            const inputs = filterForm.querySelectorAll('input[type="checkbox"], input[type="radio"]');
            inputs.forEach(input => input.checked = false);

            const selects = filterForm.querySelectorAll('select');
            selects.forEach(select => select.selectedIndex = 0);

            const ranges = filterForm.querySelectorAll('input[type="range"]');
            ranges.forEach(range => range.value = range.defaultValue);

            applyFilters();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortJobs(this.value);
        });
    }

    // Salary range slider
    const salaryRange = document.getElementById('salaryRange');
    const salaryValue = document.getElementById('salaryValue');

    if (salaryRange && salaryValue) {
        salaryRange.addEventListener('input', function() {
            salaryValue.textContent = '$' + Number(this.value).toLocaleString();
        });
    }
}

function applyFilters() {
    const jobCards = document.querySelectorAll('.job-listing-card');
    const filters = getActiveFilters();

    jobCards.forEach(card => {
        const matchesFilters = checkJobMatchesFilters(card, filters);
        card.style.display = matchesFilters ? 'block' : 'none';
    });

    updateJobCount();
}

function getActiveFilters() {
    const filters = {
        jobTypes: [],
        locations: [],
        experience: [],
        salary: 0
    };

    document.querySelectorAll('input[name="jobType"]:checked').forEach(cb => {
        filters.jobTypes.push(cb.value);
    });

    document.querySelectorAll('input[name="location"]:checked').forEach(cb => {
        filters.locations.push(cb.value);
    });

    document.querySelectorAll('input[name="experience"]:checked').forEach(cb => {
        filters.experience.push(cb.value);
    });

    const salaryRange = document.getElementById('salaryRange');
    if (salaryRange) {
        filters.salary = parseInt(salaryRange.value);
    }

    return filters;
}

function checkJobMatchesFilters(card, filters) {
    const jobType = card.dataset.jobType;
    const location = card.dataset.location;
    const experience = card.dataset.experience;
    const salary = parseInt(card.dataset.salary) || 0;

    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(jobType)) {
        return false;
    }

    if (filters.locations.length > 0 && !filters.locations.includes(location)) {
        return false;
    }

    if (filters.experience.length > 0 && !filters.experience.includes(experience)) {
        return false;
    }

    if (filters.salary > 0 && salary < filters.salary) {
        return false;
    }

    return true;
}

function sortJobs(sortBy) {
    const container = document.getElementById('jobListings');
    if (!container) return;

    const jobs = Array.from(container.querySelectorAll('.job-listing-card'));

    jobs.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            case 'oldest':
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            case 'salary-high':
                return parseInt(b.dataset.salary) - parseInt(a.dataset.salary);
            case 'salary-low':
                return parseInt(a.dataset.salary) - parseInt(b.dataset.salary);
            default:
                return 0;
        }
    });

    jobs.forEach(job => container.appendChild(job));
}

function updateJobCount() {
    const visibleJobs = document.querySelectorAll('.job-listing-card[style="display: block"], .job-listing-card:not([style])');
    const countElement = document.getElementById('jobCount');

    if (countElement) {
        countElement.textContent = visibleJobs.length;
    }
}

// Save Jobs Functionality
function initSaveJobs() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.save-job-btn')) {
            const btn = e.target.closest('.save-job-btn');
            toggleSaveJob(btn);
        }
    });
}

function toggleSaveJob(btn) {
    const jobId = btn.dataset.jobId;
    const icon = btn.querySelector('i');
    const isSaved = btn.classList.contains('saved');

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });

    if (isSaved) {
        btn.classList.remove('saved');
        icon.classList.remove('bi-bookmark-fill');
        icon.classList.add('bi-bookmark');
        btn.title = 'Save Job';
        removeFromSavedJobs(jobId);
        Toast.fire({ icon: 'info', title: 'Removed from saved jobs' });
    } else {
        btn.classList.add('saved');
        icon.classList.remove('bi-bookmark');
        icon.classList.add('bi-bookmark-fill');
        btn.title = 'Unsave Job';
        addToSavedJobs(jobId);
        Toast.fire({ icon: 'success', title: 'Job saved successfully!' });
    }
}

function addToSavedJobs(jobId) {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    }
}

function removeFromSavedJobs(jobId) {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    savedJobs = savedJobs.filter(id => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
}

function isSavedJob(jobId) {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    return savedJobs.includes(jobId);
}

// Resume Upload
function initResumeUpload() {
    const uploadArea = document.querySelector('.resume-upload-area');
    const fileInput = document.getElementById('resumeFile');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleResumeUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleResumeUpload(fileInput.files[0]);
            }
        });
    }
}

function handleResumeUpload(file) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please upload a PDF or Word document' });
        return;
    }

    if (file.size > maxSize) {
        Swal.fire({ icon: 'error', title: 'File Too Large', text: 'File size must be less than 5MB' });
        return;
    }

    const uploadArea = document.querySelector('.resume-upload-area');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <div class="upload-success">
                <i class="bi bi-file-earmark-check text-success fs-1 mb-2"></i>
                <h6 class="fw-semibold">${file.name}</h6>
                <p class="text-muted small mb-2">${(file.size / 1024).toFixed(1)} KB</p>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="resetResumeUpload()">Remove</button>
            </div>
        `;
    }

    Swal.fire({ icon: 'success', title: 'Uploaded!', text: 'Resume uploaded successfully!', timer: 2000, showConfirmButton: false });
}

function resetResumeUpload() {
    const uploadArea = document.querySelector('.resume-upload-area');
    const fileInput = document.getElementById('resumeFile');

    if (uploadArea) {
        uploadArea.innerHTML = `
            <div class="upload-icon">
                <i class="bi bi-cloud-arrow-up"></i>
            </div>
            <h6 class="fw-semibold mb-1">Upload Your Resume</h6>
            <p class="text-muted small mb-2">Drag & drop or click to browse</p>
            <p class="text-muted small">PDF, DOC, DOCX (Max 5MB)</p>
        `;
    }

    if (fileInput) {
        fileInput.value = '';
    }
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Search Suggestions
function initSearchSuggestions() {
    const searchInput = document.getElementById('jobSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');

    if (searchInput && suggestionsContainer) {
        const suggestions = [
            'Software Engineer', 'Product Manager', 'UX Designer', 'Data Analyst',
            'Marketing Manager', 'Sales Representative', 'Project Manager',
            'DevOps Engineer', 'Frontend Developer', 'Backend Developer'
        ];

        searchInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length < 2) {
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
                return;
            }

            const matches = suggestions.filter(s => s.toLowerCase().includes(value));
            if (matches.length > 0) {
                suggestionsContainer.innerHTML = matches.map(match => `
                    <a href="#" class="list-group-item list-group-item-action" onclick="selectSuggestion('${match}'); return false;">
                        <i class="bi bi-search me-2 text-muted"></i>${match}
                    </a>
                `).join('');
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }
}

function selectSuggestion(value) {
    const searchInput = document.getElementById('jobSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (searchInput) searchInput.value = value;
    if (suggestionsContainer) suggestionsContainer.style.display = 'none';
}

// Toast Notifications (Integrated with SweetAlert2)
function showToast(message, type = 'info') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true
    });

    Toast.fire({ icon: type, title: message });
}

// Initialize Notifications
function initNotifications() {
    const notificationBtns = document.querySelectorAll('.notification-btn');
    notificationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const badge = this.querySelector('.badge');
            if (badge) badge.style.display = 'none';
        });
    });
}

// Application Modal
function openApplyModal(jobId, jobTitle) {
    const modal = document.getElementById('applyModal');
    const jobTitleElement = modal.querySelector('#applyJobTitle');
    if (jobTitleElement) jobTitleElement.textContent = jobTitle;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function submitApplication(e) {
    e.preventDefault();

    Swal.fire({
        title: 'Submitting...',
        text: 'Please wait while we process your application.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    setTimeout(() => {
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Application submitted successfully!', confirmButtonColor: '#0d6efd' });
        const modal = bootstrap.Modal.getInstance(document.getElementById('applyModal'));
        if (modal) modal.hide();
        e.target.reset();
        resetResumeUpload();
    }, 1500);
}

// Status Update
function updateApplicationStatus(applicationId, newStatus) {
    Swal.fire({
        title: 'Update Status?',
        text: `Are you sure you want to mark this as ${newStatus}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Yes, update'
    }).then((result) => {
        if (result.isConfirmed) {
            showToast(`Status updated to ${newStatus}`, 'success');
            const statusBadge = document.querySelector(`[data-application-id="${applicationId}"] .status-badge`);
            if (statusBadge) {
                statusBadge.className = `status-badge ${newStatus.toLowerCase()}`;
                statusBadge.textContent = newStatus;
            }
        }
    });
}

// Export functions
window.JobHub = {
    showToast,
    openApplyModal,
    submitApplication,
    updateApplicationStatus,
    toggleSaveJob,
    resetResumeUpload
};