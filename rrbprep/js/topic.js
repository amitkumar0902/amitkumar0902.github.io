// RRB Topic Page Controller
class TopicController {
    constructor() {
        this.currentTopic = this.getCurrentTopic();
        this.questions = [];
        this.listenersAttached = false;
        this.topicOrder = [
            'anatomy-physiology', 'nutrition-biochemistry', 'nursing-foundations',
            'medical-surgical', 'community-health', 'pediatric', 'psychiatric',
            'obstetric-midwifery', 'microbiology', 'pharmacology',
            'pathology-genetics', 'psychology-sociology', 'environmental-health',
            'research-management', 'general-awareness', 'arithmetic-reasoning',
            'general-science', 'study-plan', 'previous-years', 'mock-test', 'revision'
        ];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            setTimeout(() => this.initializeComponents(), 100);
        }
    }

    initializeComponents() {
        this.removeLoadingOverlays();
        const optionCount = document.querySelectorAll('.option').length;
        const buttonCount = document.querySelectorAll('.show-answer-btn').length;
        if (!this.listenersAttached) {
            this.setupAnswerSelection();
            this.setupAnswerReveals();
            this.listenersAttached = true;
        }
        this.setupEventListeners();
        this.loadSavedAnswers();
    }

    removeLoadingOverlays() {
        document.querySelectorAll('.loading-overlay').forEach(overlay => overlay.remove());
    }

    getCurrentTopic() {
        const path = window.location.pathname;
        return path.split('/').pop().replace('.html', '');
    }

    loadQuestions() {}

    setupEventListeners() {
        const nextBtn = document.querySelector('[onclick*="nextTopic"]');
        const prevBtn = document.querySelector('[onclick*="previousTopic"]');
        const quizBtn = document.querySelector('[onclick*="practiceQuiz"]');
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateToNext());
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateToPrevious());
        if (quizBtn) quizBtn.addEventListener('click', () => this.startPracticeQuiz());
    }

    setupAnswerReveals() {
        this.handleShowAnswerClick = this.handleShowAnswerClick.bind(this);
        document.addEventListener('click', this.handleShowAnswerClick);
    }

    handleShowAnswerClick(e) {
        const btn = e.target.closest('.show-answer-btn');
        if (!btn) return;
        e.stopPropagation();
        const questionCard = btn.closest('.question-card');
        if (!questionCard) return;
        const explanation = questionCard.querySelector('.answer-explanation');
        if (!explanation) return;
        const options = questionCard.querySelectorAll('.option');
        const computedStyle = window.getComputedStyle(explanation);
        const isHidden = computedStyle.display === 'none' || explanation.style.display === 'none' ||
            (!explanation.classList.contains('show') && explanation.style.display === '');
        if (isHidden) {
            explanation.classList.add('show');
            explanation.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Answer';
            btn.classList.add('active');
            try {
                const correctAnswer = explanation.querySelector('.correct-answer');
                if (correctAnswer) {
                    const answerText = correctAnswer.textContent;
                    let correctOption = null;
                    const match1 = answerText.match(/Correct Answer:\s*([A-D])\)/i);
                    if (match1) correctOption = match1[1].toLowerCase();
                    if (!correctOption) {
                        const match2 = answerText.match(/([A-D])/i);
                        if (match2) correctOption = match2[1].toLowerCase();
                    }
                    if (correctOption) {
                        options.forEach(opt => {
                            opt.classList.remove('correct', 'incorrect');
                            if (opt.dataset.option === correctOption) opt.classList.add('correct');
                            else if (opt.classList.contains('selected')) opt.classList.add('incorrect');
                        });
                    }
                }
            } catch (err) {}
        } else {
            explanation.classList.remove('show');
            explanation.style.display = 'none';
            btn.innerHTML = '<i class="fas fa-eye"></i> Show Answer';
            btn.classList.remove('active');
            options.forEach(opt => {
                if (!opt.classList.contains('selected')) opt.classList.remove('correct', 'incorrect');
            });
        }
    }

    setupAnswerSelection() {
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleOptionDblClick = this.handleOptionDblClick.bind(this);
        document.addEventListener('click', this.handleOptionClick);
        document.addEventListener('dblclick', this.handleOptionDblClick);
    }

    handleOptionClick(e) {
        if (e.target.closest('.show-answer-btn')) return;
        const option = e.target.closest('.option');
        if (!option) return;
        e.stopPropagation();
        const questionCard = option.closest('.question-card');
        if (!questionCard) return;
        const allOptions = questionCard.querySelectorAll('.option');
        const selectedOption = option.dataset.option;
        const questionNumber = questionCard.dataset.question;
        allOptions.forEach(opt => opt.classList.remove('selected', 'incorrect'));
        option.classList.add('selected');
        const explanation = questionCard.querySelector('.answer-explanation.show');
        if (explanation) {
            const correctAnswer = explanation.querySelector('.correct-answer');
            if (correctAnswer) {
                const answerText = correctAnswer.textContent;
                const match = answerText.match(/Correct Answer:\s*([A-D])\)/i) || answerText.match(/([A-D])/i);
                if (match && match[1].toLowerCase() !== selectedOption) option.classList.add('incorrect');
            }
        }
        this.showSelectionFeedback(questionCard, selectedOption);
        this.saveAnswer(questionNumber, selectedOption);
    }

    handleOptionDblClick(e) {
        const option = e.target.closest('.option');
        if (!option) return;
        e.preventDefault();
        e.stopPropagation();
        const questionCard = option.closest('.question-card');
        if (!questionCard) return;
        questionCard.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected', 'incorrect'));
        this.clearAnswer(questionCard.dataset.question);
        this.showNotification('Answer cleared', 'info');
    }

    showSelectionFeedback(questionCard, selectedOption) {
        const feedback = document.createElement('div');
        feedback.className = 'selection-feedback';
        feedback.textContent = `You selected option ${selectedOption.toUpperCase()}`;
        feedback.style.cssText = 'position: absolute; top: 10px; right: 10px; background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; animation: fadeIn 0.3s ease forwards;';
        const existing = questionCard.querySelector('.selection-feedback');
        if (existing) existing.remove();
        questionCard.appendChild(feedback);
        setTimeout(() => { feedback.style.animation = 'fadeOut 0.3s ease forwards'; setTimeout(() => feedback.remove(), 300); }, 2000);
    }

    saveAnswer(questionNumber, answer) {
        const answers = JSON.parse(localStorage.getItem('rrbTopicAnswers') || '{}');
        answers[`${this.currentTopic}-${questionNumber}`] = answer;
        localStorage.setItem('rrbTopicAnswers', JSON.stringify(answers));
        this.updateProgress();
    }

    clearAnswer(questionNumber) {
        const answers = JSON.parse(localStorage.getItem('rrbTopicAnswers') || '{}');
        delete answers[`${this.currentTopic}-${questionNumber}`];
        localStorage.setItem('rrbTopicAnswers', JSON.stringify(answers));
        this.updateProgress();
    }

    loadSavedAnswers() {
        const answers = JSON.parse(localStorage.getItem('rrbTopicAnswers') || '{}');
        document.querySelectorAll('.question-card').forEach(card => {
            const savedAnswer = answers[`${this.currentTopic}-${card.dataset.question}`];
            if (savedAnswer) {
                const option = card.querySelector(`[data-option="${savedAnswer}"]`);
                if (option) {
                    option.classList.add('selected');
                    const explanation = card.querySelector('.answer-explanation.show');
                    if (explanation) {
                        const correctAnswer = explanation.querySelector('.correct-answer');
                        if (correctAnswer) {
                            const match = (correctAnswer.textContent || '').match(/Correct Answer:\s*([A-D])\)/i) || (correctAnswer.textContent || '').match(/([A-D])/i);
                            if (match && match[1].toLowerCase() !== savedAnswer) option.classList.add('incorrect');
                        }
                    }
                }
            }
        });
    }

    updateProgress() {
        const totalQuestions = document.querySelectorAll('.question-card').length;
        const answers = JSON.parse(localStorage.getItem('rrbTopicAnswers') || '{}');
        const answeredCount = Object.keys(answers).filter(key => key.startsWith(`${this.currentTopic}-`)).length;
    }

    navigateToNext() {
        const currentIndex = this.topicOrder.indexOf(this.currentTopic);
        if (currentIndex < this.topicOrder.length - 1) {
            this.showLoadingTransition(`topics/${this.topicOrder[currentIndex + 1]}.html`);
        }
    }

    navigateToPrevious() {
        const currentIndex = this.topicOrder.indexOf(this.currentTopic);
        if (currentIndex > 0) {
            this.showLoadingTransition(`topics/${this.topicOrder[currentIndex - 1]}.html`);
        }
    }

    startPracticeQuiz() {
        this.showNotification('Practice quiz feature coming soon!', 'info');
    }

    showLoadingTransition(url) {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = '<div class="loading-spinner"><i class="fas fa-graduation-cap"></i><p>Loading next topic...</p></div>';
        document.body.appendChild(loading);
        setTimeout(() => { window.location.href = url; }, 800);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => { notification.classList.remove('show'); setTimeout(() => notification.remove(), 300); }, 3000);
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
    init() { this.rotateQuotes(); setInterval(() => this.rotateQuotes(), 15000); }
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

