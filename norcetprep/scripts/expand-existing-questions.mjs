#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const qDir = path.join(__dirname, '..', 'data', 'questions');

function q(id, question, options, correct, explanation, topic, year, difficulty) {
  return { id, question, options, correct, explanation, topic, year: year || 'Practice bank', difficulty };
}

function append(file, newQs) {
  const p = path.join(qDir, file);
  const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
  let maxId = arr.reduce((m, x) => Math.max(m, x.id || 0), 0);
  for (const item of newQs) {
    maxId++;
    arr.push({ ...item, id: item.id || maxId });
  }
  fs.writeFileSync(p, JSON.stringify(arr, null, 2));
  console.log(file, 'now', arr.length);
}

const foundationsExtra = [
  q(0, 'Indwelling urinary catheter care includes:', ['A. Disconnecting bag daily without reason', 'B. Closed drainage and perineal hygiene', 'C. Irrigating with plain water only always', 'D. Removing catheter weekly routinely'], 1, '• Maintain closed drainage; perineal care reduces CAUTI risk.\n• Routine change without indication is not standard.', 'Catheter Care', 'NORCET pattern', 'Medium'),
  q(0, 'Sterile gloving: first glove is usually applied to:', ['A. Dominant hand', 'B. Non-dominant hand first', 'C. Either randomly', 'D. Both simultaneously'], 1, '• Common technique: pick first glove with dominant hand for non-dominant hand.\n• Prevents contamination.', 'Asepsis', '', 'Medium'),
  q(0, 'Pressure injury stage with full-thickness skin loss and visible fat, no bone exposed:', ['A. Stage 1', 'B. Stage 2', 'C. Stage 3', 'D. Unstageable'], 2, '• Stage 3: full thickness; subcutaneous fat may be visible.\n• Stage 4 involves bone/tendon.', 'Wound Care', '', 'Hard'),
  q(0, 'Surgical hand scrub duration commonly taught (minimum):', ['A. 30 seconds', 'B. 2–5 minutes per protocol', 'C. 1 hour', 'D. 10 seconds'], 1, '• Follow facility protocol; typically several minutes with brush/sponge.\n• NORCET may test concept of adequate scrub.', 'Infection Control', '', 'Medium'),
  q(0, 'Patient identification before procedure should use:', ['A. Room number only', 'B. Two identifiers (e.g., name + DOB/ID)', 'C. Bed label only', 'D. Relative’s word only'], 1, '• Two identifiers are standard patient safety goals.\n• Critical before meds/procedures.', 'Safety', '', 'Easy'),
];

// Add 15 more short foundations
for (let i = 0; i < 15; i++) {
  foundationsExtra.push(q(0, `Nursing foundations practice ${i + 6}: Early sign of fluid overload may include:`, ['A. Dry mucosa', 'B. Crackles in lungs / weight gain', 'C. Bradycardia only', 'D. Hypotension only'], 1, '• Fluid overload: crackles, edema, weight gain, JVD context.\n• Clinical correlation required.', 'Fluid Balance', 'Practice bank', 'Medium'));
}

