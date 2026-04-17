// Pharmacology (60) + Mental Health (44). Compact notes.
import { n } from './notes-helper.mjs';
export const NOTE_CONTENT_PM = {};
const P = NOTE_CONTENT_PM;

// ============ PHARMACOLOGY ============
P['pharma-1-cocaine-toxicity'] = n(
  'Sympathomimetic + local anesthetic effects; blocks NE/DA reuptake.',
  ['Toxicity: agitation, hyperthermia, HTN, tachycardia, MI, stroke, arrhythmia, seizure', 'Avoid beta-blockers alone (unopposed alpha worsens HTN)', 'Treatment: benzodiazepines first-line, phentolamine for HTN, cooling, IV fluids'],
  'Goldfrank 11e',
  'Young cocaine user with chest pain, BP 200/120, HR 140, agitation.',
  'IV lorazepam 2 mg for agitation + BP, avoid pure beta-blocker, consider phentolamine or nitroglycerin, cooling, ECG serial, troponin.'
);
P['pharma-2-acetaminophen-paracetamol-toxicity'] = n(
  'Hepatotoxicity from NAPQI accumulation.',
  ['Toxic dose: >150 mg/kg adult, >200 mg/kg child; chronic 4 g/d max', 'Stages: 1 asymptomatic, 2 RUQ pain 24-72 h, 3 fulminant hepatic failure 72-96 h, 4 recovery or death', 'Rumack-Matthew nomogram for level at 4 h', 'Antidote: N-acetylcysteine (NAC) IV 150 mg/kg loading, most effective <8 h'],
  'AAPCC',
  'Intentional overdose of 30 x 500 mg paracetamol tablets 2 h ago.',
  'Activated charcoal if <1-2 h, 4-h acetaminophen level, start IV NAC 150 mg/kg in 200 mL D5W over 60 min, then 50 mg/kg over 4 h, then 100 mg/kg over 16 h, admit.',
  'Don\'t wait for level if clear toxic ingestion >8 h.'
);
P['pharma-3-carbon-monoxide-poisoning'] = n(
  'Binds Hb with 240x affinity; cherry-red lips.',
  ['Source: fire, faulty heaters, auto exhaust', 'SpO2 reads normal (falsely)', 'Measure COHb >10% (non-smoker), >20% smoker, >40% severe', 'Treatment: 100% O2 reduces t1/2 from 4-5 h to 1 h; hyperbaric O2 for severe/pregnant'],
  'Harrison',
  'Family rescued from house fire, confused, cherry-red skin, SpO2 98% on RA.',
  'Apply 100% non-rebreather mask regardless of SpO2, send COHb level, consider HBOT if severe/pregnant/LOC.',
  'SpO2 cannot distinguish oxyhemoglobin from COHb.'
);
P['pharma-4-digoxin-toxicity'] = n(
  'Narrow therapeutic window — serum 0.5-2 ng/mL.',
  ['Precipitants: renal failure, hypokalemia, hypomagnesemia, hypercalcemia, amiodarone, verapamil', 'Symptoms: nausea, yellow-green vision, bradycardia, arrhythmia (AV block, VT)', 'Antidote: digoxin immune Fab (Digibind)', 'Avoid cardioversion unless life-threatening (VF risk)'],
  'AHA',
  'Elderly on digoxin + furosemide with nausea, yellow vision, HR 40, level 4.',
  'Hold digoxin, correct K+/Mg+, atropine for bradycardia, digoxin-specific Fab for severe arrhythmia or K+ >5.5, avoid cardioversion unless essential.'
);
P['pharma-5-magnesium-toxicity-in-eclampsia'] = n(
  'MgSO4 for seizure prophylaxis.',
  ['Loading: 4 g IV + 10 g IM (Pritchard) or 4-6 g IV + 1-2 g/h infusion (Zuspan)', 'Therapeutic: 4-7 mEq/L', 'Toxicity: 1st loss of DTR (>7), respiratory depression (>10), cardiac arrest (>13)', 'Monitor: DTR, RR >=16, UO >=30 mL/h', 'Antidote: calcium gluconate 1 g IV over 10 min'],
  'ACOG 2020',
  'Eclamptic on MgSO4 with RR 10, absent DTR.',
  'Stop MgSO4, give calcium gluconate 1 g IV over 5-10 min, support ventilation, reassess Mg level.'
);
P['pharma-6-organophosphorus-poisoning'] = n(
  'Acetylcholinesterase inhibition — SLUDGE + DUMBELS.',
  ['SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI upset, Emesis', 'DUMBELS: Defecation, Urination, Miosis, Bradycardia/bronchorrhea, Emesis, Lacrimation, Salivation/sweating', 'Treatment: decontaminate, atropine (dry secretions goal), pralidoxime (oxime)', 'Avoid suxamethonium'],
  'AAPCC',
  'Farmer with miosis, drooling, fasciculations, bradycardia, pesticide smell.',
  'Remove clothing, wash skin + decontaminate staff PPE, atropine 2-4 mg IV repeat doubling q5 min until secretions dry, pralidoxime 30 mg/kg IV, ICU.'
);
P['pharma-7-antidotes-table'] = n(
  'Common antidotes.',
  ['Paracetamol: NAC', 'Opioid: naloxone', 'Benzodiazepine: flumazenil (caution — seizure)', 'Iron: deferoxamine', 'Lead: EDTA, dimercaprol', 'Methanol/ethylene glycol: fomepizole or ethanol', 'Warfarin: vit K, FFP/PCC', 'Heparin: protamine', 'Beta-blocker: glucagon', 'CCB: calcium, insulin+dextrose', 'Cyanide: hydroxocobalamin'],
  'Goldfrank',
  'Narcotic overdose with RR 6.',
  'Naloxone 0.4 mg IV (titrate), support ventilation, continuous monitoring — antidote half-life shorter than opioids may require redosing.'
);
P['pharma-8-antiplatelet-drugs'] = n(
  'Drugs that inhibit platelet aggregation.',
  ['Aspirin: irreversible COX inhibition; 75-325 mg/d', 'P2Y12 inhibitors: clopidogrel, prasugrel, ticagrelor', 'GP IIb/IIIa: abciximab, eptifibatide — IV, ACS/PCI', 'Dipyridamole: PDE inhibitor', 'DAPT for 12 mo after ACS/DES typically'],
  'ACC/AHA',
  'Post-PCI with drug-eluting stent.',
  'DAPT — aspirin 75 mg + ticagrelor 90 mg BD x12 mo minimum, then aspirin alone long-term, PPI if GI risk.'
);
P['pharma-9-thrombolytic-therapy'] = n(
  'Fibrinolysis for acute STEMI/stroke.',
  ['Agents: alteplase (tPA), streptokinase, tenecteplase, reteplase', 'Major risk: intracranial hemorrhage', 'Contraindications: prior ICH, stroke <3 mo, head trauma <3 mo, aortic dissection, recent major surgery', 'Stroke: alteplase 0.9 mg/kg <4.5 h; STEMI: within 30 min of presentation if PCI unavailable'],
  'AHA',
  'STEMI within 2 h, no cath lab, no contraindications.',
  'IV tenecteplase weight-based bolus over 5 s, then aspirin + clopidogrel + enoxaparin, monitor for bleeding, transfer for rescue PCI if failed.'
);
P['pharma-10-emergency-treatment-of-hypotension'] = n(
  'Low BP management.',
  ['Assess cause: hypovolemic, cardiogenic, distributive, obstructive', 'Initial: IV crystalloid 500 mL-1 L', 'If not responsive: vasopressor — NE first-line for septic/distributive; dopamine if bradycardic; epi for anaphylaxis', 'Monitor MAP >=65'],
  'SCCM',
  'Septic patient BP 75/40 after 30 mL/kg crystalloid.',
  'Start norepinephrine 0.05-0.1 mcg/kg/min via central line, titrate to MAP >=65, add vasopressin if needed; look for source control.'
);
P['pharma-11-vasoconstrictor-vs-vasodilator'] = n(
  'Classes.',
  ['Vasoconstrictors: NE, epinephrine, phenylephrine, vasopressin, ergotamine', 'Vasodilators: nitroglycerin, nitroprusside, hydralazine, nitrates, CCB (amlodipine), nesiritide', 'Arterial vs venous predominant'],
  'Katzung',
  'Flash pulmonary edema needing afterload reduction.',
  'IV nitroglycerin (venous + arterial), titrate, monitor BP.'
);
P['pharma-12-digoxin'] = n(
  'Na-K ATPase inhibitor → increased intracellular Ca → positive inotropy; also vagal → negative chronotropy.',
  ['Indications: HF with reduced EF, rate control in AF', 'Dose: load 0.5 mg IV then 0.25 mg q6 h x2 (total 1-1.5 mg), maintain 0.125-0.25 mg/d', 'Levels 0.5-2 ng/mL', 'Many drug interactions'],
  'AHA',
  'AF with HR 140 despite beta-blocker.',
  'Add digoxin loading dose IV, monitor ECG continuously, check baseline K+/Mg+/creatinine.'
);
P['pharma-13-routes-of-drug-administration'] = n(
  'Routes and bioavailability.',
  ['Enteral: PO, SL, buccal, PR', 'Parenteral: SC, IM, IV, ID, intrathecal, epidural', 'Topical, transdermal, inhaled, intra-articular, ophthalmic, otic', 'IV 100% bioavailable; PO variable (first-pass)'],
  'Katzung',
  'Need rapid anticoagulation.',
  'IV heparin gives immediate effect; LMWH SC slower onset; PO anticoagulants slower still.'
);
P['pharma-14-adrenaline-dose-ratios'] = n(
  'Epinephrine concentrations.',
  ['1:1000 (1 mg/mL): IM/SC, anaphylaxis 0.3-0.5 mg IM', '1:10,000 (0.1 mg/mL): IV, cardiac arrest 1 mg q3-5 min', '1:100,000: LA with epi'],
  'AHA',
  'Anaphylaxis patient.',
  '1:1000 epinephrine 0.5 mg IM lateral thigh (adult), repeat q5-15 min, call rapid response, IV crystalloid, O2, antihistamine + steroid adjunct.'
);
P['pharma-15-mydriasis-and-miotics'] = n(
  'Pupil-affecting drugs.',
  ['Mydriatics (dilate): atropine, tropicamide, phenylephrine', 'Miotics (constrict): pilocarpine, timolol (indirect via IOP)', 'Glaucoma: pilocarpine, timolol, latanoprost, dorzolamide'],
  'Katzung',
  'Acute angle closure glaucoma.',
  'Pilocarpine 2% drops, timolol, IV acetazolamide, analgesia; urgent ophthalmology.'
);
P['pharma-16-anticholinergic-drugs'] = n(
  'Block muscarinic receptors.',
  ['Examples: atropine, scopolamine, tropicamide, glycopyrrolate, ipratropium, tiotropium, benztropine, oxybutynin', 'Effects: dry mouth, blurry vision, tachycardia, urinary retention, constipation, mydriasis, hyperthermia', 'Toxicity: hot as hare, red as beet, blind as bat, dry as bone, mad as hatter'],
  'Katzung',
  'OP poisoning treatment.',
  'Atropine IV 2-4 mg, repeat doubling until secretions dry; pralidoxime.'
);
P['pharma-17-atropine'] = n(
  'Antimuscarinic — emergency drug.',
  ['Bradyarrhythmia: 0.5 mg IV q3-5 min (max 3 mg adult)', 'OP poisoning: 2-4 mg IV repeat doubling', 'Pre-anesthesia: reduces secretions', 'Neonatal: 0.02 mg/kg min 0.1 mg', 'Side effects: tachycardia, dry mouth, urinary retention, heat intolerance'],
  'AHA',
  'Symptomatic bradycardia HR 38, BP 80/50.',
  'Atropine 0.5 mg IV push, repeat q3-5 min up to 3 mg, monitor rhythm, consider transcutaneous pacing if no response.'
);
P['pharma-18-anaphylaxis-treatment'] = n(
  'Life-threatening IgE-mediated reaction.',
  ['Criteria: airway/breathing + circulation + skin/mucosa, 2-organ within minutes-hours of exposure', 'First-line: IM epinephrine 0.5 mg (adult) lateral thigh q5-15 min', 'Adjunct: O2, crystalloid bolus, antihistamine (H1 + H2), steroid, bronchodilator', 'Observe 6-24 h (biphasic)'],
  'WAO',
  'Wasp sting with urticaria, wheeze, BP 80/50.',
  'IM epinephrine 0.5 mg lateral mid-thigh immediately, call rapid response, high-flow O2, IV crystalloid 1 L bolus, supine with legs up, repeat epi q5-15 min PRN.'
);
P['pharma-19-antidiarrheal-agents'] = n(
  'Symptomatic + rehydration.',
  ['Loperamide: μ-opioid, slow motility; avoid in invasive diarrhea/IBD with toxic mega', 'Diphenoxylate + atropine', 'Bismuth subsalicylate', 'Racecadotril: enkephalinase inhibitor (IAP-approved pediatric)', 'Probiotics'],
  'IAP',
  'Traveller diarrhea non-bloody.',
  'Oral rehydration first, loperamide 4 mg then 2 mg per loose stool (max 16 mg/d), avoid if fever/bloody stool.'
);
P['pharma-20-proton-pump-inhibitors-ppi'] = n(
  'Irreversible H-K ATPase inhibition.',
  ['Examples: omeprazole, pantoprazole, esomeprazole, rabeprazole, lansoprazole', 'Take before meals', 'Long-term: B12/Ca deficiency, C diff, fractures, AKI', 'PO 20-40 mg OD standard; IV 80 mg bolus + 8 mg/h for bleeding'],
  'ACG',
  'GERD with nocturnal symptoms.',
  'PPI 30-60 min before breakfast, re-evaluate in 4-8 wk, step-down once controlled.'
);
P['pharma-21-carminatives'] = n(
  'Agents to reduce intestinal gas (colic).',
  ['Simethicone: defoamer', 'Peppermint oil', 'Ginger', 'Dill water', 'Not effective in serious underlying pathology'],
  'IAP',
  'Infantile colic.',
  'Simethicone 20-40 mg up to QID, parent reassurance, feeding review; rule out organic pathology.'
);
P['pharma-22-antiemetics-moa-and-use'] = n(
  'Antinausea classes.',
  ['5-HT3 antagonists: ondansetron — CINV, PONV; QT prolongation', 'D2 antagonists: metoclopramide, prochlorperazine — EPS risk', 'NK1 antagonists: aprepitant — CINV', 'H1 antihistamines: promethazine, meclizine, cyclizine — motion sickness', 'Cannabinoids', 'Dexamethasone adjunct'],
  'NCCN antiemesis',
  'Post-op nausea.',
  'Ondansetron 4 mg IV, hydration, consider dexamethasone IV in non-diabetic; monitor for QT.'
);
P['pharma-23-first-line-treatment-for-pulmonary-tb'] = n(
  'DOTS under NTEP.',
  ['New case regimen: 2HRZE + 4HRE (daily FDC); India shifted to daily from 2017', 'Isoniazid (H), Rifampicin (R), Pyrazinamide (Z), Ethambutol (E)', 'Weight-based FDCs', 'DST guides MDR treatment'],
  'NTEP 2023',
  'AFB+ 60 kg new pulmonary TB.',
  'Start 4-FDC (HRZE) as per 56-70 kg band daily x2 mo intensive, then 2 drug continuation 4 mo, Nikshay, follow-up sputum at 2 and 6 mo.'
);
P['pharma-24-side-effects-of-anti-tb-drugs'] = n(
  'Adverse effects.',
  ['Isoniazid: hepatitis, peripheral neuropathy (give pyridoxine 10 mg)', 'Rifampicin: orange-red body fluids, hepatitis, enzyme inducer', 'Pyrazinamide: hyperuricemia, hepatitis', 'Ethambutol: optic neuritis (red-green color)', 'Streptomycin: ototoxic, nephrotoxic'],
  'NTEP',
  'Patient on ATT 3 mo with decreased vision.',
  'Suspect ethambutol optic neuritis — stop EMB, ophthalmology, Snellen + color vision, usually reversible.'
);
P['pharma-25-tetracycline'] = n(
  'Broad-spectrum bacteriostatic.',
  ['Uses: acne, Chlamydia, Rickettsia, Lyme, Brucella, H pylori', 'Adverse: tooth staining/enamel hypoplasia (avoid <8 y), photosensitivity, esophagitis (take standing with water)', 'Avoid in pregnancy/lactation'],
  'Katzung',
  'Pregnant woman with mild acne wants antibiotic.',
  'Avoid tetracycline — teratogenic to teeth and bones; alternatives erythromycin topical.'
);
P['pharma-26-antimalarials'] = n(
  'Class review.',
  ['Chloroquine: Pv/Po (where CQ-sensitive), hemolysis in G6PD', 'Primaquine: radical cure Pv/Po, hemolysis in G6PD', 'ACT: artemisinin + partner (Pf)', 'Quinine: severe malaria historic; cinchonism', 'Mefloquine: prophylaxis; neuropsychiatric', 'Doxycycline: prophylaxis'],
  'NVBDCP',
  'Severe Pf malaria.',
  'IV artesunate 2.4 mg/kg at 0, 12, 24 h then daily; ICU support; avoid artesunate monotherapy oral.'
);
P['pharma-27-cephalosporins'] = n(
  'Beta-lactam class — generations.',
  ['1st (cefazolin, cephalexin): Gram+ cocci, surgical prophylaxis', '2nd (cefuroxime): respiratory infection', '3rd (ceftriaxone, cefotaxime): meningitis, gonorrhea, severe CAP', '4th (cefepime): broad — Pseudomonas', '5th (ceftaroline): MRSA'],
  'IDSA',
  'Neonate sepsis.',
  'Ampicillin + cefotaxime IV as empirical cover, blood cultures before, monitor renal function.'
);
P['pharma-28-fentanyl'] = n(
  'Synthetic opioid, 100x more potent than morphine.',
  ['Rapid onset, short duration', 'Respiratory depression, chest wall rigidity (rapid IV)', 'Uses: anesthesia, severe pain, PCA, transdermal patch for chronic pain', 'Antidote: naloxone'],
  'Miller',
  'Chronic pain patient on fentanyl patch develops RR 6.',
  'Remove patch, naloxone 0.04-0.4 mg IV titrated, support ventilation, continuous monitoring (opioid t1/2 longer than naloxone).'
);
P['pharma-29-thiopental-sodium'] = n(
  'Ultra-short-acting barbiturate; induction agent.',
  ['Dose 3-5 mg/kg IV', 'Redistribution ends effect in 5-10 min', 'Can cause laryngospasm, hypotension, porphyria (contraindication)', 'No analgesia'],
  'Miller',
  'Status asthmaticus needing induction.',
  'Avoid thiopental (histamine release); choose ketamine instead.'
);
P['pharma-30-gaseous-anesthetics'] = n(
  'Inhalational agents.',
  ['N2O: analgesia + amnesia, no relaxation', 'Sevoflurane: smooth induction, pediatric', 'Isoflurane: maintenance, coronary steal', 'Desflurane: rapid onset/offset, airway irritation', 'MAC concept'],
  'Miller',
  'Pediatric induction.',
  'Sevoflurane inhalational induction (non-pungent) with N2O, then IV access.'
);
P['pharma-31-general-anesthesia-stages'] = n(
  'Guedel stages.',
  ['I: analgesia', 'II: excitement', 'III: surgical anesthesia (planes 1-4)', 'IV: medullary depression (avoid)', 'Modern IV induction bypasses stages rapidly'],
  'Miller',
  'OSCE item on stages.',
  'Identify stage III as target for surgery.'
);
P['pharma-32-spinal-anesthesia'] = n(
  'Subarachnoid injection of LA.',
  ['Position: sitting or lateral', 'Level L3-L4 below cord termination', 'Onset 2-5 min', 'Complications: hypotension (sympathetic block), headache (PDPH), urinary retention, total spinal', 'Nurse: pre-load fluids, monitor BP q2-5 min initially, keep supine for cord block level, foley'],
  'Miller',
  'CS patient under spinal with BP drop 80/40.',
  'Left lateral tilt (avoid aortocaval compression), IV fluid bolus, phenylephrine or ephedrine, O2, call anesthetist.'
);
P['pharma-33-regional-anesthesia'] = n(
  'Nerve blocks (peripheral, plexus) and neuraxial (spinal, epidural).',
  ['Epidural: continuous, no dura puncture', 'Brachial plexus blocks: interscalene (shoulder), supraclavicular, axillary', 'Femoral, sciatic, popliteal blocks', 'LA toxicity monitoring'],
  'ASRA',
  'Post-op labor epidural patient.',
  'Monitor BP q15 min, assess sensory level, check for urinary retention, left lateral tilt, maternal positioning.'
);
P['pharma-34-diuretics'] = n(
  'Classes.',
  ['Loop (furosemide, torsemide, bumetanide): inhibit NKCC2 in thick ascending limb — most potent', 'Thiazide (HCTZ, chlorthalidone): DCT — HTN', 'K-sparing (spironolactone, eplerenone, amiloride): collecting duct; gynecomastia spironolactone', 'Osmotic (mannitol): for ICP/IOP', 'CA inhibitor (acetazolamide): glaucoma, altitude'],
  'Katzung',
  'Acute pulmonary edema.',
  'Furosemide 40 mg IV, nitroglycerin drip, upright position, O2, BiPAP if respiratory fatigue.'
);
P['pharma-35-furosemide-lasix'] = n(
  'Loop diuretic.',
  ['Dose: 20-80 mg IV/PO', 'IV onset 5-10 min, PO 30-60 min', 'Ototoxicity esp rapid IV', 'Hypokalemia, hyponatremia, dehydration, hyperuricemia'],
  'Katzung',
  'IV furosemide 80 mg bolus for pulmonary edema.',
  'Administer over 1-2 min (ototoxicity risk with rapid push), monitor K+, check weight/UO, correct K+ with IV KCl if <3.5.'
);
P['pharma-36-insulin'] = n(
  'Types by onset/peak/duration.',
  ['Rapid (lispro, aspart, glulisine): 10-15 min / 1-2 h / 3-5 h', 'Regular: 30-60 min / 2-4 h / 6-8 h', 'NPH: 1-2 h / 4-10 h / 10-18 h', 'Long (glargine, detemir, degludec): flat, 20-24+ h', 'Premix 70/30'],
  'ADA',
  'T1DM on basal-bolus.',
  'Basal glargine OD bedtime + rapid (aspart) before meals, carb counting, monitor BG 4x/d, rotate sites.'
);
P['pharma-37-anticancer-drugs'] = n(
  'Major classes.',
  ['Alkylating: cyclophosphamide (hemorrhagic cystitis, use mesna), cisplatin (nephrotoxic, ototoxic)', 'Antimetabolites: methotrexate (leucovorin rescue), 5-FU', 'Anthracyclines: doxorubicin (cardiotoxicity)', 'Vinca alkaloids: vincristine (neuropathy)', 'Taxanes', 'Targeted (imatinib, trastuzumab)', 'Immune checkpoint inhibitors'],
  'NCCN',
  'Patient on cyclophosphamide.',
  'Ensure adequate hydration + mesna to prevent hemorrhagic cystitis, antiemetic, monitor CBC.'
);
P['pharma-38-dose-calculation'] = n(
  'Adult and pediatric.',
  ['Adult: per mg/kg or absolute', 'Pediatric: mg/kg or mg/m2 (BSA more accurate for chemo)', 'BSA Mosteller: √((ht cm x wt kg)/3600)', 'Young rule: age/(age+12) x adult dose', 'Clark rule: weight(lb)/150 x adult'],
  'Ghai',
  '20-kg child needs ibuprofen 10 mg/kg.',
  'Dose = 200 mg; draw up from suspension concentration and double-check.'
);
P['pharma-39-flow-rate-and-drops-min-calculations'] = n(
  'Drip calculations.',
  ['Drops/min = (volume mL x drop factor) / time (min)', 'Macrodrip: 15 or 20 gtt/mL; microdrip 60 gtt/mL', 'Infusion pump mL/h'],
  'INC',
  '500 mL NS over 4 h with 15 gtt/mL set.',
  'Drops/min = (500 x 15) / 240 = 31 gtt/min.'
);
P['pharma-40-drug-of-choice-table'] = n(
  'Common NORCET drugs of choice.',
  ['Status epilepticus: lorazepam', 'Anaphylaxis: IM epinephrine', 'Eclampsia: MgSO4', 'Torsades: IV MgSO4', 'SVT: adenosine', 'Atypical pneumonia: macrolide', 'Community-acquired pneumonia: amoxicillin or amox-clav', 'Malaria Pf: ACT', 'Meningococcal: ceftriaxone'],
  'IDSA/AAP',
  'Item on drug of choice.',
  'Recall as per indication table.'
);
P['pharma-41-alcohol-withdrawal-symptoms'] = n(
  'CIWA-Ar assessment tool.',
  ['Timeline: tremor 6-12 h, seizure 12-48 h, hallucinations 12-48 h, DTs 48-96 h', 'DT: autonomic hyperactivity, confusion, visual hallucinations', 'Treatment: benzodiazepine symptom-triggered (CIWA >=10), thiamine IM/IV before dextrose (prevent Wernicke), fluids'],
  'NICE',
  'Alcoholic 36 h after last drink, tremor, tachycardia, diaphoresis.',
  'CIWA-Ar score, thiamine 100 mg IV before glucose, benzodiazepine (lorazepam) per CIWA, IV fluid, monitor vitals.'
);
P['pharma-42-malignant-hypertension'] = n(
  'Severe HTN with retinal hemorrhages/papilledema.',
  ['Target organ damage: AKI, encephalopathy, heart failure', 'IV labetalol, nicardipine, or nitroprusside', 'Reduce MAP 10-25% first hour, then to 160/100 over 2-6 h'],
  'JNC 8',
  'BP 230/140 with headache and papilledema.',
  'ICU admit, IV labetalol bolus + infusion, reduce MAP 10-25% in 1 h, monitor hourly, workup secondary causes.'
);
P['pharma-43-beta-blockers-cautions'] = n(
  'Side effects and contraindications.',
  ['Bradycardia, AV block, hypotension, bronchospasm, fatigue, depression, sexual dysfunction, masked hypoglycemia', 'Avoid: asthma (non-selective), severe peripheral disease, heart block > 1st degree, decompensated HF (use cautiously when stable)', 'Cardioselective: metoprolol, bisoprolol, atenolol'],
  'AHA',
  'Asthmatic with HTN.',
  'Avoid non-selective beta-blocker; choose ACE-i/ARB or CCB instead.'
);
P['pharma-44-ace-inhibitors'] = n(
  'Block ACE.',
  ['Examples: enalapril, ramipril, lisinopril, captopril', 'Side effects: dry cough (bradykinin), hyperkalemia, AKI in RAS, angioedema (life-threatening), teratogenic', 'Hold if K+ >5.5 or creatinine rises >30%'],
  'ACC/AHA',
  'HTN patient develops dry cough on enalapril.',
  'Switch to ARB (losartan) which avoids bradykinin-mediated cough.'
);
P['pharma-45-warfarin'] = n(
  'Vit K antagonist; inhibits factors II, VII, IX, X and proteins C, S.',
  ['Many interactions (food, drugs, herbs)', 'INR target 2-3 (AF, DVT); 2.5-3.5 mechanical valve', 'Bleeding reversal: vit K + PCC + FFP', 'Initial paradoxical hypercoagulability — overlap with heparin 5 d and INR >=2'],
  'ACCP',
  'Patient on warfarin with INR 8, no bleeding.',
  'Hold warfarin, low-dose oral vit K 1-2 mg, recheck INR in 24 h, investigate cause (diet, drug).'
);
P['pharma-46-heparin'] = n(
  'Indirect thrombin inhibitor via antithrombin.',
  ['UFH: IV infusion, monitor aPTT (1.5-2x normal)', 'LMWH (enoxaparin): SC, no routine monitoring, anti-Xa in special populations', 'Antidote: protamine sulfate (1 mg/100 U UFH; partial for LMWH)', 'HIT: stop heparin, switch to non-heparin anticoag'],
  'ACCP',
  'PE on UFH with platelets drop 50% at day 5.',
  'Suspect HIT — stop all heparin, send HIT antibody + SRA, start non-heparin anticoagulant (argatroban or fondaparinux), avoid transfusion.'
);
P['pharma-47-lithium'] = n(
  'Mood stabilizer for bipolar.',
  ['Therapeutic: 0.6-1.2 mEq/L', 'Toxicity: >1.5 tremor, nausea, ataxia; >2.5 seizure, coma', 'Renal elimination — NSAIDs, thiazides, ACE-i increase levels; sodium depletion worsens', 'Side effects: polyuria, hypothyroidism, weight gain, nephrotoxicity'],
  'APA',
  'Bipolar patient on lithium + NSAID with tremor, confusion, level 3.2.',
  'Stop lithium, hydrate with IV NS, stop offending drugs, consider hemodialysis if severe, monitor Na+/K+/cr.'
);
P['pharma-48-phenytoin'] = n(
  'Na channel blocker — antiepileptic.',
  ['Zero-order kinetics at therapeutic doses', 'Therapeutic 10-20 mcg/mL', 'Side effects: gingival hyperplasia, hirsutism, coarsening of features, megaloblastic anemia (folate), osteomalacia, teratogenic (fetal hydantoin)', 'IV: monitor BP (hypotension), use filter'],
  'ILAE',
  'Epileptic on phenytoin develops gum overgrowth.',
  'Excellent dental hygiene, dental review, consider alternative agent, check drug level.'
);
P['pharma-49-morphine'] = n(
  'Pure μ-opioid agonist.',
  ['Dose 0.1 mg/kg IV titrated', 'Side effects: respiratory depression, hypotension, miosis, constipation, pruritus, urinary retention, biliary spasm', 'Antidote: naloxone', 'Avoid in severe renal failure (metabolite accumulation)'],
  'Miller',
  'Cancer pain patient on morphine with RR 8.',
  'Titrated naloxone 0.04 mg IV, support ventilation, reassess, reconsider pain regimen.'
);
P['pharma-50-naloxone'] = n(
  'μ-opioid antagonist.',
  ['Dose: 0.04-0.4 mg IV titrated; IM if no IV', 'Onset 1-2 min IV', 'Half-life shorter than most opioids — may need repeat or infusion', 'Precipitates acute withdrawal in chronic users'],
  'AHA',
  'Opioid overdose with RR 6, pinpoint pupils.',
  '0.04-0.4 mg IV naloxone titrated to respiration (not full wakefulness) to avoid severe withdrawal, support ventilation, continuous monitoring.'
);
P['pharma-51-nitroglycerin'] = n(
  'Venous > arterial dilator via NO.',
  ['Sublingual 0.3-0.6 mg x3 q5 min for angina', 'IV for acute pulmonary edema, HTN emergency', 'Side effects: headache, hypotension, reflex tachycardia, tolerance (need nitrate-free interval)', 'Contraindications: hypotension, inferior MI with RV infarction, recent sildenafil'],
  'AHA',
  'Angina patient takes sildenafil yesterday, now chest pain.',
  'Avoid nitroglycerin (severe hypotension with PDE-5 inhibitors); use alternative (morphine, O2, assessment).'
);
P['pharma-52-drug-allergy-first-sign'] = n(
  'Recognition.',
  ['Cutaneous: urticaria, rash (first and commonest)', 'Respiratory: wheeze, stridor', 'Circulatory: hypotension, shock', 'Type I: immediate (IgE)', 'Type IV: delayed (T-cell)'],
  'WAO',
  'Patient develops hives 10 min after IV antibiotic.',
  'Stop antibiotic, antihistamine, observe for anaphylaxis progression, document allergy, report ADR.'
);
P['pharma-53-look-alike-sound-alike-drugs'] = n(
  'LASA pairs to prevent medication errors.',
  ['Celebrex (celecoxib) vs Celexa (citalopram)', 'Prednisone vs prednisolone', 'Hydralazine vs hydroxyzine', 'Insulin U100 vs U500', 'Heparin 10,000 U vs 1000 U vials', 'Tall-man lettering (NIFEdipine vs NIMOdipine)'],
  'ISMP',
  'Ordering HYDRALAZINE.',
  'Verbal readback, TALL-MAN letters, double-check on MAR, avoid confusing HYDROXYZINE.'
);
P['pharma-54-high-alert-medications'] = n(
  'Meds with high risk of patient harm if error.',
  ['Insulin, heparin, opioids, chemo, concentrated electrolytes (KCl), neuromuscular blockers, anticoagulants', 'Independent double-check, standardized concentrations, limit stock, bar-coding'],
  'ISMP',
  'About to hang KCl infusion.',
  'Independent double-check: right patient, drug, dose, route, rate, never IV push concentrated KCl, use central line for high concentrations.'
);
P['pharma-55-safe-syringe-disposal'] = n(
  'Sharps safety.',
  ['Puncture-resistant white translucent container per BMW Rules 2016', 'Do NOT recap (or use one-hand scoop)', 'Fill 3/4 only, seal, label biohazard', 'Hub cutter at PHC sub-centers'],
  'BMW 2016',
  'After administering IM injection.',
  'Do not recap, drop directly into white translucent sharps bin, never fill >3/4.'
);
P['pharma-56-insulin-sliding-scale'] = n(
  'Correction doses for hyperglycemia.',
  ['Example: <150 no insulin; 150-200 2 U; 200-250 4 U; 250-300 6 U; etc.', 'Modern guidelines discourage sliding scale alone — use basal-bolus for inpatients', 'Check BG q4-6 h or before meals'],
  'ADA',
  'Inpatient T2DM with BG 320.',
  'Give correction per institutional basal-bolus protocol, reassess in 2-4 h, adjust basal if persistent hyperglycemia.'
);
P['pharma-57-vaccine-diluent-and-storage'] = n(
  'Reconstitution rules.',
  ['BCG: NS provided with vial; discard after 4 h', 'Measles/MMR: water for injection; 4 h', 'JE: diluent provided; 4 h', 'Hib: diluent provided', 'Store 2-8°C in ILR', 'Never freeze reconstituted vaccines'],
  'MoHFW',
  'BCG reconstituted 2 h ago; session continues.',
  'Use within 4 h of reconstitution; discard if beyond; store in cold box at 2-8°C during session.'
);
P['pharma-58-reconstitution-of-drugs'] = n(
  'Sterile mixing of powder + diluent.',
  ['Aseptic technique', 'Correct diluent per manufacturer', 'Shake/rotate as instructed', 'Label with date, time, initials', 'Check compatibility with IV fluid'],
  'INC',
  'Reconstituting ceftriaxone 1 g IV.',
  'Use sterile water 10 mL for IV, label with date/time/initials, use within hours per insert, verify compatibility with IV solution.'
);
P['pharma-59-drug-drug-interaction-basics'] = n(
  'Types.',
  ['Pharmacokinetic: absorption (antacids), distribution (protein binding), metabolism (CYP induction/inhibition), excretion', 'Pharmacodynamic: synergism, antagonism', 'Common CYP3A4: macrolides, azoles, grapefruit', 'Warfarin many interactions'],
  'Katzung',
  'Patient on warfarin started on clarithromycin.',
  'Clarithromycin CYP3A4 inhibitor — raises warfarin level; monitor INR closely, consider alternative macrolide (azithromycin) if possible.'
);
P['pharma-60-medication-error-reporting'] = n(
  'Non-punitive system to improve safety.',
  ['Incident reporting (IR), near-miss reporting', 'Root cause analysis (RCA)', 'ADR reporting to PvPI via ADR form', 'Anonymized data to ISMP, national PSC'],
  'PvPI India',
  'Nurse gave wrong dose insulin.',
  'Disclose to patient, monitor BG frequently, document, file incident report, RCA to identify systemic improvement; non-punitive culture.'
);

