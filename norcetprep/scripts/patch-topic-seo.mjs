#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const topicsDir = path.join(__dirname, '..', 'topics');

const TOPICS = {
  'foundations.html': {
    title: 'Nursing Foundations MCQs for NORCET 2026 — Free | NORCET Excellence Hub',
    desc: 'Free NORCET nursing foundations MCQs — infection control, nursing process, vital signs, safety. No login. AIIMS Nursing Officer.',
    h2: 'Nursing Foundations MCQs for NORCET 2026',
    p: 'Practice <strong>free nursing fundamentals questions</strong> for AIIMS NORCET — hand hygiene, sterile technique, nursing process (ADPIE), vital signs, body mechanics, and patient safety. Ideal for long-tail search: NORCET foundations MCQ free, nursing officer exam practice.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'medical-surgical.html': {
    title: 'Medical-Surgical Nursing MCQs — NORCET 2026 Free Practice',
    desc: 'Free med-surg NORCET MCQs — ICU, emergencies, cardiac, respiratory. 100+ questions with explanations.',
    h2: 'Medical-Surgical Nursing for NORCET',
    p: 'Highest-weightage area for NORCET. Practice <strong>free medical-surgical nursing MCQs</strong> covering critical care, fluids, shock, wound care, and common exam clinical scenarios.',
    video: 'https://www.youtube.com/playlist?list=PLNjKUOGiP2jXAApSt4GhXPN10XOr0o7o_'
  },
  'pediatric.html': {
    title: 'Pediatric Nursing MCQs — NORCET Free Online',
    desc: 'Free pediatric nursing MCQs for NORCET — milestones, immunization, growth. No login.',
    h2: 'Pediatric Nursing MCQs for NORCET',
    p: 'Free <strong>NORCET pediatric questions</strong> — developmental milestones, breastfeeding, immunization schedule, and common childhood illnesses.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'obstetric-gynecology.html': {
    title: 'OBG Nursing MCQs — NORCET 2026 Free',
    desc: 'Free obstetric and gynecology nursing MCQs for AIIMS NORCET exam.',
    h2: 'Obstetric & Gynecology MCQs for NORCET',
    p: 'Practice OBG topics: antenatal care, labor stages, postpartum complications, contraception, and legal aspects (MTP).',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'community-health.html': {
    title: 'Community Health Nursing MCQs — NORCET Free',
    desc: 'Free CHN MCQs — national health programmes, ASHA, immunization, NORCET syllabus.',
    h2: 'Community Health Nursing for NORCET',
    p: '<strong>NORCET community health nursing</strong> practice: NRHM, NHM, ASHA, ICDS, national programmes, and epidemiology basics.',
    video: 'https://www.youtube.com/results?search_query=Concept+RNA+NORCET+CHN+Sparsh'
  },
  'psychiatric.html': {
    title: 'Psychiatric Nursing MCQs — NORCET Free Practice',
    desc: 'Free psychiatric nursing MCQs for NORCET — therapeutic communication, disorders, medications.',
    h2: 'Psychiatric Nursing MCQs for NORCET',
    p: 'Mental health nursing topics: communication, defense mechanisms, major disorders, and psychotropic medication side effects.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'gk-current-affairs.html': {
    title: 'GK & Current Affairs for NORCET — Free MCQs',
    desc: 'Free GK and current affairs MCQs for NORCET Stage 1 — polity, schemes, science.',
    h2: 'GK & Current Affairs for NORCET Stage 1',
    p: 'Stage 1 includes general knowledge and aptitude. Practice <strong>Indian polity, geography, awards, health schemes (PM-JAY, UIP)</strong>, and static GK.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'reasoning-aptitude.html': {
    title: 'Reasoning & Aptitude MCQs — NORCET Free',
    desc: 'Free reasoning and quantitative aptitude practice for NORCET nursing officer exam.',
    h2: 'Reasoning & Aptitude for NORCET',
    p: 'Build speed for Stage 1 with logical reasoning, series, percentages, and data interpretation basics.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'research-statistics.html': {
    title: 'Research & Statistics MCQs — NORCET',
    desc: 'Free biostatistics and nursing research MCQs for NORCET.',
    h2: 'Research & Statistics for NORCET',
    p: 'p-values, study designs, sampling, and evidence-based practice questions aligned with NORCET syllabus.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'administration-management.html': {
    title: 'Nursing Administration & Management MCQs — NORCET',
    desc: 'Free administration and management MCQs for AIIMS NORCET.',
    h2: 'Administration & Management for NORCET',
    p: 'Leadership styles, staffing, quality improvement, and hospital management concepts for nursing officers.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'computer-basics.html': {
    title: 'Computers in Nursing MCQs — NORCET (Informatics)',
    desc: 'Free computers in nursing / informatics MCQs for NORCET — EMR, telemedicine, data privacy.',
    h2: 'Computers in Nursing for NORCET',
    p: 'Official syllabus uses <strong>computers in nursing</strong>. Practice EMR, hospital information systems, data security, and digital health basics.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  },
  'revision.html': {
    title: 'Quick Revision — NORCET Excellence Hub',
    desc: 'Quick revision hub for NORCET nursing officer exam.',
    h2: 'Quick Revision for NORCET',
    p: 'Use topic-wise modules and <a href="previous-years.html">previous year questions</a> for rapid review before the exam.',
    video: 'https://www.youtube.com/playlist?list=PLpIz0Dy1wvDy-sSMQqEPfXtpPtji-Jxai'
  }
};

function headInjection(fn, meta) {
  const slug = fn.replace('.html', '');
  const url = `https://amitkumar0902.github.io/norcetprep/topics/${fn}`;
  return `
    <meta name="description" content="${meta.desc.replace(/"/g, '&quot;')}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${meta.desc.replace(/"/g, '&quot;')}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">`;
}

function seoBlock(meta) {
  return `
        <div class="seo-description">
            <h2>${meta.h2}</h2>
            <p>${meta.p}</p>
        </div>`;
}

function youtubeBlock(url) {
  return `
        <div class="youtube-references">
            <h3><i class="fab fa-youtube"></i> Recommended videos</h3>
            <a href="${url}" target="_blank" rel="noopener"><i class="fab fa-youtube"></i> NORCET preparation playlists</a>
        </div>`;
}

for (const fn of Object.keys(TOPICS)) {
  const p = path.join(topicsDir, fn);
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');
  const meta = TOPICS[fn];

  if (!html.includes('meta name="description"')) {
    html = html.replace(/<title>[^<]+<\/title>/, `<title>${meta.title}</title>${headInjection(fn, meta)}`);
  }

  if (!html.includes('class="seo-description"')) {
    html = html.replace(
      /(\s*)<div id="questions-container">\s*/,
      `$1${seoBlock(meta)}\n$1<div id="questions-container">\n$1    `
    );
  }

  if (!html.includes('youtube-references')) {
    html = html.replace(
      /<\/section>\s*\n\s*<div class="motivation-quote">/,
      '</section>\n\n' + youtubeBlock(meta.video) + '\n\n        <div class="motivation-quote">'
    );
  }

  fs.writeFileSync(p, html);
  console.log('Patched', fn);
}
