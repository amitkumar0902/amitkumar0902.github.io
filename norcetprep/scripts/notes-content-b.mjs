// Bulk notes for Surgery, Foundation, CHN, Medicine, ENT, Child, Pharma, Mental, Micro, Biochem, Anatomy.
// Compact authoring via n() helper. Every entry carries the audit-required fields.
import { n } from './notes-helper.mjs';

export const NOTE_CONTENT_B = {};

// ============ SURGERY (54 topics) ============
NOTE_CONTENT_B['surgery-1-surgical-safety-checklist-who'] = n(
  'WHO 3-phase checklist to reduce perioperative complications: Sign In (pre-anesthesia), Time Out (pre-incision), Sign Out (pre-leaving OT).',
  ['Sign In: patient identity, site marked, allergies, airway risk, blood loss risk >500 mL', 'Time Out: whole team introductions, confirm surgery + site, antibiotic within 60 min, imaging available', 'Sign Out: procedure recorded, instrument/sponge count, specimen labeled, concerns for recovery'],
  'WHO Safe Surgery Saves Lives 2009',
  '28-y-old about to undergo appendectomy; team paused before incision.',
  'Lead Time Out: verbal confirmation of patient, procedure, site, antibiotic prophylaxis given, imaging displayed.',
  'Time Out done immediately before skin incision.'
);

NOTE_CONTENT_B['surgery-2-patient-positions-surgical'] = n(
  'Positions on OT table for surgical access.',
  ['Supine: most surgeries', 'Trendelenburg: pelvic surgery — venous return risk', 'Reverse Trendelenburg: head/neck, laparoscopic upper abdomen', 'Lithotomy: perineal, vaginal — nerve injury risk (peroneal)', 'Prone/Jackknife: spine, perianal', 'Lateral/Sims: kidney, chest', 'Fowler: neurosurgery — air embolism risk'],
  'Brunner 14e',
  'Patient for hemorrhoidectomy positioned on OT table.',
  'Place in jackknife (prone with hips flexed 90°), pad pressure points, secure with straps, check ventilation.',
  'Lithotomy >2 h increases peroneal/sciatic injury risk.'
);

NOTE_CONTENT_B['surgery-3-ot-positions'] = n(
  'Standardized operating team positions around the table.',
  ['Surgeon: right of patient (for right-handed)', 'Assistant: opposite surgeon', 'Scrub nurse: foot end or right of surgeon', 'Anesthetist: head end', 'Circulator: periphery, coordinates supplies'],
  'AORN Recommended Practices',
  'Setting up for open cholecystectomy.',
  'Position surgeon on patient right, scrub nurse adjacent, instrument trolley between; anesthetist at head.'
);

NOTE_CONTENT_B['surgery-4-cautery-mono-vs-bi-polar'] = n(
  'Electrosurgery for cutting/coagulation using high-frequency current.',
  ['Monopolar: current from active electrode → ground pad; higher power; risk of burns if pad poor contact', 'Bipolar: current between 2 tips of forceps; safer near nerves/pacemakers; less collateral damage', 'Contraindicated absolute: flammable preps not dry', 'Check pad on dry well-vascularized area (thigh, back)'],
  'AORN 2023',
  'Pacemaker patient for lap chole.',
  'Use bipolar cautery, apply ground pad on clean dry muscle, short bursts, liaise with cardiology to reprogram pacemaker to asynchronous mode.'
);

NOTE_CONTENT_B['surgery-5-sutures-and-knots'] = n(
  'Materials for tissue approximation.',
  ['Absorbable: catgut (30 d), vicryl/polyglactin (56-70 d), monocryl (90-120 d), PDS (180 d)', 'Non-absorbable: silk, nylon, prolene, stainless steel', 'Size: smaller number = thicker (0 thicker than 3-0)', 'Surgeon knot: double throw first to reduce slippage', 'Skin closure: 3-0/4-0 nylon/monocryl subcuticular'],
  'Bailey & Love 28e',
  'Closing skin on a clean abdominal wound.',
  'Use 3-0 monocryl subcuticular or 3-0 nylon interrupted, aseptic technique, document count.'
);

NOTE_CONTENT_B['surgery-6-surgical-site-infection-and-prevention'] = n(
  'Infection at operative site within 30 d (or 1 y if implant).',
  ['Classes: superficial incisional, deep, organ/space', 'Prevention: skin antisepsis (CHG-alcohol), hair clipping not shaving, prophylactic antibiotic within 60 min, normothermia, glucose control (<200), sterile draping', 'Most common: S aureus; MRSA if risk factors', 'Remove drains as early as clinically safe'],
  'CDC SSI 2017',
  'Post-op day 4 colectomy patient with wound erythema, warm, purulent drainage.',
  'Collect pus swab for culture, obtain surgical review for drainage, start empiric antibiotic, document vitals, isolate if MRSA suspected.',
  'Cefazolin 2 g IV within 60 min before skin incision.'
);

NOTE_CONTENT_B['surgery-7-types-of-wound'] = n(
  'Wound classification for healing and infection risk.',
  ['Clean (I): no inflammation, GI/respiratory not entered; infection <2%', 'Clean-contaminated (II): controlled entry; 5-10%', 'Contaminated (III): fresh trauma, spillage; 15-20%', 'Dirty (IV): existing infection, perforated viscus; >30%', 'By healing: primary (sutured), secondary (granulation), tertiary (delayed primary)'],
  'CDC wound classes',
  'Perforated appendicitis with pus.',
  'Classify as dirty (IV); leave skin open for delayed primary closure, broad-spectrum antibiotics, irrigate peritoneum.'
);

NOTE_CONTENT_B['surgery-8-nutrition-ng-tube-feeding-and-tpn-cvp-care'] = n(
  'Enteral and parenteral nutrition routes and care.',
  ['NG tube: verify placement by pH <5.5 aspirate or X-ray; flush 30 mL water before/after feeds; HOB >=30°', 'TPN: central line, aseptic connections, monitor glucose q4-6h, gradual taper to prevent rebound hypoglycemia', 'CVP normal 2-8 mmHg; measure with patient supine, zero at phlebostatic axis (4th ICS mid-axillary)', 'Refeeding syndrome: watch phosphate, magnesium, potassium in chronically malnourished'],
  'ASPEN 2016',
  'Post-op patient on TPN via right IJ.',
  'Maintain aseptic technique at hub, monitor glucose q6h, daily dressing, flush with heparinized saline per protocol, watch for refeeding.',
  'If feeding intolerance: hold, reposition, recheck residual.'
);

NOTE_CONTENT_B['surgery-9-shock-types-and-management'] = n(
  'Inadequate tissue perfusion and oxygenation.',
  ['Hypovolemic: hemorrhage, burns — replace volume', 'Cardiogenic: MI, arrhythmia — inotropes', 'Distributive: sepsis, anaphylaxis, neurogenic — vasopressors', 'Obstructive: PE, tamponade, tension pneumothorax — relieve obstruction', 'Early signs: tachycardia, cool extremities, narrow pulse pressure, oliguria'],
  'ATLS 10e',
  '30-y-old MVA, BP 70/40, HR 140, cool clammy, abdomen tender.',
  'Two large-bore IVs, crystalloid 1 L bolus, cross-match 4 units, FAST scan, urinary catheter, prepare for emergency laparotomy.',
  'MAP target >=65 mmHg after resuscitation.'
);

