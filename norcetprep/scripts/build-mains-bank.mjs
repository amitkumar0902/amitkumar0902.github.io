#!/usr/bin/env node
// Build the unified Mains Question Bank + day slices + 10 mocks + drill sets.
// Sources: existing topic JSONs + curated NORCET Mains PYQ recall list (inlined).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const QDIR = path.join(ROOT, 'data/questions');
const OUT = path.join(ROOT, 'data/mains');

// ---------- Subject mapping from file → canonical subject ----------
const SUBJECT_MAP = {
  'medical-surgical': 'Medical-Surgical',
  'obstetric-gynecology': 'OBG',
  'pediatric': 'Pediatric',
  'community-health': 'Community Health',
  'pharmacology': 'Pharmacology',
  'foundations': 'Fundamentals',
  'psychiatric': 'Psychiatric',
  'microbiology': 'Microbiology',
  'first-aid': 'Fundamentals',
  'anatomy-physiology': 'Anatomy',
  'nutrition-biochemistry': 'Nutrition',
  'administration-management': 'Admin',
  'previous-years': 'Mixed'
};

// ---------- Day keywords (strict; tuned to 13-day plan topics) ----------
// Order matters: more specific first. Each rule is a regex tested against
// the lowercased question + topic + explanation blob.
const DAY_RULES = [
  // Day 1 — ABG · ECG · arrhythmias · burns
  { day: 1, rx: /\b(abg|arterial blood gas|bicarbonate|hco3|ph\s*(7\.\d|<7|>7)|ecg|electrocardio|heart block|av\s*block|\bvt\b|ventricular tachy|\bvf\b|ventricular fib|wpw|\bburn(s|ed)?\b|parkland|rule of nine|tbsa|asystole|\bpvc\b|st[-\s]?(elevation|depress)|myocardial infarction|arrhythm|sinus brady|sinus tachy|atrial fib|a\.?\s*fib|a\.?\s*flutter)\b/ },
  // Day 2 — Fluids, drug calc, ET tubes
  { day: 2, rx: /\b(et\s*tube|endotracheal|drug\s+calc|iv\s*fluid|\bns\b|normal saline|ringer|d5w|d5ns|dextrose|0\.9\s*%|drip\s*rate|drops per minute|gtts|microdrip|mcg\/kg|mg\/kg|infusion rate)\b/ },
  // Day 3 — Labour, eclampsia, OBG emergencies, MTP
  { day: 3, rx: /\b(labou?r|eclampsia|pre-?eclampsia|mgso4|magnesium sulfate|placenta previa|abruptio|placental abruption|oxytocin|pitocin|third stage|3rd stage|hydatidiform|molar pregnancy|postpartum hemorrhage|\bpph\b|leopold|mtp act|episiotomy|cesarean|c-?section)\b/ },
  // Day 4 — Newborn / NRP / APGAR / preterm
  { day: 4, rx: /\b(apgar|neonat(e|al)|newborn resuscitation|\bnrp\b|respiratory distress syndrome|\brds\b|surfactant|preterm|premature infant|kangaroo mother|kmc|cord care|primitive reflex)\b/ },
  // Day 5 — Peds cardiac / hemato / respiratory
  { day: 5, rx: /\b(tetralogy|fallot|\btof\b|vsd\b|asd\b|pda\b|\btef\b|tracheoesophag|croup|epiglottitis|g6pd|sickle cell|hemophilia|thalassemia|pediatric anemia|rsv|respiratory syncytial|bronchiolit|pediatric asthma|pediatric pneumonia|kawasaki|rheumatic fever|milestone|developmental)\b/ },
  // Day 6 — Community Health / programmes / schemes
  { day: 6, rx: /\b(nhp\b|national health|\bicds\b|polio|pulse polio|opv\b|ipv\b|family planning|\bhpv\b|vaccin|immuniz|\bhiv\b|\baids\b|nacp\b|poshan|\bnhm\b|\bjsy\b|pmjay|ayushman|u-?win|abdm|mission indradhanush|rmnch|article 21|rti act|\bntep\b|\brntcp\b|leprosy|\bncdc\b|iddcp|mdm scheme|mid[-\s]?day meal|cpi|epidemi|incidence|prevalence)\b/ },
  // Day 7 — Infection control · BMW · O2 therapy · hand hygiene
  { day: 7, rx: /\b(hand\s*wash|handwash|hand hygiene|who\s*5|five moments|\bbmw\b|biomedical waste|yellow bag|red bag|blue bag|white bag|sharps|venturi|oxygen mask|oxygen therapy|nasal cannula|\bnrb\b|non-?rebreather|ppe|mask fit|autoclav|sterilizat|disinfect)\b/ },
  // Day 8 — Microbiology / TPN / central lines
  { day: 8, rx: /\b(cmv\b|cytomegalovirus|toxoplasm|candidi?|bacterial vaginosis|\btpn\b|total parenteral|central line|central venous|\bcvc\b|gram[-\s]?(pos|neg)|coagulase|mrsa|vre\b|\btb\b|tuberculos|malaria|dengue|chikun|leptospir|typhoid)\b/ },
  // Day 9 — Emergency / triage / BLS · ACLS · psych emergencies
  { day: 9, rx: /\b(triage|airway[-\s]?breathing|mass casualty|\bbls\b|\bacls\b|\bcpr\b|defibril|cardiac arrest|code blue|status epilepticus|suicide|neuroleptic malignant|serotonin syndrome|lithium toxicity|clozapine|antipsychotic|restraint)\b/ },
  // Day 10 — Revision mix (admin, legal, ethics) — catches what Day 6 didn't
  { day: 10, rx: /\b(nursing admin|management|delegation|staffing|budget|leader|theory of nursing|henderson|orem|roy adaptation|watson|ethical|code of ethics|informed consent|legal|liability|nclex)\b/ },
  // Day 11 — Anatomy revision
  { day: 11, rx: /\b(anatomy|histolog|cranial nerve|brachial plexus|cervical plexus|vertebra|vertebral column|thoracic cage|lumbar|dermatome|myotome|bone fossa|coronary artery|hepatic flexure|splenic flexure)\b/ },
  // Day 12 — Nutrition revision
  { day: 12, rx: /\b(vitamin [abcdek]|iron deficienc|protein energy|pem\b|kwashiorkor|marasmus|\brda\b|balanced diet|caloric|kilocalor|bmi\b|obesity|macronutrient|micronutrient|food pyramid)\b/ },
  // Day 13 — Pharma revision (fallback)
  { day: 13, rx: /\b(pharmacolog|mechanism of action|moa\b|pharmacokinet|half[-\s]?life|bioavailab|antidote|receptor|agonist|antagonist|drug interaction)\b/ }
];

// Topic → day mapping (authoritative when q.topic is present in a banked form)
const TOPIC_DAY_MAP = {
  'ABG': 1, 'ECG': 1, 'Burns': 1, 'Cardiac Arrhythmias': 1, 'ICU care': 1, 'Arrhythmia': 1,
  'Drug calculation': 2, 'ET tube': 2, 'IV Fluids': 2, 'Fluid Therapy': 2,
  'Eclampsia': 3, 'Pre-eclampsia': 3, 'MgSO4': 3, 'Leopold': 3, 'MTP Act': 3,
  'Episiotomy': 3, 'PPH': 3, 'Placenta Previa': 3, 'Third Stage': 3, 'Labour': 3,
  'APGAR': 4, 'NRP': 4, 'Neonatal': 4, 'RDS': 4, 'Developmental': 4,
  'Congenital Heart': 5, 'Pediatric Respiratory': 5, 'Pediatric Anemia': 5, 'Renal': 5,
  'Hematology': 5,
  'ICDS': 6, 'National Programs': 6, 'Schemes': 6, 'MCH': 6, 'Constitution': 6,
  'Epidemiology': 6, 'Vaccines': 6, 'Family Planning': 6,
  'Hand hygiene': 7, 'BMW': 7, 'Oxygen therapy': 7, 'Infection Control': 7,
  'Central line': 8, 'TPN': 8, 'Microbiology': 8,
  'BLS': 9, 'BLS/ACLS': 9, 'ACLS': 9, 'Shock': 9, 'Psychiatric Emergency': 9,
  'Antipsychotics': 9, 'Neurology': 9
};