// ============ MENTAL HEALTH (44) ============
P['mental-1-erikson-psychosocial-stages'] = n(
  '8-stage life-span development with psychosocial crises.',
  ['Trust vs mistrust (0-1)', 'Autonomy vs shame/doubt (1-3)', 'Initiative vs guilt (3-6)', 'Industry vs inferiority (6-12)', 'Identity vs role confusion (12-18)', 'Intimacy vs isolation (20s-40s)', 'Generativity vs stagnation (40-65)', 'Integrity vs despair (65+)'],
  'Erikson',
  'Hospitalized 2-y-old clinging to parent, resists strangers.',
  'Age-appropriate autonomy vs shame — encourage autonomy in age-appropriate care, parent presence, predictable routine.'
);
P['mental-2-ego-defense-mechanisms'] = n(
  'Unconscious adaptive responses.',
  ['Mature: sublimation, humor, altruism', 'Neurotic: repression, displacement, reaction formation, intellectualization', 'Immature: denial, projection, regression, acting out, somatization, splitting', 'Psychotic: denial of reality, distortion'],
  'Vaillant',
  'Recently divorced man blames ex for his alcoholism.',
  'Identify projection; psychotherapy — explore feelings, identify healthier coping, refer to counselor.'
);
P['mental-3-psychoanalytic-theory-freud'] = n(
  'Stages of psychosexual development.',
  ['Oral (0-1), Anal (1-3), Phallic (3-6), Latent (6-12), Genital (12+)', 'Fixation at a stage → adult pathology', 'Criticized for limited empirical basis'],
  'Freud',
  'Item on stage associated with toilet training conflicts.',
  'Identify anal stage (1-3 y).'
);
P['mental-4-freud-structural-theory-of-mind'] = n(
  'Id, ego, superego.',
  ['Id: unconscious pleasure principle', 'Ego: reality principle, mediator', 'Superego: morals, ideals, internalized parental values', 'Conflict among these drives behavior'],
  'Freud',
  'Patient repeatedly steals despite guilt.',
  'Id-superego conflict; therapy to address underlying drives.'
);
P['mental-5-delirium'] = n(
  'Acute disturbance of consciousness and cognition.',
  ['Abrupt onset, fluctuating course, inattention, disorganized thinking, altered LOC', 'CAM criteria (Confusion Assessment Method)', 'Causes: infection, drugs, electrolyte, hypoxia, pain, restraint, sleep deprivation', 'Treatment: address cause, reorient, minimize restraints, low-dose haloperidol only if severely agitated'],
  'APA',
  'Post-op elderly with fluctuating confusion, pulling lines.',
  'Screen with CAM, identify cause (infection, meds, pain, dehydration, hypoxia), non-pharmacologic first (reorientation, family, sleep, lighting), low-dose haloperidol only if severe agitation.'
);
P['mental-6-delirium-vs-dementia'] = n(
  'Differentiation.',
  ['Delirium: acute, fluctuating, reversible, LOC altered, attention impaired', 'Dementia: chronic, stable, irreversible, LOC clear until late, memory primary', 'Dementia can be complicated by delirium'],
  'APA',
  'Elderly with 2-day confusion on background of Alzheimer.',
  'Suspect superimposed delirium — full workup for reversible causes, avoid restraints.'
);
P['mental-7-parkinson-disease-psych-features'] = n(
  'Neuropsychiatric comorbidities.',
  ['Depression (40%)', 'Anxiety', 'Psychosis (dopamine-induced)', 'Dementia (Lewy body)', 'Sleep disorders (RBD)', 'Treatment: SSRIs for depression; clozapine/pimavanserin for psychosis (avoid typical antipsychotics)'],
  'MDS',
  'Parkinson patient with visual hallucinations.',
  'Review dopaminergic dose, consider clozapine or pimavanserin; avoid haloperidol (EPS worsens).'
);
P['mental-8-extrapyramidal-symptoms-eps'] = n(
  'Antipsychotic-induced movement disorders.',
  ['Acute dystonia: minutes-hours — IM diphenhydramine or benztropine', 'Akathisia: restlessness — propranolol, benzo', 'Parkinsonism: bradykinesia, rigidity — reduce dose, anticholinergic', 'Tardive dyskinesia: late, irreversible — switch to atypical, VMAT2 inhibitor', 'Neuroleptic malignant syndrome: life-threatening — stop drug, cooling, dantrolene'],
  'APA',
  'Schizophrenia patient on haloperidol with torticollis and oculogyric crisis.',
  'Acute dystonia — IM diphenhydramine 50 mg or benztropine 1-2 mg; reassurance; review antipsychotic choice.'
);
P['mental-9-vascular-dementia'] = n(
  'Second commonest dementia — cerebrovascular disease.',
  ['Stepwise cognitive decline with each stroke', 'Focal neurological signs, executive dysfunction', 'MRI: multiple infarcts, white matter disease', 'Prevent: BP/DM/cholesterol control, antiplatelet'],
  'APA',
  'Stepwise memory decline with multiple strokes on MRI.',
  'Optimize vascular risk factors (BP, DM, statin, aspirin), rehabilitation, treat depression, avoid benzodiazepines.'
);
P['mental-10-bender-gestalt-test'] = n(
  'Visuomotor test of perception/memory.',
  ['Copy 9 designs; score for errors, distortions', 'Useful in organic brain syndrome screen, learning disability', 'Not specific for a single disorder'],
  'APA',
  'Item on projective vs objective.',
  'Bender-Gestalt is a projective/visuomotor test.'
);
P['mental-11-antipsychotic-medications'] = n(
  'Typical vs atypical.',
  ['Typical (haloperidol, chlorpromazine, fluphenazine): high D2 block — EPS risk', 'Atypical (risperidone, olanzapine, quetiapine, clozapine, aripiprazole): broader receptor — metabolic side effects', 'Clozapine: refractory schizophrenia; agranulocytosis (weekly CBC first 6 mo)'],
  'APA',
  'Schizophrenia on olanzapine gains 10 kg.',
  'Metabolic side effect — lifestyle counseling, monitor lipids/FBS, consider switching to aripiprazole if severe.'
);
P['mental-12-tricyclic-antidepressants'] = n(
  'TCAs — serotonin + NE reuptake block + anticholinergic.',
  ['Amitriptyline, nortriptyline, imipramine, clomipramine', 'Side effects: dry mouth, blurred vision, urinary retention, constipation, orthostatic hypotension, widened QRS, sedation', 'Overdose dangerous — seizures, arrhythmia; sodium bicarbonate antidote (QRS wide)'],
  'APA',
  'TCA overdose with wide QRS 140 ms, seizure.',
  'Sodium bicarbonate 1-2 mEq/kg IV bolus, continuous cardiac monitoring, control seizure with benzodiazepine, avoid procainamide.'
);
P['mental-13-chlorpromazine-thorazine'] = n(
  'First phenothiazine antipsychotic.',
  ['Side effects: sedation, orthostatic hypotension, photosensitivity, cholestatic jaundice, EPS', 'Oculogyric crisis treated with anticholinergic', 'Corneal/lens deposits long-term'],
  'APA',
  'Patient on chlorpromazine complains of severe sun burn.',
  'Photosensitivity — sun protection, hat, sunscreen, consider alternative antipsychotic.'
);
P['mental-14-clozapine'] = n(
  'Atypical for refractory schizophrenia; most effective.',
  ['Agranulocytosis risk — weekly CBC x6 mo, then biweekly, then monthly; stop if ANC <1500', 'Seizure, myocarditis, sialorrhea, metabolic syndrome', 'No EPS', 'Registry monitoring mandatory'],
  'APA',
  'Patient on clozapine with sore throat and fever.',
  'Check ANC urgently — discontinue if agranulocytosis (<1500), protective isolation, blood cultures, broad-spectrum antibiotics.'
);
P['mental-15-mao-inhibitors'] = n(
  'Monoamine oxidase inhibitors.',
  ['Examples: phenelzine, tranylcypromine, selegiline, moclobemide', 'Hypertensive crisis with tyramine-rich foods (aged cheese, wine, smoked meats, soy)', 'Serotonin syndrome with SSRIs', 'Wash out 2 wk before switching'],
  'APA',
  'Depression on phenelzine develops severe headache after cheese.',
  'Hypertensive crisis — IV phentolamine or nitroprusside, monitor BP, ICU.'
);
P['mental-16-depression-neurotransmitter-deficits'] = n(
  'Monoamine hypothesis.',
  ['Decreased serotonin, NE, dopamine', 'SSRIs, SNRIs, TCAs, MAOIs target these', 'Atypical: bupropion (DA/NE), mirtazapine (α2)', 'Treatment response 2-4 wk'],
  'APA',
  'Item on depression biochemistry.',
  'Cite decreased 5-HT, NE, DA.'
);
P['mental-17-types-of-delusion'] = n(
  'Fixed false beliefs.',
  ['Persecutory (paranoid)', 'Grandiose', 'Erotomanic (de Clerambault)', 'Somatic', 'Jealous (Othello)', 'Control/reference', 'Nihilistic (Cotard)', 'Religious', 'Thought broadcasting/insertion/withdrawal'],
  'APA DSM',
  'Patient insists body is rotting though healthy.',
  'Cotard (nihilistic) delusion — assess suicide risk, start antipsychotic, ECT consideration.'
);
P['mental-18-depression-vs-normal-grief'] = n(
  'Distinguishing features.',
  ['Grief: waves, preserved self-worth, identification with deceased, resolves 6-12 mo', 'MDD: pervasive, worthlessness, functional impairment, suicidal ideation beyond deceased', 'Complicated grief → professional support'],
  'APA',
  'Widow 6 mo after loss with worthlessness, suicidal thoughts.',
  'Consider complicated grief or MDD — screen with PHQ-9, safety assess, counseling, consider SSRI.'
);
P['mental-19-omega-sign-in-depression'] = n(
  'Omega-shaped furrow between eyebrows seen in severe depression.',
  ['Facial corrugator muscle hyperactivity', 'Supports clinical impression but not specific'],
  'APA',
  'Item on omega sign.',
  'Recognize as corrugator furrow in severe depression.'
);
P['mental-20-clinical-features-of-depression'] = n(
  'DSM-5 MDD: 5/9 symptoms for 2 wk including depressed mood or anhedonia.',
  ['SIGECAPS: Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicide', 'Screen with PHQ-9', 'Treatment: psychotherapy + SSRI first-line, ECT if severe/psychotic'],
  'APA',
  'Patient with 3 wk of low mood, anhedonia, insomnia, weight loss, worthlessness, suicidal ideation.',
  'MDD — safety assess (hospitalize if active suicidality), start SSRI (sertraline), schedule psychotherapy, close follow-up.'
);
P['mental-21-lithium'] = n(
  'See Pharma-47.',
  ['Therapeutic 0.6-1.2', 'Toxicity >1.5', 'Avoid in pregnancy 1st trimester (Ebstein anomaly)'],
  'APA',
  'Bipolar on lithium with tremor and diarrhea.',
  'Check level, stop offending drugs, hydrate.'
);
P['mental-22-bipolar-disorder'] = n(
  'Mood disorder with mania/hypomania episodes.',
  ['Bipolar I: full mania >=1 wk (hospitalize)', 'Bipolar II: hypomania + MDD', 'Cyclothymia: chronic subthreshold', 'Treatment: lithium, valproate (not pregnancy), lamotrigine, atypical antipsychotics; avoid antidepressant monotherapy'],
  'APA',
  'Patient with 1 wk of grandiosity, reduced sleep need, rapid speech.',
  'Mania — hospital admission for safety, start mood stabilizer (lithium or valproate) + atypical antipsychotic, educate about sleep hygiene and relapse signs.'
);
P['mental-23-manic-depressive-disorder'] = n(
  'Historical name for bipolar disorder. See Mental-22.',
  ['Same spectrum'],
  'APA',
  'Same as bipolar.',
  'Treat per bipolar guidelines.'
);
P['mental-24-types-of-hallucinations'] = n(
  'Perceptions without stimulus.',
  ['Auditory: schizophrenia (commonest)', 'Visual: delirium, Parkinson (Lewy body), substances', 'Olfactory: temporal lobe epilepsy', 'Gustatory: rare', 'Tactile: cocaine (formication), alcohol withdrawal', 'Hypnagogic/hypnopompic: narcolepsy'],
  'APA',
  'Alcoholic 36 h withdrawal with feeling of bugs crawling on skin.',
  'Tactile (formication) — benzodiazepine per CIWA, thiamine, reassure, address underlying withdrawal.'
);
P['mental-25-negative-vs-positive-symptoms'] = n(
  'Schizophrenia symptom dichotomy.',
  ['Positive: delusions, hallucinations, disorganized speech, catatonia', 'Negative: flat affect, alogia, avolition, anhedonia, asociality', 'Positive respond better to antipsychotics'],
  'APA',
  'Item on positive symptoms.',
  'Identify as added behaviors (hallucinations, delusions).'
);
P['mental-26-bleuler-4-as'] = n(
  'Bleuler core schizophrenia features.',
  ['Association loosening', 'Affect blunting', 'Ambivalence', 'Autism'],
  'Bleuler',
  'Item on Bleuler.',
  'Recall the 4 As.'
);
P['mental-27-cage-questionnaire'] = n(
  'Alcohol screening tool.',
  ['Cut down, Annoyed, Guilty, Eye-opener', '>=2 yes = likely problem drinking', 'Simple quick screen'],
  'WHO',
  'Patient admits drinking 6 drinks/day.',
  'Administer CAGE; if >=2 positive, full assessment for AUD and intervention.'
);
P['mental-28-cannabis-sativa-effects'] = n(
  'Hemp plant — THC active.',
  ['Acute: euphoria, red eyes, dry mouth, tachycardia, impaired memory', 'Chronic: amotivational syndrome, psychosis risk, pulmonary', 'Withdrawal: irritability, anxiety, insomnia (mild)', 'Treatment: motivational interviewing, CBT'],
  'NIDA',
  'Young adult with new-onset psychosis after heavy marijuana use.',
  'Admit, urine toxicology, rule out organic cause, cessation support, risperidone if psychotic.'
);
P['mental-29-chronic-alcoholism-complications'] = n(
  'Organ damage.',
  ['GI: esophageal varices, pancreatitis, cirrhosis, Mallory-Weiss', 'Neuro: Wernicke, Korsakoff, peripheral neuropathy, cerebellar degeneration', 'Heme: macrocytic anemia (folate), thrombocytopenia', 'Cardio: cardiomyopathy, HTN', 'Fetal: FAS'],
  'APA',
  'Chronic alcoholic with confusion, ataxia, ophthalmoplegia.',
  'Wernicke encephalopathy — IV thiamine 500 mg TDS x3 d before glucose, magnesium, supportive care.'
);
P['mental-30-alcohol-withdrawal-symptoms'] = n(
  'See Pharma-41.',
  ['Timeline and CIWA-Ar as before'],
  'NICE',
  'Same as Pharma-41.',
  'CIWA-triggered benzodiazepine.'
);
P['mental-31-korsakoff-psychosis'] = n(
  'Irreversible chronic amnestic disorder from thiamine deficiency.',
  ['Anterograde + retrograde amnesia, confabulation, disorientation', 'Mamillary body damage', 'Prevention: thiamine in alcoholics before glucose', 'Treatment: thiamine but rarely reverses'],
  'APA',
  'Chronic alcoholic with confabulation and memory gaps.',
  'Thiamine 100 mg IV TDS x3 d, then oral, cognitive rehabilitation, social services, abstinence support.'
);
P['mental-32-delirium-tremens'] = n(
  'Severe alcohol withdrawal 48-96 h.',
  ['Autonomic hyperactivity: HR/BP high, fever, diaphoresis', 'Confusion, visual hallucinations, tremor', 'Mortality up to 5%', 'Treatment: IV benzodiazepines (diazepam/lorazepam), thiamine, fluids, ICU if needed'],
  'APA',
  '72 h post-admission alcoholic with agitation, fever 39, visual hallucinations.',
  'Admit ICU/HDU, IV lorazepam per CIWA titration, thiamine IV, fluids, monitor electrolytes/Mg, sitter/restraints if needed.'
);
P['mental-33-opioid-dependence'] = n(
  'Long-term opioid use disorder.',
  ['Tolerance, withdrawal, loss of control', 'Withdrawal (not life-threatening): yawning, rhinorrhea, lacrimation, piloerection, cramps, diarrhea, mydriasis', 'Treatment: methadone or buprenorphine maintenance, naltrexone, counseling', 'Overdose: naloxone'],
  'WHO',
  'Heroin user wants treatment.',
  'Refer to OST clinic for buprenorphine/methadone, counseling, HIV/HCV screening, harm reduction education.'
);
P['mental-34-codeine'] = n(
  'Weak opioid; metabolized to morphine via CYP2D6.',
  ['Dose 30-60 mg for pain; antitussive at lower dose', 'Ultra-rapid metabolizers risk of respiratory depression', 'Contraindicated in children <12 y post-tonsillectomy'],
  'FDA',
  'Child after tonsillectomy.',
  'Avoid codeine in children post-T&A; use non-opioid or other opioid cautiously.'
);
P['mental-35-conversion-disorder'] = n(
  'Functional neurological symptom disorder (DSM-5).',
  ['Motor/sensory symptoms not explained by organic disease', 'Belle indifference (variable presence)', 'Diagnostic criteria: positive signs of inconsistency', 'Treatment: supportive, avoid reinforcement, physical therapy, CBT'],
  'APA',
  'Woman with sudden unilateral paralysis after argument, normal MRI, variable weakness on exam.',
  'Rule out organic cause, reassure, involve PT/OT, CBT, avoid invasive tests; validate symptoms without reinforcement.'
);
P['mental-36-phobia'] = n(
  'Persistent fear of object/situation out of proportion to real threat.',
  ['Specific (animals, heights, blood-injection)', 'Social anxiety disorder', 'Agoraphobia', 'Treatment: CBT with exposure + response prevention, SSRI for social anxiety'],
  'APA',
  'Patient avoids flying due to intense fear.',
  'CBT with graded exposure, consider short-term benzo for acute flight, SSRI if disabling.'
);
P['mental-37-somatoform-disorder'] = n(
  'Somatic symptom disorder (DSM-5).',
  ['Persistent physical symptoms with excessive thoughts/feelings about health', 'Types: illness anxiety, functional, conversion', 'Frequent healthcare use', 'Treatment: regular scheduled visits with one provider, CBT, antidepressants'],
  'APA',
  'Patient with 10-year history of multiple medical workups, no findings.',
  'Establish therapeutic alliance, regular scheduled visits, validate symptoms, minimize repeated investigations, CBT referral.'
);
P['mental-38-obsessive-compulsive-disorder'] = n(
  'Intrusive thoughts (obsessions) + repetitive behaviors (compulsions).',
  ['>1 h/day or significant impairment', 'Treatment: CBT with exposure and response prevention, SSRI (higher doses than depression — fluoxetine 40-80 mg), clomipramine'],
  'APA',
  'Patient washes hands 3 h daily.',
  'SSRI (fluoxetine 40 mg) + CBT with ERP; support family education; monitor response over 8-12 wk.'
);
P['mental-39-eating-disorders'] = n(
  'Anorexia vs bulimia.',
  ['Anorexia: BMI <17.5, intense fear of weight gain, restriction, amenorrhea', 'Bulimia: binge + purge, normal/over-weight, Russell sign, dental erosion', 'Refeeding syndrome: hypophosphatemia, slow refeeding', 'Treatment: multidisciplinary (psychiatrist, nutrition, medical)'],
  'APA',
  '16-y-old BMI 15 with amenorrhea and fear of weight gain.',
  'Admit if medically unstable; slow refeeding to avoid refeeding syndrome, CBT, family therapy, SSRI for comorbid depression.'
);
P['mental-40-autism-spectrum-disorder'] = n(
  'Neurodevelopmental: social communication deficits + restricted repetitive behaviors by age 3.',
  ['M-CHAT screening at 18-24 mo', 'No cure; early intervention (ABA, speech, OT) improves outcomes', 'Comorbidities: seizures, anxiety, intellectual disability', 'Medications target specific comorbid symptoms'],
  'AAP',
  '3-y-old with delayed speech, no pointing, repetitive behaviors.',
  'Refer for formal diagnostic evaluation (ADOS), start early intervention (speech + ABA), parent training, rule out hearing loss.'
);
P['mental-41-psychotic-disorders'] = n(
  'Schizophrenia spectrum.',
  ['Schizophrenia: >=6 mo with 2+ of 5 features including 1 positive', 'Schizophreniform: 1-6 mo', 'Brief psychotic: <1 mo with stressor', 'Schizoaffective: psychotic + mood', 'Delusional: monosymptomatic >=1 mo'],
  'APA DSM-5',
  'Patient with 3 wk of hallucinations without mood episode.',
  'Schizophreniform (if <6 mo); start atypical antipsychotic, monitor, reassess at 6 mo.'
);
P['mental-42-rem-and-nrem-sleep-stages'] = n(
  'Sleep architecture.',
  ['NREM: 1 (light), 2 (spindles + K complexes), 3 (slow wave / deep)', 'REM: dreaming, muscle atonia, autonomic variability', '~90 min cycles; 4-5/night', 'REM more in later night', 'Deep sleep earlier night'],
  'AASM',
  'Item on dreaming stage.',
  'REM sleep is the dreaming stage with muscle atonia.'
);
P['mental-43-electroconvulsive-therapy-ect'] = n(
  'Electrical induction of generalized seizure under anesthesia.',
  ['Indications: severe MDD, catatonia, treatment-resistant, psychotic depression, suicidality', 'Contraindication: recent MI, raised ICP, severe cardiac disease (relative)', 'Side effects: transient memory impairment, headache, muscle aches', 'Consent essential; bilateral more effective, unilateral less cognitive impact'],
  'APA',
  'Severe depression with food refusal, resistant to medications.',
  'ECT indicated — consult psychiatry, informed consent, pre-anesthesia clearance, baseline MMSE, post-ECT monitoring.'
);
P['mental-44-cognitive-behavioral-therapy'] = n(
  'Structured time-limited psychotherapy focused on thoughts, feelings, behaviors.',
  ['Core: identify cognitive distortions, behavioral activation, exposure', 'Evidence-based for depression, anxiety, OCD, PTSD, insomnia', 'Typically 8-16 sessions', 'Group, individual, digital (iCBT) formats'],
  'APA',
  'Mild-moderate MDD patient prefers non-pharmacologic treatment.',
  'Refer for CBT 12-16 sessions, monitor PHQ-9 q2-4 wk, add SSRI if inadequate response.'
);
