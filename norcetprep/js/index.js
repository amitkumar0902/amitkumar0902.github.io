// NORCET Excellence Hub - Dynamic UI Controller
class ExcellenceHub {
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
        // Topic card clicks
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const topic = e.currentTarget.dataset.topic;
                this.navigateToTopic(topic);
            });
        });

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.onclick.toString();
                if (action.includes('startMockTest')) this.startMockTest();
                if (action.includes('showRevision')) this.showRevision();
                if (action.includes('showStrategy')) this.showStrategy();
                if (action.includes('showChecklist')) this.showChecklist();
            });
        });
    }

    navigateToTopic(topic) {
        // Show loading animation
        this.showLoading();

        // Navigate to topic page
        setTimeout(() => {
            // The loading overlay will be removed when the new page loads
            window.location.href = `topics/${topic}.html`;
        }, 500);
    }

    startMockTest() {
        this.showNotification('Starting Full Mock Test...', 'info');
        setTimeout(() => {
            window.location.href = 'topics/mock-test.html';
        }, 1000);
    }

    showRevision() {
        this.showNotification('Opening Quick Revision...', 'success');
        setTimeout(() => {
            window.location.href = 'topics/revision.html';
        }, 1000);
    }

    showStrategy() {
        this.showModal('Exam Strategy', `
            <div class="strategy-content">
                <h3>🎯 Time Management Strategy</h3>
                <ul>
                    <li><strong>Nursing Section (70-75 mins):</strong> 45-50 seconds per question</li>
                    <li><strong>GK Section (15-20 mins):</strong> 1-2 minutes per question</li>
                    <li><strong>Review (20 mins):</strong> Check marked questions</li>
                </ul>

                <h3>🧠 Decision Making</h3>
                <ul>
                    <li><strong>100% Sure:</strong> Answer immediately</li>
                    <li><strong>50% Sure:</strong> Attempt (no effective negative)</li>
                    <li><strong><50% Sure:</strong> Skip (save 1/3 mark)</li>
                </ul>

                <h3>🔄 Review Strategy</h3>
                <ul>
                    <li>Mark difficult questions for review</li>
                    <li>Use last 20 minutes for review</li>
                    <li>Don't change answers unless sure</li>
                </ul>
            </div>
        `);
    }

    showChecklist() {
        this.showModal('Exam Day Checklist', `
            <div class="checklist-content">
                <h3>📋 Must Carry Items</h3>
                <div class="checklist-grid">
                    <div class="checklist-item">
                        <i class="fas fa-id-card"></i>
                        <span>Admit Card (Print + Digital)</span>
                    </div>
                    <div class="checklist-item">
                        <i class="fas fa-address-card"></i>
                        <span>Valid Photo ID Proof</span>
                    </div>
                    <div class="checklist-item">
                        <i class="fas fa-pen"></i>
                        <span>Ballpoint Pen (Blue/Black)</span>
                    </div>
                    <div class="checklist-item">
                        <i class="fas fa-camera"></i>
                        <span>Passport Size Photos (if required)</span>
                    </div>
                </div>

                <h3>🚫 Don't Carry Items</h3>
                <div class="checklist-grid">
                    <div class="checklist-item warning">
                        <i class="fas fa-mobile-alt"></i>
                        <span>Mobile Phones</span>
                    </div>
                    <div class="checklist-item warning">
                        <i class="fas fa-calculator"></i>
                        <span>Electronic Devices</span>
                    </div>
                    <div class="checklist-item warning">
                        <i class="fas fa-book"></i>
                        <span>Study Materials</span>
                    </div>
                    <div class="checklist-item warning">
                        <i class="fas fa-utensils"></i>
                        <span>Food Items (except allowed)</span>
                    </div>
                </div>
            </div>
        `);
    }

    initializeCountdown() {
        // Exam date: December 22, 2025, 10:00 AM
        const examDate = new Date('2025-12-22T10:00:00');

        const updateCountdown = () => {
            const now = new Date();
            const diff = examDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            } else {
                document.getElementById('countdown-timer').innerHTML = '<div class="exam-today">EXAM DAY!</div>';
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }

    loadProgress() {
        // Simulate progress loading
        const currentQuestions = 255;
        const targetQuestions = 475;
        const progress = (currentQuestions / targetQuestions) * 100;

        document.getElementById('current-questions').textContent = currentQuestions;
        document.getElementById('total-progress').style.width = `${progress}%`;
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        });

        document.querySelectorAll('.topic-card, .tip-card, .progress-card').forEach(card => {
            observer.observe(card);
        });
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-graduation-cap"></i>
                <p>Loading...</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('show'), 10);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
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

    init() {
        this.rotateQuotes();
        setInterval(() => this.rotateQuotes(), 10000); // Change every 10 seconds
    }

    rotateQuotes() {
        const quoteElements = document.querySelectorAll('.motivation-quote blockquote');
        const currentQuote = this.quotes[this.currentIndex];

        quoteElements.forEach(quoteEl => {
            quoteEl.style.opacity = '0';
            setTimeout(() => {
                quoteEl.innerHTML = `
                    "${currentQuote.text}"
                    <cite>— ${currentQuote.author}</cite>
                `;
                quoteEl.style.opacity = '1';
            }, 500);
        });

        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    }
}

// Remove any existing loading overlays on page load
function removeAllLoadingOverlays() {
    const overlays = document.querySelectorAll('.loading-overlay');
    overlays.forEach(overlay => overlay.remove());
}

// Handle page visibility change (back/forward navigation)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        removeAllLoadingOverlays();
    }
});

// Handle pageshow event (fires on back/forward navigation)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        removeAllLoadingOverlays();
    }
});

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        removeAllLoadingOverlays();
        new ExcellenceHub();
        new MotivationalQuotes();
    });
} else {
    removeAllLoadingOverlays();
    new ExcellenceHub();
    new MotivationalQuotes();
}