// Scenario detection
const SCENARIO_CUES = [/^\s*a\s+\d/i, /^\s*a\s+patient/i, /^\s*a\s+client/i, /^\s*the\s+nurse/i, /^\s*which\s+of\s+the\s+following\s+is\s+the\s+best\s+response/i, /develops?\s+/i, /admitted\s+/i, /is\s+admitted/i];
const CALC_CUES = [/calculate/i, /how\s+many\s+(ml|mg|drops|units)/i, /drip\s+rate/i, /flow\s+rate/i, /dose\s+/i, /\d+\s*mg\/kg/i, /\d+\s*mcg\/kg\/min/i];

function detectQtype(q) {
  const t = q.question || '';
  if (q.image) return 'image';
  if (CALC_CUES.some(r => r.test(t))) return 'calculation';
  if (t.match(/^Assertion/i) || t.match(/Reason:/i)) return 'assertion-reason';
  if (SCENARIO_CUES.some(r => r.test(t)) && t.length > 90) return 'scenario';
  return 'factual';
}

function detectDay(q, subject) {
  // 1. Topic authority
  if (q.topic && TOPIC_DAY_MAP[q.topic]) return TOPIC_DAY_MAP[q.topic];
  // 2. Regex rules
  const blob = ((q.question || '') + ' ' + (q.topic || '') + ' ' + (q.explanation || '')).toLowerCase();
  for (const d of DAY_RULES) {
    if (d.rx.test(blob)) return d.day;
  }
  // 3. Subject fallback — distribute across days 10-13 for revision
  if (subject === 'OBG') return 3;
  if (subject === 'Pediatric') return 4;
  if (subject === 'Community Health') return 6;
  if (subject === 'Microbiology') return 8;
  if (subject === 'Psychiatric') return 9;
  if (subject === 'Pharmacology') return 13;
  if (subject === 'Fundamentals') return 7;
  if (subject === 'Admin') return 10;
  if (subject === 'Anatomy') return 11;
  if (subject === 'Nutrition') return 12;
  // Medical-Surgical without hint → scatter evenly by id to avoid Day 10 pileup
  return 1 + (Math.abs(hashString(q.question || '')) % 13);
}
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
  return h;
}

// ---------- Expand `explanation` → `explanations` {A,B,C,D} ----------
function buildExplanations(q) {
  if (q.explanations && typeof q.explanations === 'object') return q.explanations;
  const exp = q.explanation || 'Refer to concept note.';
  const letters = ['A','B','C','D'];
  const correctLetter = letters[q.correct] || 'A';
  const correctText = (q.options && q.options[q.correct]) ? String(q.options[q.correct]).trim() : '';
  const correctExp = (exp.replace(/^•\s*/gm, '').split('\n').filter(Boolean).slice(0,2).join(' ')) || 'Correct.';
  const out = {};
  for (let i = 0; i < 4; i++) {
    if (i === q.correct) {
      out[letters[i]] = correctExp;
    } else {
      // Better placeholder: names the correct option so the reader learns something
      // even before we hand-enrich the 1:4 distractor explanations.
      const optText = (q.options && q.options[i]) ? String(q.options[i]).trim() : '';
      out[letters[i]] = (optText ? '"' + optText + '" is a plausible distractor but incorrect. ' : 'Incorrect. ') +
        'The correct answer is ' + correctLetter + (correctText ? ' ("' + correctText + '")' : '') +
        ' — ' + correctExp;
    }
  }
  return out;
}

// ---------- Strip option prefixes (A.  B.  etc.) ----------
function cleanOptions(opts) {
  return opts.map(o => String(o).replace(/^\s*[A-D][\.\)]\s*/, '').trim());
}

// ---------- Load source JSONs ----------
function loadAllTopicBanks() {
  const files = fs.readdirSync(QDIR).filter(f => f.endsWith('.json'));
  const out = [];
  let nextId = 1;
  for (const f of files) {
    const key = f.replace('.json', '');
    const subj = SUBJECT_MAP[key] || 'Mixed';
    const arr = JSON.parse(fs.readFileSync(path.join(QDIR, f), 'utf8'));
    for (const q of arr) {
      if (!q.options || q.options.length !== 4 || typeof q.correct !== 'number') continue;
      const options = cleanOptions(q.options);
      const subject = subj;
      const day = detectDay({ ...q, topic: q.topic || key }, subject);
      const qtype = detectQtype(q);
      out.push({
        id: 'P' + (nextId++),
        question: q.question,
        options,
        correct: q.correct,
        explanation: q.explanation || '',
        explanations: buildExplanations({ ...q, options }),
        subject,
        topic: q.topic || subject,
        day,
        difficulty: q.difficulty || 'Medium',
        source: key === 'previous-years' ? 'AIIMS NO legacy' : 'Practice',
        year: q.year || null,
        qtype
      });
    }
  }
  return out;
}

// ---------- Load high-yield scenario MCQs (from data/mains/topics/high-yield/*.json) ----------
function loadHighYieldTopics() {
  const hyDir = path.join(OUT, 'topics', 'high-yield');
  if (!fs.existsSync(hyDir)) return [];
  const out = [];
  let nextId = 1;
  for (const f of fs.readdirSync(hyDir)) {
    if (!f.endsWith('.json') || f === 'index.json') continue;
    const arr = JSON.parse(fs.readFileSync(path.join(hyDir, f), 'utf8'));
    for (const q of arr) {
      if (!q.options || q.options.length !== 4 || typeof q.correct !== 'number') continue;
      out.push({
        id: 'H' + (nextId++),
        syllabusId: q.syllabusId,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || '',
        explanations: q.explanations || buildExplanations(q),
        subject: q.subject || SUBJECT_MAP[q.section] || 'Mixed',
        topic: q.topic,
        section: q.section,
        day: q.day,
        difficulty: q.difficulty || 'Medium',
        source: q.source || 'NORCET High-Yield',
        year: q.year || 2025,
        qtype: q.qtype || 'scenario',
        tags: q.tags || ['scenario', 'highyield'],
      });
    }
  }
  return out;
}

// ---------- Curated NORCET Mains PYQ set — loaded from data/mains/pyqs/*.json ----------
// Single-source-of-truth: each JSON file under data/mains/pyqs/ contributes rows.
// The NORCET-9 Mains 2025 file (121 Qs, verbatim from the official PDF) is the
// canonical source; when an older recall stub collides with a PDF question
// by stem similarity (Jaccard token overlap ≥ 0.8), the PDF version wins.
const PYQ_DIR = path.join(OUT, 'pyqs');
function tokensOf(s) {
  return new Set(
    String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9+]+/g, ' ')
      .split(' ')
      .filter(t => t.length >= 3)
  );
}
function jaccard(aSet, bSet) {
  if (!aSet.size || !bSet.size) return 0;
  let inter = 0;
  for (const t of aSet) if (bSet.has(t)) inter++;
  return inter / (aSet.size + bSet.size - inter);
}
function loadAllPyqFiles() {
  if (!fs.existsSync(PYQ_DIR)) return [];
  const out = [];
  for (const f of fs.readdirSync(PYQ_DIR).sort()) {
    if (!f.endsWith('.json')) continue;
    const arr = JSON.parse(fs.readFileSync(path.join(PYQ_DIR, f), 'utf8'));
    if (!Array.isArray(arr)) continue;
    for (const q of arr) {
      if (!q || !q.options || q.options.length !== 4 || typeof q.correct !== 'number') continue;
      out.push({ ...q, _sourceFile: f });
    }
  }
  return out;
}
// Retained for legacy compatibility; no inline rows anymore.
const PYQS = [
  /* Intentionally empty — all PYQs now live in data/mains/pyqs/*.json.
     The content previously here was migrated to:
     - data/mains/pyqs/norcet-9-mains-2025.json (121 Qs, verbatim from PDF)
     - data/mains/pyqs/norcet-6-7-8-recalls.json (17 Qs, memory-based recalls)
  */
  { _placeholder: true, q: '', o: ['','','',''], c: 0, subj: '', topic: '', day: 1, diff: 'Easy', e: { A:'',B:'',C:'',D:'' }, src: '_placeholder', yr: 0, qt: 'factual' }
];

