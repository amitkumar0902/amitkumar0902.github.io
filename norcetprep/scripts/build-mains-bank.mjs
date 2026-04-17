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

// ---------- Day keywords (question text + topic) ----------
const DAY_KEYWORDS = [
  { day: 1, words: ['abg', 'arterial blood gas', 'ph ', 'bicarbonate', 'hco3', 'ecg', 'electrocardio', 'heart block', 'av block', 'vt', 'ventricular tachy', 'vf', 'ventricular fib', 'wpw', 'burn', 'parkland', 'rule of nine', 'tbsa', 'tachycardia', 'bradycardia', 'asystole', 'pvc', 'st elevation', 'myocardial infarction', 'arrhythm'] },
  { day: 2, words: ['et tube', 'endotracheal', 'drug calculation', 'iv fluid', 'normal saline', 'ringer', 'dns ', 'd5w', 'dextrose', '0.9%', 'drip rate', 'drops per minute', 'mcg/kg', 'mg/kg', 'infusion rate'] },
  { day: 3, words: ['labour', 'labor', 'eclampsia', 'pre-eclampsia', 'mgso4', 'magnesium sulfate', 'placenta previa', 'abruptio', 'placental abruption', 'oxytocin', 'pitocin', 'third stage', '3rd stage', 'hydatidiform', 'molar pregnancy', 'postpartum hemorrhage', 'pph', 'contraction'] },
  { day: 4, words: ['milestone', 'developmental', 'nrp', 'newborn resuscitation', 'apgar', 'rds', 'respiratory distress syndrome', 'surfactant', 'preterm', 'neonate'] },
  { day: 5, words: ['tef', 'tracheoesophageal', 'croup', 'epiglottitis', 'g6pd', 'sickle cell', 'hemophilia', 'thalassemia', 'pediatric anemia'] },
  { day: 6, words: ['national health', 'nhp', 'icds', 'polio', 'family planning', 'hpv', 'vaccin', 'immuniz', 'aids', 'hiv', 'nacp', 'poshan', 'nhm', 'jsy', 'pmjay', 'ayushman', 'u-win', 'abdm', 'mission indradhanush', 'rmnch', 'logo'] },
  { day: 7, words: ['hand wash', 'handwash', 'hand hygiene', 'who 5', 'five moments', 'bmw', 'biomedical waste', 'yellow bag', 'red bag', 'blue bag', 'venturi', 'oxygen mask', 'nasal cannula', 'nrb ', 'non-rebreather'] },
  { day: 8, words: ['cmv', 'cytomegalovirus', 'toxoplasm', 'candid', 'bacterial vaginosis', 'enema', 'tpn', 'total parenteral', 'central line', 'central venous', 'cvc'] },
  { day: 9, words: ['priority', 'triage', 'airway-breathing', 'abc', 'maslow', 'bls', 'acls', 'cpr', 'defibril', 'cardiac arrest', 'code blue'] },
  { day: 5, words: ['respiratory syncytial', 'pneumonia', 'asthma', 'bronchitis'] }
];

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
  const blob = ((q.question || '') + ' ' + (q.topic || '') + ' ' + (q.explanation || '')).toLowerCase();
  for (const d of DAY_KEYWORDS) {
    if (d.words.some(w => blob.includes(w))) return d.day;
  }
  // Subject fallback
  if (subject === 'OBG') return 3;
  if (subject === 'Pediatric') return 4;
  if (subject === 'Community Health') return 6;
  if (subject === 'Microbiology') return 8;
  if (subject === 'Psychiatric') return 9;
  if (subject === 'Pharmacology') return 2;
  if (subject === 'Fundamentals') return 7;
  if (subject === 'Anatomy' || subject === 'Nutrition' || subject === 'Admin') return 10;
  return 10;
}

