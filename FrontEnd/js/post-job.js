let currentCompanyId = null;

async function getCompanyId() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // userId එක ගන්නවා

    if (!userId || userId === "undefined") {
        console.error("User ID found as undefined. Please login again.");
        return;
    }

    try {
        // userId එක පාවිච්චි කරලා Company එක ඉල්ලනවා
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
        console.error("Company ID එක ගන්න බැරි වුණා:", err);
    }
}

document.addEventListener('DOMContentLoaded', getCompanyId);

// Submit logic එක ඔයාගේ විදිහටම තියන්න...

// පිටුව load වුණු ගමන් ID එක ගන්න
document.addEventListener('DOMContentLoaded', getCompanyId);

document.getElementById('postJobForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    // currentCompanyId එක තාම ලැබිලා නැත්නම් error එකක් පෙන්වන්න
    if (!currentCompanyId) {
        alert("Please set up your company profile first!");
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
        // මෙන්න මේක තමයි වැදගත්ම දේ
        companyId: currentCompanyId
    };

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
                alert('Job published successfully! 🚀');
                window.location.href = 'employer-dashboard.html';
            } else {
                alert('Failed to publish job. Check your connection or login again.');
            }
        })
        .catch(err => console.error("Error:", err));
});