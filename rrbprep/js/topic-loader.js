// RRB Static Topic Loader - Fetches JSON and renders question cards for GitHub Pages
(function() {
    var topic = (function() {
        var path = window.location.pathname;
        var match = path.match(/\/topics\/([^\/]+)\.html$/) || path.match(/topics\/([^\/]+)\.html$/);
        return match ? match[1] : '';
    })();

    if (!topic || topic === 'mock-test' || topic === 'revision' || topic === 'study-plan' || topic === 'previous-years') {
        window.dispatchEvent(new Event('rrb-questions-loaded'));
        return;
    }

    var container = document.getElementById('questions-container');
    if (!container) return;

    // From /rrbprep/topics/xxx.html -> ../data/questions/xxx.json
    var dataUrl = '../data/questions/' + topic + '.json';

    fetch(dataUrl)
        .then(function(r) { return r.json(); })
        .then(function(questions) {
            var letters = ['a', 'b', 'c', 'd'];
            var html = '';
            questions.forEach(function(q, idx) {
                var correctIdx = typeof q.correct === 'number' ? q.correct : 0;
                var opts = q.options || [];
                var correctLetter = letters[correctIdx] || 'a';
                var correctText = (opts[correctIdx] || '').replace(/^[A-D]\.?\s*/i, '').trim();
                html += '<div class="question-card" data-question="' + (q.id || (idx + 1)) + '">';
                html += '<div class="question-header"><span class="question-number">Question ' + (q.id || (idx + 1)) + '</span>';
                if (q.topic) html += '<span class="question-topic">' + escapeHtml(q.topic) + '</span>';
                if (q.year) html += '<span class="question-year">' + escapeHtml(q.year) + '</span>';
                html += '</div>';
                html += '<div class="question-text"><p>' + escapeHtml(q.question) + '</p></div>';
                html += '<div class="options-container">';
                opts.forEach(function(opt, i) {
                    var letter = letters[i] || 'a';
                    html += '<div class="option" data-option="' + letter + '">' + escapeHtml(opt) + '</div>';
                });
                html += '</div>';
                html += '<div class="answer-explanation" style="display:none;">';
                html += '<span class="correct-answer">Correct Answer: ' + correctLetter.toUpperCase() + ') ' + escapeHtml(correctText) + '</span><br><br>';
                html += '<strong>Explanation:</strong> ' + escapeHtml((q.explanation || '').replace(/\n/g, '<br>'));
                html += '</div>';
                html += '<button type="button" class="show-answer-btn"><i class="fas fa-eye"></i> Show Answer</button>';
                html += '</div>';
            });
            container.innerHTML = html;
            window.dispatchEvent(new Event('rrb-questions-loaded'));
        })
        .catch(function(err) {
            container.innerHTML = '<div class="empty-state"><p>Could not load questions. Check console.</p></div>';
            console.error('RRB topic-loader:', err);
            window.dispatchEvent(new Event('rrb-questions-loaded'));
        });

    function escapeHtml(s) {
        if (!s) return '';
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }
})();
