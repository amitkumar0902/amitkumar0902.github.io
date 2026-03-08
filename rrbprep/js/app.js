// RRB Nursing Excellence Hub - Main JavaScript

(function() {
    var KEY = 'rrb-theme';
    function getTheme() { return localStorage.getItem(KEY) || 'light'; }
    function setTheme(t) { localStorage.setItem(KEY, t); document.documentElement.setAttribute('data-theme', t); }
    function updateIcons(t) {
        var darkIcon = document.getElementById('theme-icon-dark');
        var lightIcon = document.getElementById('theme-icon-light');
        if (darkIcon && lightIcon) {
            darkIcon.style.display = t === 'dark' ? 'none' : 'inline';
            lightIcon.style.display = t === 'dark' ? 'inline' : 'none';
        }
    }
    function initTheme() {
        var t = getTheme();
        document.documentElement.setAttribute('data-theme', t);
        updateIcons(t);
    }
    function toggleTheme() {
        var t = getTheme() === 'dark' ? 'light' : 'dark';
        setTheme(t);
        updateIcons(t);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    window.RRB_toggleTheme = toggleTheme;
})();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', window.RRB_toggleTheme);

    console.log('RRB Nursing Excellence Hub loaded');
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.topic-card, .question-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
});

// Utility functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Export for use in other scripts
window.RRB = {
    formatTime: formatTime
};
