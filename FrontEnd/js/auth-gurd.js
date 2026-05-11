(function () {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;
    const page = path.split("/").pop(); // දැනට ඉන්න page එකේ නම ගන්නවා

    // 1. Log නොවී යන්න අවසර තියෙන පිටු ලැයිස්තුව (White-list)
    // index.html හෝ මුකුත්ම නැති (root) වෙලාවට විතරක් අවසර දෙනවා
    const publicPages = ['index.html', '', 'login.html', 'register.html'];

    const isPublicPage = publicPages.includes(page);

    // 2. Security Logic එක
    // පබ්ලික් පිටුවක් නෙවෙයි නම් සහ Token එකක් නැත්නම්, වහාම Login එකට හරවා යවනවා
    if (!isPublicPage && !token) {
        window.location.href = 'login.html';
    }
})();