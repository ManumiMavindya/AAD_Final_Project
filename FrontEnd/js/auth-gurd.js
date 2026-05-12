(function () {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;
    const page = path.split("/").pop();

    const publicPages = ['index.html', '', 'login.html', 'register.html'];

    const isPublicPage = publicPages.includes(page);

    if (!isPublicPage && !token) {
        window.location.href = 'login.html';
    }
})();