// Progress Tracker
class TopicProgress {
    constructor() {
        this.topicOrder = [
            'anatomy-physiology', 'nutrition-biochemistry', 'nursing-foundations',
            'medical-surgical', 'community-health', 'pediatric', 'psychiatric',
            'obstetric-midwifery', 'microbiology', 'pharmacology',
            'pathology-genetics', 'psychology-sociology', 'environmental-health',
            'research-management', 'general-awareness', 'arithmetic-reasoning',
            'general-science', 'study-plan', 'previous-years', 'mock-test', 'revision'
        ];
        this.init();
    }
    init() { this.updateProgress(); }
    updateProgress() {
        const currentTopic = (window.location.pathname || '').split('/').pop().replace('.html', '');
        const currentIndex = this.topicOrder.indexOf(currentTopic);
    }
}

function removeAllLoadingOverlays() {
    document.querySelectorAll('.loading-overlay').forEach(overlay => overlay.remove());
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) removeAllLoadingOverlays(); });
window.addEventListener('pageshow', (event) => { if (event.persisted) removeAllLoadingOverlays(); });

var topicPageInited = false;
var topicControllerInstance;
function initTopicPage() {
    if (topicPageInited) return;
    topicPageInited = true;
    removeAllLoadingOverlays();
    topicControllerInstance = new TopicController();
    new TopicQuotes();
    new TopicProgress();
}
window.nextTopic = function() { if (topicControllerInstance && topicControllerInstance.navigateToNext) topicControllerInstance.navigateToNext(); };
window.previousTopic = function() { if (topicControllerInstance && topicControllerInstance.navigateToPrevious) topicControllerInstance.navigateToPrevious(); };
window.practiceQuiz = function() { if (topicControllerInstance && topicControllerInstance.startPracticeQuiz) topicControllerInstance.startPracticeQuiz(); };
window.addEventListener('rrb-questions-loaded', initTopicPage);
function ready() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initTopicPage, 2500));
    } else {
        setTimeout(initTopicPage, 2500);
    }
}
ready();