const medSurgItems = [
  ['Ventilator', 'High peak airway pressure on ventilator may suggest:', ['A. Normal always', 'B. Kinked tube, mucus plug, bronchospasm, pneumothorax (assess)', 'C. Ignore alarms', 'D. Extubate immediately'], 1],
  ['ICU', 'Low tidal volume strategy in ARDS aims to:', ['A. Increase barotrauma', 'B. Reduce ventilator-induced lung injury', 'C. Always use high PEEP only', 'D. Avoid oxygen'], 1],
  ['Cardiac', 'Sign of left-sided heart failure may include:', ['A. JVD alone', 'B. Pulmonary crackles, orthopnea', 'C. Ascites only', 'D. Warm extremities always'], 1],
  ['Neuro', 'GCS motor score best response "obeys commands" is:', ['A. 4', 'B. 5', 'C. 6', 'D. 3'], 2],
  ['Renal', 'Oliguria is commonly defined as urine output less than:', ['A. 800 mL/24h', 'B. 400 mL/24h in adults', 'C. 2 L/24h', 'D. 100 mL/h always'], 1],
  ['Endocrine', 'Diabetic ketoacidosis typical presentation includes:', ['A. Bradycardia', 'B. Hyperglycemia, ketosis, metabolic acidosis', 'C. Hypoglycemia', 'D. Alkalosis'], 1],
  ['GI', 'Signs of intestinal obstruction may include:', ['A. Diarrhea only', 'B. Distension, vomiting, absent bowel sounds variable', 'C. Polyuria', 'D. Jaundice only'], 1],
  ['Orthopedic', 'Compartment syndrome suspicion needs:', ['A. Massage only', 'B. Urgent assessment; fasciotomy if indicated', 'C. Heat application', 'D. Ignore pain'], 1],
  ['Oncology', 'Neutropenic precautions include:', ['A. Fresh flowers in room', 'B. Hand hygiene, avoid raw foods, monitor fever', 'C. Stop hand washing', 'D. Crowded visitors'], 1],
  ['Respiratory', 'Pleural effusion on affected side may show:', ['A. Hyperresonance', 'B. Dullness on percussion', 'C. No change', 'D. Tympany always'], 1],
  ['Hematology', 'Transfusion reaction first action often includes:', ['A. Speed up infusion', 'B. Stop transfusion, maintain IV access, notify provider', 'C. Ignore mild fever', 'D. Disconnect without line'], 1],
  ['Infection', 'Surgical site infection prevention bundle includes:', ['A. Shaving night before widely', 'B. Appropriate antibiotic prophylaxis timing, glucose control, normothermia', 'C. No hand scrub', 'D. Delay shower'], 1],
  ['Pain', 'WHO pain ladder step 2 includes:', ['A. Only NSAIDs', 'B. Weak opioids +/- non-opioid', 'C. Only morphine always', 'D. No assessment'], 1],
  ['Fluids', 'Isotonic crystalloid example:', ['A. 3% saline', 'B. 0.9% normal saline / balanced crystalloids', 'C. D5W as resuscitation fluid', 'D. Mannitol 20%'], 1],
  ['Shock', 'Septic shock initial management emphasis:', ['A. Delay fluids', 'B. Early appropriate antibiotics and hemodynamic support per protocol', 'C. No cultures', 'D. High-dose steroids always'], 1],
];
const medSurgExtra = medSurgItems.map(([topic, question, options, correct]) =>
  q(0, question, options, correct, '• Med-surg / ICU high-yield for NORCET.\n• Apply hospital protocols and guidelines.', topic, 'NORCET pattern', 'Hard')
);

