(function () {
    const STORAGE_KEY = 'neuracare_dark_mode';
    const toggle = document.getElementById('dark-mode-toggle');
    const icon = toggle ? toggle.querySelector('i') : null;

    function getDark() {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function setDark(on) {
        try {
            localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
        } catch (e) {}
        document.body.classList.toggle('dark-mode', on);
        if (icon) {
            icon.className = on ? 'fas fa-sun' : 'fas fa-moon';
        }
        if (toggle) toggle.setAttribute('aria-label', on ? 'Switch to light mode' : 'Toggle dark mode');
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            setDark(!getDark());
        });
    }

    setDark(getDark());
})();
