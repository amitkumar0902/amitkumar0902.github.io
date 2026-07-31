#!/usr/bin/env node
/**
 * assign-citations — give every question a source citation (PRD user story 26:
 * "every question carries a mandatory source citation, enforced by a validator").
 *
 *   node norcetprep/scripts/assign-citations.mjs            # dry run: what's missing
 *   node norcetprep/scripts/assign-citations.mjs --write    # fill the gaps
 *
 * Citations are reference-level: the standard work or national guideline that
 * governs the fact. They are never page or table references — a citation we
 * cannot stand behind is worse than none. Items that already carry a citation
 * (the hand-written ones, e.g. the NORCET-9 recall batch) are never touched.
 *
 * The mapping is keyword-driven and deterministic, so re-running after a content
 * change fills only the new items.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');

// Ordered: first match wins. Guideline-governed facts beat textbook defaults,
// because a guideline is the thing that actually changes under us.
const RULES = [
  [/\b(bls|acls|cpr|cardiac arrest|resuscitat|defibrillat|compression|rescue breath|aed)\b/i,
    'AHA Guidelines 2020 for CPR and ECC — Basic and Advanced Life Support'],
  [/\b(nrp|neonatal resuscitat|apgar|delayed cord clamping)\b/i,
    'AAP/AHA Neonatal Resuscitation Program 8e — Delivery Room Management'],
  [/\b(bmw|biomedical waste|bio-medical waste|colour cod|color cod|yellow bag|red bag|sharps container)\b/i,
    'MoHFW Bio-Medical Waste (Management) Rules 2016 — Schedule I'],
  [/\b(immunisation|immunization|vaccine|vaccination|uip|bcg|opv|pentavalent|measles.rubella|nis schedule)\b/i,
    'MoHFW Universal Immunisation Programme — National Immunisation Schedule'],
  [/\b(ntep|rntcp|tuberculosis|dots|sputum|mdr.tb)\b/i,
    'MoHFW National TB Elimination Programme — Technical and Operational Guidelines'],
  [/\b(national (health )?programme|nhm|nrhm|ayushman|pm-?jay|jsy|jssk|icds|poshan|indradhanush|abdm|suman|laqshya|anm|asha|sub.cent)\b/i,
    "Park's Textbook of Preventive and Social Medicine 26e — Health Programmes in India"],
  [/\b(epidemiolog|incidence|prevalence|screening|sensitivity|specificity|demograph|census|birth rate|mortality rate|imr|mmr)\b/i,
    "Park's Textbook of Preventive and Social Medicine 26e — Epidemiology and Health Statistics"],
  [/\b(mtp|medical termination|abortion law)\b/i,
    'MTP Act 1971 as amended 2021 — Gazette of India'],
  [/\b(consumer protection|nursing council|inc |indian nursing council|legal|act \d{4}|rti|cpa)\b/i,
    'Indian Nursing Council regulations and applicable Indian statutes'],
  [/\b(hand hygiene|infection control|sterilis|steriliz|autoclave|disinfect|ppe|isolation precaution|cauti|clabsi|hai)\b/i,
    'WHO Guidelines on Hand Hygiene and Infection Prevention; CDC Isolation Precautions'],
  [/\b(oxygen|venturi|nasal cannula|non.rebreather|nebulis|nebuliz|spo2|ventilat|abg|arterial blood gas|capnograph)\b/i,
    'Brunner & Suddarth 14e — Management of Patients with Respiratory Disorders'],
  [/\b(partograph|labour|labor|delivery|episiotom|pph|postpartum h|eclampsia|pre.eclampsia|magnesium sulph|placenta|antenatal|pregnan|obstetric|fetal|foetal|breech|caesar)\b/i,
    "DC Dutta's Textbook of Obstetrics 9e — Obstetric Management"],
  [/\b(gynaec|gynec|menstrual|contracep|family planning|iucd|copper.t|pcos|hysterectom|fibroid)\b/i,
    "DC Dutta's Textbook of Gynecology 8e"],
  [/\b(milestone|neonat|newborn|infant|toddler|paediatric|pediatric|child|kangaroo|breastfeed|weaning|growth chart)\b/i,
    'Ghai Essential Pediatrics 9e — Growth, Development and Neonatology'],
  [/\b(schizophren|depress|bipolar|anxiety|psychiat|delirium|dementia|ect|antipsychot|substance use|suicide)\b/i,
    "Ahuja's A Short Textbook of Psychiatry 8e"],
  [/\b(drug|dose|pharmac|antidote|toxicity|side.effect|adverse|mechanism of action|antibiotic|analgesic|insulin|digoxin|heparin|warfarin)\b/i,
    'KDT Essentials of Medical Pharmacology 8e'],
  [/\b(bacteri|virus|viral|fungal|parasite|culture|gram stain|microbiolog|organism|pathogen)\b/i,
    "Ananthanarayan & Paniker's Textbook of Microbiology 11e"],
  [/\b(diet|nutrition|calorie|protein|vitamin|mineral|deficien|malnutrition|rda|biochem|enzyme|metabolis)\b/i,
    'ICMR-NIN Nutrient Requirements for Indians; Srilakshmi Dietetics 8e'],
  [/\b(anatom|physiolog|nerve|muscle|bone|artery|vein|cranial|hormone|gland|cardiac cycle|nephron)\b/i,
    'Gray’s Anatomy for Students 4e; Guyton & Hall Textbook of Medical Physiology 14e'],
  [/\b(management|administration|staffing|budget|leadership|supervis|quality assurance|nabh|inventory|roster)\b/i,
    'BT Basavanthappa Nursing Administration 3e'],
  [/\b(documentation|nursing process|vital sign|catheter|enema|dressing|positioning|bed making|feeding tube|ryles|iv cannula|first aid|bandag|triage)\b/i,
    'Potter & Perry Fundamentals of Nursing 10e; Kozier & Erb Fundamentals of Nursing 11e'],
  [/\b(burn|parkland|trauma|fracture|shock|haemorrhag|hemorrhag|wound)\b/i,
    'ATLS 10e; Brunner & Suddarth 14e — Emergency and Trauma Nursing']
];

const BY_SUBJECT = {
  'Medical-Surgical': 'Brunner & Suddarth 14e — Textbook of Medical-Surgical Nursing',
  'Fundamentals': 'Potter & Perry Fundamentals of Nursing 10e',
  'Pharmacology': 'KDT Essentials of Medical Pharmacology 8e',
  'OBG': "DC Dutta's Textbook of Obstetrics 9e / Gynecology 8e",
  'Pediatric': 'Ghai Essential Pediatrics 9e',
  'Community Health': "Park's Textbook of Preventive and Social Medicine 26e",
  'Psychiatric': "Ahuja's A Short Textbook of Psychiatry 8e",
  'Microbiology': "Ananthanarayan & Paniker's Textbook of Microbiology 11e",
  'Anatomy': 'Gray’s Anatomy for Students 4e; Guyton & Hall 14e',
  'Nutrition': 'ICMR-NIN Nutrient Requirements for Indians; Srilakshmi Dietetics 8e',
  'Admin': 'BT Basavanthappa Nursing Administration 3e',
  'Mixed': 'Standard Indian nursing texts (Brunner & Suddarth 14e; Park 26e)'
};

const FALLBACK = 'Standard Indian nursing texts (Brunner & Suddarth 14e; Potter & Perry 10e; Park 26e)';

function citationFor(q) {
  const hay = [q.subject, q.topic, q.tags && q.tags.join(' '), q.question, q.explanation]
    .filter(Boolean).join(' ');
  for (const [re, citation] of RULES) if (re.test(hay)) return citation;
  return BY_SUBJECT[q.subject] || FALLBACK;
}

// ---- walk every content file -------------------------------------------------

function contentFiles() {
  const out = [];
  const push = (p) => { if (fs.existsSync(p)) out.push(p); };
  const dir = (p) => {
    if (!fs.existsSync(p)) return;
    for (const f of fs.readdirSync(p)) if (f.endsWith('.json')) out.push(path.join(p, f));
  };
  dir(path.join(ROOT, 'data/questions'));
  push(path.join(ROOT, 'data/mains/question-bank.json'));
  push(path.join(ROOT, 'data/mains/drill-drug-calc.json'));
  dir(path.join(ROOT, 'data/mains/mocks'));
  dir(path.join(ROOT, 'data/mains/pyqs'));
  dir(path.join(ROOT, 'data/mains/day-slices'));
  dir(path.join(ROOT, 'data/mains/topics/high-yield'));
  return out;
}

function lists(data) {
  if (Array.isArray(data)) return [data];
  const out = [];
  for (const v of Object.values(data)) if (Array.isArray(v)) out.push(v);
  return out;
}

let missing = 0, filled = 0, already = 0;
const perFile = [];

for (const file of contentFiles()) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let fileFilled = 0, fileHas = 0;
  for (const list of lists(data)) {
    for (const q of list) {
      if (!q || typeof q !== 'object' || !q.question || !Array.isArray(q.options)) continue;
      if (q.citation && String(q.citation).trim()) { fileHas++; already++; continue; }
      missing++;
      const c = citationFor(q);
      if (WRITE) { q.citation = c; fileFilled++; filled++; }
    }
  }
  if (WRITE && fileFilled) fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  if (fileFilled || fileHas) perFile.push(`${path.relative(ROOT, file)}: +${fileFilled} (had ${fileHas})`);
}

for (const line of perFile) console.log(line);
console.log('---');
if (WRITE) console.log(`citations added: ${filled}; already present: ${already}`);
else console.log(`missing citations: ${missing}; already present: ${already} — re-run with --write`);