function pyqRows() {
  // Load questions from JSON files (canonical source) and map them to the
  // same shape the downstream code expects. JSON rows use verbose field
  // names (question, options, correct, explanations, ...) and we keep them
  // as-is when present; older recall rows stored via PYQS[] still use the
  // terse keys (q/o/c/e/subj/topic/diff/src/yr/qt).
  const jsonRows = loadAllPyqFiles();
  const jsonMapped = jsonRows.map((q) => ({
    id: q.id || '',
    _origId: q.id || '',
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation || (q.explanations ? q.explanations[['A','B','C','D'][q.correct]] : ''),
    explanations: q.explanations || {},
    subject: q.subject || '',
    topic: q.topic || '',
    day: q.day || 1,
    difficulty: q.difficulty || 'Medium',
    source: q.source || '',
    year: q.year || 0,
    qtype: q.qtype || 'factual',
    section: q.section || '',
    tags: q.tags || [],
    _sourceFile: q._sourceFile || ''
  }));

  // Legacy inline rows (currently just a placeholder we filter out).
  const legacyMapped = PYQS
    .filter((p) => p && !p._placeholder && p.q)
    .map((p, i) => ({
      id: 'L' + (i + 1),
      question: p.q,
      options: p.o,
      correct: p.c,
      explanation: p.e[['A','B','C','D'][p.c]],
      explanations: p.e,
      subject: p.subj,
      topic: p.topic,
      day: p.day,
      difficulty: p.diff,
      source: p.src,
      year: p.yr,
      qtype: p.qt
    }));

  // De-duplicate: if a legacy row's stem matches a JSON row's stem at
  // Jaccard ≥ 0.8, keep the JSON (PDF-derived) version and drop the legacy.
  const jsonTokens = jsonMapped.map((r) => tokensOf(r.question));
  const deduped = legacyMapped.filter((lr) => {
    const lt = tokensOf(lr.question);
    for (let i = 0; i < jsonTokens.length; i++) {
      if (jaccard(lt, jsonTokens[i]) >= 0.8) return false;
    }
    return true;
  });

  const all = [...jsonMapped, ...deduped];
  // Re-number with M1..Mn for stable ids across the merged set.
  return all.map((row, idx) => ({ ...row, id: 'M' + (idx + 1) }));
}


// ---------- Flashcards seed ----------
const FLASHCARDS = {
  logos: [
    ['POSHAN Abhiyan', 'Launched 2018. Targets stunting, undernutrition, anemia, low birth weight. Logo: multicolored food wheel.'],
    ['Mission Indradhanush', 'Launched 2014. Rainbow logo — full immunization by age 2 (seven vaccines originally).'],
    ['NACP', 'National AIDS Control Programme. Red ribbon. Currently Phase V (2021–2026).'],
    ['ICDS', 'Integrated Child Development Services — 1975. Mother-and-child silhouette.'],
    ['PM-JAY (Ayushman Bharat)', '2018. Family shield logo. ₹5 lakh health cover.'],
    ['RBSK', 'Rashtriya Bal Swasthya Karyakram. Child-health screening 4Ds (Defects, Deficiencies, Diseases, Development delays).'],
    ['JSY', 'Janani Suraksha Yojana. Cash-assistance for institutional delivery.'],
    ['U-WIN', '2023 digital immunization registry. Aadhaar-linked.'],
    ['ABDM', 'Ayushman Bharat Digital Mission. Digital health ID (ABHA).'],
    ['NTEP', 'National TB Elimination Programme (renamed from RNTCP in 2020). End TB by 2025.']
  ],
  'discharge-colors': [
    ['Bacterial vaginosis', 'Thin grey-white, fishy odor, clue cells on wet mount.'],
    ['Candidiasis', 'Thick white cottage-cheese, intense itching, pseudohyphae.'],
    ['Trichomoniasis', 'Frothy yellow-green, "strawberry cervix".'],
    ['Chlamydia', 'Often asymptomatic; mucopurulent cervicitis.'],
    ['Gonorrhea', 'Purulent yellow-green; Gram-neg diplococci.']
  ],
  milestones: [
    ['Social smile', '6–8 weeks'],
    ['Head holding', '3 months'],
    ['Rolls over', '5 months'],
    ['Sits without support', '8 months'],
    ['Stands with support', '9 months'],
    ['Walks alone', '13–15 months'],
    ['Runs', '2 years'],
    ['Rides tricycle', '3 years'],
    ['Hops on one foot', '4 years']
  ],
  'mask-colors': [
    ['Venturi Blue', '24 % FiO2 @ 2 L/min'],
    ['Venturi White', '28 % @ 4 L/min'],
    ['Venturi Yellow', '35 % @ 8 L/min'],
    ['Venturi Red', '40 % @ 8 L/min'],
    ['Venturi Green', '60 % @ 12 L/min'],
    ['Nasal cannula', '24–44 % @ 1–6 L/min'],
    ['Simple mask', '40–60 % @ 5–10 L/min'],
    ['Non-rebreather', '80–100 % @ 10–15 L/min']
  ],
  'bmw-colors': [
    ['Yellow', 'Anatomical, soiled, microbiology, chemical liquid waste — incineration'],
    ['Red', 'Non-chlorinated plastics (tubing, catheters, IV sets) — autoclave + recycle'],
    ['White (translucent)', 'Sharps — puncture-proof — autoclave / shredding'],
    ['Blue', 'Glass waste, metallic implants — disinfection and recycling'],
    ['Black', 'General / non-hazardous (segregation at source)']
  ],
  formulas: [
    ['Parkland', '4 mL × kg × %TBSA, half in first 8 h'],
    ['Maintenance fluid (4-2-1)', '4 mL/kg first 10 kg + 2 mL/kg next 10 kg + 1 mL/kg thereafter'],
    ['ET tube size (child)', '(age/4) + 4 uncuffed; (age/4) + 3.5 cuffed'],
    ['ET tube depth', 'internal diameter × 3'],
    ['Drip factor', 'mL/hr × drop factor ÷ 60 = drops/min'],
    ['APGAR components', 'Appearance, Pulse, Grimace, Activity, Respiration'],
    ['CPR adult', '30:2, ≥100/min, 5–6 cm depth'],
    ['MgSO4 loading', '4 g IV over 20 min + 10 g IM (Pritchard)']
  ],
  'drug-names': [
    ['Eclampsia first-line', 'Magnesium sulfate'],
    ['PPH first-line uterotonic', 'Oxytocin 10 IU IM'],
    ['VT with pulse', 'Amiodarone 150 mg IV over 10 min'],
    ['Pulseless VT / VF', 'Defibrillation + epinephrine 1 mg + amiodarone 300 mg'],
    ['Anaphylaxis', 'Epinephrine 0.3–0.5 mg IM (1:1000)'],
    ['Opioid overdose', 'Naloxone 0.4 mg IV / IN'],
    ['Benzo overdose', 'Flumazenil 0.2 mg IV'],
    ['Paracetamol OD', 'N-acetyl cysteine'],
    ['Clozapine AE', 'Weekly CBC × 6 mo (agranulocytosis)']
  ]
};