NOTE_CONTENT_B['surgery-10-basics-of-trauma'] = n(
  'Systematic ATLS primary survey.',
  ['A: Airway with C-spine control', 'B: Breathing (look, listen, feel; tension pneumothorax)', 'C: Circulation (control bleeding, 2 large IVs)', 'D: Disability (GCS, pupils)', 'E: Exposure + prevent hypothermia', 'Then secondary survey head-to-toe'],
  'ATLS 10e',
  'Multi-trauma from road accident.',
  'Simultaneous primary survey; cervical collar, high-flow O2, 2 large-bore IVs with warmed crystalloid, cover to prevent hypothermia, FAST.'
);

NOTE_CONTENT_B['surgery-11-glasgow-coma-scale-gcs'] = n(
  'Bedside measure of consciousness: Eye + Verbal + Motor; range 3-15.',
  ['Eye: 4 spontaneous, 3 to speech, 2 to pain, 1 none', 'Verbal: 5 oriented, 4 confused, 3 inappropriate, 2 incomprehensible, 1 none', 'Motor: 6 obeys, 5 localizes, 4 withdraws, 3 flexion (decorticate), 2 extension (decerebrate), 1 none', 'GCS <=8 = coma, intubate'],
  'Teasdale 1974, INC',
  'Head injury patient opens eyes to pain, confused words, localizes pain.',
  'Calculate E2 V4 M5 = GCS 11 (moderate head injury); document, repeat q15 min, prepare CT scan.',
  'GCS 13-15 mild, 9-12 moderate, <=8 severe.'
);

NOTE_CONTENT_B['surgery-12-abdominal-trauma'] = n(
  'Blunt or penetrating abdominal injury.',
  ['Blunt: spleen most common injured', 'Penetrating: liver most common', 'FAST scan: 4 windows — perihepatic, perisplenic, pelvis, pericardial', 'DPL positive if >10 mL blood or >100,000 RBC/mm3', 'Unstable + positive FAST → laparotomy'],
  'ATLS 10e',
  'Cyclist hit car, LUQ pain, BP 92/60.',
  'FAST scan; if positive + unstable, emergency laparotomy — likely splenic injury.'
);

NOTE_CONTENT_B['surgery-13-thoracic-trauma-pneumothorax-and-hemothorax'] = n(
  'Air (pneumo) or blood (hemo) in pleural space.',
  ['Tension pneumothorax: hyper-resonance, tracheal deviation, distended neck veins, shock — needle decompression 2nd ICS MCL (or 5th ICS AAL per ATLS 10e)', 'Open pneumothorax: 3-sided dressing', 'Massive hemothorax: >1500 mL initial or >200 mL/h — thoracotomy', 'Simple pneumo/hemo: chest tube 5th ICS AAL'],
  'ATLS 10e',
  'Stabbing patient, absent breath sounds left, trachea deviated right, BP 80/50.',
  'Immediate needle decompression at 2nd ICS MCL left, prepare for chest tube insertion, high-flow O2.',
  'Do not wait for X-ray in tension pneumothorax.'
);

NOTE_CONTENT_B['surgery-14-head-injury-edh-and-sdh'] = n(
  'Traumatic intracranial hemorrhage.',
  ['EDH: middle meningeal artery tear; biconvex/lens-shaped; lucid interval; 90% skull fracture', 'SDH: bridging vein rupture; crescent-shaped; elderly, alcoholics, anticoagulants; slower onset', 'Cushing triad (raised ICP): HTN + bradycardia + irregular respiration', 'Management: head up 30°, mannitol 0.25-1 g/kg, hyperventilation transient, craniotomy'],
  'Brain Trauma Foundation',
  'Young adult after fall, lucid then unconscious, pupil dilated on same side.',
  'Prepare for urgent non-contrast CT, maintain airway, head up 30°, notify neurosurgery — classic EDH presentation.'
);

NOTE_CONTENT_B['surgery-15-burns-classification-and-management'] = n(
  'Thermal, chemical, or electrical skin injury.',
  ['Depth: superficial (epidermis), superficial partial (blisters, painful), deep partial (reduced sensation), full thickness (painless, leathery)', 'Rule of 9s adult: head 9, each arm 9, each leg 18, trunk front 18, back 18, genitalia 1', 'Pediatric Lund-Browder', 'Parkland formula: 4 mL x kg x %TBSA; half in first 8 h from injury, half in next 16 h', 'Refer if >10% TBSA, face/hands/perineum, full thickness'],
  'ABA 2023, Brunner 14e',
  '70 kg adult, 30% TBSA full-thickness burn from kitchen fire 1 h ago.',
  'Secure airway, IV lactated Ringer 4x70x30 = 8400 mL (4200 first 8 h from burn time), Foley catheter, warm environment, tetanus.',
  'Urine output goal: adult 0.5 mL/kg/h, child 1 mL/kg/h.'
);

NOTE_CONTENT_B['surgery-16-plastic-surgery-skin-graft-humbys-knife'] = n(
  'Reconstructive skin coverage.',
  ['Split-thickness skin graft (STSG): epidermis + partial dermis; harvested with Humby knife or dermatome', 'Full-thickness graft (FTSG): better cosmesis, smaller area', 'Donor site heals 10-14 d', 'Graft take: 5-7 d; assess color, adherence', 'Stevens-Johnson, necrotizing fasciitis post-burn needs grafting'],
  'Bailey & Love 28e',
  'Post burn debridement wound 10x15 cm requiring cover.',
  'Prepare donor site (thigh), harvest STSG with Humby knife, mesh for expansion, apply to wound with light pressure dressing.'
);

NOTE_CONTENT_B['surgery-17-bedsores-pressure-ulcer-stages'] = n(
  'NPUAP staging of pressure injuries.',
  ['Stage I: non-blanchable erythema, skin intact', 'Stage II: partial-thickness loss, blister', 'Stage III: full-thickness loss, visible fat', 'Stage IV: exposed bone/muscle/tendon', 'Unstageable: eschar-covered', 'Deep tissue injury: purple intact skin', 'Sites: sacrum, heels, ischium, greater trochanter, occiput'],
  'NPUAP/EPUAP 2019',
  'Bedridden stroke patient with 2 cm non-blanchable erythema over sacrum.',
  'Stage I — offload sacrum with pillow, turn q2h, barrier cream, Braden assessment, hydrate, protein-rich diet.',
  'Braden <=18 = at risk.'
);

NOTE_CONTENT_B['surgery-18-wound-healing-stages'] = n(
  'Phases of soft tissue repair.',
  ['Hemostasis (immediate): vasoconstriction, platelet plug, coagulation cascade', 'Inflammatory (0-5 d): neutrophils, macrophages', 'Proliferative (3-21 d): fibroblasts, angiogenesis, granulation, epithelialization', 'Maturation/remodeling (21 d to 1 y): collagen cross-linking, scar strengthens to ~80%'],
  'Brunner 14e',
  'Clean surgical wound day 7.',
  'Expect proliferative phase; remove sutures at 7-14 d per site, instruct on scar care.'
);

NOTE_CONTENT_B['surgery-19-liver-abscess-and-cancer'] = n(
  'Localized hepatic infection or malignancy.',
  ['Amoebic abscess: right lobe, anchovy-paste pus, PV travel; metronidazole + luminal agent', 'Pyogenic: polymicrobial; drain + broad-spectrum antibiotics', 'HCC: aflatoxin, HBV/HCV, cirrhosis; AFP >400 suggestive', 'Imaging: USG, triphasic CT'],
  'Bailey & Love 28e',
  'Middle-aged man from rural area with RUQ pain, fever, hepatomegaly.',
  'USG — confirm amoebic abscess, start metronidazole 750 mg TDS x10 d + diloxanide, needle aspirate if large (>10 cm).'
);

