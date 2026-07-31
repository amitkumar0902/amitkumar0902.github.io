// NORCET Topic Page Controller
class TopicController {
    constructor() {
        this.currentTopic = this.getCurrentTopic();
        this.questions = [];
        this.listenersAttached = false;
        this.init();
    }

    init() {
        // Wait a bit to ensure DOM is fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            // Use setTimeout to ensure all elements are rendered
            setTimeout(() => this.initializeComponents(), 100);
        }
    }

    initializeComponents() {
        // Remove any existing loading overlays first
        this.removeLoadingOverlays();
        
        console.log('Initializing TopicController components...');
        const optionCount = document.querySelectorAll('.option').length;
        const buttonCount = document.querySelectorAll('.show-answer-btn').length;
        console.log(`Found ${optionCount} options and ${buttonCount} show-answer buttons`);
        
        if (!this.listenersAttached) {
            console.log('Setting up event listeners...');
            this.setupAnswerSelection();
            this.setupAnswerReveals();
            this.listenersAttached = true;
            console.log('Event listeners attached');
        }
        this.setupEventListeners();
        this.loadSavedAnswers();
        console.log('Initialization complete');
    }

    removeLoadingOverlays() {
        // Remove any existing loading overlays that might be stuck
        const existingOverlays = document.querySelectorAll('.loading-overlay');
        existingOverlays.forEach(overlay => {
            overlay.remove();
        });
    }

    getCurrentTopic() {
        const path = window.location.pathname;
        const topic = path.split('/').pop().replace('.html', '');
        return topic;
    }

    loadQuestions() {
        // Questions are already in the HTML, no need to reload
    }

    setupEventListeners() {
        // Navigation buttons
        const nextBtn = document.querySelector('[onclick*="nextTopic"]');
        const prevBtn = document.querySelector('[onclick*="previousTopic"]');
        const quizBtn = document.querySelector('[onclick*="practiceQuiz"]');

        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateToNext());
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateToPrevious());
        if (quizBtn) quizBtn.addEventListener('click', () => this.startPracticeQuiz());
    }

    setupAnswerReveals() {
        // Add show answer button functionality - use event delegation
        // Bind to preserve 'this' context
        this.handleShowAnswerClick = this.handleShowAnswerClick.bind(this);
        document.addEventListener('click', this.handleShowAnswerClick);
        console.log('Show answer button listeners attached');
    }

    handleShowAnswerClick(e) {
        const btn = e.target.closest('.show-answer-btn');
        if (!btn) return;

        console.log('Show answer button clicked');
        e.stopPropagation();

        const questionCard = btn.closest('.question-card');
        if (!questionCard) {
            console.error('Question card not found');
            return;
        }

        const explanation = questionCard.querySelector('.answer-explanation');
        if (!explanation) {
            console.error('Answer explanation not found');
            return;
        }

        const options = questionCard.querySelectorAll('.option');
        // Check if explanation is hidden
        const computedStyle = window.getComputedStyle(explanation);
        const isHidden = computedStyle.display === 'none' || 
                        explanation.style.display === 'none' ||
                        (!explanation.classList.contains('show') && explanation.style.display === '');

        if (isHidden) {
            // Show explanation
            explanation.classList.add('show');
            explanation.style.display = 'block';
            btn.textContent = 'Hide Answer';
            btn.classList.add('active');

            // Highlight correct answer
            try {
                const correctAnswer = explanation.querySelector('.correct-answer');
                if (correctAnswer) {
                    const answerText = correctAnswer.textContent;
                    let correctOption = null;

                    // Pattern 1: "Correct Answer: B)"
                    const match1 = answerText.match(/Correct Answer:\s*([A-D])\)/i);
                    if (match1) {
                        correctOption = match1[1].toLowerCase();
                    }

                    // Pattern 2: Just find any A-D letter
                    if (!correctOption) {
                        const match2 = answerText.match(/([A-D])/i);
                        if (match2) {
                            correctOption = match2[1].toLowerCase();
                        }
                    }

                    if (correctOption) {
                        options.forEach(opt => {
                            opt.classList.remove('correct', 'incorrect');
                            if (opt.dataset.option === correctOption) {
                                opt.classList.add('correct');
                            } else if (opt.classList.contains('selected') && opt.dataset.option !== correctOption) {
                                // Mark selected wrong answer as incorrect
                                opt.classList.add('incorrect');
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error highlighting answer:', error);
            }
        } else {
            // Hide explanation
            explanation.classList.remove('show');
            explanation.style.display = 'none';
            btn.textContent = 'Show Answer';
            btn.classList.remove('active');

            // Remove highlights (but keep selected state)
            options.forEach(opt => {
                if (!opt.classList.contains('selected')) {
                    opt.classList.remove('correct', 'incorrect');
                }
            });
        }
    }

    setupAnswerSelection() {
        // Use event delegation for better reliability and dynamic content
        // Bind to preserve 'this' context
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleOptionDblClick = this.handleOptionDblClick.bind(this);
        document.addEventListener('click', this.handleOptionClick);
        document.addEventListener('dblclick', this.handleOptionDblClick);
        console.log('Option selection listeners attached');
    }

    handleOptionClick(e) {
        // Don't handle if clicking on show-answer-btn
        if (e.target.closest('.show-answer-btn')) return;

        const option = e.target.closest('.option');
        if (!option) return;

        console.log('Option clicked:', option.dataset.option);
        e.stopPropagation();

        const questionCard = option.closest('.question-card');
        if (!questionCard) return;

        const allOptions = questionCard.querySelectorAll('.option');
        const selectedOption = option.dataset.option;
        const questionNumber = questionCard.dataset.question;

        // Remove previous selections
        allOptions.forEach(opt => {
            opt.classList.remove('selected', 'incorrect');
            // Keep 'correct' class if answer was shown
        });

        // Mark as selected
        option.classList.add('selected');

        // Check if answer is shown and mark incorrect if wrong
        const explanation = questionCard.querySelector('.answer-section.show');
        if (explanation) {
            const correctAnswer = explanation.querySelector('.correct-answer');
            if (correctAnswer) {
                const answerText = correctAnswer.textContent;
                // Extract correct answer letter (A, B, C, or D)
                const match = answerText.match(/Correct Answer:\s*([A-D])\)/i) || answerText.match(/([A-D])/i);
                if (match) {
                    const correctOption = match[1].toLowerCase();
                    // If selected option doesn't match correct answer, mark as incorrect
                    if (selectedOption !== correctOption) {
                        option.classList.add('incorrect');
                    }
                }
            }
        }

        // Show feedback
        this.showSelectionFeedback(questionCard, selectedOption);

        // Store the answer
        this.saveAnswer(questionNumber, selectedOption);
    }

    handleOptionDblClick(e) {
        const option = e.target.closest('.option');
        if (!option) return;

        e.preventDefault();
        e.stopPropagation();

        const questionCard = option.closest('.question-card');
        if (!questionCard) return;

        const questionNumber = questionCard.dataset.question;

        // Clear selection
        questionCard.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'incorrect');
            // Keep 'correct' class if answer was shown
        });

        // Remove from storage
        this.clearAnswer(questionNumber);

        // Show feedback
        this.showNotification('Answer cleared', 'info');
    }

    showSelectionFeedback(questionCard, selectedOption) {
        // You can add visual feedback here
        const feedback = document.createElement('div');
        feedback.className = 'selection-feedback';
        feedback.textContent = `You selected option ${selectedOption.toUpperCase()}`;
        feedback.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--primary-color);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        `;

        // Remove existing feedback
        const existingFeedback = questionCard.querySelector('.selection-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        questionCard.appendChild(feedback);

        // Remove feedback after 2 seconds
        setTimeout(() => {
            feedback.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    saveAnswer(questionNumber, answer) {
        // Store answers in localStorage for persistence
        const answers = JSON.parse(localStorage.getItem('topicAnswers') || '{}');
        answers[`${this.currentTopic}-${questionNumber}`] = answer;
        localStorage.setItem('topicAnswers', JSON.stringify(answers));

        // Update progress
        this.updateProgress();
    }

    clearAnswer(questionNumber) {
        // Remove answer from localStorage
        const answers = JSON.parse(localStorage.getItem('topicAnswers') || '{}');
        delete answers[`${this.currentTopic}-${questionNumber}`];
        localStorage.setItem('topicAnswers', JSON.stringify(answers));

        // Update progress
        this.updateProgress();
    }

    loadSavedAnswers() {
        const answers = JSON.parse(localStorage.getItem('topicAnswers') || '{}');

        document.querySelectorAll('.question-card').forEach(card => {
            const questionNumber = card.dataset.question;
            const savedAnswer = answers[`${this.currentTopic}-${questionNumber}`];

            if (savedAnswer) {
                const option = card.querySelector(`[data-option="${savedAnswer}"]`);
                if (option) {
                    option.classList.add('selected');
                    
                    // Check if answer is shown and mark incorrect if wrong
                    const explanation = card.querySelector('.answer-section.show');
                    if (explanation) {
                        const correctAnswer = explanation.querySelector('.correct-answer');
                        if (correctAnswer) {
                            const answerText = correctAnswer.textContent;
                            const match = answerText.match(/Correct Answer:\s*([A-D])\)/i) || answerText.match(/([A-D])/i);
                            if (match) {
                                const correctOption = match[1].toLowerCase();
                                if (savedAnswer !== correctOption) {
                                    option.classList.add('incorrect');
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    updateProgress() {
        const totalQuestions = document.querySelectorAll('.question-card').length;
        const answers = JSON.parse(localStorage.getItem('topicAnswers') || '{}');
        const answeredCount = Object.keys(answers).filter(key => key.startsWith(`${this.currentTopic}-`)).length;

        // You can add a progress indicator here
        console.log(`Progress: ${answeredCount}/${totalQuestions} questions answered`);
    }

    navigateToNext() {
        const topicOrder = [
            'foundations', 'medical-surgical', 'pediatric', 'obstetric-gynecology', 'community-health',
            'psychiatric', 'gk-current-affairs', 'reasoning-aptitude', 'mock-test', 'revision'
        ];

        const currentIndex = topicOrder.indexOf(this.currentTopic);
        if (currentIndex < topicOrder.length - 1) {
            const nextTopic = topicOrder[currentIndex + 1];
            this.showLoadingTransition(`topics/${nextTopic}.html`);
        }
    }

    navigateToPrevious() {
        const topicOrder = [
            'foundations', 'medical-surgical', 'pediatric', 'obstetric-gynecology', 'community-health',
            'psychiatric', 'gk-current-affairs', 'reasoning-aptitude', 'mock-test', 'revision'
        ];

        const currentIndex = topicOrder.indexOf(this.currentTopic);
        if (currentIndex > 0) {
            const prevTopic = topicOrder[currentIndex - 1];
            this.showLoadingTransition(`topics/${prevTopic}.html`);
        }
    }

    startPracticeQuiz() {
        // Create a mini quiz from current topic questions
        const questions = Array.from(document.querySelectorAll('.question-card'));
        if (questions.length === 0) return;

        this.showNotification('Starting practice quiz...', 'info');
        setTimeout(() => {
            // For now, just show a message. Could be enhanced to create actual quiz
            this.showNotification('Practice quiz feature coming soon! 📝', 'info');
        }, 1000);
    }

    showLoadingTransition(url) {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-graduation-cap"></i>
                <p>Loading next topic...</p>
            </div>
        `;
        document.body.appendChild(loading);

        setTimeout(() => {
            window.location.href = url;
        }, 800);
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
}