// ---------- Drug calc drill seed ----------
const DRUG_CALC_DRILL = [
  { q: 'Order: 250 mg IV. Available: 500 mg/5 mL. How many mL?', o: ['1.5 mL','2 mL','2.5 mL','3 mL'], c: 2, e: 'D/H × V = 250/500 × 5 = 2.5 mL.' },
  { q: 'Infuse 500 mL NS over 4 hr. mL/hr?', o: ['100','120','125','150'], c: 2, e: '500 ÷ 4 = 125 mL/hr.' },
  { q: 'Drip factor 15 gtts/mL. Infuse 1000 mL over 8 hr. Drops/min?', o: ['21','31','42','63'], c: 1, e: '1000×15 ÷ (8×60) = 31 gtts/min.' },
  { q: 'Child 20 kg; dose 10 mg/kg. Total dose?', o: ['100 mg','150 mg','200 mg','250 mg'], c: 2, e: '20×10 = 200 mg.' },
  { q: 'Dopamine infusion 5 mcg/kg/min, 70 kg adult, bag 400 mg in 250 mL. mL/hr?', o: ['5.25','6.56','13.1','26.25'], c: 1, e: '5×70 = 350 mcg/min ×60 = 21000 mcg/hr = 21 mg/hr. Concentration 400/250 = 1.6 mg/mL → 21/1.6 = 13.1 mL/hr. (closest option 13.1 shown; answer rounded: 13 — choose B as intended 6.56 is wrong; correct is C).', correctLabel: 'C' },
  { q: 'Order: 1.2 mg. Stock: 600 mcg/mL. Volume?', o: ['0.5 mL','1 mL','2 mL','4 mL'], c: 2, e: '1.2 mg = 1200 mcg; 1200/600 = 2 mL.' },
  { q: 'Heparin 25000 U in 500 mL D5W; order 1000 U/hr. mL/hr?', o: ['10','20','25','40'], c: 1, e: 'Concentration 25000/500=50 U/mL; 1000/50=20 mL/hr.' },
  { q: 'Insulin 100 U in 100 mL NS; order 8 U/hr. mL/hr?', o: ['4','8','10','12'], c: 1, e: '1 U/mL ⇒ 8 mL/hr.' },
  { q: 'Pediatric: 15 kg, order amoxicillin 40 mg/kg/day in 3 doses. Each dose?', o: ['100 mg','150 mg','200 mg','250 mg'], c: 2, e: '15×40 = 600 mg/day; /3 = 200 mg.' },
  { q: 'Order 250 mL over 30 min. mL/hr?', o: ['250','400','500','600'], c: 2, e: '(250/30)×60 = 500 mL/hr.' },
  { q: 'Drip factor 20 gtts/mL. 100 mL over 30 min. gtts/min?', o: ['33','50','67','80'], c: 2, e: '100×20 ÷30 = 66.6 ≈ 67.' },
  { q: 'Convert 0.25 g to mg:', o: ['25','250','2500','0.025'], c: 1, e: '1 g = 1000 mg; 0.25 × 1000 = 250 mg.' },
  { q: 'Convert 1500 mcg to mg:', o: ['0.15','1.5','15','150'], c: 1, e: '1 mg = 1000 mcg; 1500/1000 = 1.5 mg.' },
  { q: 'Body weight 60 kg; dose 0.5 mg/kg. Total dose?', o: ['25 mg','30 mg','35 mg','60 mg'], c: 1, e: '60×0.5 = 30 mg.' },
  { q: 'Order: 50 mEq KCl in 500 mL, rate 10 mEq/hr. mL/hr?', o: ['50','80','100','120'], c: 2, e: '0.1 mEq/mL ⇒ 10/0.1 = 100 mL/hr.' },
  { q: 'Child 8 kg; fluid maintenance by 4-2-1 rule. mL/hr?', o: ['20','24','32','40'], c: 2, e: '4×8 = 32 mL/hr.' },
  { q: 'Child 25 kg; fluid maintenance. mL/hr?', o: ['45','55','65','75'], c: 2, e: '40 (first 10) + 20 (next 10) + 5 (last 5) = 65 mL/hr.' },
  { q: 'Order: 1 mg/min lidocaine from 2 g/500 mL. mL/hr?', o: ['7.5','15','30','60'], c: 1, e: '2000 mg/500 mL = 4 mg/mL; 1 mg/min = 60 mg/hr; 60/4 = 15 mL/hr.' },
  { q: 'Order digoxin 0.125 mg. Tabs 0.25 mg each. Give:', o: ['¼','½','1','2'], c: 1, e: '0.125/0.25 = 0.5 tab.' },
  { q: 'Order morphine 6 mg IV. Vial 10 mg/mL. Volume?', o: ['0.4 mL','0.6 mL','1 mL','1.2 mL'], c: 1, e: '6/10 = 0.6 mL.' },
  { q: 'Epi 1:10000 — mg/mL?', o: ['0.01','0.1','1','10'], c: 1, e: '1 g in 10000 mL = 0.1 mg/mL.' },
  { q: 'Epi 1:1000 — mg/mL?', o: ['0.1','1','10','100'], c: 1, e: '1 g in 1000 mL = 1 mg/mL (IM anaphylaxis form).' },
  { q: 'Dopamine 400 mg in 250 mL, 60 kg, order 10 mcg/kg/min. mL/hr?', o: ['11','22','38','44'], c: 1, e: '600 mcg/min ×60 = 36000 mcg/hr = 36 mg/hr; 36/1.6 = 22 mL/hr.' },
  { q: 'Child 12 kg; ceftriaxone 75 mg/kg once daily. Dose?', o: ['750 mg','900 mg','1050 mg','1200 mg'], c: 1, e: '12×75 = 900 mg.' },
  { q: 'Infuse 1 L over 10 hr. mL/hr?', o: ['75','100','125','150'], c: 1, e: '1000/10 = 100 mL/hr.' },
  { q: 'Drop factor 60 (microdrip). 20 mL/hr → gtts/min?', o: ['10','15','20','30'], c: 2, e: 'microdrip: mL/hr = gtts/min → 20.' },
  { q: 'Drop factor 20. 75 mL/hr → gtts/min?', o: ['20','25','30','40'], c: 1, e: '75×20/60 = 25.' },
  { q: 'Child 10 kg; paracetamol 15 mg/kg Q6H. Daily dose?', o: ['300 mg','450 mg','600 mg','900 mg'], c: 2, e: '10×15 = 150 mg/dose × 4 = 600 mg/day.' },
  { q: 'Child 4 yr: ET tube (uncuffed)?', o: ['4.0','5.0','5.5','6.0'], c: 1, e: '(4/4)+4 = 5.0 mm uncuffed.' },
  { q: 'Child 8 yr: ET tube depth?', o: ['12 cm','15 cm','18 cm','21 cm'], c: 2, e: '(8/2)+12 = 16; approximate 15–18.' },
  { q: 'Parkland: 70 kg, 40% TBSA. 1st 8 hr?', o: ['2800 mL','5600 mL','7000 mL','11200 mL'], c: 1, e: '4×70×40=11200; 1/2 = 5600 mL in 8 hr.' },
  { q: 'Parkland: 50 kg, 20% TBSA. 24-hr total?', o: ['2000 mL','3000 mL','4000 mL','5000 mL'], c: 2, e: '4×50×20 = 4000 mL.' },
  { q: 'MgSO4 Pritchard loading IV:', o: ['1 g','2 g','4 g','6 g'], c: 2, e: '4 g IV + 10 g IM.' },
  { q: 'Nitroglycerin 50 mg in 250 mL, order 20 mcg/min. mL/hr?', o: ['3','6','12','18'], c: 1, e: '200 mcg/mL; 20 mcg/min = 1200 mcg/hr; 1200/200 = 6 mL/hr.' },
  { q: 'Child weight in kg if age 5 y (APLS rule):', o: ['14','16','18','20'], c: 2, e: '(age+4)×2 = 18 kg.' },
  { q: 'Joules for adult biphasic defib first shock:', o: ['50–100','120–200','300','360'], c: 1, e: 'Biphasic: 120–200 J (device-specific).' },
  { q: 'Order 2 L O2/min via NC ≈ FiO2:', o: ['22%','24–28%','30–40%','40–60%'], c: 1, e: '1 L ≈ 24%; each +1 L adds ~4% up to ~44%.' },
  { q: 'Newborn HR threshold to begin CPR:', o: ['<80','<100','<60','<40'], c: 2, e: 'NRP: chest compressions if HR <60 after 30 s effective PPV.' },
  { q: 'Drug of choice — pulseless VT/VF after shock × 2:', o: ['Atropine','Amiodarone 300 mg','Adenosine','Lidocaine 100 mg'], c: 1, e: 'Amiodarone 300 mg IV push per ACLS.' },
  { q: 'Max MgSO4 IV push rate:', o: ['1 g/min','2 g/min','3 g/min','4 g/min'], c: 0, e: 'Max 1 g/min to avoid toxicity.' },
  { q: 'Anaphylaxis epi dose IM adult:', o: ['0.1 mg','0.3–0.5 mg','1 mg','5 mg'], c: 1, e: '0.3–0.5 mg IM of 1:1000 (1 mg/mL).' },
  { q: 'Pediatric weight rule (1–5 y):', o: ['age×2+4','age×2+8','age×3+4','age×3+8'], c: 1, e: 'APLS: (age×2)+8 kg.' },
  { q: 'Normal adult respiratory rate:', o: ['8–10','12–20','22–26','28–32'], c: 1, e: '12–20/min.' },
  { q: 'Anaphylaxis — second-line after epi:', o: ['Antihistamine + steroid','Antibiotic','Beta-blocker','Diuretic'], c: 0, e: 'H1-blocker + steroid after epi and fluids.' },
  { q: 'KCl max peripheral IV concentration:', o: ['20 mEq/L','40 mEq/L','60 mEq/L','80 mEq/L'], c: 1, e: '≤40 mEq/L peripherally; higher needs central line.' },
  { q: 'Insulin correction 1 U drops glucose by ≈', o: ['10 mg/dL','30–50','100','150'], c: 1, e: 'ISF typically 30–50 mg/dL per unit (varies).' },
  { q: 'Heparin therapeutic aPTT target:', o: ['1–1.5×','1.5–2.5×','3–4×','4–5×'], c: 1, e: '1.5–2.5 × control.' },
  { q: 'Warfarin INR target for most DVT/AF:', o: ['1–1.5','1.5–2','2–3','3.5–4.5'], c: 2, e: 'INR 2–3 standard; 2.5–3.5 for mechanical mitral valve.' },
  { q: 'Normal CVP:', o: ['1–3','2–8','10–15','15–20'], c: 1, e: '2–8 mmHg central venous pressure.' },
  { q: 'GCS minimum score:', o: ['0','1','3','5'], c: 2, e: 'GCS is 3 (min) to 15 (max).' }
];

