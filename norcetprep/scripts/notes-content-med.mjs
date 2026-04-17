// Medicine (111 topics). Compact notes for all.
import { n } from './notes-helper.mjs';

export const NOTE_CONTENT_MED = {};
const M = NOTE_CONTENT_MED;

M['medicine-1-fluid-and-electrolyte-imbalance-with-ecg-changes'] = n(
  'Key electrolyte disturbances and ECG features.',
  ['Hyperkalemia: peaked T, wide QRS, sine-wave at >7-9', 'Hypokalemia: flat T, U wave, ST depression', 'Hypocalcemia: prolonged QT, Trousseau/Chvostek', 'Hypercalcemia: short QT', 'Hypernatremia: thirst, confusion', 'Hyponatremia: seizures if rapid drop'],
  'Harrison 21e',
  'CKD patient with K+ 6.8, peaked T waves.',
  'IV calcium gluconate 10 mL 10% over 5 min (stabilize myocardium), insulin+dextrose, nebulized salbutamol, plan dialysis.',
  'Calcium gluconate first for cardiac-effect K+.'
);
M['medicine-2-vagal-maneuver'] = n(
  'Non-pharmacological termination of SVT.',
  ['Valsalva (modified more effective), carotid sinus massage (unilateral, avoid bilateral), cold-water facial immersion', 'Slows AV node conduction', 'Contraindication carotid massage: bruit, recent stroke, MI'],
  'ACLS 2020',
  'Hemodynamically stable SVT 180/min.',
  'Attempt modified Valsalva first; if fails, adenosine 6 mg IV rapid push followed by saline flush.'
);
M['medicine-3-basic-ecg-interpretation'] = n(
  'Systematic 12-lead ECG reading.',
  ['Paper: 1 mm = 0.04 s, 1 mm = 0.1 mV', 'Rate: 300/big boxes between R-R (regular); (6-s strip x 10) irregular', 'PR 120-200 ms; QRS <120 ms; QT <440 ms (corrected)', 'Axis: lead I + aVF both positive = normal', 'Right/left BBB pattern', 'STEMI: ST elevation >=1 mm in 2 contiguous limb leads or >=2 mm precordial'],
  'Dubin',
  'ECG shows ST elevation V1-V4 with reciprocal depression in II III aVF.',
  'Anterior STEMI — activate cath lab, MONA-B, start aspirin 325 mg + ticagrelor 180 mg + heparin, target FMC-to-balloon <90 min.'
);
M['medicine-4-heart-sounds-rhonchi-wheezes-pleural-rub-crackles'] = n(
  'Auscultation terminology.',
  ['Crackles (rales): discontinuous; fine (interstitial fibrosis, early CHF), coarse (pneumonia, bronchiectasis)', 'Rhonchi: low-pitched rumble from secretions in large airways', 'Wheeze: high-pitched, continuous, expiratory; asthma/COPD', 'Pleural rub: leathery, not cleared by cough', 'Stridor: high-pitched inspiratory — upper airway obstruction'],
  'Bates 13e',
  'COPD patient with polyphonic expiratory wheeze.',
  'Salbutamol nebulization, O2 titrated 88-92%, reassess breath sounds.'
);
M['medicine-5-pulse-pressure'] = n(
  'SBP - DBP; normally 30-40 mmHg.',
  ['Widened (>50): aortic regurgitation, hyperthyroidism, anemia, thiamine deficiency, AV fistula', 'Narrow (<25): cardiac tamponade, constrictive pericarditis, severe aortic stenosis, hypovolemia'],
  'Harrison 21e',
  'BP 160/60 with collapsing pulse.',
  'Wide pulse pressure suggests aortic regurgitation — auscultate for diastolic murmur, echo, refer to cardiology.'
);
M['medicine-6-myocardial-infarction-and-enzyme-markers'] = n(
  'Acute coronary syndrome — Type 1 due to plaque rupture.',
  ['Troponin I/T: rises 3-6 h, peaks 18-24 h, remains 7-14 d — most sensitive and specific', 'CK-MB: rises 4-6 h, peaks 24 h, returns 48-72 h — reinfarction detection', 'Myoglobin: earliest (1-2 h) but non-specific', 'AST, LDH: historic', 'STEMI: PCI within 90 min or fibrinolysis within 30 min'],
  'ACC/AHA 2023',
  'Crushing chest pain 2 h, ECG ST elevation II III aVF, troponin positive.',
  'Inferior STEMI — aspirin 325 mg chew, clopidogrel/ticagrelor loading, heparin, morphine for pain, activate cath lab.',
  'No nitrates in inferior MI with RV involvement.'
);
M['medicine-7-rheumatic-fever'] = n(
  'Post-streptococcal (GAS) autoimmune disease.',
  ['Jones criteria: 2 major OR 1 major + 2 minor + evidence of recent strep', 'Major: migratory polyarthritis, carditis, chorea (Sydenham), erythema marginatum, subcutaneous nodules', 'Minor: fever, arthralgia, elevated ESR/CRP, prolonged PR', 'Treatment: benzathine penicillin G IM + NSAIDs; steroids for severe carditis', 'Secondary prophylaxis: BPG IM q3 wk up to 21 y or 10 y after attack'],
  'AHA 2015 update',
  '10-y-old with migratory arthritis, carditis, recent pharyngitis.',
  'Throat culture/ASO, ECG (PR prolongation), admit for benzathine penicillin IM + aspirin, start secondary prophylaxis q3 wk.'
);
M['medicine-8-varicose-vein'] = n(
  'Dilated tortuous superficial veins.',
  ['Great saphenous most commonly', 'Risk: prolonged standing, pregnancy, family history', 'Complications: superficial thrombophlebitis, venous ulcer over medial malleolus, lipodermatosclerosis', 'CEAP classification', 'Treatment: graduated compression stockings, endovenous laser/radiofrequency, sclerotherapy, stripping'],
  'SVS 2020',
  'Teacher with leg heaviness and visible bulging veins.',
  'Graduated compression stockings 20-30 mmHg, elevate legs, weight management, refer for duplex USG and consider endovenous ablation.'
);
M['medicine-9-ventricular-fibrillation-defibrillation'] = n(
  'Shockable rhythm: disorganized ventricular activity — no cardiac output.',
  ['Defibrillation immediately: biphasic 120-200 J, monophasic 360 J', 'Resume CPR for 2 min immediately post-shock', 'Epi 1 mg IV q3-5 min after 2nd shock', 'Amiodarone 300 mg IV bolus after 3rd shock; 150 mg repeat', 'Refractory VF → consider dual sequential defibrillation'],
  'AHA 2020',
  'Witnessed collapse, monitor shows VF.',
  'Deliver shock 200 J biphasic immediately, resume CPR 2 min, reassess, epi 1 mg after 2nd shock.'
);
M['medicine-10-coronary-artery-bypass-grafting-cabg'] = n(
  'Surgical revascularization using grafts.',
  ['LIMA to LAD — best patency (>90% at 10 y)', 'Saphenous vein graft (SVG) for others', 'Radial artery alternative', 'Post-op: sternal precautions 6-8 wk, no lifting >5 kg, cough with pillow', 'DAPT per indication'],
  'STS 2023',
  'POD 2 CABG patient ready for ambulation.',
  'Sternal precautions, incentive spirometry, cough with pillow, gradual ambulation, monitor for sternal instability (clicking, pain).'
);
M['medicine-11-angina-types-variant-prinzmetal'] = n(
  'Spectrum of angina.',
  ['Stable: reproducible with exertion, relieved by rest/nitrates', 'Unstable: new-onset, worsening pattern, rest pain', 'Prinzmetal (variant): vasospasm — pain at rest, often nocturnal, transient ST elevation', 'Treatment: CCB + nitrates for Prinzmetal; avoid non-selective beta-blockers (worsen spasm)'],
  'AHA 2023',
  'Young man with nocturnal chest pain and transient ST elevation.',
  'Prinzmetal — diltiazem or amlodipine, isosorbide dinitrate, avoid non-selective beta-blockers, cocaine screen.'
);
M['medicine-12-bacterial-endocarditis'] = n(
  'Infection of cardiac valves/endothelium.',
  ['Modified Duke criteria: 2 major OR 1 major + 3 minor OR 5 minor', 'Major: positive blood cultures (typical organism x2), evidence on echo (vegetation/abscess)', 'Organisms: Strep viridans (native), S aureus (IV drug users, prosthetic), enterococci', 'Treatment: IV antibiotics 4-6 wk guided by culture; surgery if heart failure/abscess/persistent bacteremia'],
  'AHA 2015',
  'IVDU with fever, new murmur, Osler nodes.',
  'Draw 3 sets of blood cultures before antibiotics, echocardiogram (TEE), start vancomycin + gentamicin, cardiology/ID consult.'
);
M['medicine-13-constrictive-pericarditis'] = n(
  'Fibrotic/calcified pericardium restricts filling.',
  ['Causes: TB (common in India), post-cardiac surgery, radiation', 'Kussmaul sign: JVP rises with inspiration', 'Pericardial knock on auscultation', 'CT/MRI shows thickened pericardium', 'Treatment: pericardiectomy'],
  'Harrison 21e',
  'Post-TB patient with elevated JVP rising on inspiration and ascites.',
  'Refer for echo/CT, diuretics for symptoms, plan pericardiectomy.'
);
M['medicine-14-intra-aortic-balloon-pump-iabp'] = n(
  'Mechanical circulatory support via descending aorta.',
  ['Inflates in diastole (coronary perfusion), deflates in systole (afterload reduction)', 'Indications: cardiogenic shock, unstable angina, bridge to surgery', 'Complications: limb ischemia, thrombocytopenia, infection, dissection', 'Contraindication: AR, aortic dissection'],
  'ACC/AHA',
  'Cardiogenic shock patient on IABP.',
  'Monitor distal limb pulses (ischemia), MAP, urine output, platelet count; keep knee straight; check balloon timing.'
);
M['medicine-15-cardiac-tamponade'] = n(
  'Pericardial effusion compressing heart — emergency.',
  ['Beck triad: hypotension + muffled heart sounds + distended neck veins', 'Pulsus paradoxus >10 mmHg', 'Echo: diastolic RV collapse, IVC plethora', 'Treatment: emergency pericardiocentesis (subxiphoid)', 'Avoid IPPV if possible (worsens)'],
  'AHA',
  'Post-MI patient with sudden hypotension, distended neck veins, muffled sounds.',
  'Urgent echo, prepare pericardiocentesis tray, IV fluids to maintain preload, call cardiology.'
);
M['medicine-16-pacemaker-types-and-settings'] = n(
  'Electrical stimulation of heart for bradyarrhythmias.',
  ['NBG code 5-letter: chamber paced/sensed/response/rate modulation/multisite', 'Common modes: VVI, DDD, AAI', 'Indications: symptomatic bradycardia, complete AV block, sick sinus', 'Complications: infection, lead dislodgement, pneumothorax', 'Patient education: avoid strong magnets, MRI-conditional devices'],
  'HRS 2018',
  'Recent pacemaker implant patient.',
  'Avoid heavy arm movement for 4-6 wk on implant side, monitor pocket for hematoma/infection, no MRI unless MRI-conditional, carry device card.'
);
M['medicine-17-cardioversion-vs-defibrillation'] = n(
  'Synchronized vs unsynchronized shock.',
  ['Cardioversion: synchronized with R wave; for stable tachyarrhythmias with pulse (AF, SVT, VT with pulse); starting energy 50-200 J biphasic', 'Defibrillation: unsynchronized; pulseless VT, VF; 120-200 J biphasic', 'Sedation needed for cardioversion', 'Anticoagulate if AF >48 h prior to elective cardioversion'],
  'AHA',
  'AF with rapid ventricular response, unstable, BP 80/50.',
  'Synchronized cardioversion 120-150 J biphasic after brief sedation.'
);
M['medicine-18-defibrillator-aed'] = n(
  'Automated external defibrillator.',
  ['Deliver shock in VF/pulseless VT only', 'Pads: right upper sternum + left axilla; alternate anteroposterior for kids/small', 'Pediatric pads <8 y or <25 kg', 'Continue compressions while AED analyzes? No — step clear during analysis', 'Shave hair if needed, avoid water/metal'],
  'AHA',
  'Public cardiac arrest, bystander with AED.',
  'Turn AED on, attach pads right upper chest + left mid-axilla, let it analyze, deliver shock if advised, resume CPR immediately.'
);
M['medicine-19-cardiac-monitor'] = n(
  'Continuous ECG rhythm surveillance.',
  ['Lead placement 3-lead: white right, black left, red chest (lower left)', '5-lead: add green RL, brown chest', 'Lead II best for P wave', 'Alarm parameters: HR high/low, asystole, VF, SpO2', 'Troubleshoot: check electrodes, skin prep, lead contact'],
  'AACN',
  'Cardiac monitor shows flat line.',
  'Check patient first (asystole vs lead off), verify pulse, if asystole start CPR and check lead placement.'
);
M['medicine-20-pcwp-pulmonary-capillary-wedge-pressure'] = n(
  'Reflects left atrial and LV end-diastolic pressure.',
  ['Normal 6-12 mmHg', 'Elevated: LV failure, mitral stenosis, volume overload', 'Low: hypovolemia', 'Measured via Swan-Ganz catheter'],
  'Brunner',
  'Pulmonary edema patient with PCWP 28.',
  'Diuretics (furosemide), vasodilator (nitroglycerin), supplemental O2, reassess PCWP.'
);
M['medicine-21-pulmonary-artery-catheter'] = n(
  'Swan-Ganz catheter — see Foundation entry.',
  ['Normal: RAP 0-8, RV 25/0-8, PA 25/10, PCWP 6-12', 'Measure CO by thermodilution', 'Elevated PVR: pulmonary HTN', 'Less common now'],
  'Brunner',
  'ICU shock patient needs PA catheter.',
  'Level transducer at phlebostatic axis, zero, interpret pressure tracings, watch for arrhythmia during float.'
);
M['medicine-22-thyroid-eye-disease'] = n(
  'Graves ophthalmopathy.',
  ['Proptosis, lid lag, lid retraction (Dalrymple), ophthalmoplegia', 'Smoking is major risk factor', 'Treatment: smoking cessation, selenium, IV methylprednisolone for moderate-severe, orbital decompression, teprotumumab'],
  'Harrison 21e',
  'Graves patient with progressive proptosis.',
  'Stop smoking, ophthalmology referral, lubricating eye drops, elevate head while sleeping, escalate to steroids if inflammation.'
);
M['medicine-23-dka-kussmaul-breathing'] = n(
  'Diabetic ketoacidosis — Type 1 DM commonly.',
  ['Triad: hyperglycemia >250, ketosis (β-hydroxybutyrate), metabolic acidosis pH <7.3 HCO3 <18', 'Kussmaul breathing: deep, rapid compensatory', 'Fluid deficit ~6 L adult', 'Treatment: IV NS 1-1.5 L first hour, then 0.45% NaCl 250-500 mL/h; insulin infusion 0.1 U/kg/h; K+ replacement when <5.3; glucose when BG <250'],
  'ADA 2023',
  'T1DM with BG 520, pH 7.1, K+ 3.2, dyspnea.',
  'IV NS 1 L bolus, delay insulin until K+ replaced (first replace KCl), then insulin infusion 0.1 U/kg/h, monitor hourly glucose and K+.',
  'Start insulin only after K+ >=3.3.'
);
M['medicine-24-diabetes-insipidus'] = n(
  'ADH deficiency (central) or resistance (nephrogenic).',
  ['Large-volume dilute urine (>3 L/day, SG <1.005, osmolality <300)', 'Water deprivation test differentiates', 'Central: desmopressin responds', 'Nephrogenic: thiazides paradoxically reduce output', 'Causes central: head injury, pituitary surgery'],
  'Harrison',
  'Post-pituitary surgery patient with polyuria 8 L/day.',
  'Strict I/O, electrolytes (Na+), start desmopressin (dDAVP) intranasal or IV, monitor for hyponatremia as response occurs.'
);
M['medicine-25-diabetes-mellitus-management'] = n(
  'Chronic hyperglycemia.',
  ['Diagnosis: FPG >=126, OGTT 2-h >=200, HbA1c >=6.5, random >=200 with symptoms', 'HbA1c target <7% (individualize)', 'Metformin first-line (eGFR >30)', 'SGLT2i + GLP1-RA for CVD/CKD', 'Complications: retinopathy, nephropathy, neuropathy, atherosclerosis'],
  'ADA 2024',
  'New T2DM HbA1c 8.5%, CKD, HFrEF.',
  'Start metformin 500 mg BD + empagliflozin 10 mg (SGLT2i for CV and renal benefit), lifestyle, statin, BP control, diabetic education.'
);
M['medicine-26-simmonds-disease-panhypopituitarism'] = n(
  'Post-partum pituitary necrosis (Sheehan) or other cause of anterior pituitary failure.',
  ['Loss of FSH/LH, TSH, ACTH, GH, prolactin', 'Lactation failure post-PPH is classic', 'Hypothyroid, adrenal insufficiency, hypogonadism', 'Treatment: hormone replacement lifelong'],
  'Harrison',
  'Post-severe PPH mother cannot lactate, amenorrhea, fatigue.',
  'Measure cortisol, TSH, fT4, prolactin, FSH/LH, start hydrocortisone before levothyroxine, endocrine referral.'
);
M['medicine-27-hypoparathyroidism-vs-hyperparathyroidism'] = n(
  'Parathyroid hormone disorders.',
  ['Hypo: low Ca, high P; tetany, Chvostek, Trousseau, QT prolonged; Rx: Ca + calcitriol', 'Hyper: high Ca, low P; bones/stones/abdominal groans/psychic moans; Rx: parathyroidectomy if symptomatic'],
  'Harrison',
  'Post-thyroidectomy patient with perioral numbness, carpal spasm.',
  'Suspect hypocalcemia — check serum ionized calcium, IV calcium gluconate, start oral calcium + calcitriol, monitor long-term.'
);
M['medicine-28-graves-disease'] = n(
  'Autoimmune hyperthyroidism (TSH-R antibodies).',
  ['Diffuse goiter, ophthalmopathy, pretibial myxedema, thyroid acropachy', 'High fT4/T3, suppressed TSH, high TRAb', 'Treatment: methimazole/PTU (PTU in 1st trimester), radioiodine (avoid in pregnancy/breastfeeding), surgery', 'Thyroid storm: beta-blocker + PTU + iodine + hydrocortisone'],
  'ATA 2016',
  'Pregnant 1st trimester with Graves.',
  'Use PTU 1st trimester (less teratogenic than methimazole), switch to methimazole in 2nd; monitor fT4 to keep in upper normal.'
);
M['medicine-29-iron-deficiency-anemia'] = n(
  'Most common anemia — microcytic hypochromic.',
  ['Low MCV, low MCH, low ferritin, low iron, high TIBC', 'Causes: blood loss (GI, menstrual), poor intake, malabsorption (celiac), pregnancy', 'Oral iron: ferrous sulfate 200 mg TDS (65 mg elemental), take on empty stomach, with vit C', 'IV iron: sucrose, isomaltoside for severe/intolerance'],
  'NICE, AMB',
  'Menstruating woman Hb 8, MCV 68, ferritin 5.',
  'Start oral ferrous sulfate 200 mg TDS with vit C, investigate cause (menstrual + GI evaluation >40 y), reassess Hb in 4 wk.'
);
M['medicine-30-thalassemia'] = n(
  'Hereditary defect in α or β globin chain synthesis.',
  ['Beta-thal major: severe microcytic anemia, hepatosplenomegaly, skeletal changes, iron overload from transfusion', 'HbF and HbA2 elevated', 'Management: regular transfusion + iron chelation (deferasirox, deferoxamine, deferiprone)', 'Curative: HSCT', 'Prevention: carrier screening, prenatal diagnosis'],
  'TIF 2021',
  'Beta-thal major child on monthly transfusions with ferritin 3000.',
  'Start iron chelation with deferasirox 20-30 mg/kg OD, monitor LFT, creatinine, ferritin q3 mo, eye/ear screening.'
);
M['medicine-31-leukemia-aml-all-cml-cll'] = n(
  'Hematologic malignancies of WBC line.',
  ['ALL: children; bone marrow blast >20% lymphoblast; good prognosis', 'AML: adults; Auer rods; M3 (APL) with t(15;17), PML-RARA, DIC risk', 'CML: Philadelphia chromosome t(9;22), BCR-ABL; imatinib', 'CLL: elderly; smudge cells; monoclonal B-cells; often watchful waiting'],
  'NCCN 2023',
  'Child with fatigue, lymphadenopathy, blasts 80%.',
  'Suspect ALL — refer to pediatric hem-onc, bone marrow biopsy, induction chemotherapy per BFM protocol, supportive care.'
);
M['medicine-32-sickle-cell-disease'] = n(
  'HbS mutation — autosomal recessive.',
  ['Vaso-occlusive crisis: pain (bone, chest, abdomen), avascular necrosis of femoral head', 'Acute chest syndrome: hypoxia, infiltrate — mortality', 'Complications: stroke, priapism, splenic sequestration', 'Hydroxyurea reduces crises', 'Preventive: Hib/pneumococcal vaccines, folate'],
  'ASH 2014',
  'Sickle cell patient with severe pain and chest infiltrate on X-ray.',
  'Acute chest syndrome — IV hydration (1.0-1.5x maintenance, not more), O2, analgesia, antibiotics (cefuroxime + macrolide), exchange transfusion if severe.'
);
M['medicine-33-lymphoma-nhl-vs-hl'] = n(
  'Lymph-node malignancies.',
  ['HL: Reed-Sternberg cells; contiguous spread; bimodal 20s and 60s; good prognosis', 'NHL: heterogeneous; diffuse; more common; extranodal frequent', 'B symptoms: fever, night sweats, weight loss >10%', 'Staging: Ann Arbor I-IV'],
  'NCCN',
  'Young adult with painless cervical lymphadenopathy, night sweats.',
  'Excision biopsy (not FNAC), staging CT/PET, bone marrow; refer to oncology.'
);
M['medicine-34-hodgkin-lymphoma-reed-sternberg'] = n(
  'HL subtypes and RS cells.',
  ['RS: "owl-eye" binucleate cell with eosinophilic nucleolus', 'Subtypes: nodular sclerosis (commonest), mixed cellularity, lymphocyte-rich, lymphocyte-depleted, nodular lymphocyte-predominant', 'Treatment: ABVD chemotherapy (adriamycin, bleomycin, vinblastine, dacarbazine) ± radiation'],
  'NCCN',
  'Biopsy showing Reed-Sternberg cells.',
  'Confirm HL, stage with PET-CT, plan ABVD chemotherapy, fertility preservation counsel.'
);
M['medicine-35-lordosis-scoliosis-kyphosis'] = n(
  'Spinal curvature disorders.',
  ['Lordosis: inward lumbar curve', 'Kyphosis: outward thoracic (hunchback)', 'Scoliosis: lateral curvature + rotation; Cobb angle >10° defines', 'Adam forward-bend test: rib hump', 'Brace >25-40°; surgery >45-50°'],
  'AAOS',
  'Adolescent scoliosis Cobb 30°.',
  'Bracing (Boston/Milwaukee) 23 h/day until skeletal maturity, monitor q6 mo, surgery if progression >45°.'
);
M['medicine-36-paget-disease'] = n(
  'Disordered bone remodeling — increased osteoclast activity.',
  ['Elderly, skull/pelvis/spine', 'Elevated alkaline phosphatase', 'Bone pain, deformity, fractures, high-output heart failure, hearing loss (CN VIII compression)', 'Treatment: bisphosphonates (zoledronate IV)'],
  'Harrison',
  'Elderly man with skull thickening, high ALP, hearing loss.',
  'Confirm with bone scan; start zoledronate 5 mg IV, ensure adequate Ca/vit D, audiology follow-up.'
);
M['medicine-37-colles-fracture'] = n(
  'Distal radius fracture with dorsal displacement — fall on outstretched hand.',
  ['Dinner-fork deformity', 'Elderly osteoporotic women', 'X-ray confirms', 'Treatment: closed reduction + cast if acceptable alignment; ORIF if comminuted or severe'],
  'Brunner 14e',
  'Elderly woman with fall on outstretched hand, dinner-fork deformity.',
  'Analgesia, splint, X-ray, closed reduction under hematoma block or conscious sedation, cast, DEXA for osteoporosis.'
);
M['medicine-38-sprain-vs-strain'] = n(
  'Soft tissue injury distinction.',
  ['Sprain: ligament (joint) — e.g., ankle inversion', 'Strain: muscle or tendon — e.g., hamstring', 'Grading: 1 (mild), 2 (partial), 3 (complete tear)', 'RICE: rest, ice, compression, elevation'],
  'AAOS',
  'Ankle inversion injury with lateral swelling.',
  'RICE, NSAIDs, weight-bearing as tolerated, functional bracing, refer if grade 3 or persistent instability.'
);
M['medicine-39-amputation'] = n(
  'Surgical removal of a limb.',
  ['Indications: peripheral vascular disease (commonest), diabetes, trauma, tumor, severe infection', 'Levels: AKA, BKA, Syme, transmetatarsal', 'Phantom limb pain: gabapentin, mirror therapy', 'Stump care: bandaging in cone shape, prevent contractures'],
  'Brunner',
  'Post-BKA day 2 patient.',
  'Prone positioning 2-3x/day to prevent hip flexion contracture, elevate stump first 24 h then avoid, bandage in figure-8 toward proximal, phantom pain education.'
);
M['medicine-40-trochanter-rolls'] = n(
  'Rolled blanket/foam placed lateral to hip to prevent external rotation in bedridden patient.',
  ['Prevents foot drop + external rotation', 'Reinforce in stroke, bedridden, post-op hip replacement', 'Reposition q2h'],
  'Brunner',
  'Bedridden stroke patient lying in bed.',
  'Place trochanter rolls lateral to hip from greater trochanter to mid-thigh to keep hip neutral, foot board to prevent drop foot, turn q2h.'
);
M['medicine-41-arthroplasty-arthrodesis-arthrotomy'] = n(
  'Joint surgery terminology.',
  ['Arthroplasty: joint replacement (THR, TKR)', 'Arthrodesis: surgical fusion (ankle, wrist, spine)', 'Arthrotomy: surgical opening of joint', 'Arthroscopy: minimally invasive camera exam'],
  'AAOS',
  'Patient scheduled for THR.',
  'Explain arthroplasty; precautions: avoid hip flexion >90°, adduction past midline, internal rotation for 6-12 wk.'
);
M['medicine-42-gout'] = n(
  'Monosodium urate crystal arthropathy.',
  ['Podagra: 1st MTP painful red swollen', 'Elevated uric acid (not always acute)', 'Polarized light microscopy: negative birefringent needle crystals', 'Acute: NSAID, colchicine, steroid', 'Chronic: allopurinol/febuxostat (uric acid <6 mg/dL)'],
  'ACR 2020',
  'Obese man with severe big toe pain, red swollen MTP joint, 3 AM onset.',
  'Acute gout — NSAID (naproxen) or colchicine, rest, ice, do NOT start allopurinol during acute attack; start urate-lowering after resolution.'
);
M['medicine-43-arterial-blood-gas-abg-interpretation'] = n(
  'ABG step-by-step.',
  ['pH 7.35-7.45; PaCO2 35-45; HCO3 22-26; PaO2 80-100; SpO2 >95', 'Acidosis (<7.35): respiratory (high CO2) or metabolic (low HCO3)', 'Alkalosis (>7.45): respiratory (low CO2) or metabolic (high HCO3)', 'Compensation: partial, full, mixed', 'Anion gap = Na - (Cl + HCO3); 8-12 normal; >12 elevated suggests MUDPILES'],
  'Brunner',
  'pH 7.20, PaCO2 30, HCO3 12, Na 138, Cl 100.',
  'Metabolic acidosis (pH low, HCO3 low); anion gap 26 (high) — DKA/lactic/toxin; treat underlying, fluids; avoid bicarbonate unless pH <7.1.'
);
M['medicine-44-nephrotic-syndrome'] = n(
  'Glomerular proteinuria >3.5 g/day + hypoalbuminemia + edema + hyperlipidemia.',
  ['Children: minimal change — steroid responsive', 'Adults: FSGS, membranous, diabetic', 'Complications: thrombosis (renal vein), infection (low IgG), hyperlipidemia', 'Treatment: steroids, ACE-i, diuretics, statins, anticoagulation if severe'],
  'KDIGO 2021',
  '5-y-old with periorbital edema, urine albumin 4+, low albumin.',
  'Minimal change disease likely — start prednisolone 60 mg/m2/day, salt restriction, monitor for infection, no routine renal biopsy in typical cases.'
);
M['medicine-45-chronic-renal-failure'] = n(
  'CKD: GFR <60 for >=3 mo or kidney damage markers.',
  ['Stages G1-G5 by eGFR; A1-A3 by albuminuria', 'Complications: anemia (EPO), hyperkalemia, metabolic acidosis, bone-mineral disease, uremia', 'Dialysis when eGFR <10-15 with symptoms', 'Transplant gold standard'],
  'KDIGO 2024',
  'CKD-5 patient with pulmonary edema, K+ 6.5.',
  'Emergency dialysis, calcium gluconate for cardiac protection, insulin+dextrose for K+, furosemide if any residual function, O2.'
);
M['medicine-46-hemodialysis-av-fistula-care'] = n(
  'Vascular access for hemodialysis.',
  ['Types: AVF (best, 6-8 wk maturation), graft, CVC (temporary)', 'Fistula care: assess thrill/bruit q shift, no BP/IV/blood draws on that arm, avoid heavy lifting, check for infection', 'Steal syndrome: cool pale distal hand'],
  'KDOQI',
  'New AVF in left forearm.',
  'Teach: feel thrill daily, no BP/IV on left arm, avoid heavy watches/tight sleeves, report pain/coolness of hand.'
);
M['medicine-47-nephrectomy'] = n(
  'Removal of kidney.',
  ['Indications: RCC, chronic infection, non-functional, trauma, donor', 'Post-op: monitor UO, other kidney function, pain, respiratory (flank incision)', 'DVT prophylaxis, early ambulation'],
  'Campbell-Walsh',
  'POD 1 right nephrectomy.',
  'Monitor UO, flank incision splinted for coughing, pain control, early ambulation, assess for bleeding.'
);
M['medicine-48-acute-kidney-injury'] = n(
  'Abrupt decrease in kidney function.',
  ['KDIGO: SCr rise >=0.3 in 48 h OR >=1.5x in 7 d OR UO <0.5 mL/kg/h for >6 h', 'Pre-renal: hypovolemia, sepsis', 'Intrinsic: ATN (ischemia, toxins, myoglobin), AIN', 'Post-renal: obstruction', 'Management: correct cause, avoid nephrotoxins, dialysis if AEIOU'],
  'KDIGO AKI',
  'Post-op patient with UO 15 mL/h, SCr rising.',
  'Fluid challenge 500 mL, bladder scan for obstruction, review nephrotoxic drugs, send urinalysis, consider nephrology if no response.',
  'AEIOU: Acidosis, Electrolytes (K), Ingestion, Overload, Uremia.'
);
M['medicine-49-hydronephrosis'] = n(
  'Dilation of renal pelvis/calyces due to outflow obstruction.',
  ['Causes: stones, BPH, tumor, stricture, pregnancy', 'USG diagnostic', 'Treatment: relieve obstruction (catheter, stent, PCN)'],
  'Campbell-Walsh',
  'Pregnant woman with right flank pain, USG right hydronephrosis.',
  'Physiologic in pregnancy common; if severe, urology — consider stent; monitor for infection.'
);
M['medicine-50-pyelonephritis'] = n(
  'Upper UTI — renal parenchyma + collecting system.',
  ['Fever, chills, flank pain, CVA tenderness, dysuria', 'UA: WBC casts', 'E coli commonest', 'Treatment: IV ceftriaxone or pip-tazo based on severity; stepdown to oral per culture', 'Repeat cultures; imaging if no response in 48-72 h'],
  'IDSA',
  'Woman with fever, right flank pain, CVA tenderness, WBC casts in urine.',
  'Admit, IV ceftriaxone after cultures, IV fluids, analgesia, monitor UO, step down to oral ciprofloxacin per susceptibility.'
);
M['medicine-51-colostomy-care'] = n(
  'See Foundation-16.',
  ['Stoma pink/red moist healthy', 'Output depends on level', 'Appliance changes q3-7 d or when leak', 'Skin barrier', 'Diet: low-residue initially, avoid gas-producing foods'],
  'WOCN',
  'POD 5 left-sided colostomy.',
  'Empty pouch when 1/3 full, measure output, skin barrier, psychological support, diet counsel.'
);
M['medicine-52-acute-pancreatitis'] = n(
  'Acute inflammation of pancreas.',
  ['Diagnosis: 2/3 — typical epigastric pain, lipase >3x ULN, imaging', 'Etiology: gallstones (45%), alcohol (35%), hypertriglyceridemia, ERCP', 'Severity: Atlanta (mild, moderately severe, severe)', 'Management: aggressive fluids (LR), pain, NPO → early enteral nutrition if tolerated; not routine antibiotics'],
  'ACG 2022',
  'Alcoholic with severe epigastric pain radiating to back, lipase 2500.',
  'IV lactated Ringer 5-10 mL/kg/h, analgesia, NPO initially with plan for early EN, monitor for organ failure, no prophylactic antibiotics unless infected necrosis.'
);
M['medicine-53-biliary-colic'] = n(
  'RUQ pain from transient gallstone impaction at cystic duct.',
  ['Colicky post-fatty meal, may radiate to right shoulder', 'No fever/leukocytosis (vs cholecystitis)', 'USG shows stones', 'Treatment: elective lap chole'],
  'ACG',
  'Woman with post-prandial RUQ pain, USG shows stones, afebrile.',
  'Analgesia, low-fat diet, schedule elective laparoscopic cholecystectomy.'
);
M['medicine-54-inflammatory-bowel-disease-uc-vs-crohn'] = n(
  'Chronic inflammatory disorders of GI tract.',
  ['UC: mucosa, continuous, rectum up, bloody diarrhea, toxic megacolon, crypt abscess, PSC association', 'Crohn: transmural, skip lesions, any GI site, granuloma, fistula, string sign, perianal disease', 'Extraintestinal: arthritis, uveitis, pyoderma gangrenosum, erythema nodosum', 'Treatment: 5-ASA (UC), corticosteroids, immunomodulators, biologics (anti-TNF)'],
  'ACG 2023',
  '25-y-old with chronic bloody diarrhea, tenesmus, continuous proctocolitis on colonoscopy.',
  'Suspect UC; gastroenterology referral, start 5-ASA, steroids for flare, monitor for toxic megacolon, vaccines before biologics.'
);
M['medicine-55-ileostomy'] = n(
  'Surgical opening of small intestine to skin.',
  ['Output: liquid, high (1000-1500 mL/d), high Na+ loss', 'Skin excoriation risk — protect with barrier', 'Dehydration risk — >1500 mL/d high-output', 'Avoid high-fiber roughage'],
  'WOCN',
  'New ileostomy with output 2000 mL/day.',
  'High-output — loperamide, oral rehydration with WHO ORS, IV fluid if necessary, dietary adjustments, monitor for dehydration and Na+/K+ loss.'
);
M['medicine-56-esophageal-varices'] = n(
  'Dilated submucosal veins in lower esophagus from portal hypertension.',
  ['Risk: cirrhosis, portal vein thrombosis', 'Massive hematemesis, melena', 'Management: terlipressin/octreotide IV, endoscopic band ligation, ceftriaxone prophylaxis, TIPSS, Sengstaken-Blakemore tube temporizing'],
  'Baveno VII',
  'Cirrhotic with large hematemesis.',
  'Two large-bore IVs, crystalloid + blood cross-match, terlipressin IV, ceftriaxone IV, urgent endoscopy for band ligation, monitor for encephalopathy.'
);
M['medicine-57-perforated-duodenal-ulcer'] = n(
  'Complication of peptic ulcer — gas under diaphragm on erect CXR.',
  ['Sudden severe epigastric pain, board-like abdomen', 'Peritonitis signs', 'Treatment: IV fluids, NG decompression, broad-spectrum antibiotics, emergency laparotomy with omental patch (Graham)'],
  'Bailey & Love',
  'Young man with sudden severe epigastric pain, rigid abdomen, CXR gas under diaphragm.',
  'NPO, NG tube, IV fluids, broad-spectrum antibiotics, urgent surgical consult for Graham patch repair, H pylori treat later.'
);
M['medicine-58-cirrhosis-of-liver'] = n(
  'End-stage liver fibrosis.',
  ['Causes: alcohol, HCV/HBV, NAFLD, autoimmune, Wilson, hemochromatosis', 'Complications: ascites, varices, SBP, hepatic encephalopathy, HCC, hepatorenal syndrome', 'Child-Pugh A/B/C; MELD score for transplant priority'],
  'AASLD',
  'Cirrhotic with ascites and confusion, asterixis.',
  'Suspect hepatic encephalopathy; rule out precipitants (GI bleed, SBP, electrolyte), lactulose to 3 loose stools/day, low-protein in acute only, rifaximin, diagnostic paracentesis.'
);
M['medicine-59-gerd'] = n(
  'See Surgery-41. Chronic acid reflux.',
  ['Lifestyle + PPI', 'Alarm symptoms → endoscopy', 'Nissen fundoplication for refractory'],
  'ACG',
  'Chronic GERD not responding to PPI.',
  'Optimize dose, take before meals, endoscopy for Barrett/complications, consider fundoplication.'
);
M['medicine-60-melena'] = n(
  'Black tarry stool — upper GI bleed proximal to ligament of Treitz.',
  ['Blood digested by gastric acid → black', 'Requires >50 mL blood', 'Causes: peptic ulcer, varices, Mallory-Weiss, cancer', 'Hematochezia (bright red) = lower GI or massive upper', 'Management: stabilize, EGD'],
  'ACG',
  'Elderly on NSAID with melena and HR 110, BP 95/60.',
  'Two large-bore IVs, crystalloid, cross-match, PPI IV pantoprazole 80 mg bolus + 8 mg/h, NPO, urgent upper endoscopy.'
);
M['medicine-61-parkinson'] = n(
  'Neurodegenerative disease — loss of dopaminergic nigrostriatal neurons.',
  ['TRAP: Tremor (resting pill-rolling), Rigidity (cogwheel), Akinesia/bradykinesia, Postural instability', 'Lewy bodies', 'Treatment: levodopa/carbidopa (gold standard), dopamine agonists (pramipexole), MAO-B inhibitors (selegiline), COMT inhibitors, DBS for advanced'],
  'Harrison',
  'Elderly with resting tremor, cogwheel rigidity, shuffling gait.',
  'Start levodopa/carbidopa 100/25 TDS, PT/OT, fall prevention, monitor for on-off fluctuations and dyskinesia over years.'
);
M['medicine-62-kernicterus'] = n(
  'Bilirubin encephalopathy in neonates from severe unconjugated hyperbilirubinemia.',
  ['Deposits in basal ganglia → athetoid cerebral palsy, hearing loss, upward gaze palsy', 'Prevent with phototherapy/exchange transfusion per Bhutani nomogram', 'Especially Rh/ABO incompatibility, G6PD deficiency'],
  'Ghai',
  'Day 3 neonate with jaundice to soles, poor feeding, high-pitched cry.',
  'Intensive phototherapy, exchange transfusion if level warrants per Bhutani; also monitor hydration, treat underlying hemolysis.'
);
M['medicine-63-stroke'] = n(
  'Sudden focal neurological deficit from ischemia or hemorrhage.',
  ['Ischemic 85%: thrombotic, embolic, lacunar', 'Hemorrhagic 15%: ICH, SAH', 'FAST: Face, Arm, Speech, Time', 'NIHSS score', 'Ischemic + <4.5 h → IV alteplase 0.9 mg/kg; <24 h large-vessel → thrombectomy', 'BP target: ischemic <185/110 for thrombolysis; ICH <140 SBP'],
  'AHA/ASA 2019',
  '65-y-old with sudden right arm weakness and aphasia, NIHSS 12, CT no bleed, onset 2 h ago.',
  'Within window — confirm no contraindications, IV alteplase 0.9 mg/kg (10% bolus over 1 min, rest over 60 min), BP <185/110, monitor q15 min, neuro checks.',
  'Time is brain — door-to-needle <60 min target.'
);
M['medicine-64-myasthenia-gravis'] = n(
  'Autoimmune — anti-AChR antibodies at NMJ.',
  ['Fatigable muscle weakness; ocular first (ptosis, diplopia), bulbar, respiratory', 'Ice test: improvement with ice', 'Edrophonium (Tensilon) test historic', 'Treatment: pyridostigmine; thymectomy; corticosteroids; IVIg/plasmapheresis for crisis', 'Myasthenic vs cholinergic crisis'],
  'EFNS',
  'Young woman with fluctuating ptosis and difficulty chewing.',
  'Acetylcholine receptor antibody test, EMG, CT chest for thymoma, start pyridostigmine, avoid aminoglycosides/quinolones/beta-blockers that worsen.'
);
M['medicine-65-epilepsy'] = n(
  '>=2 unprovoked seizures >24 h apart or one with high recurrence risk.',
  ['Classification: focal, generalized (tonic-clonic, absence, myoclonic, atonic), unknown onset', 'First-line: levetiracetam, valproate (not in fertile women), lamotrigine', 'Status epilepticus: lorazepam IV → phenytoin/levetiracetam → midazolam infusion → GA', 'Seizure precautions: padded rails, suction, O2, lateral position'],
  'ILAE 2017, AHA',
  'Patient actively convulsing >5 min.',
  'Status epilepticus — protect airway (left lateral), O2, IV lorazepam 0.1 mg/kg (up to 4 mg), glucose if hypoglycemic, if continues phenytoin/levetiracetam loading, ICU.'
);
M['medicine-66-guillain-barre'] = n(
  'Acute inflammatory demyelinating polyneuropathy.',
  ['Post-Campylobacter, CMV, Zika; ascending symmetric weakness, areflexia', 'CSF: albumino-cytologic dissociation (elevated protein, normal cells)', 'Monitor FVC — intubate if <20 mL/kg or rapid decline', 'Treatment: IVIg 0.4 g/kg x5 d or plasmapheresis', 'Avoid steroids (not effective)'],
  'AAN',
  'Ascending weakness after gastroenteritis, FVC 18 mL/kg.',
  'ICU admission, monitor bulbar and respiratory function, intubate if FVC <20 mL/kg or airway compromised, IVIg 0.4 g/kg/day x5 d.'
);
M['medicine-67-multiple-sclerosis'] = n(
  'CNS demyelinating autoimmune disease.',
  ['Young women; relapsing-remitting most common', 'Symptoms: optic neuritis, Lhermitte sign, Uhthoff (heat worsens), fatigue, spasticity, bladder', 'MRI: periventricular white-matter plaques', 'Treatment: IV methylprednisolone for relapse; DMTs (interferon, glatiramer, natalizumab, ocrelizumab)'],
  'McDonald 2017',
  'Young woman with unilateral painful visual loss, prior sensory episode.',
  'MRI brain/cord, LP (oligoclonal bands), IV methylprednisolone 1 g x5 d for acute relapse, neuro referral for DMT.'
);
M['medicine-68-alzheimer'] = n(
  'Commonest neurodegenerative dementia.',
  ['Amyloid plaques, neurofibrillary tangles (tau)', 'Progressive memory loss, language, executive decline', 'MMSE, MoCA screening', 'Treatment: cholinesterase inhibitors (donepezil, rivastigmine, galantamine); memantine (NMDA) moderate-severe', 'Aducanumab/lecanemab novel'],
  'NICE',
  'Elderly with progressive memory loss, MoCA 18.',
  'Start donepezil 5 mg OD, caregiver support, safety assessment (driving, cooking), address reversible causes (B12, TSH, depression).'
);
M['medicine-69-meningitidis'] = n(
  'Inflammation of meninges.',
  ['Bacterial: S pneumoniae, N meningitidis, H influenzae', 'Viral: enteroviruses — milder', 'Classic triad: fever, headache, neck stiffness; Kernig, Brudzinski', 'LP: bacterial turbid, high protein, low glucose, neutrophils', 'Empiric: ceftriaxone + vancomycin ± dexamethasone (pneumococcal)'],
  'IDSA',
  'Adult with fever, headache, neck stiffness, photophobia.',
  'LP after ruling out raised ICP, send CSF studies, start empiric ceftriaxone 2 g BD + vancomycin within 1 h, dexamethasone 0.15 mg/kg QID x4 d before or with first dose if pneumococcal suspected.'
);
M['medicine-70-brain-edema'] = n(
  'Types and management.',
  ['Vasogenic: BBB disruption (tumor, abscess) — responds to steroids', 'Cytotoxic: cellular swelling (ischemia) — no steroid benefit', 'Interstitial: hydrocephalus', 'Management: head elevation 30°, mannitol 0.25-1 g/kg, 3% hypertonic saline, hyperventilation (temporary), surgical decompression'],
  'Neurocritical Care Society',
  'Elevated ICP >25 cm H2O in TBI.',
  'Head up 30°, mannitol 1 g/kg bolus, short hyperventilation to PaCO2 30-35, sedation, avoid hypotonic fluids, consider 3% saline, ICP monitor.'
);
M['medicine-71-tonic-clonic-seizure'] = n(
  'Generalized convulsion with loss of consciousness.',
  ['Phases: tonic (rigid 10-20 s), clonic (jerking 1-2 min), post-ictal', 'Tongue biting, incontinence possible', 'Nursing: protect head, turn lateral, do NOT restrain or place objects in mouth, time seizure, O2 suction ready', 'Post-ictal: recovery position, monitor airway'],
  'ILAE',
  'Ward patient begins tonic-clonic seizure.',
  'Lower to floor if standing, cushion head, left lateral position, clear surroundings, time seizure, do NOT put anything in mouth, O2 once cyanosis resolves.'
);
M['medicine-72-pontine-hemorrhage'] = n(
  'Catastrophic brainstem stroke.',
  ['Sudden coma, pinpoint reactive pupils, quadriparesis, hyperthermia', 'Poor prognosis', 'Supportive care; avoid hypertension exacerbation'],
  'Harrison',
  'Comatose patient with pinpoint pupils and quadriplegia after sudden headache.',
  'Airway management, neurosurgical consult, BP control, supportive; family counseling.'
);
M['medicine-73-normal-respiratory-rate'] = n(
  'Normal RR by age.',
  ['Newborn: 30-60', 'Infant <1 y: 30-50', 'Toddler 1-3 y: 24-40', 'Preschooler 3-6: 22-34', 'School-age: 18-30', 'Adolescent: 12-20', 'Adult: 12-20'],
  'Ghai',
  '2-y-old with RR 48.',
  'Tachypnea for age — assess for respiratory distress, pneumonia, fever; count for full minute.'
);
M['medicine-74-respiratory-distress'] = n(
  'Signs of increased work of breathing.',
  ['Tachypnea, nasal flaring, grunting, retractions (intercostal, subcostal, suprasternal), accessory muscle use', 'Cyanosis', 'Tripoding', 'Silverman-Anderson score for neonates', 'Severe: lethargy, apneas, bradycardia → intubate'],
  'Brunner, Ghai',
  'Infant with tachypnea 60, intercostal retractions, grunting.',
  'Respiratory distress — O2, upright, minimal handling, consider CPAP, NBM if severe, monitor for deterioration.'
);
M['medicine-75-mantoux'] = n(
  'Tuberculin skin test.',
  ['0.1 mL (5 TU) PPD intradermal, inner forearm, read 48-72 h', 'Measure induration (not erythema)', 'Positive: >=5 mm (HIV, contact), >=10 mm (high-risk), >=15 mm (low-risk)', 'Does not distinguish active vs latent vs BCG'],
  'CDC',
  'HIV contact tested with Mantoux, induration 8 mm.',
  'Positive (HIV cutoff >=5 mm); refer for active TB workup (CXR, sputum) and IGRA if available.'
);
M['medicine-76-tuberculin-test-interpretation'] = n(
  'See Medicine-74 for Mantoux. Other TB tests: IGRA (QuantiFERON, T-SPOT), NAAT (CBNAAT), culture gold standard.',
  ['IGRA not affected by BCG', 'CBNAAT detects MTB + rifampicin resistance', 'GeneXpert in 2 h', 'Sputum AFB microscopy ~50% sensitivity'],
  'NTEP',
  'Patient with chronic cough, CXR cavitary upper zone.',
  'Send sputum for CBNAAT (detects MTB + rifampicin resistance in 2 h), register under NTEP if positive, start 4-drug regimen.'
);
M['medicine-77-pulmonary-edema'] = n(
  'Cardiogenic or non-cardiogenic.',
  ['Cardiogenic: high PCWP, LVF, MI, MR', 'Non-cardiogenic: ARDS (normal PCWP)', 'Symptoms: orthopnea, PND, pink frothy sputum, bilateral crackles', 'Treatment: LMNOP — Lasix, Morphine, Nitrates, Oxygen, Position (upright)'],
  'AHA',
  'Acute pulmonary edema patient.',
  'Sit upright with legs dependent, high-flow O2, furosemide 40 mg IV, nitroglycerin drip, BiPAP if respiratory fatigue, monitor vitals and UO.'
);
M['medicine-78-obstructive-sleep-apnea'] = n(
  'Upper airway collapse in sleep — AHI >=5.',
  ['Loud snoring, witnessed apneas, daytime sleepiness, morning headache', 'STOP-BANG screening', 'Polysomnography diagnostic', 'Treatment: CPAP first-line, weight loss, oral appliance, UPPP surgery', 'Consequences: HTN, AF, MI, stroke'],
  'AASM',
  'Obese man with loud snoring and daytime sleepiness.',
  'Refer for polysomnography; if AHI >=5 and symptomatic, start CPAP, weight loss, counsel driving risk.'
);
M['medicine-79-peep'] = n(
  'Positive end-expiratory pressure during ventilation.',
  ['Indications: ARDS, atelectasis, recruit alveoli, improve oxygenation', 'Typical 5-15 cm H2O; higher in ARDS per PEEP table', 'Complications: barotrauma, reduced venous return, reduced CO, raised ICP', 'Contraindication: tension pneumothorax untreated, severe right heart failure'],
  'ARDSNet',
  'ARDS patient with PaO2/FiO2 80 on PEEP 5.',
  'Increase PEEP per table (likely 10-15 based on FiO2), monitor plateau <30, lung-protective Vt 6 mL/kg, prone if P/F <150.'
);
M['medicine-80-lung-cancer'] = n(
  'Commonest cancer death worldwide.',
  ['Small-cell (15%, smoking, paraneoplastic SIADH/Cushing) vs Non-small-cell (85%)', 'NSCLC: adenocarcinoma (commonest, non-smokers), squamous (central, PTHrP hypercalcemia), large-cell', 'Risk: smoking (#1), asbestos, radon, second-hand smoke', 'Screening: low-dose CT in high-risk >=50 y smokers', 'Treatment: surgery (early NSCLC), chemo, radio, targeted (EGFR, ALK), immunotherapy'],
  'NCCN',
  '55-y-old smoker with new cough, hemoptysis, weight loss, CT mass.',
  'Biopsy for histology and molecular testing, staging PET-CT, pulmonary function, multidisciplinary oncology review, smoking cessation support.'
);
M['medicine-81-pulmonary-embolism'] = n(
  'Obstruction of pulmonary arteries by thromboembolus.',
  ['Risk: Virchow triad (stasis, endothelial injury, hypercoagulability)', 'Symptoms: sudden dyspnea, chest pain, tachycardia, hypoxia', 'Wells score; D-dimer sensitive (rule-out); CTPA gold standard', 'Treatment: anticoagulation (LMWH/DOAC); thrombolysis if massive PE; IVC filter if anticoag contraindicated'],
  'CHEST 2021',
  'Post-op hip surgery with sudden dyspnea, SpO2 88%, tachycardia.',
  'O2, CTPA, start LMWH (enoxaparin 1 mg/kg BD) pending result, elevate head, telemetry, prepare for thrombolysis if massive.'
);
M['medicine-82-occupational-lung-disease'] = n(
  'Pneumoconioses and hypersensitivity pneumonitis.',
  ['Silicosis: sandblasting, mining — eggshell calcification; TB risk', 'Asbestosis: shipbuilding — pleural plaques, mesothelioma', 'Coal workers pneumoconiosis (black lung)', 'Bagassosis: sugarcane (thermophilic actinomycetes)', 'Byssinosis (Monday fever): cotton mill', 'Farmer lung: moldy hay'],
  'Park 26e',
  'Cotton-mill worker with Monday morning dyspnea.',
  'Byssinosis — remove from exposure, bronchodilators, vaccinate, counsel ESI benefits, spirometry monitoring.'
);
M['medicine-83-apnea'] = n(
  'Cessation of airflow.',
  ['Newborn apnea: >20 s or <20 s with bradycardia/cyanosis/hypotonia', 'Central: no effort; obstructive: effort without airflow; mixed', 'Treatment newborn: tactile stimulation, CPAP, caffeine citrate'],
  'AAP',
  'Preterm 32-wk with recurrent apneas.',
  'Apnea of prematurity — start caffeine citrate 20 mg/kg loading then 5-10 mg/kg/day, CPAP, monitor, positioning prone or side-lying.'
);
M['medicine-84-pulmonary-function-test'] = n(
  'Spirometry measures lung volumes/flows.',
  ['FEV1: forced expiratory volume in 1 s', 'FVC: forced vital capacity', 'FEV1/FVC ratio: normal >=0.7; <0.7 = obstructive (asthma, COPD)', 'Restrictive: FEV1/FVC normal but both reduced (fibrosis, obesity)', 'Reversibility >12% and 200 mL = asthma'],
  'ATS/ERS',
  'Smoker with FEV1/FVC 0.55, FEV1 55% predicted.',
  'COPD GOLD 2 moderate; bronchodilators, smoking cessation, pulmonary rehab, vaccines, check ABG if severe.'
);
M['medicine-85-cheyne-stokes'] = n(
  'Periodic breathing pattern: crescendo-decrescendo with apnea.',
  ['Causes: CHF, stroke, uremia, high altitude, opioids', 'Due to delayed chemoreceptor feedback', 'Kussmaul = deep rapid (DKA), Biot = irregular (brainstem)'],
  'Harrison',
  'Elderly CHF patient with crescendo-decrescendo breathing pattern.',
  'Document Cheyne-Stokes, optimize CHF treatment, consider sleep study, monitor overnight SpO2.'
);
M['medicine-86-brain-death'] = n(
  'Irreversible cessation of all brain including brainstem function.',
  ['Criteria: coma, absent brainstem reflexes (pupil, corneal, oculocephalic, oculovestibular, gag, cough), apnea test positive', 'Repeat exam after interval', 'Exclude confounders: hypothermia, drugs, severe metabolic', 'Legal requirement for organ donation'],
  'AAN 2010',
  'Ventilated patient 72 h post severe TBI with fixed pupils.',
  'Exclude drugs/hypothermia, perform brainstem reflex exam by 2 physicians, apnea test, document per institutional protocol, discuss organ donation with family.'
);
M['medicine-87-pneumonia'] = n(
  'Acute LRTI.',
  ['CAP: S pneumoniae commonest; atypical (Mycoplasma, Chlamydia, Legionella)', 'HAP: >48 h after admission; Pseudomonas, MRSA', 'CURB-65: Confusion, Urea >7, RR >=30, BP <90/60, age >=65', 'Treatment CAP: amoxicillin ± macrolide; HAP: broad-spectrum per local antibiogram'],
  'IDSA 2019',
  '65-y-old with fever, cough, RR 32, BP 85/55, BUN 9.',
  'CURB-65 score 4 — admit ICU, blood cultures, IV ceftriaxone + azithromycin, O2, fluids, HAP coverage if hospitalized >48 h.'
);
M['medicine-88-scrotum'] = n(
  'Scrotal pathology summary.',
  ['Hydrocele: transilluminates', 'Varicocele: bag of worms, left > right', 'Epididymitis: tender epididymis + fever', 'Torsion: sudden pain, elevated testis, absent cremasteric', 'Testicular tumor: painless mass'],
  'Campbell-Walsh',
  'Young adult with painless right testicular mass, no transillumination.',
  'Testicular cancer until proven otherwise — do NOT biopsy transscrotally; order USG, tumor markers (AFP, β-hCG, LDH), refer urology.'
);
M['medicine-89-exstrophy-bladder'] = n(
  'See Surgery-27. Congenital anterior abdominal wall and bladder failure.',
  ['Cover bladder with plastic wrap at birth', 'Urinary reconstruction staged', 'Avoid latex'],
  'Ghai',
  'Newborn bladder exstrophy.',
  'Cover with plastic wrap, no gauze, pediatric urology urgent referral.'
);
M['medicine-90-urolithiasis'] = n(
  'Kidney/ureter stones.',
  ['Types: Ca oxalate (80%), struvite (infection — staghorn), uric acid (radiolucent), cystine', 'NCCT KUB gold standard', 'Treatment: <5 mm often pass; 5-10 mm MET with tamsulosin; >10 mm SWL/ureteroscopy; staghorn PCNL'],
  'Campbell-Walsh',
  'Patient with colicky flank pain, stone 8 mm in distal ureter.',
  'Analgesia (diclofenac IM), hydration, tamsulosin 0.4 mg OD (MET), strain urine; urology follow-up; imaging reassessment.'
);
M['medicine-91-urinary-incontinence'] = n(
  'Types.',
  ['Stress: leak with cough/laugh (weak pelvic floor); Kegel, pessary', 'Urge (overactive bladder): sudden urgency; anticholinergic (oxybutynin), β3-agonist (mirabegron)', 'Overflow: retention with dribbling; BPH, DM neuropathy', 'Functional: mobility/cognition; toilet routine', 'Mixed'],
  'NICE',
  'Post-partum woman with leakage on coughing.',
  'Stress incontinence — Kegel pelvic floor exercises 3 sets of 10 BD, weight management, biofeedback; refer for pessary/surgery if severe.'
);
M['medicine-92-fecal-incontinence'] = n(
  'Loss of anal sphincter control.',
  ['Causes: obstetric injury, neurologic (MS, cauda equina), diarrhea, impaction with overflow', 'Evaluation: endoanal USG, manometry', 'Treatment: dietary fiber, bulk-forming, biofeedback, sphincteroplasty'],
  'ACG',
  'Elderly with fecal soiling and chronic constipation.',
  'Rule out fecal impaction with overflow — disimpact, start bulk-forming laxative and scheduled toileting, refer for evaluation.'
);
M['medicine-93-hiv'] = n(
  'Retrovirus — CD4 depletion.',
  ['Stages: acute (seroconversion) → clinical latency → AIDS (CD4 <200 or AIDS-defining illness)', 'Screening: ELISA → Western blot / rapid tests; viral load monitor', 'ART: start all regardless of CD4 (NACP V); first-line TLD (TDF + 3TC + DTG)', 'Opportunistic: PCP (<200), MAC (<50), CMV, toxoplasmosis'],
  'NACP V, WHO',
  'New HIV diagnosis with CD4 180.',
  'Start TLD (TDF 300 + 3TC 300 + DTG 50) daily, PCP prophylaxis with cotrimoxazole DS OD, screen TB, counsel adherence, partner testing.'
);
M['medicine-94-kaposi-sarcoma'] = n(
  'HHV-8 vascular tumor.',
  ['Classic, endemic (African), immunosuppression (transplant), AIDS-associated', 'Violaceous plaques/nodules on skin and mucosa; may involve GI, lung', 'Treatment: ART (often regresses with immune reconstitution), local therapy, systemic chemo for visceral'],
  'WHO',
  'AIDS patient with purple plaques on palate and legs.',
  'Classic KS — start/optimize ART, refer to oncology for systemic involvement.'
);
M['medicine-95-wasting-syndrome'] = n(
  'AIDS-defining involuntary loss >10% body weight + chronic diarrhea/fatigue/fever >30 d.',
  ['Multifactorial: OI, malabsorption, anorexia', 'Treat cause, nutritional support, ART', 'Appetite stimulants, resistance training'],
  'WHO',
  'Advanced HIV with 15% weight loss and chronic diarrhea.',
  'Evaluate for OI, start ART if not on, nutritional consult, enteral supplement, treat underlying diarrhea etiology.'
);
M['medicine-96-uti'] = n(
  'Lower or upper urinary tract infection.',
  ['Women commoner; E coli 80%', 'Uncomplicated lower UTI: nitrofurantoin 5 d, fosfomycin 3 g single dose, cefuroxime, cotrimoxazole', 'Complicated/pyelonephritis: ciprofloxacin or IV ceftriaxone', 'Recurrent: post-coital prophylaxis, topical estrogen (menopause)'],
  'IDSA',
  'Non-pregnant woman with dysuria, frequency, nitrite +.',
  'Nitrofurantoin 100 mg BD x5 d; hydration; follow-up if symptoms persist.'
);
M['medicine-97-hai'] = n(
  'Healthcare-associated infections.',
  ['CLABSI: central line >48 h — bundles (CHG bath, hand hygiene, max barrier)', 'CAUTI: Foley >48 h — remove ASAP, closed drainage', 'VAP: ventilator >48 h — HOB 30°, oral CHG, SAT/SBT', 'SSI: see Surgery', 'C difficile: soap and water (not alcohol), contact precautions'],
  'CDC',
  'ICU with rising CLABSI rate.',
  'Implement central line bundle — hand hygiene, maximum sterile barrier, CHG skin prep, optimal site (subclavian > IJ > femoral), daily review of need.'
);
M['medicine-98-skin-lesions'] = n(
  'Primary skin lesion terminology.',
  ['Macule: flat, <=1 cm (freckle)', 'Papule: raised <=1 cm (wart)', 'Plaque: flat-topped >1 cm (psoriasis)', 'Nodule: raised >1 cm', 'Vesicle: fluid-filled <=1 cm (chickenpox)', 'Bulla: >1 cm (burn blister)', 'Pustule: pus-filled', 'Wheal: transient raised (urticaria)'],
  'Dermatology standard',
  'Itchy raised transient lesion on arm 30 min after shellfish.',
  'Wheals in urticaria — stop allergen, antihistamine cetirizine 10 mg, watch for anaphylaxis (wheeze, hypotension, airway swelling).'
);
M['medicine-99-contact-dermatitis'] = n(
  'Type IV hypersensitivity or irritant reaction.',
  ['Allergic: nickel, poison ivy', 'Irritant: detergents, acids', 'Treatment: identify and remove trigger, topical steroids, antihistamines', 'Patch testing for allergen identification'],
  'AAD',
  'Nurse with erythematous itchy hands after latex glove use.',
  'Suspect latex allergy — switch to nitrile gloves, topical hydrocortisone, oral antihistamine, patch test to confirm, document.'
);
M['medicine-100-scabies'] = n(
  'Sarcoptes scabiei mite infestation.',
  ['Intense itching especially night, interdigital web burrows, genital nodules', 'Treatment: permethrin 5% cream, head to toe, wash off after 8-12 h, repeat in 7 d; ivermectin 200 mcg/kg PO alternative', 'Treat all household contacts, wash linen hot water'],
  'CDC',
  'Family with intense nocturnal itch and web-space burrows.',
  'Permethrin 5% to all household members simultaneously, wash linen >60°C or bag 72 h, repeat in 1 wk.'
);
M['medicine-101-sjs'] = n(
  'Stevens-Johnson syndrome — severe mucocutaneous drug reaction.',
  ['<10% BSA detachment = SJS; 10-30% = SJS/TEN overlap; >30% = TEN', 'Common drugs: carbamazepine, allopurinol, sulfonamides, lamotrigine', 'Nikolsky sign positive', 'Management: stop offending drug, burn-unit-like care, fluids, pain, monitor eyes, IVIg/cyclosporine'],
  'AAD',
  'Patient on allopurinol develops rash + mucous membrane involvement + 15% BSA.',
  'Stop allopurinol immediately, transfer to burn/ICU unit, fluid + electrolyte, wound care, ophthalmology for eye involvement, report ADR.'
);
M['medicine-102-barium-enema'] = n(
  'Fluoroscopic study of colon with barium contrast.',
  ['Indications: suspected obstruction, volvulus, Hirschsprung, intussusception (also therapeutic)', 'Prep: bowel prep, NPO overnight', 'Post-procedure: laxative to clear barium, hydrate', 'Contraindicated: suspected perforation (use gastrografin)'],
  'Radiology',
  'Suspected intussusception in infant.',
  'Diagnostic + therapeutic air or barium enema under fluoroscopy; contraindicated if perforation; surgical standby.'
);
M['medicine-103-xray-basic'] = n(
  'Common X-ray findings to recognize.',
  ['Tension pneumothorax: mediastinal shift, flat diaphragm, no lung markings', 'CHF: cardiomegaly, Kerley B lines, bat-wing', 'Pneumonia: consolidation with air bronchograms', 'TB: upper zone cavitation, miliary reticulonodular', 'Hyaline membrane: ground glass + air bronchograms in preterm'],
  'Radiology',
  'Preterm neonate CXR shows reticulogranular pattern with air bronchograms.',
  'RDS (hyaline membrane disease) — surfactant via ETT, CPAP/ventilation, thermoregulation.'
);
M['medicine-104-hypertensive-emergency-vs-urgency'] = n(
  'Emergency = severe HTN + target-organ damage. Urgency = severe HTN without organ damage.',
  ['Emergency: stroke, MI, aortic dissection, PE, eclampsia, encephalopathy, retinal hemorrhage', 'Treatment: IV labetalol, nicardipine, sodium nitroprusside; goal reduce MAP 10-25% in first hour', 'Aortic dissection: SBP <120 rapidly + HR <60', 'Ischemic stroke: don\'t lower BP unless >220/120 or thrombolysis'],
  'JNC 8',
  'BP 220/130 with new chest pain and dyspnea.',
  'Hypertensive emergency — ICU admission, IV nitroglycerin + beta-blocker, target MAP reduction 10-25% in 1 h, monitor end-organs.'
);
M['medicine-105-heart-failure'] = n(
  'Inability to meet metabolic demand.',
  ['HFrEF (EF <=40): ischemic, DCM', 'HFpEF (EF >=50): elderly HTN, diabetes', 'NYHA I-IV functional class', 'BNP elevated', 'Treatment HFrEF: ACE-i/ARNI + beta-blocker + MRA + SGLT2i; diuretic for symptoms', 'Device: ICD, CRT', 'Salt <2 g/d, fluid <2 L/d'],
  'ACC/AHA 2022',
  'HFrEF patient with dyspnea, pitting edema, weight gain 3 kg in 3 d.',
  'Daily weights, sodium <2 g, fluid <2 L, optimize ACE-i/sacubitril-valsartan + beta-blocker + MRA + empagliflozin, furosemide PRN.'
);
M['medicine-106-copd'] = n(
  'Chronic progressive airflow limitation.',
  ['Emphysema: destruction of alveolar walls, "pink puffers"', 'Chronic bronchitis: productive cough >3 mo x2 y, "blue bloaters"', 'GOLD ABE grouping, FEV1 based staging', 'Treatment: bronchodilators (LABA/LAMA), inhaled steroid in frequent exacerbators, pulmonary rehab, vaccines, O2 if PaO2 <55', 'Smoking cessation most impactful'],
  'GOLD 2024',
  'COPD exacerbation with increased dyspnea and sputum.',
  'Nebulized salbutamol + ipratropium, oral prednisolone 40 mg x5 d, antibiotic if purulent sputum, controlled O2 SpO2 88-92%, assess need for NIV.'
);
M['medicine-107-asthma'] = n(
  'Chronic airway inflammation with reversible obstruction.',
  ['Symptoms: wheeze, cough, dyspnea, chest tightness especially night/early morning', 'Spirometry reversibility', 'GINA stepwise: ICS-LABA even in mild', 'Acute: SABA nebulizer, oxygen SpO2 94-98%, oral steroid, consider MgSO4', 'Status asthmaticus: ICU, consider intubation'],
  'GINA 2024',
  'Adult with severe acute asthma, PEFR 40% predicted, unable to speak sentences.',
  'O2 high-flow, salbutamol + ipratropium nebulization back-to-back, IV hydrocortisone 100 mg, magnesium sulfate 2 g IV if no response, monitor for intubation.'
);
M['medicine-108-acs-mona'] = n(
  'Initial therapy for acute coronary syndrome: MONA-B.',
  ['Morphine, Oxygen (if SpO2 <90%), Nitroglycerin, Aspirin 325 mg chewed', 'Plus Beta-blocker if no contraindication, statin high-intensity, heparin', 'Avoid nitrates in inferior MI with RV involvement, severe AS, sildenafil <24 h', 'Door-to-balloon <90 min for STEMI'],
  'ACC/AHA',
  'Chest pain patient, STEMI anterior.',
  'ASA 325 chew, ticagrelor 180 mg loading, heparin bolus, morphine PRN, nitroglycerin SL, O2 if hypoxic, call cath lab, prep for PCI.'
);
M['medicine-109-cardiogenic-shock'] = n(
  'Cardiac output inadequate for tissue perfusion despite euvolemia.',
  ['MI commonest cause', 'Hypotension, elevated filling pressures, low CI', 'Treatment: inotropes (dobutamine, milrinone), pressors (norepinephrine), revascularization, IABP/Impella/ECMO, avoid excess fluids'],
  'AHA',
  'Post-MI BP 80/50, cool extremities, oliguria, crackles.',
  'ICU, norepinephrine + dobutamine titrate MAP >=65, urgent PCI for underlying MI, consider IABP, strict I/O, avoid excess fluid.'
);
M['medicine-110-peripheral-arterial-disease'] = n(
  'Atherosclerosis of lower limb arteries.',
  ['Intermittent claudication, rest pain, ulcers, 6 Ps in acute (pain, pallor, pulselessness, paresthesia, paralysis, poikilothermia)', 'ABI <=0.9 diagnostic; <0.4 severe', 'Risk factors: smoking, DM, HTN', 'Management: smoking cessation, statin, antiplatelet, exercise therapy; cilostazol; revascularization'],
  'ACC/AHA',
  'Diabetic smoker with calf cramping at 100 m walking.',
  'ABI, address risk factors, start aspirin + statin, supervised exercise program, smoking cessation; refer if lifestyle-limiting.'
);
M['medicine-111-liver-function-tests'] = n(
  'Hepatic biochemistry.',
  ['AST/ALT: hepatocellular injury; AST:ALT >2 alcohol; >1000 ischemic/viral/toxic', 'ALP: cholestasis, bone', 'GGT: confirms hepatic ALP', 'Bilirubin: direct vs indirect', 'Albumin, PT/INR: synthetic function', 'LDH: hemolysis, liver'],
  'Harrison',
  'Patient with jaundice, AST 1800, ALT 2000, INR 1.8.',
  'Acute hepatitis — check viral serology, paracetamol level, autoimmune, alcohol; supportive care, monitor coagulation and encephalopathy; urgent hepatology.'
);
