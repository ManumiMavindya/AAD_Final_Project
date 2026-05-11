
    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-bs-theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    localStorage.setItem('theme', newTheme);
});

    // Back to Top Logic
    const backToTop = document.getElementById('backToTop');
    window.onscroll = () => {
    if (window.scrollY > 400) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
};
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    async function loadCompanyLogos() {
    try {
    const response = await fetch('http://localhost:8080/api/company/names'); // ඔයාගේ API URL එක මෙතනට දාන්න
    const companyNames = await response.json();

    const wrapper = document.getElementById('company-marquee');

    // Marquee එක දිගටම කැරකෙන්න නම් මේ ලිස්ට් එක දෙපාරක් (Double) කරන්න ඕනේ
    const createGroup = (names) => {
    const group = document.createElement('div');
    group.className = 'marquee-group';
    names.forEach(name => {
    const span = document.createElement('span');
    span.className = 'marquee-item';
    span.textContent = name.toUpperCase(); // ඔක්කොම Capital වෙන්න
    group.appendChild(span);
});
    return group;
};

    // පේළි දෙකම ඇඩ් කරනවා infinite loop එක වැඩ කරන්න
    wrapper.appendChild(createGroup(companyNames));
    wrapper.appendChild(createGroup(companyNames));

} catch (error) {
    console.error("Error loading company names:", error);
}
}

    // Page එක load වෙද්දීම මේක call කරන්න
    document.addEventListener('DOMContentLoaded', loadCompanyLogos);