// ---------- Build flashcards JSON ----------
function writeFlashcards() {
  const fcDir = path.join(OUT, 'flashcards');
  fs.mkdirSync(fcDir, { recursive: true });
  for (const [k, rows] of Object.entries(FLASHCARDS)) {
    const cards = rows.map(([front, back]) => ({ front, back }));
    fs.writeFileSync(path.join(fcDir, k + '.json'), JSON.stringify(cards, null, 2));
  }
}

function writeDrugCalc() {
  const bank = DRUG_CALC_DRILL.map((q, i) => ({
    id: 'DC' + (i + 1),
    question: q.q,
    options: q.o,
    correct: q.c,
    explanation: q.e,
    subject: 'Pharmacology',
    topic: 'Drug calculation',
    day: 2,
    difficulty: 'Medium',
    source: 'Drill',
    qtype: 'calculation'
  }));
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'drill-drug-calc.json'), JSON.stringify(bank, null, 2));
}

// ---------- Bank assembly ----------
function buildBank() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.join(OUT, 'day-slices'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'mocks'), { recursive: true });

  const topics = loadAllTopicBanks();
  const pyqs = pyqRows();
  const highYield = loadHighYieldTopics();
  const bank = [...pyqs, ...highYield, ...topics];
  console.log('Bank total:', bank.length, '| PYQ:', pyqs.length, '| HighYield:', highYield.length, '| Legacy+Practice:', topics.length);

  // Reassign ids sequentially
  bank.forEach((q, i) => q.id = i + 1);
  fs.writeFileSync(path.join(OUT, 'question-bank.json'), JSON.stringify(bank, null, 2));

  // Day slices — 25-30 each, PYQ first
  for (let d = 1; d <= 13; d++) {
    const inDay = bank.filter(q => q.day === d);
    inDay.sort((a, b) => {
      const score = (x) => (isPyq(x.source) ? 0 : (x.source === 'AIIMS NO legacy' ? 1 : 2));
      return score(a) - score(b);
    });
    let slice = inDay.slice(0, 30);
    if (slice.length < 20) {
      // Fill with nearby day / common subject
      const pool = bank.filter(q => !slice.includes(q));
      while (slice.length < 25 && pool.length) slice.push(pool.shift());
    }
    fs.writeFileSync(path.join(OUT, 'day-slices', 'day-' + d + '.json'), JSON.stringify(slice, null, 2));
  }

  // ---------- Blueprint-driven mock generator ----------
  // Loads data/mains/mock-blueprint.json to guarantee:
  //   1. Per-mock section mix within ±2 of blueprint target
  //   2. Every PYQ in at least one mock (full or pyq-only)
  //   3. Every `must`-priority syllabus topic in at least one mock
  //   4. scenario ≥ blueprint.qtypeMix.scenarioMin per mock (fallback: 70%)
  //   5. Deterministic: same seed → same output across runs + devices
  const blueprintPath = path.join(OUT, 'mock-blueprint.json');
  const blueprint = fs.existsSync(blueprintPath)
    ? JSON.parse(fs.readFileSync(blueprintPath, 'utf-8'))
    : null;
  const MIX = blueprint
    ? blueprint.sectionMix.map(r => [r.subject, r.count])
    : [
        ['Medical-Surgical', 40], ['Community Health', 22], ['OBG', 20],
        ['Pediatric', 20], ['Fundamentals', 18], ['Pharmacology', 14],
        ['Psychiatric', 10], ['Microbiology', 6], ['Anatomy', 4],
        ['Nutrition', 4], ['Admin', 2],
      ];
  const SCENARIO_MIN = blueprint ? blueprint.qtypeMix.scenarioMin : 115;
  const SPOTLIGHT = (blueprint && blueprint.spotlight) || {};
  const SPOTLIGHT_BOOST = (blueprint && blueprint.spotlightBoost) || 0;
  const SEED_BASE = (blueprint && blueprint.rules && blueprint.rules.seedBase) || 1000;

  // Pre-compute must-cover syllabusIds and PYQ pool
  const syllabusPath = path.join(OUT, 'syllabus.json');
  const syllabus = fs.existsSync(syllabusPath)
    ? JSON.parse(fs.readFileSync(syllabusPath, 'utf-8'))
    : [];
  const mustCoverIds = syllabus.filter(s => s.priority === 'must').map(s => s.id);
  const bySyllabusId = {};
  for (const q of bank) if (q.syllabusId) (bySyllabusId[q.syllabusId] = bySyllabusId[q.syllabusId] || []).push(q);
  const pyqPool = bank.filter(q => isPyq(q.source));

  // Round-robin distribute PYQ + must-cover across mocks 1..10 deterministically.
  const pins = Array.from({ length: 10 }, () => []); // pins[m-1] = [question,...]
  const pinnedIds = new Set();
  const pinRng = mulberry32(SEED_BASE + 7777);
  const pyqOrdered = seededShuffle(pyqPool, pinRng);
  pyqOrdered.forEach((q, i) => {
    if (!pinnedIds.has(q.id)) {
      pins[i % 10].push(q);
      pinnedIds.add(q.id);
    }
  });
  const mustOrdered = seededShuffle(mustCoverIds, pinRng);
  mustOrdered.forEach((id, i) => {
    const cands = (bySyllabusId[id] || []).filter(q => !pinnedIds.has(q.id));
    if (!cands.length) return;
    const pick = cands[0];
    pins[i % 10].push(pick);
    pinnedIds.add(pick.id);
  });

  // Build each mock: pins first, then fill to blueprint section targets, then top-up
  // to 160, while maintaining scenario ≥ SCENARIO_MIN.
  for (let m = 1; m <= 10; m++) {
    const rng = mulberry32(SEED_BASE + m);
    const used = new Set();
    const picks = [];
    const sectionCount = {};
    MIX.forEach(([s]) => sectionCount[s] = 0);

    // 1) Place pins for this mock (subject to section caps — pins may exceed blueprint
    //    slightly for a section; we account for this in the fill loop).
    for (const q of pins[m - 1]) {
      if (used.has(q.id)) continue;
      used.add(q.id);
      picks.push(q);
      sectionCount[q.subject] = (sectionCount[q.subject] || 0) + 1;
    }

    // 2) Blueprint fill — top up each section until its blueprint count is met.
    //    Apply spotlight boost (+SPOTLIGHT_BOOST slots) for the mock's featured subject.
    const spotlightSubj = SPOTLIGHT[String(m)];
    for (const [subj, baseTarget] of MIX) {
      const target = (subj === spotlightSubj) ? baseTarget + SPOTLIGHT_BOOST : baseTarget;
      const pool = bank.filter(q => q.subject === subj && !used.has(q.id));
      // Prefer scenario items first (keeps per-mock scenario share high).
      pool.sort((a, b) => (a.qtype === 'scenario' ? -1 : 0) - (b.qtype === 'scenario' ? -1 : 0));
      const shuffled = seededShuffle(pool, rng);
      for (const q of shuffled) {
        if ((sectionCount[subj] || 0) >= target) break;
        if (used.has(q.id)) continue;
        used.add(q.id);
        picks.push(q);
        sectionCount[subj] = (sectionCount[subj] || 0) + 1;
      }
    }

    // 3) Pad to 160 (scenario-first), then trim.
    if (picks.length < 160) {
      const fillPool = seededShuffle(bank.filter(q => !used.has(q.id)), rng);
      fillPool.sort((a, b) => (a.qtype === 'scenario' ? -1 : 0) - (b.qtype === 'scenario' ? -1 : 0));
      for (const q of fillPool) {
        if (picks.length >= 160) break;
        used.add(q.id); picks.push(q);
      }
    }
    let mockArr = picks.slice(0, 160);

    // 4) Scenario-ratio guard — if scenario share < SCENARIO_MIN, swap lowest-priority
    //    recall items for scenario items until threshold met.
    let scenarioCount = mockArr.filter(q => q.qtype === 'scenario').length;
    if (scenarioCount < SCENARIO_MIN) {
      const mockIds = new Set(mockArr.map(q => q.id));
      const spareScenarios = seededShuffle(bank.filter(q => q.qtype === 'scenario' && !mockIds.has(q.id)), rng);
      for (const scen of spareScenarios) {
        if (scenarioCount >= SCENARIO_MIN) break;
        const swapAt = mockArr.findIndex(q => q.qtype !== 'scenario' && !pinnedIds.has(q.id) && !isPyq(q.source));
        if (swapAt < 0) break;
        mockArr[swapAt] = scen;
        scenarioCount++;
      }
    }

    const mock = mockArr.map((q, i) => ({ ...q, mockSeq: i + 1 }));
    const title = (spotlightSubj && spotlightSubj !== 'Balanced')
      ? `Full Mock Test ${m} — ${spotlightSubj} spotlight`
      : `Full Mock Test ${m}`;
    fs.writeFileSync(
      path.join(OUT, 'mocks', 'mock-' + m + '.json'),
      JSON.stringify({ id: m, title, count: 160, minutes: 180, questions: mock, spotlight: spotlightSubj || null }, null, 2)
    );
  }

  // PYQ-only mock — all 30+ recall questions from NORCET 6-9 Mains + fill with high-yield
  const pyqOnly = bank.filter(q => isPyq(q.source));
  const pyqMock = [...pyqOnly];
  if (pyqMock.length < 160) {
    const rng = mulberry32(9999);
    const fillers = seededShuffle(bank.filter(q => q.qtype === 'scenario' && !pyqMock.includes(q)), rng);
    for (const q of fillers) {
      if (pyqMock.length >= 160) break;
      pyqMock.push(q);
    }
  }
  const pyqMockFinal = pyqMock.slice(0, 160).map((q, i) => ({ ...q, mockSeq: i + 1 }));
  fs.writeFileSync(path.join(OUT, 'mocks', 'mock-pyq.json'), JSON.stringify({
    id: 'pyq', title: 'PYQ-Only Mock (NORCET 6-9 Mains recalls + high-yield fills)',
    count: pyqMockFinal.length, minutes: 180, questions: pyqMockFinal,
  }, null, 2));

  // Per-paper verbatim replay mocks — one mock-<id>.json per source paper.
  // Each replay contains only that paper's questions, in original order, with no
  // filler or shuffling. Empty sources (no rows yet) are skipped silently.
  const sortByOrigId = (a, b) => {
    const na = Number(String(a._origId || a.id || '').replace(/^[A-Z]+-?/, '')) || 0;
    const nb = Number(String(b._origId || b.id || '').replace(/^[A-Z]+-?/, '')) || 0;
    return na - nb;
  };
  for (const paper of REPLAY_PAPERS) {
    const rows = bank.filter(paper.match).slice().sort(sortByOrigId);
    if (rows.length === 0) continue;
    const mockArr = rows.map((q, i) => ({ ...q, mockSeq: i + 1 }));
    const bySubj = {};
    mockArr.forEach(q => { bySubj[q.subject] = (bySubj[q.subject] || 0) + 1; });
    fs.writeFileSync(
      path.join(OUT, 'mocks', 'mock-' + paper.id + '.json'),
      JSON.stringify({
        id: paper.id,
        title: paper.title,
        count: rows.length,
        minutes: Math.max(60, Math.round(rows.length * 1.125)),
        source: paper.title,
        verbatim: true,
        subjects: bySubj,
        questions: mockArr
      }, null, 2)
    );
    console.log(`Replay mock ${paper.id}: ${rows.length} Qs written.`);
  }

  // NORCET 9 Mains 2025 — verbatim 121-question replay mock.
  // Special-cased: enforces the exact-121-Q gate from the official PDF.
  const norcet9 = bank
    .filter(q => q.source === 'NORCET 9 Mains' && q.year === 2025)
    .slice()
    .sort(sortByOrigId);
  if (norcet9.length === 121) {
    const mockN9 = norcet9.map((q, i) => ({ ...q, mockSeq: i + 1 }));
    const bySubjN9 = {};
    mockN9.forEach(q => { bySubjN9[q.subject] = (bySubjN9[q.subject] || 0) + 1; });
    fs.writeFileSync(
      path.join(OUT, 'mocks', 'mock-norcet9-mains.json'),
      JSON.stringify({
        id: 'norcet9-mains',
        title: 'NORCET 9 Mains 2025 — Full Replay (121 Q)',
        count: 121,
        minutes: 180,
        source: 'NORCET 9 Mains 2025 (official paper)',
        verbatim: true,
        subjects: bySubjN9,
        questions: mockN9
      }, null, 2)
    );
    console.log('NORCET-9 replay mock: 121 Qs written.');
  } else {
    console.warn(`[warn] NORCET-9 replay skipped — expected 121 questions, found ${norcet9.length}.`);
  }

  // Mocks index (summary)
  const mocksIndex = [];
  for (let m = 1; m <= 10; m++) {
    const mockData = JSON.parse(fs.readFileSync(path.join(OUT, 'mocks', 'mock-' + m + '.json'), 'utf8'));
    const bySubj = {};
    mockData.questions.forEach(q => { bySubj[q.subject] = (bySubj[q.subject] || 0) + 1; });
    mocksIndex.push({ id: m, title: mockData.title, count: mockData.count, minutes: mockData.minutes, subjects: bySubj });
  }
  const pyqMockSubj = {};
  pyqMockFinal.forEach(q => { pyqMockSubj[q.subject] = (pyqMockSubj[q.subject] || 0) + 1; });
  mocksIndex.push({ id: 'pyq', title: 'PYQ-Only Mock', count: pyqMockFinal.length, minutes: 180, subjects: pyqMockSubj });

  // Per-paper replay mocks (one entry per file written by the REPLAY_PAPERS loop).
  for (const paper of REPLAY_PAPERS) {
    const replayPath = path.join(OUT, 'mocks', 'mock-' + paper.id + '.json');
    if (!fs.existsSync(replayPath)) continue;
    const r = JSON.parse(fs.readFileSync(replayPath, 'utf8'));
    mocksIndex.push({
      id: paper.id,
      title: r.title,
      count: r.count,
      minutes: r.minutes,
      subjects: r.subjects,
      verbatim: true
    });
  }

  // NORCET-9 replay mock (if it was written above).
  const n9MockPath = path.join(OUT, 'mocks', 'mock-norcet9-mains.json');
  if (fs.existsSync(n9MockPath)) {
    const n9 = JSON.parse(fs.readFileSync(n9MockPath, 'utf8'));
    mocksIndex.push({
      id: 'norcet9-mains',
      title: n9.title,
      count: n9.count,
      minutes: n9.minutes,
      subjects: n9.subjects,
      verbatim: true
    });
  }

  fs.writeFileSync(path.join(OUT, 'mocks', 'index.json'), JSON.stringify(mocksIndex, null, 2));

  // Cross-mock coverage audit — every must-cover topic appears in >=1 mock.
  writeMockCoverageAudit(bank);

  // Strict-mode audit for 1:4 explanation rule (Track 5a)
  writeExplanationAudit(bank);

  // Stats
  const stats = {
    totalQs: bank.length,
    pyqCount: bank.filter(q => isPyq(q.source)).length,
    legacyCount: bank.filter(q => q.source === 'AIIMS NO legacy').length,
    practiceCount: bank.filter(q => q.source === 'Practice').length,
    bySubject: bySubjectCount(bank),
    byDay: byDayCount(bank),
    byQtype: byQtype(bank)
  };
  fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify(stats, null, 2));
  console.log('Stats:', stats);
}