NOTE_CONTENT_B['surgery-20-gallbladder-stones-cholelithiasis'] = n(
  'Gallstones in gallbladder.',
  ['5 F: Female, Fat, Fertile, Forty, Fair', 'Types: cholesterol (70%), pigment (hemolysis), mixed', 'Biliary colic: RUQ pain radiating to right shoulder, post-fatty meal', 'Cholecystitis: Murphy sign +, fever, leukocytosis', 'Treatment: laparoscopic cholecystectomy'],
  'Brunner 14e',
  '45-y-old obese woman with severe RUQ pain post-meal, Murphy sign +.',
  'NPO, IV fluids, analgesia, antibiotics if cholecystitis, prep for lap chole.'
);

NOTE_CONTENT_B['surgery-21-pancreatitis-and-whipple-procedure'] = n(
  'Pancreas inflammation; Whipple for peri-ampullary cancer.',
  ['Acute: gallstone or alcohol, epigastric pain radiating to back, elevated lipase', 'Ranson score / APACHE II for severity', 'Grey-Turner (flank), Cullen (periumbilical) = hemorrhagic', 'Whipple: pancreaticoduodenectomy; removes head of pancreas, duodenum, CBD, gallbladder'],
  'Bailey & Love 28e',
  '50-y-old alcoholic with epigastric pain, lipase 1800, Ranson 4.',
  'NPO, IV fluids aggressively, pain control, NG if vomiting, monitor calcium, ICU for severe.'
);

NOTE_CONTENT_B['surgery-22-renal-stone-and-renal-cancer'] = n(
  'Urolithiasis and RCC.',
  ['Stones: calcium oxalate (70%), struvite (infection), uric acid, cystine', 'Colic: loin to groin pain, hematuria, restless', 'Imaging: NCCT KUB gold standard', 'RCC: hematuria, flank pain, mass (classic triad rare); clear cell most common', 'Staging: T, N, M; nephrectomy for localized'],
  'Campbell-Walsh 12e',
  'Patient writhing with right flank pain, hematuria.',
  'NCCT, analgesia (diclofenac IM), hydration, alpha-blocker tamsulosin for stones <10 mm, strain urine for stone analysis.'
);

NOTE_CONTENT_B['surgery-23-horseshoe-kidney'] = n(
  'Congenital fusion of lower poles of kidneys across midline.',
  ['Prevalence: 1 in 500', 'Isthmus usually trapped by IMA', 'Complications: UTI, stones, hydronephrosis', 'Usually asymptomatic; incidental imaging'],
  'Campbell-Walsh 12e',
  'Incidental finding on CT abdomen.',
  'Reassure; monitor for UTI, stones; refer if obstruction.'
);

NOTE_CONTENT_B['surgery-24-bladder-cancer'] = n(
  'Most common urinary malignancy; transitional cell carcinoma >90%.',
  ['Risk: smoking (most important), aniline dye, schistosomiasis (squamous), chronic catheter', 'Painless gross hematuria most common symptom', 'Diagnosis: cystoscopy + biopsy', 'Treatment: TURBT, intravesical BCG for non-muscle invasive; cystectomy for invasive'],
  'Campbell-Walsh 12e',
  '65-y-old smoker with painless hematuria.',
  'Urology referral, urgent cystoscopy, counsel smoking cessation.'
);

NOTE_CONTENT_B['surgery-25-urethral-trauma'] = n(
  'Anterior (bulbar) or posterior (membranous) urethral injury.',
  ['Signs: blood at meatus, high-riding prostate (posterior), perineal hematoma', 'Do NOT catheterize', 'Retrograde urethrogram first', 'Suprapubic catheter if rupture confirmed'],
  'Bailey & Love 28e',
  'Pelvic fracture patient with blood at meatus.',
  'Do not insert Foley; arrange retrograde urethrogram, prepare suprapubic catheter, consult urology.'
);

NOTE_CONTENT_B['surgery-26-hypospadias'] = n(
  'Congenital urethral opening on ventral penis.',
  ['Classification: glandular, coronal, penile, penoscrotal, perineal', 'Associated: chordee, cryptorchidism', 'Do NOT circumcise — foreskin used for repair', 'Repair at 6-18 mo'],
  'Ghai 10e',
  'Newborn boy with urethral opening on ventral penile shaft.',
  'Counsel parents, refer to pediatric urology, avoid circumcision — foreskin needed for reconstruction.'
);

NOTE_CONTENT_B['surgery-27-ectopia-vesicae'] = n(
  'Bladder exstrophy — failure of closure of anterior abdominal wall and bladder.',
  ['Everted bladder mucosa visible', 'Associated: epispadias, pubic diastasis', '1 in 30,000', 'Cover with plastic wrap at birth, avoid latex, reconstruction staged'],
  'Ghai 10e',
  'Newborn with open bladder on lower abdomen.',
  'Cover bladder with plastic wrap (not gauze — will adhere), NICU, prevent hypothermia, pediatric urology urgent.'
);

NOTE_CONTENT_B['surgery-28-undescended-testis'] = n(
  'Testis not in scrotum by 3 mo (unilateral) or earlier bilaterally.',
  ['Risk: infertility, malignancy (seminoma), torsion, inguinal hernia', 'Orchidopexy at 6-12 mo', 'Bilateral → karyotype, endocrine workup', 'Retractile vs true undescended'],
  'Ghai 10e',
  '6-mo-old with empty right hemiscrotum.',
  'Refer to pediatric surgery for orchidopexy around 6-12 mo.'
);

NOTE_CONTENT_B['surgery-29-testicular-torsion'] = n(
  'Twisting of spermatic cord — surgical emergency.',
  ['Peak age: puberty', 'Sudden severe scrotal pain, elevated testis, absent cremasteric reflex, Prehn sign negative (no relief with elevation)', 'Doppler USG — absent flow', 'Manual detorsion (open book), surgical exploration within 6 h'],
  'Campbell-Walsh 12e',
  '15-y-old with sudden left testicular pain 3 h, elevated, swollen.',
  'Emergency scrotal exploration within 6 h for salvage, avoid delays for imaging if classic.'
);

NOTE_CONTENT_B['surgery-30-hernia-types-and-complications'] = n(
  'Protrusion of viscera through defect in containing wall.',
  ['Inguinal: direct (medial to inferior epigastric) vs indirect (lateral, through deep ring)', 'Femoral: below inguinal ligament, women, high obstruction risk', 'Umbilical, incisional, hiatal', 'Complications: irreducible, obstructed, strangulated (ischemia — emergency)'],
  'Bailey & Love 28e',
  'Elderly patient with irreducible painful inguinal swelling 6 h, vomiting.',
  'NPO, IV fluids, NG tube, urgent surgical consult for strangulation — emergency herniotomy.'
);

