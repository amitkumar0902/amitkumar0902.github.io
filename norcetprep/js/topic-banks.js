/**
 * Single source of truth: JSON slugs under data/questions/ used for
 * hub progress (index.js) and mock tests (mock-test.js).
 * Topic pages load via URL: topics/<slug>.html → ../data/questions/<slug>.json
 */
(function () {
    window.NORCET_TOPIC_BANK_SLUGS = [
        'foundations',
        'medical-surgical',
        'pharmacology',
        'anatomy-physiology',
        'pediatric',
        'obstetric-gynecology',
        'community-health',
        'psychiatric',
        'microbiology',
        'nutrition-biochemistry',
        'first-aid',
        'gk-current-affairs',
        'reasoning-aptitude',
        'research-statistics',
        'administration-management',
        'computer-basics',
        'previous-years'
    ];
})();