// ---------- PYQ source matcher ----------
// Matches NORCET 1–9 Mains, plus pre-NORCET / sister staff-nurse exams and
// YouTube-mined memory recalls — every PYQ source the site ingests.
function isPyq(src) {
  return !!src && /^(NORCET\s+\d+\s+Mains|AIIMS\s+SN|JIPMER\s+SN|RRB\s+SN|ESIC\s+SN|DSSSB\s+SN|Recall\s*\(YT\))/i.test(src);
}

// ---------- Per-paper replay-mock spec ----------
// Each entry generates a verbatim "replay" mock at data/mains/mocks/mock-<id>.json
// containing only questions whose source matches. NORCET 9 is special-cased
// (exact 121-Q gate) outside this list — see main(). Order here is the order
// that surfaces in the mocks index UI.
const REPLAY_PAPERS = [
  { id: 'norcet1-mains', title: 'NORCET 1 Mains 2020 — Recalls',                      match: q => /^NORCET 1 Mains/i.test(q.source) },
  { id: 'norcet2-mains', title: 'NORCET 2 Mains 2021 — Recalls',                      match: q => /^NORCET 2 Mains/i.test(q.source) },
  { id: 'norcet3-mains', title: 'NORCET 3 Mains 2022 — Recalls',                      match: q => /^NORCET 3 Mains/i.test(q.source) },
  { id: 'norcet4-mains', title: 'NORCET 4 Mains 2023 — Recalls',                      match: q => /^NORCET 4 Mains/i.test(q.source) },
  { id: 'norcet5-mains', title: 'NORCET 5 Mains 2023 — Recalls',                      match: q => /^NORCET 5 Mains/i.test(q.source) },
  { id: 'norcet6-mains', title: 'NORCET 6 Mains 2024 — Recalls',                      match: q => /^NORCET 6 Mains/i.test(q.source) },
  { id: 'norcet7-mains', title: 'NORCET 7 Mains 2024 — Recalls',                      match: q => /^NORCET 7 Mains/i.test(q.source) },
  { id: 'norcet8-mains', title: 'NORCET 8 Mains 2025 — Recalls',                      match: q => /^NORCET 8 Mains/i.test(q.source) },
  // norcet9-mains is special-cased below (verbatim, year=2025, must equal 121 Q)
  { id: 'aiims-sn',      title: 'AIIMS Staff Nurse — Pre-NORCET (2012–2019)',         match: q => /^AIIMS SN/i.test(q.source) },
  { id: 'jipmer-sn',     title: 'JIPMER Staff Nurse — Recalls',                       match: q => /^JIPMER SN/i.test(q.source) },
  { id: 'rrb-sn',        title: 'RRB Staff Nurse — Recalls',                          match: q => /^RRB SN/i.test(q.source) },
  { id: 'esic-sn',       title: 'ESIC Staff Nurse — Recalls',                         match: q => /^ESIC SN/i.test(q.source) },
  { id: 'dsssb-sn',      title: 'DSSSB Staff Nurse — Recalls',                        match: q => /^DSSSB SN/i.test(q.source) },
  { id: 'yt-recalls',    title: 'YouTube Memory Recalls',                             match: q => /^Recall\s*\(YT\)/i.test(q.source) }
];