NOTE_CONTENT_B['surgery-31-deep-vein-thrombosis-dvt'] = n(
  'Thrombus in deep vein, typically calf/thigh.',
  ['Virchow triad: venous stasis, endothelial injury, hypercoagulability', 'Signs: unilateral leg swelling, warmth, tenderness, Homan sign', 'Wells score to stratify', 'D-dimer sensitive not specific; Doppler USG confirms', 'Treatment: LMWH/DOAC/warfarin; IVC filter if anticoagulation contraindicated'],
  'CHEST 2021',
  'Post-op day 4 hip replacement with unilateral calf swelling.',
  'Doppler USG leg, start enoxaparin 1 mg/kg SC BD pending, elevate leg, compression stocking, bedside PE assessment.',
  'Prophylaxis: LMWH + mechanical in all post-op.'
);

NOTE_CONTENT_B['surgery-32-osteomyelitis'] = n(
  'Bone infection, hematogenous or direct.',
  ['Commonest: S aureus (also MRSA)', 'Children: metaphysis long bones; adults: vertebrae', 'ESR, CRP elevated; MRI sensitive', 'Treatment: 4-6 wk IV antibiotics; surgical debridement for chronic'],
  'Brunner 14e',
  '8-y-old with fever, limp, tender distal femur.',
  'Blood cultures x2, MRI, empiric anti-staph IV, ortho consult for drainage.'
);

NOTE_CONTENT_B['surgery-33-rickets'] = n(
  'Defective mineralization of growing bone due to vit D/calcium/phosphate deficiency.',
  ['Signs: bowing legs (genu varum), rachitic rosary, Harrison sulcus, craniotabes, delayed fontanel closure', 'Labs: low calcium/phosphate, elevated ALP, low 25(OH)D', 'Treatment: vit D3 supplementation + calcium'],
  'Ghai 10e',
  '2-y-old with bowed legs, delayed milestones, exclusively breastfed vegetarian mother.',
  'Send Ca/P/ALP/25(OH)D, start vit D3 60,000 IU weekly x6-8 wk + calcium, sunlight exposure, refer ortho if deformity.'
);

NOTE_CONTENT_B['surgery-34-osteomalacia'] = n(
  'Adult equivalent of rickets — poor mineralization of osteoid.',
  ['Causes: vit D deficiency, chronic kidney disease, phosphate wasting', 'Signs: bone pain, proximal muscle weakness, waddling gait, Looser zones on X-ray', 'Treatment: vit D + calcium'],
  'Harrison 21e',
  'Elderly woman with diffuse bone pain and difficulty climbing stairs.',
  'Check 25(OH)D, Ca, P, ALP, start vit D3 60,000 IU weekly, calcium, fall prevention.'
);

NOTE_CONTENT_B['surgery-35-fractures-and-healing'] = n(
  'Break in continuity of bone.',
  ['Types: complete/incomplete, open/closed, displaced, comminuted, greenstick (kids), stress', 'Healing: hematoma (0-7d) → fibrocartilaginous callus (2-3 wk) → bony callus (6-12 wk) → remodeling', 'Open fracture: irrigation, debridement, tetanus, antibiotics within 6 h', 'Fat embolism 12-72 h after long bone fracture: petechiae, hypoxia, confusion'],
  'Brunner 14e',
  'Long bone fracture patient 48 h post-injury develops dyspnea, petechiae on chest, confusion.',
  'Suspect fat embolism — high-flow O2, support ventilation, notify team; supportive care.'
);

NOTE_CONTENT_B['surgery-36-local-anesthesia'] = n(
  'Reversible nerve block.',
  ['Amides (no -caine echo): lidocaine, bupivacaine, ropivacaine', 'Esters: procaine, tetracaine — higher allergy risk', 'Max doses: lidocaine 4.5 mg/kg plain, 7 mg/kg with adrenaline', 'Adrenaline prolongs action, reduces bleeding; avoid in end-arteries (finger, toe, penis, ear, nose)', 'Toxicity: CNS excitation → seizure → coma; cardiac arrest'],
  'Miller Anesthesia 9e',
  'Hand laceration repair in 70 kg adult with 1% lidocaine.',
  'Max 4.5 mg/kg = 315 mg = 31.5 mL of 1%; avoid adrenaline in fingers, aspirate before injecting.'
);

NOTE_CONTENT_B['surgery-37-surgical-instruments-identification'] = n(
  'High-yield OR instruments.',
  ['Artery forceps: Spencer Wells, mosquito (mostly haemostasis)', 'Tissue forceps: Babcock (bowel), Allis (skin)', 'Needle holder: Mayo-Hegar, Crile-Wood', 'Retractors: Deaver, Balfour, Doyen (CS), Morris', 'Scissors: Mayo (heavy), Metzenbaum (fine dissection)', 'Clamps: Kocher (bowel), Satinsky (vascular)'],
  'AORN, Bailey & Love 28e',
  'OSCE image of curved forceps with longitudinal serrations and transverse serrations at tip.',
  'Identify as Kocher artery forceps; used for bowel clamping/vascular control.'
);

NOTE_CONTENT_B['surgery-38-basics-of-ventilator'] = n(
  'Mechanical ventilation modes and parameters.',
  ['Modes: CMV, AC, SIMV, PSV, CPAP, BiPAP', 'Settings: RR, Vt 6-8 mL/kg ideal body wt (ARDSNet), FiO2, PEEP 5-10, I:E 1:2', 'ARDS: low Vt (6 mL/kg), higher PEEP, plateau <30', 'Weaning: SBT on PSV, RSBI <105 suggests readiness'],
  'Brunner 14e',
  'ARDS patient on ventilator with Vt 500 mL for 70 kg (=7 mL/kg) not improving.',
  'Reduce Vt to 6 mL/kg (420), increase PEEP per ARDS table, monitor plateau pressure <30, prone if PaO2/FiO2 <150.'
);

NOTE_CONTENT_B['surgery-39-achalasia-cardia'] = n(
  'Failure of LES relaxation and absent esophageal peristalsis.',
  ['Dysphagia to solids AND liquids', 'Bird-beak on barium swallow', 'Manometry diagnostic — gold standard', 'Treatment: pneumatic dilation, Heller myotomy, POEM, botox injection'],
  'Harrison 21e',
  'Young adult with progressive dysphagia to solids and liquids, regurgitation.',
  'Refer for manometry, prepare for Heller myotomy/POEM, soft diet, head up after meals.'
);

NOTE_CONTENT_B['surgery-40-zenker-diverticulum'] = n(
  'Pharyngoesophageal pulsion diverticulum at Killian triangle.',
  ['Elderly, regurgitation of undigested food, halitosis, neck mass', 'Barium swallow diagnostic', 'Treatment: cricopharyngeal myotomy + diverticulectomy'],
  'Bailey & Love 28e',
  '75-y-old with regurgitation of undigested food hours after meals, halitosis.',
  'Refer for barium swallow and surgical evaluation.'
);

NOTE_CONTENT_B['surgery-41-gerd'] = n(
  'Reflux of gastric contents into esophagus.',
  ['Pyrosis, regurgitation, waterbrash, chronic cough, nocturnal asthma', 'Barrett esophagus complication', 'Diagnosis: pH monitoring, endoscopy', 'Lifestyle: weight loss, avoid late meals, head of bed elevation', 'Medical: PPI', 'Surgical: Nissen fundoplication for refractory'],
  'ACG 2022',
  '50-y-old with nocturnal retrosternal burning, sour taste.',
  'PPI (omeprazole) 20 mg OD before breakfast, weight loss, avoid late meals, head elevation; endoscopy if alarm symptoms.',
  'Alarm symptoms: dysphagia, weight loss, hematemesis, melena, anemia.'
);