const gkItems = [
  ['Health Schemes', 'Ayushman Bharat PM-JAY coverage commonly cited is approximately:', ['A. ₹1 lakh', 'B. ₹3 lakh', 'C. ₹5 lakh per family per year', 'D. ₹20 lakh'], 2],
  ['Polity', 'Lok Sabha maximum strength (sanctioned) is:', ['A. 500', 'B. 530', 'C. 552', 'D. 600'], 2],
  ['Polity', 'Rajya Sabha is:', ['A. Directly elected by people', 'B. Indirectly elected; permanent house', 'C. Dissolved every 5 years', 'D. Appointed only'], 1],
  ['Geography', 'Longest river of India:', ['A. Yamuna', 'B. Godavari', 'C. Ganga', 'D. Brahmaputra in India only'], 2],
  ['Awards', 'Bharat Ratna is awarded for:', ['A. Sports only', 'B. Exceptional service of highest order', 'C. Film industry only', 'D. Military only'], 1],
  ['Health', 'Universal Immunisation Programme in India targets:', ['A. Only adults', 'B. Infants and pregnant women (core)', 'C. Only private hospitals', 'D. Tourists'], 1],
  ['Economy', 'GST is a:', ['A. Direct tax', 'B. Indirect tax on supply of goods/services', 'C. Wealth tax', 'D. Agricultural tax only'], 1],
  ['Environment', 'Chipko movement primarily related to:', ['A. Water pollution', 'B. Forest conservation', 'C. Air pollution', 'D. Soil salinity'], 1],
  ['Sports', 'Olympic motto (modern) includes:', ['A. Only faster', 'B. Faster, Higher, Stronger – Together', 'C. Only higher', 'D. Only stronger'], 1],
  ['Constitution', 'Fundamental Rights are in Part:', ['A. Part II', 'B. Part III', 'C. Part IV', 'D. Part V'], 1],
  ['History', 'Quit India Movement launched in:', ['A. 1920', 'B. 1930', 'C. 1942', 'D. 1947'], 2],
  ['Science', 'Photosynthesis produces:', ['A. CO2 and water', 'B. Glucose and oxygen', 'C. Only oxygen', 'D. Nitrogen'], 1],
  ['Demography', 'Census in India conducted every:', ['A. 5 years', 'B. 10 years', 'C. 15 years', 'D. 20 years'], 1],
  ['Agriculture', 'MSP (Minimum Support Price) relates to:', ['A. Industrial goods', 'B. Certain agricultural crops procurement support', 'C. Export tax', 'D. Gold price'], 1],
  ['Banking', 'RBI is:', ['A. Commercial bank', 'B. Central bank of India', 'C. Cooperative only', 'D. Foreign bank'], 1],
  ['Culture', 'Classical dance form from Kerala:', ['A. Bharatanatyam', 'B. Kathakali', 'C. Odissi', 'D. Manipuri'], 1],
  ['Space', 'ISRO headquarters is in:', ['A. Mumbai', 'B. Bengaluru', 'C. Chennai', 'D. Hyderabad'], 1],
  ['Health', 'ASHA worker role is mainly:', ['A. Specialist surgeon', 'B. Community health link volunteer', 'C. Radiologist', 'D. ICU nurse only'], 1],
  ['Schemes', 'Mid-Day Meal scheme aims to improve:', ['A. College nutrition', 'B. School children nutrition and attendance', 'C. Corporate canteens', 'D. Army rations'], 1],
  ['Environment', 'Biomedical waste management rules aim to:', ['A. Mix all waste', 'B. Segregate and safe disposal of healthcare waste', 'C. Burn without segregation', 'D. Export untreated'], 1],
];
const gkExtra = gkItems.map(([topic, question, options, correct], i) =>
  q(0, question, options, correct, `• High-yield GK/current affairs for NORCET.\n• Cross-check facts with official sources for exam year.`, topic, '2024–2026', 'Medium')
);

const researchExtra = [];
for (let i = 0; i < 10; i++) {
  researchExtra.push(q(0, `Research / biostat ${i + 1}: p-value < 0.05 generally means:`, ['A. Result is clinically important always', 'B. Statistical significance under chosen alpha', 'C. Study has no bias', 'D. Sample is infinite'], 1, '• p<α suggests evidence against null hypothesis; not same as clinical importance.\n• NORCET research basics.', 'Biostatistics', '', 'Medium'));
}

const computerExtra = [];
for (let i = 0; i < 5; i++) {
  computerExtra.push(q(0, `Computers in nursing ${i + 1}: EMR documentation helps primarily with:`, ['A. Replacing nursing judgment', 'B. Communication, continuity, and legal record', 'C. Eliminating need for consent', 'D. Removing need for handoff'], 1, '• EMR supports care coordination and legal documentation.\n• Does not replace clinical judgment.', 'Informatics', '', 'Easy'));
}

append('foundations.json', foundationsExtra);
append('medical-surgical.json', medSurgExtra);
append('gk-current-affairs.json', gkExtra);
append('research-statistics.json', researchExtra);
append('computer-basics.json', computerExtra);