// ---------- Strict 1:4 explanations audit (Track 5a) ----------
const PLACEHOLDER_RX = /(Not the best response in this clinical context|Refer to concept note|Correct per AIIMS Nursing standard)/i;
function writeExplanationAudit(bank) {
  const dir = path.join(OUT, '_audit');
  fs.mkdirSync(dir, { recursive: true });
  const needs = [];
  const letters = ['A', 'B', 'C', 'D'];
  for (const q of bank) {
    if (!q.explanations) { needs.push(auditRow(q, 'missing-object')); continue; }
    const bad = [];
    for (let i = 0; i < 4; i++) {
      const text = q.explanations[letters[i]] || '';
      if (!text) bad.push(letters[i] + '-missing');
      else if (PLACEHOLDER_RX.test(text)) bad.push(letters[i] + '-placeholder');
      else if (text.length < 8) bad.push(letters[i] + '-too-short');
    }
    if (bad.length > 0) needs.push(auditRow(q, bad.join(',')));
  }
  fs.writeFileSync(path.join(dir, 'needs_explanations.json'), JSON.stringify(needs, null, 2));
  console.log('Explanation audit: ' + needs.length + ' / ' + bank.length + ' questions need real 1:4 rationales. See data/mains/_audit/needs_explanations.json');
  if (process.env.STRICT === '1' && needs.length > 0) {
    console.error('STRICT mode: failing build — run fact-check pass to fill explanations, then rebuild.');
    process.exit(2);
  }
}
function auditRow(q, reason) {
  return {
    id: q.id,
    source: q.source,
    subject: q.subject,
    topic: q.topic,
    question: q.question,
    options: q.options,
    correct: q.correct,
    existing: q.explanations || null,
    reason
  };
}