NOTE_CONTENT_B['surgery-42-esophageal-perforation'] = n(
  'Full-thickness tear; Boerhaave after vomiting (spontaneous).',
  ['Mackler triad: vomiting + chest pain + subcutaneous emphysema', 'Gastrografin swallow (not barium)', 'High mortality if not operated within 24 h', 'NPO, broad-spectrum antibiotics, surgical repair'],
  'Bailey & Love 28e',
  'Post-endoscopy patient with chest pain, neck crepitus.',
  'NPO, IV fluids, broad-spectrum antibiotics, urgent CT with water-soluble contrast, surgical consult.'
);

NOTE_CONTENT_B['surgery-43-barrett-esophagus'] = n(
  'Metaplastic columnar epithelium replacing squamous in distal esophagus due to chronic GERD.',
  ['Risk of adenocarcinoma — surveillance endoscopy', 'Non-dysplastic: q3-5 y; low-grade dysplasia: q6-12 mo; high-grade: ablation', 'PPI long-term'],
  'ACG 2022',
  'Chronic GERD patient, endoscopy shows salmon-colored mucosa distal esophagus.',
  'Biopsy to confirm metaplasia/dysplasia, continue PPI, schedule surveillance per dysplasia grade.'
);

NOTE_CONTENT_B['surgery-44-infantile-hypertrophic-pyloric-stenosis-ihps'] = n(
  'Hypertrophy of pyloric muscle causing gastric outlet obstruction in 4-6 wk-old infants.',
  ['Male >female (4:1), first-born, macrolide exposure', 'Projectile non-bilious vomiting; olive-shaped mass', 'Hypokalemic hypochloremic metabolic alkalosis (classic)', 'USG: pyloric muscle >3 mm thick, >15 mm length', 'Treatment: correct electrolytes first, then Ramstedt pyloromyotomy'],
  'Ghai 10e',
  '6-wk-old boy with projectile non-bilious vomiting, olive mass RUQ.',
  'Correct hypochloremic alkalosis with IV NS + KCl before surgery; NG decompression; plan pyloromyotomy once pH and chloride normalized.'
);

NOTE_CONTENT_B['surgery-45-peptic-ulcer'] = n(
  'Gastric or duodenal mucosal break.',
  ['Duodenal: pain relieved by food, H pylori 90%', 'Gastric: pain worsened by food, H pylori 70%, risk of malignancy', 'Test: urea breath test, stool antigen, endoscopy + biopsy', 'Treatment: PPI + triple therapy (amoxicillin + clarithromycin) x14 d', 'Complications: bleed, perforation, obstruction'],
  'ACG 2017',
  'H pylori + on UBT with epigastric pain.',
  'Start triple therapy: PPI BD + amoxicillin 1 g BD + clarithromycin 500 mg BD x14 d, confirm eradication UBT 4 wk after.'
);

NOTE_CONTENT_B['surgery-46-portal-hypertension'] = n(
  'Portal venous pressure >5 mmHg above IVC.',
  ['Causes: cirrhosis (commonest), portal vein thrombosis, schistosomiasis', 'Consequences: varices, splenomegaly, caput medusae, ascites, encephalopathy', 'Variceal bleed: terlipressin/octreotide, endoscopic band ligation, TIPSS'],
  'Harrison 21e',
  'Cirrhosis patient with hematemesis.',
  'Two large-bore IVs, crystalloid, blood cross-match, terlipressin IV, endoscopy for banding, prophylactic ceftriaxone.'
);

NOTE_CONTENT_B['surgery-47-bariatric-surgery'] = n(
  'Weight-loss surgery in BMI >40 or >35 with comorbidity.',
  ['Types: sleeve gastrectomy, Roux-en-Y gastric bypass, adjustable band', 'Complications: anastomotic leak, dumping, B12/iron/Ca deficiency', 'Lifelong vitamin/mineral supplementation'],
  'ASMBS 2022',
  '45-y-old BMI 45 with T2DM post Roux-en-Y.',
  'Small frequent meals, chew thoroughly, lifelong multivitamin + B12 IM monthly, calcium, iron.'
);

NOTE_CONTENT_B['surgery-48-meckel-diverticulum'] = n(
  'True diverticulum of ileum — vitelline duct remnant.',
  ['Rule of 2s: 2% population, 2 ft from ileocecal valve, 2 inches long, 2% symptomatic, boys 2x, first 2 y of life', 'Painless rectal bleed (ectopic gastric mucosa)', 'Meckel scan (Tc-99m pertechnetate)'],
  'Ghai 10e',
  '18-mo-old with painless rectal bleed.',
  'Meckel scan, prep for diverticulectomy if positive, stabilize with fluids and transfusion if needed.'
);

NOTE_CONTENT_B['surgery-49-appendicitis'] = n(
  'Inflammation of vermiform appendix; commonest surgical abdomen.',
  ['Migration of pain to RIF, anorexia, low-grade fever, Rovsing/psoas/obturator signs, McBurney tenderness', 'Alvarado score >=7 = likely', 'USG/CT abdomen', 'Treatment: appendectomy (open or laparoscopic)'],
  'Bailey & Love 28e',
  '20-y-old with periumbilical pain migrating to RIF, anorexia, fever 38.',
  'NPO, IV fluids, analgesia, antibiotics, urgent surgical consult for appendectomy.'
);

NOTE_CONTENT_B['surgery-50-hemorrhoids'] = n(
  'Dilated anal cushions — internal above dentate, external below.',
  ['Internal grades: I (no prolapse), II (prolapse reduces spontaneously), III (manual reduction), IV (irreducible)', 'Painless bright red rectal bleed on defecation', 'High-fiber diet, sitz bath, warm water, analgesics', 'Rubber band ligation (grade I-II), sclerotherapy, hemorrhoidectomy (grade III-IV)'],
  'Bailey & Love 28e',
  '40-y-old with painless bright red rectal bleed on defecation, grade II.',
  'High-fiber diet, stool softener, sitz bath, refer for rubber band ligation.'
);

NOTE_CONTENT_B['surgery-51-anal-fissure'] = n(
  'Linear tear in anoderm distal to dentate line.',
  ['Posterior midline 90%; other locations suspect IBD/TB', 'Severe pain on defecation, bright red bleed, sentinel tag, hypertrophied papilla', 'Treatment: sitz bath, high-fiber, GTN ointment, botulinum toxin, lateral sphincterotomy'],
  'Bailey & Love 28e',
  'Patient with severe tearing anal pain on defecation, small bleed.',
  'Sitz bath, high-fiber diet, 0.4% GTN ointment BD, analgesia, refer if not healed in 6 wk.'
);

NOTE_CONTENT_B['surgery-52-colorectal-cancer'] = n(
  'Adenocarcinoma of colon/rectum.',
  ['Risk: FAP, HNPCC, UC, low-fiber/high-red meat, smoking', 'Symptoms: change in bowel habit, bleeding, tenesmus, iron-deficiency anemia', 'Screening: FIT/FOBT from 50 y, colonoscopy q10 y', 'Staging: TNM; Dukes A-D', 'Surgery ± chemo ± radiation'],
  'NCCN 2023',
  '55-y-old with change in bowel habit and iron-def anemia.',
  'Colonoscopy + biopsy, CT for staging, refer to oncology/surgery.'
);

