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

    if (isSaved) {
        btn.classList.remove('saved');
        icon.classList.remove('bi-bookmark-fill');
        icon.classList.add('bi-bookmark');
        btn.title = 'Save Job';
        removeFromSavedJobs(jobId);
        showToast('Job removed from saved jobs', 'info');
    } else {
        btn.classList.add('saved');
        icon.classList.remove('bi-bookmark');
        icon.classList.add('bi-bookmark-fill');
        btn.title = 'Unsave Job';
        addToSavedJobs(jobId);
        showToast('Job saved successfully!', 'success');
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
        showToast('Please upload a PDF or Word document', 'error');
        return;
    }

    if (file.size > maxSize) {
        showToast('File size must be less than 5MB', 'error');
        return;
    }

    // Show uploaded file info
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

    showToast('Resume uploaded successfully!', 'success');
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

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');

    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordStrengthUI(strength, strengthIndicator);
        });
    }

    // Confirm password validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (passwordInput && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return Math.min(strength, 4);
}

function updatePasswordStrengthUI(strength, indicator) {
    const levels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['#ef4444', '#f59e0b', '#fbbf24', '#22c55e', '#16a34a'];

    indicator.innerHTML = `
        <div class="progress-bar-custom mt-2">
            <div class="progress-fill" style="width: ${(strength / 4) * 100}%; background-color: ${colors[strength]}"></div>
        </div>
        <small class="text-muted">${levels[strength]}</small>
    `;
}

// Search Suggestions
function initSearchSuggestions() {
    const searchInput = document.getElementById('jobSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');

    if (searchInput && suggestionsContainer) {
        const suggestions = [
            'Software Engineer',
            'Product Manager',
            'UX Designer',
            'Data Analyst',
            'Marketing Manager',
            'Sales Representative',
            'Project Manager',
            'DevOps Engineer',
            'Frontend Developer',
            'Backend Developer'
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

        // Hide suggestions when clicking outside
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

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();

    const toastId = 'toast-' + Date.now();
    const iconMap = {
        success: 'bi-check-circle-fill text-success',
        error: 'bi-exclamation-circle-fill text-danger',
        warning: 'bi-exclamation-triangle-fill text-warning',
        info: 'bi-info-circle-fill text-primary'
    };

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'toast show fade-in';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header">
            <i class="bi ${iconMap[type]} me-2"></i>
            <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);

    // Close button functionality
    toast.querySelector('.btn-close').addEventListener('click', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1100';
    document.body.appendChild(container);
    return container;
}

// Initialize Notifications
function initNotifications() {
    const notificationBtns = document.querySelectorAll('.notification-btn');

    notificationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const badge = this.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    });
}

// Application Modal
function openApplyModal(jobId, jobTitle) {
    const modal = document.getElementById('applyModal');
    const jobTitleElement = modal.querySelector('#applyJobTitle');

    if (jobTitleElement) {
        jobTitleElement.textContent = jobTitle;
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function submitApplication(e) {
    e.preventDefault();

    // Simulate application submission
    showToast('Application submitted successfully!', 'success');

    const modal = bootstrap.Modal.getInstance(document.getElementById('applyModal'));
    if (modal) {
        modal.hide();
    }

    // Reset form
    e.target.reset();
    resetResumeUpload();
}

// Status Update (for employer/admin dashboards)
function updateApplicationStatus(applicationId, newStatus) {
    // Simulate status update
    showToast(`Application status updated to ${newStatus}`, 'success');

    // Update UI
    const statusBadge = document.querySelector(`[data-application-id="${applicationId}"] .status-badge`);
    if (statusBadge) {
        statusBadge.className = `status-badge ${newStatus.toLowerCase()}`;
        statusBadge.textContent = newStatus;
    }
}

// Charts initialization (for dashboards)
function initCharts() {
    // This is a placeholder for chart initialization
    // In a real implementation, you would use a charting library like Chart.js
}

// Export functions for use in other files
window.JobHub = {
    showToast,
    openApplyModal,
    submitApplication,
    updateApplicationStatus,
    toggleSaveJob,
    resetResumeUpload
};