// Motivational Quotes Rotator for Topic Pages
class TopicQuotes {
    constructor() {
        this.quotes = [
            { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
            { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
            { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
            { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
        ];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.rotateQuotes();
        setInterval(() => this.rotateQuotes(), 15000); // Change every 15 seconds
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

// Progress Tracker
class TopicProgress {
    constructor() {
        this.topicOrder = [
            'foundations', 'medical-surgical', 'pediatric', 'obstetric-gynecology', 'community-health',
            'psychiatric', 'gk-current-affairs', 'reasoning-aptitude', 'mock-test', 'revision'
        ];
        this.init();
    }

    init() {
        this.updateProgress();
    }

    updateProgress() {
        const currentTopic = this.getCurrentTopic();
        const currentIndex = this.topicOrder.indexOf(currentTopic);

        if (currentIndex !== -1) {
            const progress = ((currentIndex + 1) / this.topicOrder.length) * 100;
            // Could update progress bar if added to UI
        }
    }

    getCurrentTopic() {
        const path = window.location.pathname;
        return path.split('/').pop().replace('.html', '');
    }
}

// Initialize when DOM is loaded
// Remove any existing loading overlays first
function removeAllLoadingOverlays() {
    const overlays = document.querySelectorAll('.loading-overlay');
    overlays.forEach(overlay => overlay.remove());
}

// Remove loading overlays immediately
removeAllLoadingOverlays();

// Handle page visibility change (back/forward navigation)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible (user navigated back)
        removeAllLoadingOverlays();
    }
});

// Handle pageshow event (fires on back/forward navigation)
window.addEventListener('pageshow', (event) => {
    // If page was loaded from cache (back/forward), remove loading overlays
    if (event.persisted) {
        removeAllLoadingOverlays();
    }
});

// Wait for topic-loader to finish (static site) or init after fallback timeout
var topicPageInited = false;
function initTopicPage() {
    if (topicPageInited) return;
    topicPageInited = true;
    removeAllLoadingOverlays();
    new TopicController();
    new TopicQuotes();
    new TopicProgress();
}
window.addEventListener('norcet-questions-loaded', initTopicPage);
// Fallback: if event not fired within 2.5s (e.g. no loader), init anyway
function ready() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initTopicPage, 2500);
        });
    } else {
        setTimeout(initTopicPage, 2500);
    }
}
ready();