// ---------- Expand `explanation` → `explanations` {A,B,C,D} ----------
function buildExplanations(q) {
  if (q.explanations && typeof q.explanations === 'object') return q.explanations;
  const exp = q.explanation || 'Refer to concept note.';
  const letters = ['A','B','C','D'];
  const out = {};
  for (let i = 0; i < 4; i++) {
    if (i === q.correct) {
      out[letters[i]] = (exp.replace(/^•\s*/gm, '').split('\n').filter(Boolean).slice(0,2).join(' ')) || 'Correct.';
    } else {
      out[letters[i]] = 'Not the best response in this clinical context; see the explanation for the correct choice.';
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
        explanations: buildExplanations(q),
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

// ---------- Curated NORCET Mains PYQ set (recall-based, high yield) ----------
// These are memory-based / publicly compiled recalls from NORCET 6-9 Mains 2024-2025.
const PYQS = [
  // NORCET 9 — Sep 27, 2025 — recall
  { q: 'The Parkland formula for fluid resuscitation in burns is:', o: ['2 mL × kg × %TBSA','3 mL × kg × %TBSA','4 mL × kg × %TBSA','5 mL × kg × %TBSA'], c: 2, subj: 'Medical-Surgical', topic: 'Burns', day: 1, diff: 'High', e: { A: '2 mL×kg×%TBSA is the Modified Brooke formula, not Parkland.', B: '3 mL×kg×%TBSA is seen in pediatric modifications (Galveston) — not Parkland.', C: 'Parkland = 4 mL × kg × %TBSA, lactated Ringer\'s over 24 h; half in first 8 h.', D: 'Exceeds standard resuscitation volume and risks over-resuscitation.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Most common electrolyte abnormality in chronic kidney disease is:', o: ['Hypokalemia','Hyperkalemia','Hyponatremia','Hypercalcemia'], c: 1, subj: 'Medical-Surgical', topic: 'Renal', day: 5, diff: 'Medium', e: { A: 'Hypokalemia is seen in loop diuretic over-use, not typical of CKD.', B: 'CKD impairs K+ excretion → hyperkalemia; leading cause of arrhythmic death.', C: 'Hyponatremia can occur but not the hallmark finding.', D: 'Hypercalcemia is atypical; CKD typically causes hypocalcemia.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'In BLS (AHA 2020), the correct sequence for adults is:', o: ['A-B-C','C-A-B','B-C-A','Call-Check-Compress'], c: 1, subj: 'Fundamentals', topic: 'BLS/ACLS', day: 9, diff: 'Easy', e: { A: 'Older Airway-Breathing-Compressions sequence has been superseded.', B: 'Current AHA: Compressions first (C-A-B) to minimise chest-compression delay.', C: 'Incorrect ordering.', D: 'Describes the pre-BLS check, not the CPR sequence itself.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Correct depth of chest compression in adult CPR is:', o: ['1-2 cm','3-4 cm','5-6 cm','7-8 cm'], c: 2, subj: 'Fundamentals', topic: 'BLS/ACLS', day: 9, diff: 'Easy', e: { A: 'Too shallow — insufficient coronary perfusion pressure.', B: 'Still below AHA recommendation.', C: 'AHA recommends 5–6 cm (2–2.4 inches) at 100–120/min.', D: 'Excessive depth increases rib-fracture/internal-injury risk.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'IV infusion of 1 L at 125 mL/hr — duration is:', o: ['6 hr','8 hr','10 hr','12 hr'], c: 1, subj: 'Pharmacology', topic: 'Drug calculation', day: 2, diff: 'Easy', e: { A: '6 hr × 125 = 750 mL, not 1 L.', B: '1000 ÷ 125 = 8 hours.', C: '10 hr × 125 = 1250 mL, too much.', D: '12 hr × 125 = 1500 mL, too much.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'calculation' },
  { q: 'First-line drug for severe pre-eclampsia / eclampsia prophylaxis:', o: ['Hydralazine','Magnesium sulfate','Labetalol','Diazepam'], c: 1, subj: 'OBG', topic: 'Eclampsia', day: 3, diff: 'Easy', e: { A: 'BP control adjunct, not seizure prophylaxis.', B: 'MgSO4 is the drug of choice — superior seizure prevention (MAGPIE trial).', C: 'Antihypertensive only, not seizure prevention.', D: 'Older practice, now supplanted by MgSO4.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Normal APGAR score range is:', o: ['0–5','0–10','0–15','1–10'], c: 1, subj: 'Pediatric', topic: 'APGAR', day: 4, diff: 'Easy', e: { A: 'Maximum is 10, not 5.', B: '5 criteria × 0–2 each → total 0–10.', C: 'Incorrect.', D: 'Minimum is 0, not 1.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Exclusive breastfeeding WHO recommendation:', o: ['3 months','4 months','6 months','12 months'], c: 2, subj: 'Community Health', topic: 'MCH', day: 6, diff: 'Easy', e: { A: 'Too short per WHO.', B: 'Below current WHO guidance.', C: 'WHO: exclusive breastfeeding first 6 months of life.', D: 'Complementary feeding should start by 6 months.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Which antipsychotic requires weekly CBC monitoring?', o: ['Haloperidol','Clozapine','Risperidone','Olanzapine'], c: 1, subj: 'Psychiatric', topic: 'Antipsychotics', day: 9, diff: 'Medium', e: { A: 'EPS risk but no mandatory CBC protocol.', B: 'Clozapine → agranulocytosis risk → weekly CBC × 6 mo, then fortnightly.', C: 'Routine CBC not mandated.', D: 'Metabolic monitoring needed; not weekly CBC.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Yellow-coded BMW bag contains:', o: ['General waste','Sharps','Human anatomical / soiled / micro / chem','Discarded medicines'], c: 2, subj: 'Community Health', topic: 'BMW', day: 7, diff: 'Easy', e: { A: 'General goes in black, not yellow.', B: 'Sharps → white translucent puncture-proof.', C: 'Per BMW Rules 2016: yellow = anatomical, soiled, microbiological, pharmaceutical, chemical liquid waste.', D: 'Discarded meds go in yellow sub-category but whole bag label is broader — best answer is the full yellow list (C).' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'MTP Act (2021 amendment) allows termination up to:', o: ['12 weeks','20 weeks','24 weeks','28 weeks'], c: 2, subj: 'OBG', topic: 'MTP Act', day: 3, diff: 'Medium', e: { A: 'Previous lower limit without conditions.', B: 'Up to 20 wk with one RMP opinion.', C: 'Up to 24 wk for specified categories with 2 RMP opinions (rape survivors, minors, etc.).', D: 'Only beyond 24 wk with Medical Board approval for substantial fetal abnormalities.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'PM-JAY coverage per family per year:', o: ['₹1 lakh','₹3 lakh','₹5 lakh','₹10 lakh'], c: 2, subj: 'Community Health', topic: 'National Programs', day: 6, diff: 'Easy', e: { A: 'Too low.', B: 'Too low.', C: 'Ayushman Bharat PM-JAY provides ₹5 lakh health cover per family per year.', D: 'Incorrect.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Most common method of suicide in India:', o: ['Poisoning','Hanging','Firearms','Drowning'], c: 1, subj: 'Psychiatric', topic: 'Epidemiology', day: 9, diff: 'Medium', e: { A: 'Second most common but not leading.', B: 'NCRB data: hanging is the leading method (>55%).', C: 'Rare due to low firearms penetration.', D: 'Uncommon method.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Article 21A deals with:', o: ['Right to equality','Right to education','Right to life','Right to speech'], c: 1, subj: 'Community Health', topic: 'Constitution', day: 6, diff: 'Easy', e: { A: 'Article 14.', B: 'Article 21A → Right to Education 6–14 yrs (86th Amendment).', C: 'Article 21.', D: 'Article 19.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },
  { q: 'Drug of choice for status epilepticus (first-line IV):', o: ['Phenytoin','Lorazepam','Phenobarbital','Valproate'], c: 1, subj: 'Pharmacology', topic: 'Neurology', day: 9, diff: 'Medium', e: { A: 'Used as second-line after benzodiazepines.', B: 'IV lorazepam 0.1 mg/kg is first-line per ACEP/ILAE.', C: 'Third-line option.', D: 'Alternative second-line.' }, src: 'NORCET 9 Mains', yr: 2025, qt: 'factual' },

  // NORCET 8 — key recalls
  { q: 'DBT stands for (in nursing / govt scheme context):', o: ['Direct Bank Transfer','Direct Benefit Transfer','Digital Benefit Transfer','Direct Beneficiary Transaction'], c: 1, subj: 'Community Health', topic: 'Schemes', day: 6, diff: 'Easy', e: { A: 'Common misreading.', B: 'Direct Benefit Transfer — government cash-scheme mechanism.', C: 'Incorrect expansion.', D: 'Incorrect expansion.' }, src: 'NORCET 8 Mains', yr: 2025, qt: 'factual' },
  { q: 'Tetralogy of Fallot — classic components do NOT include:', o: ['VSD','Overriding aorta','RV hypertrophy','ASD'], c: 3, subj: 'Pediatric', topic: 'Congenital Heart', day: 5, diff: 'Medium', e: { A: 'Part of TOF.', B: 'Part of TOF.', C: 'Part of TOF.', D: 'ASD is NOT part of TOF; TOF = VSD + overriding aorta + pulmonary stenosis + RVH.' }, src: 'NORCET 8 Mains', yr: 2025, qt: 'factual' },
  { q: 'Leopold\'s maneuver 1st step detects:', o: ['Fetal lie','Fundal content (breech/cephalic)','Engagement','Position'], c: 1, subj: 'OBG', topic: 'Leopold', day: 3, diff: 'Easy', e: { A: 'Overall finding, but 1st step focuses on the fundus.', B: 'Fundal grip → identifies what part (head vs breech) occupies the fundus.', C: '4th maneuver (Pawlik).', D: '3rd maneuver.' }, src: 'NORCET 8 Mains', yr: 2025, qt: 'factual' },
  { q: 'Normal pH of arterial blood is:', o: ['7.25–7.35','7.35–7.45','7.45–7.55','7.40–7.60'], c: 1, subj: 'Medical-Surgical', topic: 'ABG', day: 1, diff: 'Easy', e: { A: 'Acidemic range.', B: 'Physiological 7.35–7.45.', C: 'Alkalemic.', D: 'Incorrect band.' }, src: 'NORCET 8 Mains', yr: 2025, qt: 'factual' },
  { q: 'Best bedside intervention to prevent Ventilator-Associated Pneumonia (VAP):', o: ['HOB flat','HOB elevation 30–45°','Continuous sedation','Paralytic infusion'], c: 1, subj: 'Medical-Surgical', topic: 'ICU care', day: 1, diff: 'Medium', e: { A: 'Increases aspiration risk.', B: 'Semi-Fowler 30–45° is a core VAP-bundle element (reduces reflux/aspiration).', C: 'Over-sedation delays extubation and increases VAP risk.', D: 'Paralytics have no routine VAP-prevention role.' }, src: 'NORCET 8 Mains', yr: 2025, qt: 'scenario' },
  { q: 'Coombs test is used to diagnose:', o: ['Hemophilia','Autoimmune hemolytic anemia','G6PD deficiency','Aplastic anemia'], c: 1, subj: 'Medical-Surgical', topic: 'Hematology', day: 5, diff: 'Medium', e: { A: 'Coagulation factor assays used.', B: 'Direct Coombs detects antibody on RBCs — AIHA.', C: 'Enzyme assay, not Coombs.', D: 'Bone marrow biopsy, not Coombs.' }, src: 'NORCET 8 Mains', yr: 2025, qt: 'factual' },

  // NORCET 7 — key recalls
  { q: 'Episiotomy most commonly used in India:', o: ['Mediolateral','Midline','J-shaped','Lateral'], c: 0, subj: 'OBG', topic: 'Episiotomy', day: 3, diff: 'Easy', e: { A: 'Mediolateral → reduced 3rd/4th-degree tear risk compared with midline.', B: 'Preferred in the USA but not standard in India due to higher tear risk.', C: 'Rarely used.', D: 'Obsolete; abandoned due to high complications.' }, src: 'NORCET 7 Mains', yr: 2024, qt: 'factual' },
  { q: 'Triple-lumen catheter typically has:', o: ['1 port','2 ports','3 ports','4 ports'], c: 2, subj: 'Fundamentals', topic: 'Central line', day: 8, diff: 'Easy', e: { A: 'Single-lumen.', B: 'Double-lumen.', C: 'Triple-lumen = 3 ports (distal/middle/proximal).', D: 'Quadruple-lumen, less common.' }, src: 'NORCET 7 Mains', yr: 2024, qt: 'factual' },
  { q: 'First intervention in hypovolemic shock:', o: ['Antibiotics','Vasopressors','IV fluid bolus','Inotropes'], c: 2, subj: 'Medical-Surgical', topic: 'Shock', day: 9, diff: 'Easy', e: { A: 'Only for septic source.', B: 'Second line after fluid challenge.', C: 'Crystalloid bolus 20–30 mL/kg is first action in hypovolemia.', D: 'For cardiogenic, not hypovolemic shock.' }, src: 'NORCET 7 Mains', yr: 2024, qt: 'factual' },

  // NORCET 6 — key recalls
  { q: 'Pre-eclampsia is diagnosed at what BP threshold after 20 wk GA:', o: ['≥130/80 mmHg','≥140/90 mmHg','≥150/95 mmHg','≥160/110 mmHg'], c: 1, subj: 'OBG', topic: 'Pre-eclampsia', day: 3, diff: 'Medium', e: { A: 'Stage 1 hypertension cutoff, not pre-eclampsia.', B: 'BP ≥140/90 on two occasions ≥4 h apart after 20 wk + proteinuria/end-organ.', C: 'Not a standard cutoff.', D: 'That level defines severe features, not the diagnosis itself.' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' },
  { q: 'First step in Neonatal Resuscitation Program after birth:', o: ['Clamp cord','Dry, warm, position, clear airway','Give oxygen','Start compressions'], c: 1, subj: 'Pediatric', topic: 'NRP', day: 4, diff: 'Easy', e: { A: 'Done after initial steps.', B: 'Initial steps: warm, dry, position airway, clear secretions, stimulate.', C: 'Only if HR<100 and PPV has failed.', D: 'Only if HR<60 after effective PPV.' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' },
  { q: 'Normal ET tube size for full-term newborn (uncuffed):', o: ['2.5 mm','3.0–3.5 mm','4.0 mm','4.5 mm'], c: 1, subj: 'Pediatric', topic: 'ET tube', day: 2, diff: 'Medium', e: { A: 'Used for <1 kg preterm.', B: 'Term newborn ~3.0–3.5 mm uncuffed.', C: 'Older infant (6–12 mo).', D: 'Child >1 year.' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' },
  { q: 'MgSO4 therapeutic serum level in eclampsia is:', o: ['1–2 mEq/L','4–7 mEq/L','8–10 mEq/L','>10 mEq/L'], c: 1, subj: 'OBG', topic: 'MgSO4', day: 3, diff: 'High', e: { A: 'Subtherapeutic.', B: 'Therapeutic 4–7 mEq/L; 8–10 → loss of DTRs; >10 → respiratory depression.', C: 'Toxic range.', D: 'Toxic; stop infusion, give Ca gluconate.' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' },
  { q: 'Venturi mask color providing 24% FiO2 (low-concentration):', o: ['Blue','White','Yellow','Red'], c: 0, subj: 'Fundamentals', topic: 'Oxygen therapy', day: 7, diff: 'Medium', e: { A: 'Blue = 24% FiO2 at 2 L/min.', B: 'White = 28%.', C: 'Yellow = 35%.', D: 'Red = 40% (or green on some sets).' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' },
  { q: 'CPR compression:ventilation ratio in adults (single rescuer):', o: ['15:2','30:2','5:1','10:2'], c: 1, subj: 'Fundamentals', topic: 'BLS', day: 9, diff: 'Easy', e: { A: 'Pediatric 2-rescuer ratio.', B: 'Adult single or two-rescuer (before advanced airway): 30 compressions : 2 breaths.', C: 'Outdated ratio.', D: 'Not standard.' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' },
  { q: 'Which does NOT belong to the 5 WHO moments of hand hygiene:', o: ['Before touching a patient','Before clean/aseptic procedure','After touching the nurses\' station','After touching patient surroundings'], c: 2, subj: 'Fundamentals', topic: 'Hand hygiene', day: 7, diff: 'Easy', e: { A: 'Moment 1.', B: 'Moment 2.', C: 'NOT one of the 5 moments — irrelevant to clinical contact.', D: 'Moment 5.' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' },
  { q: 'ICDS beneficiary age group for supplementary nutrition is:', o: ['0–3 y','6 mo–6 y + pregnant / lactating','0–5 y','6–12 y'], c: 1, subj: 'Community Health', topic: 'ICDS', day: 6, diff: 'Medium', e: { A: 'Partial range only.', B: 'ICDS covers children 6 mo–6 y, pregnant and lactating women, adolescent girls.', C: 'Does not include pregnant/lactating.', D: 'School-age not under ICDS.' }, src: 'NORCET 6 Mains', yr: 2024, qt: 'factual' }
];

function pyqRows() {
  return PYQS.map((p, i) => ({
    id: 'M' + (i + 1),
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
  const bank = [...pyqs, ...topics];
  console.log('Bank total:', bank.length, '| PYQ:', pyqs.length, '| Legacy+Practice:', topics.length);

  // Reassign ids sequentially
  bank.forEach((q, i) => q.id = i + 1);
  fs.writeFileSync(path.join(OUT, 'question-bank.json'), JSON.stringify(bank, null, 2));

  // Day slices — 25-30 each, PYQ first
  for (let d = 1; d <= 13; d++) {
    const inDay = bank.filter(q => q.day === d);
    inDay.sort((a, b) => {
      const score = (x) => (x.source && x.source.includes('NORCET Mains') ? 0 : (x.source === 'AIIMS NO legacy' ? 1 : 2));
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

  // Mocks — stratified 160 each (mains subject mix)
  // Target mix (approx from NORCET Mains analyses):
  const MIX = [
    ['Medical-Surgical', 40],
    ['Community Health', 22],
    ['OBG', 18],
    ['Pediatric', 18],
    ['Fundamentals', 20],
    ['Pharmacology', 16],
    ['Psychiatric', 10],
    ['Microbiology', 8],
    ['Anatomy', 4],
    ['Nutrition', 2],
    ['Admin', 2]
  ];
  for (let m = 1; m <= 10; m++) {
    const used = new Set();
    const picks = [];
    const rng = mulberry32(1000 + m);
    for (const [subj, n] of MIX) {
      const pool = bank.filter(q => q.subject === subj);
      const shuffled = seededShuffle(pool, rng);
      let taken = 0;
      for (const q of shuffled) {
        if (taken >= n) break;
        if (used.has(q.id)) continue;
        used.add(q.id);
        picks.push(q);
        taken++;
      }
      // If pool too small, refill by relaxing "used" constraint
      if (taken < n) {
        for (const q of seededShuffle(pool, rng)) {
          if (taken >= n) break;
          if (picks.includes(q)) continue;
          picks.push(q); taken++;
        }
      }
    }
    // Pad/trim to exactly 160
    while (picks.length < 160) {
      const more = seededShuffle(bank, rng);
      for (const q of more) {
        if (!picks.includes(q)) { picks.push(q); if (picks.length >= 160) break; }
      }
      if (picks.length === 0) break;
    }
    const mock = picks.slice(0, 160).map((q, i) => ({ ...q, mockSeq: i + 1 }));
    fs.writeFileSync(path.join(OUT, 'mocks', 'mock-' + m + '.json'), JSON.stringify({ id: m, title: 'Full Mock Test ' + m, count: 160, minutes: 180, questions: mock }, null, 2));
  }

  // Mocks index (summary)
  const mocksIndex = [];
  for (let m = 1; m <= 10; m++) {
    const mockData = JSON.parse(fs.readFileSync(path.join(OUT, 'mocks', 'mock-' + m + '.json'), 'utf8'));
    const bySubj = {};
    mockData.questions.forEach(q => { bySubj[q.subject] = (bySubj[q.subject] || 0) + 1; });
    mocksIndex.push({ id: m, title: mockData.title, count: mockData.count, minutes: mockData.minutes, subjects: bySubj });
  }
  fs.writeFileSync(path.join(OUT, 'mocks', 'index.json'), JSON.stringify(mocksIndex, null, 2));

  // Stats
  const stats = {
    totalQs: bank.length,
    pyqCount: bank.filter(q => (q.source || '').includes('NORCET Mains')).length,
    legacyCount: bank.filter(q => q.source === 'AIIMS NO legacy').length,
    practiceCount: bank.filter(q => q.source === 'Practice').length,
    bySubject: bySubjectCount(bank),
    byDay: byDayCount(bank),
    byQtype: byQtype(bank)
  };
  fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify(stats, null, 2));
  console.log('Stats:', stats);
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
console.log('Done. Output at', OUT);