NOTE_CONTENT_B['surgery-53-massive-blood-transfusion-protocol'] = n(
  'Replacement of >=10 units RBC in 24 h or >=4 units in 1 h.',
  ['1:1:1 PRBC:FFP:Platelet ratio', 'Complications: hypothermia, hyperkalemia, hypocalcemia (citrate), acidosis, TRALI, TACO', 'Monitor coagulation, ionized calcium, temperature', 'Warm blood, give calcium gluconate per 4 U'],
  'ATLS 10e, AABB 2023',
  'Trauma patient requiring 8 units PRBC in 30 min.',
  'Activate MTP, maintain 1:1:1 ratio, warm blood, calcium gluconate 1 g IV per 4 U, monitor potassium and pH.'
);

NOTE_CONTENT_B['surgery-54-triage-start-and-disaster'] = n(
  'Sorting casualties by urgency.',
  ['START (adult): assess Respirations, Perfusion, Mental status', 'Tags: Red (immediate), Yellow (delayed), Green (minor/walking wounded), Black (expectant/deceased)', 'JumpSTART for pediatric', 'ED triage: ESI 1-5 or Manchester'],
  'FEMA, ATLS',
  'Mass casualty with 30 victims; you are first responder.',
  'Call walking wounded to one area (Green), then check respirations — if absent after airway opened = Black; RR >30 or perfusion capillary refill >2 s or altered mental = Red; others = Yellow.',
  'Triage Red = life-threatening but salvageable.'
);

// ============ FOUNDATION (30 topics) ============
NOTE_CONTENT_B['foundation-1-infection-control-standard-precautions'] = n(
  'CDC standard precautions applied to all patients regardless of diagnosis.',
  ['Hand hygiene before/after every patient contact', 'PPE based on anticipated exposure (gloves, gown, mask, eyewear)', 'Safe sharps handling — no recapping', 'Cough etiquette', 'Environmental cleaning'],
  'CDC 2007 updated 2022',
  'Nurse caring for multiple patients in a ward.',
  'Perform hand hygiene at 5 moments (WHO): before patient contact, before aseptic task, after body fluid exposure risk, after patient contact, after contact with patient surroundings.',
  'Alcohol-based hand rub if hands not visibly soiled; soap+water if soiled.'
);

NOTE_CONTENT_B['foundation-2-code-of-ethics-icn-inc'] = n(
  'Ethical guidelines for nursing practice.',
  ['ICN code: promote health, prevent illness, restore health, alleviate suffering', 'INC 2018: 4 elements — nurse and patient/individual, practice, profession, co-workers', 'Pillars: autonomy, beneficence, non-maleficence, justice, fidelity, veracity', 'Confidentiality protected except by law'],
  'ICN 2021, INC 2018',
  'Patient refuses blood transfusion on religious grounds despite severe anemia.',
  'Respect autonomy after verifying informed refusal, document, involve multi-disciplinary team including ethics committee.'
);

NOTE_CONTENT_B['foundation-3-lines-and-tubes-suctioning-ett-ng-tracheostomy-cvp'] = n(
  'Routine care of commonly encountered tubes/lines.',
  ['Suctioning: pre-oxygenate 100% O2, sterile technique, <15 sec, negative pressure 80-150 adult', 'ETT: confirm bilateral breath sounds, CXR position 2-4 cm above carina, cuff 20-30 cmH2O', 'NG: verify pH <5.5 aspirate or X-ray', 'Tracheostomy: inner cannula care q8h, stoma cleaning, humidification', 'CVP: dress q7d transparent/q2d gauze, chlorhexidine scrub'],
  'AACN 2020',
  'Patient on ventilator needs suctioning for thick secretions.',
  'Pre-oxygenate to 100% x 30 sec, sterile technique, insert without suction, apply suction while withdrawing <15 sec, reassess SpO2.',
  'Never instill saline as a routine in closed suction.'
);

NOTE_CONTENT_B['foundation-4-oxygen-therapy-devices-and-flow-rates'] = n(
  'Oxygen delivery devices and FiO2 achieved.',
  ['Nasal cannula: 1-6 L/min → 24-44% FiO2 (rule: 4% per L)', 'Simple mask: 5-10 L/min → 40-60%', 'Venturi: precise 24-60% (blue 24, white 28, yellow 35, red 40, green 60)', 'Non-rebreather: 10-15 L → 90-100%', 'Must humidify at flow >4 L/min'],
  'Brunner 14e',
  'COPD patient needs precise FiO2 28% due to CO2 retention risk.',
  'Apply Venturi mask with white/28% adapter, flow as labeled on device (typically 4 L), monitor SpO2 88-92%.',
  'Target SpO2 88-92% in COPD, 94-98% in most adults.'
);

NOTE_CONTENT_B['foundation-5-blood-transfusion-and-sampling'] = n(
  'Safe transfusion practice.',
  ['Bedside double-check: patient ID, blood group/Rh, crossmatch, product expiry', 'Start within 30 min of release from blood bank, complete within 4 h', 'Vitals baseline, 15 min, hourly', 'Use 0.9% saline only in same line', 'Transfusion reactions: acute hemolytic, febrile non-hemolytic, allergic, TRALI, TACO'],
  'AABB 2023, MoHFW NACO',
  'Patient starts chills, lower back pain, fever 15 min into transfusion.',
  'STOP transfusion, keep line open with NS, notify physician, send blood bag + tubing + patient blood/urine for workup — suspect acute hemolytic reaction.',
  'Anti-D within 72 h for Rh-negative who receives Rh+ blood.'
);

NOTE_CONTENT_B['foundation-6-iv-fluids-types-and-indications'] = n(
  'Crystalloids and colloids for fluid resuscitation/maintenance.',
  ['Isotonic: NS 0.9%, RL, Plasmalyte — resuscitation', 'Hypotonic: 0.45% NaCl, D5W (becomes hypotonic after dextrose metabolized) — maintenance', 'Hypertonic: 3% NaCl, D10, D25 — hyponatremia/hypoglycemia', 'Colloids: albumin, hydroxyethyl starch (avoid in sepsis), gelatin', 'Maintenance formula 4-2-1: 100/50/20 mL/kg/d'],
  'ISCCM, NICE CG174',
  '70-kg adult needs maintenance fluids.',
  '4-2-1 rule: 100 mL/h for first 10 kg, 50 for next 10, 20 for rest → ~110 mL/h of NS or RL.'
);

NOTE_CONTENT_B['foundation-7-oral-care-unconscious-patient'] = n(
  'Prevention of VAP and aspiration in unconscious/ventilated patients.',
  ['Side-lying or head turned', 'Chlorhexidine 0.12% oral rinse BD (VAP bundle)', 'Soft toothbrush or swab q4-6h', 'Suction ready; small amounts of fluid', 'Moisten lips with petroleum jelly'],
  'IHI VAP bundle',
  'ICU patient intubated needs oral care.',
  'Position side-lying, suction prepared, use soft swab with CHG 0.12%, clean tongue to reduce biofilm, moisten lips.'
);

NOTE_CONTENT_B['foundation-8-airway-management'] = n(
  'Open airway and ventilate effectively.',
  ['Head-tilt chin-lift (no trauma); jaw thrust if C-spine', 'OPA (size: corner of mouth to angle of mandible) — only if unconscious, no gag', 'NPA (size: tip of nose to tragus) — for semi-conscious', 'Bag-valve-mask: 1 breath per 5-6 sec adult, 1 per 3 sec child', 'LMA, ETT as escalation'],
  'AHA BLS/ACLS',
  'Unconscious patient with snoring respiration.',
  'Head-tilt chin-lift, insert OPA sized mouth corner to mandibular angle, check breathing, bag-valve-mask if inadequate.'
);

