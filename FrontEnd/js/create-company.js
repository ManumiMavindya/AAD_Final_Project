
    const token = localStorage.getItem('token');

    document.addEventListener('DOMContentLoaded', checkProfile);

    async function checkProfile() {
    try {
    const response = await fetch(`http://localhost:8080/api/company/my-company`, {
    headers: { 'Authorization': 'Bearer ' + token }
});

    if (response.ok) {
    const data = await response.json();
    if (data && data.companyName) {
    showProfile(data);
}
}
} catch (err) {
    console.log("No profile found yet.");
}
}

    function showProfile(data) {
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('viewSection').style.display = 'block';

    document.getElementById('dispName').textContent = data.companyName;
    document.getElementById('dispIndustry').textContent = data.industry;
    document.getElementById('dispLocation').textContent = data.location;
    document.getElementById('dispDesc').textContent = data.description;
    document.getElementById('dispWeb').href = data.website;
    document.getElementById('dispWeb').textContent = data.website;
    document.getElementById('dispLogo').src = `http://localhost:8080/uploads/logos/${data.logoUrl}`;
}

    function previewImage(input) {
    if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
    const img = document.getElementById('imagePreview');
    img.src = e.target.result;
    img.style.display = 'block';
    document.getElementById('uploadIcon').style.display = 'none';
    document.getElementById('uploadText').style.display = 'none';
};
    reader.readAsDataURL(input.files[0]);
}
}

    document.getElementById('companyForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData();
    const companyData = {
    companyName: document.getElementById('companyName').value,
    industry: document.getElementById('industry').value,
    location: document.getElementById('compLocation').value,
    website: document.getElementById('website').value,
    description: document.getElementById('compDescription').value,
    userId: parseInt(localStorage.getItem('userId'))
};

    formData.append('company', new Blob([JSON.stringify(companyData)], { type: 'application/json' }));

    const logoFile = document.getElementById('logoFile').files[0];
    if (logoFile) {
    formData.append('logo', logoFile);
} else {
    Swal.fire({
    icon: 'warning',
    title: 'Logo Required',
    text: 'Please upload a company logo to continue.',
    confirmButtonColor: '#0d6efd'
});
    return;
}

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

    try {
    const response = await fetch('http://localhost:8080/api/company/add', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
});

    if (response.ok) {
    Swal.fire({
    icon: 'success',
    title: 'Profile Saved!',
    text: 'Your company profile has been updated successfully. 🏢',
    confirmButtonColor: '#0d6efd'
}).then(() => {
    window.location.href = 'post-job.html';
});
} else {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Failed to save profile");
}
} catch (error) {
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error.message,
    confirmButtonColor: '#d33'
});
} finally {
    btn.disabled = false;
    btn.innerHTML = 'Save Profile';
}
});

    function toggleEdit() {
    document.getElementById('viewSection').style.display = 'none';
    document.getElementById('setupSection').style.display = 'block';
}

    function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your account!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Log Out'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    });
}
