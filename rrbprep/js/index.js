// RRB Nursing Excellence Hub - Dynamic UI Controller
class RRBHub {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCountdown();
        this.loadProgress();
        this.setupAnimations();
    }

    setupEventListeners() {
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const topic = e.currentTarget.dataset.topic;
                this.navigateToTopic(topic);
            });
        });
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = (e.currentTarget.onclick || e.currentTarget.getAttribute('onclick') || '').toString();
                if (action.includes('startMockTest')) this.startMockTest();
                if (action.includes('showRevision')) this.showRevision();
                if (action.includes('showStrategy')) this.showStrategy();
                if (action.includes('showChecklist')) this.showChecklist();
                if (action.includes('showStudyPlan')) this.showStudyPlan();
            });
        });
    }

    navigateToTopic(topic) {
        this.showLoading();
        setTimeout(() => { window.location.href = `topics/${topic}.html`; }, 500);
    }

    startMockTest() {
        this.showNotification('Starting Full Mock Test...', 'info');
        setTimeout(() => { window.location.href = 'topics/mock-test.html'; }, 1000);
    }

    showRevision() {
        this.showNotification('Opening Quick Revision...', 'success');
        setTimeout(() => { window.location.href = 'topics/revision.html'; }, 1000);
    }

    showStudyPlan() {
        this.showNotification('Opening Study Plan...', 'info');
        setTimeout(() => { window.location.href = 'topics/study-plan.html'; }, 500);
    }

    showStrategy() {
        this.showModal('RRB Exam Strategy', `
            <div class="strategy-content">
                <h3>Time Management (90 Minutes)</h3>
                <ul>
                    <li><strong>Professional Ability (60 min):</strong> 70 questions at ~51 sec each</li>
                    <li><strong>General Awareness (10 min):</strong> 10 questions at ~60 sec each</li>
                    <li><strong>Arithmetic + Reasoning (10 min):</strong> 10 questions at ~60 sec each</li>
                    <li><strong>General Science (5 min):</strong> 10 questions at ~30 sec each</li>
                    <li><strong>Review (5 min):</strong> Check marked questions</li>
                </ul>
                <h3>Decision Making (1/3 Negative Marking)</h3>
                <ul>
                    <li><strong>100% Sure:</strong> Answer immediately (+1 mark)</li>
                    <li><strong>75%+ Sure:</strong> Attempt (expected value positive)</li>
                    <li><strong>50% Sure:</strong> Skip (marginal)</li>
                    <li><strong>&lt;50% Sure:</strong> Strictly skip (saves 1/3 mark)</li>
                </ul>
                <h3>Section Order Strategy</h3>
                <ul>
                    <li>Start with Professional Ability (your strongest, most marks)</li>
                    <li>Then General Science (quick factual recall)</li>
                    <li>Then General Awareness</li>
                    <li>End with Arithmetic + Reasoning (most time-consuming)</li>
                </ul>
            </div>
        `);
    }

    showChecklist() {
        this.showModal('RRB Exam Day Checklist', `
            <div class="checklist-content">
                <h3>Must Carry Items (RRB CBT)</h3>
                <div class="checklist-grid">
                    <div class="checklist-item">
                        <i class="fas fa-id-card"></i>
                        <span>RRB Admit Card (CEN 03/2025) - Print + Digital</span>
                    </div>
                    <div class="checklist-item">
                        <i class="fas fa-address-card"></i>
                        <span>Valid Photo ID (Aadhaar / PAN / Passport / Driving Licence)</span>
                    </div>
                    <div class="checklist-item">
                        <i class="fas fa-pen"></i>
                        <span>Ballpoint Pen (Blue/Black) for rough work</span>
                    </div>
                    <div class="checklist-item">
                        <i class="fas fa-camera"></i>
                        <span>Passport Size Photos (if required as per admit card)</span>
                    </div>
                </div>
                <h3>Do Not Carry</h3>
                <div class="checklist-grid">
                    <div class="checklist-item warning">
                        <i class="fas fa-mobile-alt"></i>
                        <span>Mobile Phones / Smartwatches</span>
                    </div>
                    <div class="checklist-item warning">
                        <i class="fas fa-calculator"></i>
                        <span>Electronic Devices</span>
                    </div>
                    <div class="checklist-item warning">
                        <i class="fas fa-book"></i>
                        <span>Study Materials / Notes</span>
                    </div>
                    <div class="checklist-item warning">
                        <i class="fas fa-utensils"></i>
                        <span>Food (except if permitted)</span>
                    </div>
                </div>
                <p style="margin-top:1rem;font-size:0.9em;color:var(--gray-600);">Reach exam center 1 hour early. PwBD candidates get 120 minutes.</p>
            </div>
        `);
    }

    initializeCountdown() {
        const examDate = new Date('2026-03-12T10:00:00');
        const updateCountdown = () => {
            const now = new Date();
            const diff = examDate - now;
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const countdownEl = document.getElementById('countdown-timer');
            if (!countdownEl) return;
            if (diff > 0 && daysEl && hoursEl && minutesEl) {
                daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
                hoursEl.textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                minutesEl.textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            } else if (diff <= 0) {
                countdownEl.innerHTML = '<div class="exam-today">EXAM DAY!</div>';
            }
        };
        updateCountdown();
        setInterval(updateCountdown, 60000);
    }

    loadProgress() {
        const currentQuestions = 525;
        const targetQuestions = 525;
        const progress = (currentQuestions / targetQuestions) * 100;
        const currentEl = document.getElementById('current-questions');
        const progressEl = document.getElementById('total-progress');
        if (currentEl) currentEl.textContent = currentQuestions;
        if (progressEl) progressEl.style.width = `${progress}%`;
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate-in'); });
        });
        document.querySelectorAll('.topic-card, .tip-card, .progress-card').forEach(card => observer.observe(card));
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = '<div class="loading-spinner"><i class="fas fa-graduation-cap"></i><p>Loading...</p></div>';
        document.body.appendChild(loading);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => { notification.classList.remove('show'); setTimeout(() => notification.remove(), 300); }, 3000);
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { modal.classList.remove('show'); setTimeout(() => modal.remove(), 300); }
        });
    }
}

