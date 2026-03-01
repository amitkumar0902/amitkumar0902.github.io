// AIIMS CRE Mock Test System - Full Exam Simulation
class MockTestManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = new Array(100).fill(null);
        this.markedForReview = new Set();
        this.timeLeft = 120 * 60; // 120 minutes in seconds
        this.timer = null;
        this.testStarted = false;
        this.testCompleted = false;

        this.init();
    }

    init() {
        this.loadQuestions();
        this.setupEventListeners();
        this.checkReadiness();
    }

    loadQuestions() {
        // Load 100 questions from the existing question bank
        // For demo, we'll create a mix of questions from different topics
        this.questions = [
            // Mix of questions from all topics
            {
                id: 1,
                question: "Which antipsychotic requires weekly CBC monitoring?",
                options: ["Haloperidol", "Clozapine", "Risperidone", "Olanzapine"],
                correct: 1,
                explanation: "Clozapine causes agranulocytosis, requiring weekly CBC monitoring",
                topic: "Psychiatric Nursing"
            },
            {
                id: 2,
                question: "Parkland formula for burns is:",
                options: ["2ml × kg × %TBSA", "3ml × kg × %TBSA", "4ml × kg × %TBSA", "5ml × kg × %TBSA"],
                correct: 2,
                explanation: "Parkland formula: 4ml × kg × %TBSA lactated Ringer's solution",
                topic: "Nutrition & Dietetics"
            },
            {
                id: 3,
                question: "MTP allowed up to:",
                options: ["12 weeks", "20 weeks", "24 weeks", "28 weeks"],
                correct: 2,
                explanation: "MTP Act 1971 (amended 2021) allows termination up to 24 weeks",
                topic: "Legal & Ethical Aspects"
            },
            {
                id: 4,
                question: "Yellow bag contains:",
                options: ["General waste", "Sharps", "Infectious waste", "Chemical waste"],
                correct: 2,
                explanation: "Yellow bag: Human anatomical, soiled, microbiological, chemical waste",
                topic: "Biomedical Waste Management"
            },
            {
                id: 5,
                question: "PM-JAY provides coverage of:",
                options: ["Rs 1 lakh", "Rs 3 lakh", "Rs 5 lakh", "Rs 10 lakh"],
                correct: 2,
                explanation: "Pradhan Mantri Jan Arogya Yojana provides Rs 5 lakh coverage per family",
                topic: "National Health Programs"
            },
            {
                id: 6,
                question: "BLS sequence is:",
                options: ["A-B-C", "C-A-B", "A-C-B", "C-B-A"],
                correct: 1,
                explanation: "Current BLS: Compressions-Airway-Breathing (C-A-B)",
                topic: "Emergency & Critical Care"
            },
            {
                id: 7,
                question: "Article 21A deals with:",
                options: ["Right to Equality", "Right to Education", "Right to Life", "Right to Speech"],
                correct: 1,
                explanation: "Article 21A provides Right to Education for children aged 6-14 years",
                topic: "General Knowledge"
            },
            // Add more questions to reach 100...
            // For brevity, I'll add a few more representative questions
            {
                id: 8,
                question: "Most common suicide method in India:",
                options: ["Poisoning", "Hanging", "Firearms", "Drowning"],
                correct: 1,
                explanation: "Hanging is the most common method of suicide in India",
                topic: "Psychiatric Nursing"
            },
            {
                id: 9,
                question: "Exclusive breastfeeding duration:",
                options: ["3 months", "4 months", "6 months", "12 months"],
                correct: 2,
                explanation: "WHO recommends exclusive breastfeeding for first 6 months",
                topic: "Nutrition & Dietetics"
            },
            {
                id: 10,
                question: "Death certificate issued within:",
                options: ["12 hours", "24 hours", "48 hours", "7 days"],
                correct: 1,
                explanation: "Death certificate must be issued within 24 hours",
                topic: "Legal & Ethical Aspects"
            }
        ];

        // Generate remaining questions to reach 100
        for (let i = 11; i <= 100; i++) {
            this.questions.push({
                id: i,
                question: `Sample Question ${i}`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct: Math.floor(Math.random() * 4),
                explanation: "Sample explanation",
                topic: ["Psychiatric", "Nutrition", "Legal", "BMW", "Programs", "Emergency", "GK"][Math.floor(Math.random() * 7)]
            });
        }
    }

    setupEventListeners() {
        // Readiness checklist
        document.querySelectorAll('.check-item input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.checkReadiness());
        });

        // Start test
        document.getElementById('start-test-btn').addEventListener('click', () => this.startTest());

        // Test navigation
        document.getElementById('prev-question').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());

        // Test actions
        document.getElementById('mark-review').addEventListener('click', () => this.markForReview());
        document.getElementById('clear-answer').addEventListener('click', () => this.clearAnswer());
        document.getElementById('submit-test').addEventListener('click', () => this.submitTest());

        // Option selection
        document.getElementById('options').addEventListener('click', (e) => {
            if (e.target.closest('.option')) {
                this.selectAnswer(e.target.closest('.option').dataset.option);
            }
        });

        // Results actions
        document.getElementById('review-test').addEventListener('click', () => this.showReview());
        document.getElementById('retake-test').addEventListener('click', () => location.reload());
        document.getElementById('back-to-hub').addEventListener('click', () => window.location.href = '../index.html');

        // Review modal
        document.getElementById('close-review').addEventListener('click', () => this.hideReview());
        document.getElementById('prev-review').addEventListener('click', () => this.reviewPrevious());
        document.getElementById('next-review').addEventListener('click', () => this.reviewNext());
    }

    checkReadiness() {
        const checkboxes = document.querySelectorAll('.check-item input');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        document.getElementById('start-test-btn').disabled = !allChecked;
    }

    startTest() {
        this.testStarted = true;
        document.getElementById('test-instructions').style.display = 'none';
        document.getElementById('test-interface').style.display = 'block';

        this.startTimer();
        this.renderQuestionPalette();
        this.showQuestion(0);
        this.showNotification('Test started! Good luck! ⏱️', 'success');
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();

            if (this.timeLeft <= 0) {
                this.submitTest();
            }

            // Show warning at 10 minutes
            if (this.timeLeft === 10 * 60) {
                this.showNotification('⚠️ 10 minutes remaining!', 'warning');
            }

            // Show warning at 5 minutes
            if (this.timeLeft === 5 * 60) {
                this.showNotification('🚨 5 minutes remaining!', 'danger');
            }
        }, 1000);
    }

    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('timer').textContent = timeString;

        // Color coding based on time left
        const timerElement = document.getElementById('timer').parentElement;
        timerElement.className = 'timer-display';

        if (this.timeLeft <= 5 * 60) {
            timerElement.classList.add('danger');
        } else if (this.timeLeft <= 10 * 60) {
            timerElement.classList.add('warning');
        }
    }

    renderQuestionPalette() {
        const paletteGrid = document.getElementById('palette-grid');
        paletteGrid.innerHTML = '';

        for (let i = 1; i <= 100; i++) {
            const questionBtn = document.createElement('button');
            questionBtn.className = 'palette-btn';
            questionBtn.textContent = i;
            questionBtn.dataset.question = i - 1;

            questionBtn.addEventListener('click', () => this.showQuestion(i - 1));

            paletteGrid.appendChild(questionBtn);
        }

        this.updatePalette();
    }

    updatePalette() {
        document.querySelectorAll('.palette-btn').forEach((btn, index) => {
            btn.className = 'palette-btn';

            if (this.answers[index] !== null) {
                btn.classList.add('answered');
            } else if (this.markedForReview.has(index)) {
                btn.classList.add('marked');
            } else {
                btn.classList.add('not-visited');
            }

            if (index === this.currentQuestionIndex) {
                btn.classList.add('current');
            }
        });

        this.updateStats();
    }

    updateStats() {
        const answered = this.answers.filter(a => a !== null).length;
        const marked = this.markedForReview.size;

        document.getElementById('answered-count').textContent = answered;
        document.getElementById('marked-count').textContent = marked;
    }

    showQuestion(index) {
        if (index < 0 || index >= this.questions.length) return;

        this.currentQuestionIndex = index;
        const question = this.questions[index];

        document.getElementById('q-number').textContent = `Q${question.id}`;
        document.getElementById('q-category').textContent = question.topic;
        document.getElementById('question-text').textContent = question.question;

        // Update options
        ['a', 'b', 'c', 'd'].forEach((opt, i) => {
            document.getElementById(`option-${opt}`).textContent = question.options[i];
        });

        // Update navigation
        document.getElementById('prev-question').disabled = index === 0;
        document.getElementById('next-question').disabled = index === this.questions.length - 1;
        document.getElementById('current-q').textContent = index + 1;

        // Show selected answer
        this.updateSelectedAnswer();

        this.updatePalette();
    }

    updateSelectedAnswer() {
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        const selectedAnswer = this.answers[this.currentQuestionIndex];
        if (selectedAnswer !== null) {
            document.querySelector(`[data-option="${selectedAnswer}"]`).classList.add('selected');
        }
    }

    selectAnswer(option) {
        this.answers[this.currentQuestionIndex] = option;
        this.updateSelectedAnswer();
        this.updatePalette();

        // Auto-advance after short delay
        setTimeout(() => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.nextQuestion();
            }
        }, 500);
    }

    markForReview() {
        if (this.markedForReview.has(this.currentQuestionIndex)) {
            this.markedForReview.delete(this.currentQuestionIndex);
        } else {
            this.markedForReview.add(this.currentQuestionIndex);
        }
        this.updatePalette();
        this.showNotification('Question marked for review', 'info');
    }

    clearAnswer() {
        this.answers[this.currentQuestionIndex] = null;
        this.updateSelectedAnswer();
        this.updatePalette();
        this.showNotification('Answer cleared', 'info');
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.showQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.showQuestion(this.currentQuestionIndex + 1);
        }
    }

    submitTest() {
        if (!confirm('Are you sure you want to submit the test?')) return;

        clearInterval(this.timer);
        this.testCompleted = true;

        this.calculateResults();
        this.showResults();
    }

    calculateResults() {
        let correct = 0;
        let wrong = 0;
        let notAttempted = 0;

        this.answers.forEach((answer, index) => {
            if (answer === null) {
                notAttempted++;
            } else if (answer === String.fromCharCode(97 + this.questions[index].correct)) {
                correct++;
            } else {
                wrong++;
            }
        });

        // Calculate score with negative marking
        const score = correct - (wrong / 3);
        const percentage = Math.round((score / 100) * 100);

        this.results = {
            correct,
            wrong,
            notAttempted,
            score: Math.max(0, score),
            percentage,
            timeTaken: 120 * 60 - this.timeLeft
        };
    }

    showResults() {
        document.getElementById('test-interface').style.display = 'none';
        document.getElementById('test-results').style.display = 'block';

        // Update results
        document.getElementById('final-score').textContent = `${this.results.score.toFixed(1)}/100`;
        document.getElementById('percentage').textContent = `${this.results.percentage}%`;
        document.getElementById('correct-answers').textContent = this.results.correct;
        document.getElementById('wrong-answers').textContent = this.results.wrong;
        document.getElementById('not-attempted').textContent = this.results.notAttempted;

        const minutes = Math.floor(this.results.timeTaken / 60);
        const seconds = this.results.timeTaken % 60;
        document.getElementById('time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Predicted rank (rough estimation)
        const predictedRank = this.calculatePredictedRank();
        document.getElementById('rank-predict').textContent = predictedRank;

        // Topic analysis
        this.generateTopicAnalysis();

        // Recommendations
        this.generateRecommendations();
    }

    calculatePredictedRank() {
        const score = this.results.percentage;
        if (score >= 90) return "Top 10";
        if (score >= 85) return "Top 50";
        if (score >= 80) return "Top 100";
        if (score >= 75) return "Top 500";
        if (score >= 70) return "Top 1000";
        return "Need improvement";
    }

    generateTopicAnalysis() {
        const topicAnalysis = document.getElementById('topic-analysis');
        const topics = {};

        this.questions.forEach((q, index) => {
            if (!topics[q.topic]) topics[q.topic] = { total: 0, correct: 0 };

            topics[q.topic].total++;
            if (this.answers[index] === String.fromCharCode(97 + q.correct)) {
                topics[q.topic].correct++;
            }
        });

        topicAnalysis.innerHTML = Object.entries(topics)
            .map(([topic, data]) => `
                <div class="topic-result">
                    <div class="topic-name">${topic}</div>
                    <div class="topic-score">${data.correct}/${data.total}</div>
                    <div class="topic-percentage">${Math.round((data.correct/data.total)*100)}%</div>
                </div>
            `).join('');
    }

    generateRecommendations() {
        const recommendations = document.getElementById('recommendations');

        let recs = [];

        if (this.results.notAttempted > 20) {
            recs.push("⏰ Work on time management - too many questions left unanswered");
        }

        if (this.results.wrong > this.results.correct) {
            recs.push("🎯 Focus on accuracy - high wrong answer rate suggests guessing");
        }

        if (this.results.percentage < 70) {
            recs.push("📚 Need more practice - revisit weak topics");
        }

        if (this.results.percentage >= 85) {
            recs.push("🎉 Excellent performance! Maintain this level for exam");
        }

        recommendations.innerHTML = recs.map(rec => `<div class="recommendation-item">${rec}</div>`).join('');
    }

    showReview() {
        this.reviewIndex = 0;
        this.renderReview();
        document.getElementById('review-modal').style.display = 'flex';
        setTimeout(() => document.getElementById('review-modal').classList.add('show'), 10);
    }

    hideReview() {
        document.getElementById('review-modal').classList.remove('show');
        setTimeout(() => document.getElementById('review-modal').style.display = 'none', 300);
    }

    renderReview() {
        const question = this.questions[this.reviewIndex];
        const userAnswer = this.answers[this.reviewIndex];
        const correctAnswer = String.fromCharCode(97 + question.correct);

        const reviewContent = document.getElementById('review-content');
        reviewContent.innerHTML = `
            <div class="review-question">
                <div class="question-header">
                    <span class="question-number">Q${question.id}</span>
                    <span class="question-category">${question.topic}</span>
                </div>
                <p class="question-text">${question.question}</p>

                <div class="options-review">
                    ${question.options.map((opt, i) => {
                        const optLetter = String.fromCharCode(97 + i);
                        let className = 'option-review';

                        if (optLetter === correctAnswer) className += ' correct';
                        if (optLetter === userAnswer && userAnswer !== correctAnswer) className += ' wrong';
                        if (optLetter === userAnswer) className += ' selected';

                        return `
                            <div class="${className}">
                                <span class="option-letter">${optLetter.toUpperCase()}</span>
                                <span class="option-text">${opt}</span>
                                ${optLetter === correctAnswer ? '<i class="fas fa-check"></i>' : ''}
                                ${optLetter === userAnswer && userAnswer !== correctAnswer ? '<i class="fas fa-times"></i>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="explanation-review">
                    <h4>Explanation:</h4>
                    <p>${question.explanation}</p>
                </div>
            </div>
        `;

        document.getElementById('review-counter').textContent = `${this.reviewIndex + 1} of ${this.questions.length}`;
    }

    reviewPrevious() {
        if (this.reviewIndex > 0) {
            this.reviewIndex--;
            this.renderReview();
        }
    }

    reviewNext() {
        if (this.reviewIndex < this.questions.length - 1) {
            this.reviewIndex++;
            this.renderReview();
        }
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
        new MockTestManager();
    });
} else {
    removeAllLoadingOverlays();
    new MockTestManager();
}