NOTE_CONTENT_B['foundation-9-iv-cannula-gauges-and-colour-coding'] = n(
  'Peripheral IV cannula sizes by gauge.',
  ['14G orange: trauma/rapid infusion', '16G grey: trauma, surgery', '18G green: blood, contrast', '20G pink: routine IV, blood', '22G blue: children, thin veins', '24G yellow: neonates/very thin'],
  'INS 2021',
  'Unstable trauma adult.',
  'Insert 14G or 16G in antecubital; 2 large-bore for rapid fluid/blood resuscitation.'
);

NOTE_CONTENT_B['foundation-10-cardiopulmonary-resuscitation-cpr'] = n(
  'High-quality CPR per AHA 2020 adult guidelines.',
  ['Compression rate 100-120/min, depth 5-6 cm, full recoil', 'Ratio 30:2 (one rescuer) until advanced airway', 'Minimize interruptions <10 sec', 'Switch compressors q2 min', 'Shockable: VF/pulseless VT → defibrillate, then resume CPR', 'Child: 15:2 if 2 rescuers; depth 1/3 AP diameter'],
  'AHA 2020, ILCOR',
  'Adult collapse in ward, no pulse, no breathing.',
  'Start chest compressions immediately 100-120/min depth 5-6 cm, call code, attach AED, shock if VF/VT, continue 30:2 with bag-mask.',
  'Hands-only CPR if untrained or unwilling to ventilate.'
);

NOTE_CONTENT_B['foundation-11-drug-calculation-basics'] = n(
  'Common formulas for dose and rate calculation.',
  ['Dose: (desired/have) x volume', 'Drops/min: (volume x drop factor) / time (min); macrodrip 15 or 20 gtt/mL, microdrip 60 gtt/mL', 'Pediatric dose: mg/kg or m2 BSA', 'Infusion: mL/h = mg/min desired × 60 / concentration'],
  'Brunner 14e',
  'Give 1 g cefazolin in 100 mL NS over 30 min using 20 gtt/mL set.',
  'Drops/min = (100 x 20) / 30 = 67 gtt/min.'
);

NOTE_CONTENT_B['foundation-12-bandaging'] = n(
  'Techniques for wound support/compression/immobilization.',
  ['Types: spiral, reverse spiral, figure-of-8, spica, recurrent', 'Principles: distal to proximal, even tension, distal pulse check', 'Assess: colour, warmth, movement, sensation distal to bandage'],
  'INC',
  'Ankle sprain — apply compression bandage.',
  'Figure-of-8 from foot distal to leg proximal, 50% overlap, check capillary refill and toe colour after.'
);

NOTE_CONTENT_B['foundation-13-patient-positioning'] = n(
  'Therapeutic and functional positioning.',
  ['Semi-Fowler (30°): respiratory, cardiac, NG feeding', 'Fowler (45-60°): dyspnea', 'High-Fowler (>60°): CHF, severe dyspnea', 'Trendelenburg: hypotension (historical — limited evidence)', 'Left lateral: pregnancy (venous return), late-pregnancy emergency', 'Prone: ARDS (>=12 h/day)', 'Sim: enema', 'Orthopneic: COPD'],
  'Brunner 14e',
  'ARDS patient with P/F ratio 140.',
  'Prone positioning for >=12 h/day, protect pressure points, secure all lines, airway clearance.'
);

NOTE_CONTENT_B['foundation-14-assessment-scales-gcs-braden-norton-flacc'] = n(
  'Common assessment tools.',
  ['GCS: E4V5M6 max 15, coma <=8', 'Braden: pressure risk (<=18 at risk; lower = higher risk)', 'Norton: pressure risk (<=14 at risk)', 'FLACC: pediatric pain (Face, Legs, Activity, Cry, Consolability 0-10)', 'Numeric pain 0-10', 'Wong-Baker faces: pediatric pain'],
  'INC, AACN',
  'Non-verbal 3-y-old post-op.',
  'Assess pain with FLACC; sum 0-10; >=4 intervene with analgesic.'
);

NOTE_CONTENT_B['foundation-15-enema-types-and-procedure'] = n(
  'Fluid instilled into rectum for evacuation or medication.',
  ['Cleansing: tap water, NS, soap-suds', 'Retention: oil (100-200 mL), medicated', 'Return-flow (Harris): air distension relief', 'Position: left lateral Sim', 'Tube insertion 7-10 cm adult, 2.5-4 cm child', 'Height: 30-45 cm above anus'],
  'INC',
  'Pre-op patient needs bowel prep.',
  'Left lateral Sim, lubricate tip, insert 7-10 cm, allow fluid to flow by gravity 30-45 cm height, encourage retention 5-10 min.'
);

NOTE_CONTENT_B['foundation-16-care-of-colostomy-patient'] = n(
  'Care of surgically created bowel opening.',
  ['Types: ileostomy (liquid output, skin excoriation risk), transverse/descending/sigmoid colostomy (more formed)', 'Stoma: pink/red moist; assess for necrosis (dark), retraction, prolapse', 'Bag change when 1/3 full; skin barrier', 'High-fiber diet for constipation, avoid gas-producing foods', 'Body image support'],
  'WOCN 2021',
  'Post-op day 3 colostomy patient.',
  'Assess stoma colour (pink/red healthy), measure output, empty when 1/3 full, apply skin barrier, provide psychological support.'
);

NOTE_CONTENT_B['foundation-17-medication-administration-rights-and-routes'] = n(
  'Medication safety framework.',
  ['10 rights: patient, drug, dose, route, time, documentation, reason, response, education, right to refuse', '3 checks: when taking from cabinet, preparing, administering', 'Routes: PO, SL, buccal, SC, IM, IV, ID, PR, topical, inhaled, transdermal'],
  'ISMP 2023',
  'About to give metformin 500 mg PO to patient.',
  'Check patient ID with 2 identifiers (name + DOB/MRN), right drug/dose/route/time, educate, document.'
);

NOTE_CONTENT_B['foundation-18-patient-safety-speak-up-and-npsg'] = n(
  'System and communication strategies to prevent harm.',
  ['NPSG (Joint Commission 2024): identify correctly, communicate effectively (SBAR), medications safely, alarms, prevent infections, falls, suicide', 'SPEAK UP: Speak up, Pay attention, Educate, Advocate, Know meds, Use quality facility, Participate', 'SBAR: Situation, Background, Assessment, Recommendation'],
  'JC NPSG 2024',
  'Handing over to night shift.',
  'Use SBAR: state situation (post-op day 1), background (diabetic, CKD), assessment (stable but pain 7/10), recommendation (PRN analgesia q4h).'
);

NOTE_CONTENT_B['foundation-19-crutch-walking-gaits'] = n(
  'Ambulation techniques with crutches.',
  ['4-point: maximum support, slowest (R crutch → L foot → L crutch → R foot)', '2-point: faster, partial weight (R crutch + L foot together, L crutch + R foot)', '3-point: non-weight bearing leg — crutches first, then good leg', 'Swing-through: both legs together, most advanced', 'Stairs: good leg first going up, bad leg first going down'],
  'Brunner 14e',
  'Post-ORIF right femur patient, non-weight-bearing right.',
  'Teach 3-point gait: both crutches forward + injured leg, then hop good leg through; "good up, bad down" for stairs.'
);