// Motivational Quotes Rotator
class MotivationalQuotes {
    constructor() {
        this.quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
            { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
            { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" }
        ];
        this.currentIndex = 0;
        this.init();
    }
    init() { this.rotateQuotes(); setInterval(() => this.rotateQuotes(), 10000); }
    rotateQuotes() {
        const quoteElements = document.querySelectorAll('.motivation-quote blockquote');
        const currentQuote = this.quotes[this.currentIndex];
        quoteElements.forEach(quoteEl => {
            quoteEl.style.opacity = '0';
            setTimeout(() => {
                quoteEl.innerHTML = `"${currentQuote.text}" <cite>— ${currentQuote.author}</cite>`;
                quoteEl.style.opacity = '1';
            }, 500);
        });
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    }
}

function removeAllLoadingOverlays() {
    document.querySelectorAll('.loading-overlay').forEach(overlay => overlay.remove());
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) removeAllLoadingOverlays(); });
window.addEventListener('pageshow', (event) => { if (event.persisted) removeAllLoadingOverlays(); });

var rrbHubInstance;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        removeAllLoadingOverlays();
        rrbHubInstance = new RRBHub();
        new MotivationalQuotes();
    });
} else {
    removeAllLoadingOverlays();
    rrbHubInstance = new RRBHub();
    new MotivationalQuotes();
}
window.startMockTest = function() { if (rrbHubInstance) rrbHubInstance.startMockTest(); };
window.showRevision = function() { if (rrbHubInstance) rrbHubInstance.showRevision(); };
window.showStrategy = function() { if (rrbHubInstance) rrbHubInstance.showStrategy(); };
window.showChecklist = function() { if (rrbHubInstance) rrbHubInstance.showChecklist(); };
window.showStudyPlan = function() { if (rrbHubInstance) rrbHubInstance.showStudyPlan(); }
