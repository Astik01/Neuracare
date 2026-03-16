/**
 * Neuracare – Auth state & navbar (multi-page)
 * Include on every page. Sets navbar: Get Started vs Avatar dropdown.
 * Gates My Bookings: redirect to login if not logged in.
 */
(function () {
    const AUTH_KEY = 'neuracare_user';
    const REDIRECT_KEY = 'neuracare_redirect_after_login';

    function getAuthUser() {
        try {
            const raw = localStorage.getItem(AUTH_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setAuthUser(user) {
        try {
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        } catch (e) {}
    }

    function logout() {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'index.html';
    }

    function isMyBookingsPage() {
        const path = window.location.pathname || '';
        const page = path.split('/').pop() || '';
        return page === 'my-bookings.html' || page === 'my-bookings';
    }

    function initAuthGate() {
        if (!isMyBookingsPage()) return;
        const user = getAuthUser();
        if (!user) {
            sessionStorage.setItem(REDIRECT_KEY, window.location.href);
            window.location.replace('login.html');
        }
    }

    function initNavbar() {
        const user = getAuthUser();
        const getStartedWrap = document.getElementById('nav-get-started');
        const avatarWrap = document.getElementById('nav-avatar-wrap');
        const avatarDropdown = document.getElementById('nav-avatar-dropdown');
        const avatarBtn = document.getElementById('nav-avatar-btn');

        if (!getStartedWrap || !avatarWrap) return;

        if (user) {
            getStartedWrap.style.display = 'none';
            avatarWrap.style.display = 'flex';
            const initial = document.getElementById('nav-user-initial');
            if (initial && user.name) initial.textContent = (user.name.trim()[0] || 'U').toUpperCase();
        } else {
            getStartedWrap.style.display = 'flex';
            avatarWrap.style.display = 'none';
        }

        if (avatarBtn && avatarDropdown) {
            avatarBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                avatarDropdown.classList.toggle('open');
            });
            document.addEventListener('click', function () {
                avatarDropdown.classList.remove('open');
            });
        }

        const logoutBtn = document.getElementById('nav-logout');
        if (logoutBtn) logoutBtn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initAuthGate();
            initNavbar();
        });
    } else {
        initAuthGate();
        initNavbar();
    }

    window.NeuracareAuth = { getAuthUser: getAuthUser, setAuthUser: setAuthUser, logout: logout };
})();