NOTE_CONTENT_B['foundation-20-restraint-types-and-care'] = n(
  'Mechanical or chemical restriction of movement — last resort.',
  ['Types: physical (wrist, vest, mitt), chemical (sedatives), environmental (locked unit)', 'Indications: imminent harm to self/others; all alternatives failed', 'Physician order within 1 h; renew q4h adult, q1h child', 'Assess q15 min: circulation, skin, hydration, toileting, ROM', 'Quick-release knot — never square knot'],
  'JC 2024',
  'Agitated post-ICU patient pulling at IV lines.',
  'Try de-escalation, then least-restrictive restraint if needed, physician order within 1 h, assess q15 min, release q2h for ROM/toileting.'
);

NOTE_CONTENT_B['foundation-21-health-assessment'] = n(
  'Systematic head-to-toe patient assessment.',
  ['Sequence: inspection → palpation → percussion → auscultation (abdomen: inspect → auscultate → percuss → palpate)', 'Vital signs baseline', 'Subjective (history) + objective (exam) data', 'Focus assessment for chief complaint', 'Document using body system approach'],
  'Bates 13e',
  'New admission head-to-toe.',
  'Take vitals, collect history, perform head-to-toe in IPPA order (except abdomen), document findings, report abnormalities.'
);

NOTE_CONTENT_B['foundation-22-urinary-catheter-care'] = n(
  'CAUTI prevention in indwelling catheters.',
  ['Insert only when necessary; remove as early as possible', 'Sterile insertion, closed drainage', 'Secure catheter to thigh to prevent traction', 'Keep bag below bladder, never on floor', 'Peri-care BD with soap and water', 'Never disconnect unless indicated'],
  'CDC CAUTI 2017',
  'Post-op with Foley 5 days.',
  'Daily assessment of need, perineal care BD, ensure unobstructed drainage, bag below bladder, document output; plan removal ASAP.'
);

NOTE_CONTENT_B['foundation-23-chest-tube-care'] = n(
  'Water-seal drainage system.',
  ['3 chambers: collection, water-seal, suction control', 'Normal: bubbling in suction chamber; tidaling in water-seal with respiration', 'Continuous bubbling in water-seal = air leak', 'Keep below chest level; no kinks; never clamp >1 h (tension pneumothorax risk)', 'Milking/stripping not routine'],
  'Brunner 14e',
  'Post-op thoracotomy with chest tube.',
  'Keep drainage unit below chest, monitor tidaling, report continuous bubbling (air leak), measure output hourly, never clamp during transport unless directed.',
  'Bubbling in water-seal during expiration only is normal.'
);

NOTE_CONTENT_B['foundation-24-thoracentesis'] = n(
  'Needle aspiration of pleural fluid.',
  ['Position: upright, leaning on table with arms resting', 'Site: 2 ICS below fluid level, above rib to avoid neurovascular bundle', '<1.5 L/session to avoid re-expansion pulmonary edema', 'Complications: pneumothorax, bleeding, infection'],
  'Brunner 14e',
  'Pleural effusion 1.5 L.',
  'Position sitting leaning forward, assist with aspiration above rib, monitor for cough/dyspnea (pneumothorax), send fluid to lab, CXR post-procedure.'
);

NOTE_CONTENT_B['foundation-25-lumbar-puncture-procedure-and-position'] = n(
  'Sampling CSF via subarachnoid space L3-L4 or L4-L5.',
  ['Position: lateral recumbent knees-to-chest or sitting leaning forward', 'Site: iliac crest line = L4 body', 'Contraindications: raised ICP, skin infection, coagulopathy', 'Post-LP: bed rest supine 4-6 h, hydration to reduce headache'],
  'Brunner 14e',
  'Suspected meningitis, no signs of raised ICP.',
  'Position lateral with knees-to-chest, prep L3-L4 site, assist with sterile technique, label tubes sequentially (typically 1-cell count, 2-biochem, 3-microbio, 4-spare), bed rest after.'
);

NOTE_CONTENT_B['foundation-26-pulmonary-artery-catheter'] = n(
  'Swan-Ganz catheter measures right heart pressures and cardiac output.',
  ['Normal CVP 2-8 mmHg; PA pressure 15-30/8-15; PCWP 6-12 (reflects LVEDP)', 'PCWP elevated in LV failure; CVP in RV failure/volume overload', 'Complications: arrhythmia, PA rupture, infection, thrombus', 'Less used now due to complications'],
  'Brunner 14e',
  'ICU patient with unclear fluid status.',
  'Ensure transducer at phlebostatic axis (4th ICS mid-axillary), zero regularly, monitor waveform, report dampening (thrombus) or high pressures.'
);

NOTE_CONTENT_B['foundation-27-pressure-ulcer-stages'] = n(
  'See Surgery-17; same staging.',
  ['Risk assessment: Braden (6 subscales, total 6-23; <=18 at risk)', 'Prevention: turn q2h, pressure-redistributing mattress, skin inspection daily, moisture management, nutrition'],
  'NPIAP 2019',
  'Braden 14 in elderly bedridden patient.',
  'Turn q2h, air/foam mattress, heel offload, skin assessment per shift, nutritional review, moisturize dry skin.'
);

NOTE_CONTENT_B['foundation-28-vital-signs'] = n(
  'Baseline physiologic parameters.',
  ['Adult: T 36.5-37.5, HR 60-100, RR 12-20, BP <120/<80 optimal', 'Child varies by age: infant HR 100-160, RR 30-60; toddler HR 80-130; school-age 70-110', 'Apical HR for 1 min in children and irregular rhythms', 'Orthostatic: drop >20/10 or rise HR >20'],
  'Brunner 14e, Ghai 10e',
  'Newborn vital signs.',
  'Document expected newborn: HR 120-160, RR 30-60, axillary T 36.5-37.5.'
);

NOTE_CONTENT_B['foundation-29-spill-management-bmw'] = n(
  'BMW Rules 2016 colour-coded waste and spill handling.',
  ['Yellow: infectious, anatomical, chemical, pharmaceutical', 'Red: contaminated recyclable plastics (gloves, tubing, catheters)', 'White: sharps (translucent)', 'Blue: glassware, metallic body implants', 'Spill: contain, disinfect with 1% sodium hypochlorite 10 min, clean inside-out, document, report'],
  'BMW Rules 2016 MoEF',
  'Blood spill on floor.',
  'Wear PPE, cover with absorbent paper, apply 1% NaOCl for 10 min, wipe from outside toward center, discard in yellow bag, document.'
);

NOTE_CONTENT_B['foundation-30-needle-stick-injury-pep'] = n(
  'Occupational exposure to blood-borne pathogens.',
  ['Immediate: allow to bleed freely, wash with soap+water (no scrubbing), don\'t suck or squeeze', 'Report within 2 h', 'Source + worker testing for HIV, HBV, HCV', 'HIV PEP within 2 h (best) up to 72 h: tenofovir + emtricitabine + dolutegravir x28 d', 'HBV: vaccine + HBIg if unvaccinated'],
  'NACO PEP guidelines, CDC',
  'Nurse sustained needle stick from HIV+ patient.',
  'Allow to bleed, wash with soap+water, report within 2 h, start PEP TDF+FTC+DTG within 2 h, test at 0/6 wk/3 mo/6 mo, counselling.',
  'Window period for HIV antibodies ~6 wk.'
);

// Continue with CHN (46), Medicine (111), Child (78), Pharma (60), Mental (44), Micro (39), Biochem (21), Anatomy (77), ENT (9).
// Packing below in terse format.