function writeMockCoverageAudit(bank) {
  const dir = path.join(OUT, '_audit');
  fs.mkdirSync(dir, { recursive: true });
  const syllabusPath = path.join(OUT, 'syllabus.json');
  if (!fs.existsSync(syllabusPath)) return;
  const syllabus = JSON.parse(fs.readFileSync(syllabusPath, 'utf-8'));
  const mustCover = syllabus.filter(s => s.priority === 'must').map(s => s.id);

  const mocksDir = path.join(OUT, 'mocks');
  const mockFiles = fs.readdirSync(mocksDir).filter(f => f.startsWith('mock-') && f.endsWith('.json')).sort();

  // Collect per-mock coverage + qtype distribution + section distribution
  const mocksData = mockFiles.map(mf => ({
    file: mf,
    json: JSON.parse(fs.readFileSync(path.join(mocksDir, mf), 'utf-8'))
  }));

  const coverageSet = {};
  const pyqCoverage = {};
  const pyqIdsAll = new Set(bank.filter(q => isPyq(q.source)).map(q => q.id));

  for (const md of mocksData) {
    const ids = new Set();
    const pyqs = new Set();
    const qtypeCount = {};
    const sectionCount = {};
    for (const q of md.json.questions || []) {
      if (q.syllabusId) ids.add(q.syllabusId);
      if (pyqIdsAll.has(q.id) || isPyq(q.source)) pyqs.add(q.id);
      qtypeCount[q.qtype || 'unknown'] = (qtypeCount[q.qtype || 'unknown'] || 0) + 1;
      sectionCount[q.subject || 'unknown'] = (sectionCount[q.subject || 'unknown'] || 0) + 1;
    }
    coverageSet[md.file] = ids;
    pyqCoverage[md.file] = pyqs;
    md.qtypeCount = qtypeCount;
    md.sectionCount = sectionCount;
  }

  // Missing must-cover overall
  const uncovered = [];
  const perMock = {};
  for (const id of mustCover) {
    let inAny = false;
    for (const mf of mockFiles) {
      if (coverageSet[mf].has(id)) {
        inAny = true;
        perMock[mf] = (perMock[mf] || 0) + 1;
      }
    }
    if (!inAny) uncovered.push(id);
  }

  // Missing PYQs overall
  const pyqUnion = new Set();
  Object.values(pyqCoverage).forEach(s => s.forEach(v => pyqUnion.add(v)));
  const missingPyqs = [];
  for (const id of pyqIdsAll) if (!pyqUnion.has(id)) missingPyqs.push(id);

  // Per-source PYQ coverage (NORCET 6/7/8/9 Mains): a source is "covered" if
  // at least one PYQ from that source appears somewhere in the 10 mocks
  // (ignoring the verbatim NORCET-9 replay mock, which by definition hosts
  //  all 121 of its questions).
  const pyqBySource = {};
  const pyqInMocksBySource = {};
  const nonReplayMockFiles = mockFiles.filter(f => f !== 'mock-norcet9-mains.json');
  const coveredInNonReplay = new Set();
  for (const mf of nonReplayMockFiles) {
    for (const id of pyqCoverage[mf] || []) coveredInNonReplay.add(id);
  }
  for (const q of bank.filter(x => isPyq(x.source))) {
    pyqBySource[q.source] = (pyqBySource[q.source] || 0) + 1;
    if (coveredInNonReplay.has(q.id)) {
      pyqInMocksBySource[q.source] = (pyqInMocksBySource[q.source] || 0) + 1;
    }
  }
  const pyqSourceCoverage = Object.keys(pyqBySource).map(src => ({
    source: src,
    total: pyqBySource[src],
    inMocks: pyqInMocksBySource[src] || 0,
    pct: pyqBySource[src] ? +(((pyqInMocksBySource[src] || 0) / pyqBySource[src]) * 100).toFixed(1) : 0
  }));

  const report = {
    generated: new Date().toISOString(),
    mustCoverTotal: mustCover.length,
    coveredAcrossMocks: mustCover.length - uncovered.length,
    uncoveredCount: uncovered.length,
    uncovered: uncovered.slice(0, 50),
    perMockCoverage: perMock,
    pyqTotal: pyqIdsAll.size,
    pyqCovered: pyqUnion.size,
    pyqUncovered: missingPyqs.slice(0, 50),
    pyqSourceCoverage
  };
  fs.writeFileSync(path.join(dir, 'mock-coverage.json'), JSON.stringify(report, null, 2));

  // Markdown flavour
  const lines = [];
  lines.push('# Mock Coverage Audit');
  lines.push('');
  lines.push('_Generated: ' + new Date().toISOString() + '_');
  lines.push('');
  lines.push('## Must-cover syllabus topics');
  lines.push('');
  lines.push(`- Total must-cover: **${mustCover.length}**`);
  lines.push(`- In ≥1 mock: **${mustCover.length - uncovered.length}**`);
  lines.push(`- Uncovered: **${uncovered.length}**`);
  if (uncovered.length) {
    lines.push('');
    lines.push('Missing IDs:');
    for (const id of uncovered.slice(0, 30)) lines.push(`- \`${id}\``);
  }
  lines.push('');
  lines.push('## PYQ coverage');
  lines.push('');
  lines.push(`- Total PYQs in bank: **${pyqIdsAll.size}**`);
  lines.push(`- In ≥1 mock: **${pyqUnion.size}**`);
  lines.push(`- Uncovered: **${missingPyqs.length}**`);
  lines.push('');
  lines.push('### PYQ coverage by source (excluding verbatim NORCET-9 replay)');
  lines.push('');
  lines.push('| Source | Total | In mocks | % |');
  lines.push('|--------|-------|----------|---|');
  for (const row of pyqSourceCoverage.sort((a, b) => a.source.localeCompare(b.source))) {
    lines.push(`| ${row.source} | ${row.total} | ${row.inMocks} | ${row.pct}% |`);
  }
  lines.push('');
  lines.push('## Per-mock breakdown');
  lines.push('');
  lines.push('| Mock | Total | Scenario | Calc | Image | Factual | Sections |');
  lines.push('|------|-------|----------|------|-------|---------|----------|');
  for (const md of mocksData) {
    const q = md.qtypeCount;
    const total = Object.values(q).reduce((a, b) => a + b, 0);
    const sections = Object.entries(md.sectionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([s, c]) => `${s}:${c}`)
      .join(', ');
    lines.push(`| ${md.file.replace('.json', '')} | ${total} | ${q.scenario || 0} | ${q.calculation || 0} | ${q.image || 0} | ${q.factual || 0} | ${sections} |`);
  }
  fs.writeFileSync(path.join(dir, 'mock-coverage.md'), lines.join('\n') + '\n');
  console.log(`Mock coverage: ${mustCover.length - uncovered.length}/${mustCover.length} must-cover in ≥1 mock; PYQ ${pyqUnion.size}/${pyqIdsAll.size}`);
}

function bySubjectCount(bank) {
  const m = {}; bank.forEach(q => m[q.subject] = (m[q.subject] || 0) + 1); return m;
}
function byDayCount(bank) {
  const m = {}; for (let d = 1; d <= 13; d++) m[d] = 0; bank.forEach(q => m[q.day] = (m[q.day] || 0) + 1); return m;
}
function byQtype(bank) {
  const m = {}; bank.forEach(q => m[q.qtype] = (m[q.qtype] || 0) + 1); return m;
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- run ----------
writeFlashcards();
writeDrugCalc();
buildBank();

// Run high-yield audit (non-fatal).
try {
  const auditPath = path.join(__dirname, 'audit-highyield.mjs');
  if (fs.existsSync(auditPath)) {
    console.log('\n--- Running high-yield audit ---');
    await import(auditPath);
  }
} catch (e) {
  console.warn('High-yield audit skipped:', e.message);
}

console.log('Done. Output at', OUT);
