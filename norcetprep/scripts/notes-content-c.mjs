// CHN (46) + Medicine (111) + ENT (9). Continued from notes-content-b.mjs.
import { n } from './notes-helper.mjs';

export const NOTE_CONTENT_C = {};

// ============ CHN (46 topics) ============
NOTE_CONTENT_C['chn-1-national-immunization-schedule'] = n(
  'MoHFW UIP schedule for universal infant immunization.',
  ['Birth: BCG, OPV-0, Hep-B birth dose', '6 wk: OPV-1, Penta-1 (DPT+HepB+Hib), Rota-1, fIPV-1, PCV-1', '10 wk: OPV-2, Penta-2, Rota-2', '14 wk: OPV-3, Penta-3, Rota-3, fIPV-2, PCV-2', '9 mo: MR-1, JE-1 (endemic), Vit A', '16-24 mo: DPT booster, OPV booster, MR-2, JE-2, PCV booster', '5-6 y: DPT-2 booster', '10 y and 16 y: Td'],
  'MoHFW UIP 2023',
  'Nurse preparing 6-wk vaccination visit.',
  'Administer OPV-1 (2 drops oral), Penta-1 (0.5 mL IM anterolateral thigh), Rota-1, fIPV-1, PCV-1; record in MCP card.',
  'Total doses by 1 year: BCG+4 OPV+3 penta+3 rota+2 fIPV+2 PCV+1 MR.'
);

NOTE_CONTENT_C['chn-2-cold-chain'] = n(
  'System of transporting/storing vaccines at prescribed temperature.',
  ['ILR (2-8°C): most vaccines', 'Deep freezer (-15 to -25°C): OPV, measles, MR for long-term', 'Cold box: field transport', 'Vaccine carrier: 4-8°C for outreach', 'Do NOT freeze DPT, TT, HepB, Penta — freezing denatures', 'VVM (vaccine vial monitor): discard if stage 3 or 4', 'Shake test: check for freeze damage in DPT'],
  'MoHFW Cold Chain Handbook 2022',
  'ANM at outreach session has vaccine carrier.',
  'Keep carrier closed; place vaccines above ice packs; use within 4 h; check VVM and discard if square darker than circle.',
  'Top shelf of ILR: OPV, measles; bottom: DPT, TT, HepB.'
);

NOTE_CONTENT_C['chn-3-family-planning-methods'] = n(
  'Spacing and permanent contraceptive methods.',
  ['Barrier: condom (dual protection HIV+pregnancy), diaphragm, female condom', 'IUD: Cu-T 380A (10 y), 375 (5 y), LNG-IUS (5 y)', 'Hormonal: COC, POP, DMPA injection (q3 mo), implant (Nexplanon 3 y)', 'Emergency: LNG 1.5 mg <72 h, Cu-T <5 d', 'Permanent: tubectomy, NSV', 'LAM: exclusive breastfeeding + amenorrhea + <6 mo (98% effective)'],
  'MoHFW FP Guidelines',
  '28-y-old P2 wants 5-year reversible method.',
  'Counsel Cu-T 380A (10 y) or LNG-IUS (5 y); rule out pregnancy, insert within 7 d of menses, teach thread check, 6-week follow-up.'
);

NOTE_CONTENT_C['chn-4-diarrhea-and-ors-management'] = n(
  'IMNCI approach to childhood diarrhea.',
  ['Classify: no dehydration, some dehydration, severe', 'Plan A (no dehydration): home ORS + zinc', 'Plan B (some): ORS 75 mL/kg over 4 h', 'Plan C (severe): IV RL — 100 mL/kg: <12 mo 30 mL/kg in 1 h + 70 in 5 h; >=12 mo 30 in 30 min + 70 in 2.5 h', 'Zinc: 10 mg/d <6 mo, 20 mg/d >=6 mo x14 d', 'Continue feeding/breastfeeding'],
  'WHO/UNICEF, IMNCI India',
  '10-kg 14-mo-old with lethargy, sunken eyes, skin pinch goes back slowly, unable to drink.',
  'Severe dehydration — Plan C: IV RL 30 mL/kg (300 mL) in 30 min, then 70 mL/kg (700 mL) over 2.5 h; reassess q15-30 min; start ORS once able to drink.',
  'Zinc reduces duration + severity + recurrence.'
);

NOTE_CONTENT_C['chn-5-child-growth-and-icds'] = n(
  'Integrated Child Development Services.',
  ['Launched 1975; target: 0-6 y children, pregnant women, lactating mothers, adolescent girls', 'Services: supplementary nutrition, immunization, health check-up, referral, pre-school education, nutrition and health education', 'Anganwadi worker is field functionary', 'Supplementary nutrition: 500 kcal/12-15 g protein for normal 6-36 mo; 800/20-25 for SAM', 'WHO growth chart — plot weight-for-age monthly'],
  'ICDS Scheme, MoWCD',
  'AWW notes 2-y-old weight below -3Z on growth chart.',
  'Classify as SAM, refer to NRC, double ration supplementary nutrition, counsel mother on IYCF, deworm if not done.'
);

NOTE_CONTENT_C['chn-6-nutritional-guidelines-for-pregnant-and-lactating-females'] = n(
  'ICMR-NIN RDA for pregnancy/lactation.',
  ['Pregnancy: +350 kcal 2nd trimester, +350-500 3rd; +0.8 g protein/kg/d', 'Lactation: +600 kcal first 6 mo, +520 after; +25 g protein', 'IFA: 60 mg iron + 500 mcg folic acid daily (pregnancy from 2nd trimester, continue 6 mo postpartum)', 'Calcium 1000-1200 mg', 'Iodine 200-250 mcg'],
  'ICMR RDA 2020',
  'Lactating mother at 3 mo postpartum.',
  'Recommend +600 kcal, +25 g protein, IFA + calcium + iodine, adequate fluids, diverse diet.'
);

NOTE_CONTENT_C['chn-7-mosquito-ticks-mites-louse-identification-and-prevention'] = n(
  'Vector-borne disease carriers.',
  ['Anopheles: malaria — breeds in clean water, female bites night', 'Aedes aegypti: dengue, chikungunya, Zika, yellow fever — daytime biter, stagnant clean water (coolers, tyres)', 'Culex: filariasis, JE — polluted water', 'Ticks: rickettsial, Lyme, KFD', 'Mites: scrub typhus (chigger), scabies', 'Louse: epidemic typhus, relapsing fever'],
  'Park 26e',
  'Aedes containment in dengue outbreak.',
  'Source reduction — empty coolers weekly, cover water storage, use larvicide (temephos), long sleeves, repellents, fogging for adult vectors.'
);

NOTE_CONTENT_C['chn-8-ntep-nacp-nlep'] = n(
  'National TB, HIV, and Leprosy programmes.',
  ['NTEP (formerly RNTCP): DBT under Nikshay Poshan Yojana 500 INR/mo; new drug regimen 2023 daily FDC', 'NACP V (2022-26): 95-95-95 targets; ART lifelong free', 'NLEP: MDT free; leprosy elimination <1/10,000 population; renewed focus on case detection 2023'],
  'MoHFW 2023',
  'Sputum AFB+ patient under NTEP.',
  'Register in Nikshay, daily FDC 4-drug intensive 2 mo + 2-drug continuation 4 mo, monthly follow-up, Nikshay Poshan Yojana benefit, contact screening.'
);

NOTE_CONTENT_C['chn-9-malaria-and-vector-borne-diseases'] = n(
  'Protozoal and arboviral vector-borne illnesses.',
  ['Malaria: P. vivax, P. falciparum (severe), P. malariae, P. ovale, P. knowlesi', 'Falciparum: cerebral, ARDS, AKI, hypoglycemia', 'Diagnosis: RDT (HRP2 Pf, pLDH) + microscopy', 'Treatment: Pf — ACT (artesunate + sulfa-pyrimethamine); Pv — chloroquine + primaquine 14 d (radical cure)', 'Severe: IV artesunate'],
  'NVBDCP 2023',
  'Child from endemic area with fever, P falciparum+ on RDT, GCS 10.',
  'Admit, start IV artesunate 2.4 mg/kg at 0/12/24 h then daily, supportive care, blood sugar, avoid steroids; notify NVBDCP.'
);

NOTE_CONTENT_C['chn-10-rickettsial-disease'] = n(
  'Zoonotic infections from arthropod vectors.',
  ['Scrub typhus (O. tsutsugamushi): chigger, eschar, rash, lymphadenopathy', 'Indian tick typhus', 'Epidemic typhus (louse)', 'Treatment: doxycycline 100 mg BD x7 d (first-line, all ages in India per AIIMS/ICMR)'],
  'IAP, ICMR',
  'Child from hilly area with fever, eschar on thigh.',
  'Start doxycycline empirically; notify; supportive care; Weil-Felix positive to OX-K in scrub typhus.'
);

NOTE_CONTENT_C['chn-11-epidemiology-and-study-design'] = n(
  'Study designs and measures of association.',
  ['Descriptive: case report, case series, cross-sectional', 'Analytical: case-control (OR), cohort (RR), RCT (RR)', 'Cohort: follow forward, measures incidence', 'Case-control: look back; good for rare diseases', 'Incidence = new cases / population at risk; Prevalence = total cases / population', 'Relative risk = CI exposed / CI unexposed'],
  'Park 26e',
  'Study of 1000 smokers and 1000 non-smokers followed 10 y for lung cancer.',
  'Design is cohort; calculate relative risk as CI exposed / CI unexposed.'
);

NOTE_CONTENT_C['chn-12-mission-indradhanush'] = n(
  'MoHFW 2014 campaign to reach fully immunized status >90%.',
  ['Target: children <2 y and pregnant women partially or unimmunized', 'Rounds in poorly performing districts', 'IMI (Intensified MI) 2017 + IMI 2.0 (2019) + IMI 4.0 (2022) + IMI 5.0 (2023)', 'Full immunization coverage rose from 65% to >85% per NFHS-5'],
  'MoHFW',
  'AWW identifies 14 unimmunized children in village.',
  'Conduct MI session — OPV, BCG, Penta etc as per schedule, counsel parents, plan catch-up, Nikshay/UWin record.'
);

NOTE_CONTENT_C['chn-13-national-rural-health-mission-nrhm'] = n(
  'Launched 2005, part of National Health Mission now.',
  ['Goal: accessible, affordable, quality healthcare to rural poor', 'Key interventions: ASHA, JSY, ANMs upgrade, facility upgrade (SC, PHC, CHC, DH)', 'Indian Public Health Standards (IPHS) for facilities', 'NRHM + NUHM = NHM (2013)'],
  'MoHFW',
  'PHC under NRHM.',
  'Follow IPHS norms — 30-bed PHC covers 30,000 plains / 20,000 hilly population, 1 medical officer.'
);

NOTE_CONTENT_C['chn-14-janani-suraksha-yojana-jsy'] = n(
  'Cash incentive for institutional delivery under NHM.',
  ['LPS states: 1400 rural, 1000 urban for mother; 600 rural, 200 urban for ASHA', 'HPS states: BPL/SC/ST only: 700 rural, 600 urban; 200 ASHA', 'Linked with JSSK for free entitlements'],
  'MoHFW JSY 2005',
  'ASHA escorts BPL pregnant woman to PHC in UP (LPS state).',
  'Register under JSY, ensure 2 ANC visits, institutional delivery, PNC; mother receives 1400 INR, ASHA 600 INR.'
);

NOTE_CONTENT_C['chn-15-disease-determinants'] = n(
  'Factors influencing disease occurrence.',
  ['Agent: biological, physical, chemical, nutritional, mechanical', 'Host: age, sex, genetics, immunity, nutrition', 'Environment: physical, biological, social', 'Epidemiologic triangle'],
  'Park 26e',
  'Epidemic analysis.',
  'Identify agent-host-environment triad to plan intervention at weakest link.'
);

NOTE_CONTENT_C['chn-16-pathogenicity-vs-virulence'] = n(
  'Measures of disease-causing capacity.',
  ['Pathogenicity: proportion of infected who become ill (secondary attack rate)', 'Virulence: proportion of ill who become severe/die (case fatality rate)', 'Infectivity: proportion exposed who become infected'],
  'Park 26e',
  '100 exposed, 50 infected, 30 ill, 3 die.',
  'Infectivity 50%, pathogenicity 60%, virulence 10% (CFR).'
);

NOTE_CONTENT_C['chn-17-incubation-period-table'] = n(
  'Time from infection to symptoms.',
  ['Cholera: few hours to 5 d', 'Influenza: 1-3 d', 'Measles: 10-14 d', 'Chickenpox: 14-21 d', 'Mumps: 16-18 d', 'Rubella: 14-21 d', 'Tetanus: 3-21 d', 'Hepatitis A: 15-50 d', 'Hepatitis B: 30-180 d', 'Rabies: 2-8 wk (up to years)', 'COVID-19: 2-14 d'],
  'Park 26e',
  'Child develops fever + rash 12 d after exposure.',
  'Suspect measles (incubation 10-14 d); isolate with airborne precautions, notify surveillance.'
);

NOTE_CONTENT_C['chn-18-ascariasis'] = n(
  'Intestinal roundworm (A. lumbricoides) infection.',
  ['Fecal-oral; eggs in soil', 'Loeffler syndrome: eosinophilic pneumonitis from larval migration', 'Complications: obstruction, biliary ascariasis', 'Treatment: albendazole 400 mg single dose (>2 y) or mebendazole 100 mg BD x3 d'],
  'Park 26e',
  'Child from rural area passing worms in stool.',
  'Give albendazole 400 mg single dose, treat family, improve sanitation, repeat deworming q6 mo.'
);

NOTE_CONTENT_C['chn-19-chickenpox'] = n(
  'Varicella-zoster virus (DNA herpes).',
  ['Incubation 14-21 d; infective 1-2 d before rash till all lesions crusted', 'Rash: centripetal, all stages simultaneously (pleomorphic)', 'Complications: pneumonia (adults), encephalitis, Reye syndrome (aspirin)', 'Treatment: acyclovir for adults/immunocompromised; VZIG for exposure'],
  'Park 26e',
  'Child with fever and vesicular rash starting on trunk.',
  'Airborne + contact precautions, cool baths, calamine, avoid aspirin, acyclovir if severe/adult.'
);

NOTE_CONTENT_C['chn-20-measles'] = n(
  'Highly contagious paramyxovirus; droplet spread.',
  ['Koplik spots (pathognomonic): day 2-3', 'Rash: day 4 — maculopapular behind ears spreads caudally', 'Complications: pneumonia, diarrhea, encephalitis, SSPE, blindness', 'Vit A 2 doses on day 1 and 2 for all children with measles', 'Vaccine: MR 9 mo and 16-24 mo'],
  'Park 26e',
  'Unimmunized 2-y-old with fever, cough, coryza, conjunctivitis, Koplik spots.',
  'Airborne isolation, vit A 100,000 IU day 1 and 2 (up to 200,000 IU in >=12 mo), supportive care, notify IDSP, catch-up MR.'
);

NOTE_CONTENT_C['chn-21-airborne-droplet-contact-precautions'] = n(
  'Transmission-based precautions.',
  ['Airborne: TB, measles, varicella — N95, negative pressure room', 'Droplet: meningococcus, flu, pertussis, mumps, rubella — surgical mask, single room or cohort', 'Contact: MRSA, VRE, C. difficile, RSV — gown + gloves, dedicated equipment', 'Combined for some (e.g., COVID-19, SARS)'],
  'CDC 2007',
  'Sputum AFB+ TB patient.',
  'Airborne precautions — N95 respirator fit-tested, negative-pressure room, keep door closed, instruct cough etiquette.'
);

NOTE_CONTENT_C['chn-22-bordetella-pertussis-whooping-cough'] = n(
  'Gram-negative coccobacillus causing whooping cough.',
  ['Stages: catarrhal (most infective) → paroxysmal (whoop + post-tussive vomit) → convalescent', 'Lymphocytosis marked', 'Treatment: azithromycin (also for contacts)', 'Prevention: DPT/Penta vaccine'],
  'Park 26e',
  'Infant with paroxysmal cough, whoop, cyanosis on cough.',
  'Droplet isolation, azithromycin 10 mg/kg x5 d, oxygen PRN, gentle feeding, treat household contacts.'
);

NOTE_CONTENT_C['chn-23-smallpox-eradication'] = n(
  'First (and only) disease eradicated globally.',
  ['Caused by Variola virus', 'India declared free 1977; global eradication 1980 WHO', 'Strategies: surveillance + ring vaccination, freeze-dried vaccine', 'Monkeypox now an emerging concern'],
  'WHO',
  'Test item.',
  'Identify smallpox as the only human disease eradicated by immunization.'
);

NOTE_CONTENT_C['chn-24-hepatitis-c-and-e'] = n(
  'Viral hepatitis subtypes.',
  ['HCV (RNA, Flaviviridae): parenteral, sexual, perinatal; chronic in 70-80%; DAA cure >95%', 'HEV (RNA, Hepeviridae): fecal-oral; waterborne outbreaks; severe in pregnancy (fulminant, 20% mortality)', 'HEV self-limited in non-pregnant; no vaccine in India'],
  'Park 26e',
  'Pregnant woman in 3rd trimester with fulminant hepatitis.',
  'Consider Hepatitis E; admit to ICU, supportive care, watch for coagulopathy and encephalopathy, arrange transfer to tertiary with hepatology.'
);

NOTE_CONTENT_C['chn-25-brucellosis'] = n(
  'Zoonosis from Brucella (melitensis/abortus).',
  ['Unpasteurized milk, contact with infected animals (cattle, goats)', 'Undulant fever, sweats, hepatosplenomegaly, arthralgia', 'Diagnosis: serology (Rose Bengal, standard agglutination test)', 'Treatment: doxycycline + rifampicin x6 wk'],
  'Park 26e',
  'Dairy farmer with recurrent undulant fever and sweats.',
  'Send blood for Brucella serology, start doxycycline + rifampicin, counsel pasteurization.'
);

NOTE_CONTENT_C['chn-26-anthrax'] = n(
  'Bacillus anthracis infection from infected animals/hides.',
  ['Forms: cutaneous (black eschar, malignant pustule), pulmonary (woolsorter — mediastinitis), GI', 'Bioterrorism agent', 'Treatment: ciprofloxacin or doxycycline'],
  'Park 26e',
  'Tannery worker with painless black eschar on forearm.',
  'Isolate, start ciprofloxacin, report to public health authority, culture swab.'
);

NOTE_CONTENT_C['chn-27-trachoma'] = n(
  'Chlamydia trachomatis serotypes A-C; leading cause of infectious blindness.',
  ['Transmission: contact, flies, fomites', 'Stages: follicles → inflammation → scarring → trichiasis → corneal opacity', 'WHO SAFE strategy: Surgery, Antibiotic (azithromycin), Face washing, Environmental', 'India declared trachoma-free 2017'],
  'WHO',
  'Child in endemic region with follicles on tarsal conjunctiva.',
  'Azithromycin 20 mg/kg single dose (max 1 g), face washing, environmental hygiene, notify surveillance.'
);

NOTE_CONTENT_C['chn-28-malaria-species'] = n(
  'Plasmodium species.',
  ['P. vivax: benign tertian (48 h cycle), hypnozoites in liver → relapse', 'P. falciparum: malignant tertian; severe malaria; no hypnozoite', 'P. malariae: quartan (72 h); nephrotic syndrome', 'P. ovale: benign tertian; West Africa; hypnozoites', 'P. knowlesi: zoonotic from macaques; SE Asia', 'Treatment: ACT for Pf; CQ + primaquine x14 d for Pv/Po'],
  'NVBDCP 2023',
  'Traveller from Southeast Asia with P knowlesi+.',
  'Treat as Pf with ACT; severe cases IV artesunate; notify.'
);

NOTE_CONTENT_C['chn-29-types-of-prevention-primary-secondary-tertiary'] = n(
  'Levels of prevention (Leavell-Clark).',
  ['Primordial: prevent risk factor emergence', 'Primary: health promotion + specific protection (vaccines, HI education)', 'Secondary: early diagnosis + prompt treatment (screening)', 'Tertiary: disability limitation + rehabilitation'],
  'Park 26e',
  'Mammography in 50-y-old for breast cancer screening.',
  'Classify as secondary prevention (early diagnosis of asymptomatic disease).'
);

NOTE_CONTENT_C['chn-30-iceberg-phenomenon'] = n(
  'Most disease is below the surface (subclinical/latent).',
  ['Tip: clinical cases visible', 'Submerged: subclinical, carriers, pre-clinical', 'Screening reveals hidden portion', 'Important for: TB, hypertension, diabetes, HIV'],
  'Park 26e',
  'Community hypertension screening detects unknown cases.',
  'Apply iceberg concept — screen asymptomatic population to reveal hidden cases.'
);

NOTE_CONTENT_C['chn-31-maslow-hierarchy-of-needs'] = n(
  'Motivation theory: 5 levels bottom-to-top.',
  ['Physiological (air, food, water, sleep)', 'Safety and security', 'Love and belonging', 'Self-esteem', 'Self-actualization', 'Must meet lower before higher'],
  'Maslow 1943',
  'Post-op patient cannot breathe comfortably and has pain but also anxious about family visit.',
  'Address airway + pain (physiological) first before psychosocial/belonging needs.',
  'Maslow underpins nursing priority-setting.'
);

NOTE_CONTENT_C['chn-32-socio-economic-indicators'] = n(
  'Measures of population wellbeing.',
  ['HDI: life expectancy + education + GNI per capita', 'GDP, per capita income, poverty ratio', 'Literacy rate (male/female)', 'Sex ratio, child sex ratio', 'IMR, MMR, TFR'],
  'HDR 2023',
  'India HDI rank.',
  'Cite India HDI 2022: rank 134/193, value 0.644.'
);

NOTE_CONTENT_C['chn-33-anthropology'] = n(
  'Study of human cultures and biology affecting health.',
  ['Physical anthropology: human biology, evolution', 'Cultural anthropology: customs, beliefs affecting health-seeking behaviour', 'Medical anthropology: culture + illness'],
  'Park 26e',
  'Immunization uptake low in village due to belief.',
  'Apply cultural anthropology; engage community leaders; myth-busting IEC.'
);

NOTE_CONTENT_C['chn-34-hardness-of-water'] = n(
  'Dissolved Ca and Mg salts in water.',
  ['Soft: <75 mg/L CaCO3', 'Moderately hard: 75-150', 'Hard: 150-300', 'Very hard: >300', 'Temporary hardness: bicarbonates, removed by boiling', 'Permanent: sulphates/chlorides, removed by ion-exchange'],
  'Park 26e',
  'Water sample CaCO3 200 mg/L.',
  'Classify as hard; use boiling for temporary or ion-exchange for permanent hardness.'
);

NOTE_CONTENT_C['chn-35-theme-of-world-health-day'] = n(
  'WHO campaign dates.',
  ['World Health Day: 7 April', '2024 theme: My Health, My Right', '2023: Health for All', '2025: Healthy beginnings, hopeful futures (maternal-newborn)'],
  'WHO',
  'Item asking 2024 WHD theme.',
  'My Health, My Right.'
);

NOTE_CONTENT_C['chn-36-chlorination'] = n(
  'Water disinfection using chlorine compounds.',
  ['Residual chlorine 0.5 mg/L after 1 h contact = potable (free chlorine)', 'Bleaching powder: 33% available chlorine', 'Superchlorination + dechlorination (sodium thiosulphate)', 'Breakpoint chlorination: oxidize all ammonia/organic matter before free residual'],
  'Park 26e',
  'After chlorinating well, residual 0.6 mg/L at 1 h.',
  'Declare safe for drinking; chlorinate weekly.'
);

NOTE_CONTENT_C['chn-37-air-pollution-indices'] = n(
  'AQI and classical smoke/SPM indices.',
  ['AQI India: 0-50 good, 51-100 satisfactory, 101-200 moderate, 201-300 poor, 301-400 very poor, 401-500 severe', 'Major pollutants: PM2.5, PM10, NO2, SO2, CO, O3, NH3, Pb', 'WHO guideline PM2.5: 5 μg/m3 annual'],
  'CPCB India',
  'AQI 350 in Delhi winter.',
  'Very poor — limit outdoor activity, advise masks (N95), keep windows closed, asthma/COPD patients extra precautions.'
);

NOTE_CONTENT_C['chn-38-no-tobacco-day'] = n(
  'WHO observance to draw attention to tobacco harms.',
  ['31 May annually', 'COTPA 2003 India: ban smoking in public places, advertising ban, pictorial warnings 85%', 'Tobacco kills >8 million/y globally'],
  'WHO',
  'Item on observance date.',
  '31 May — WHO World No Tobacco Day.'
);

NOTE_CONTENT_C['chn-39-occupational-hazards'] = n(
  'Workplace-related diseases.',
  ['Physical: noise (NIHL), heat, radiation', 'Chemical: lead (plumbism), mercury, benzene, asbestos (mesothelioma)', 'Biological: TB, hepatitis, COVID', 'Ergonomic: back pain', 'Psychosocial: burnout'],
  'Park 26e',
  'Sandblaster with dyspnea and eggshell calcification on CXR.',
  'Silicosis — remove from exposure, BCG vaccination, screen for TB, notify ESIC.'
);

NOTE_CONTENT_C['chn-40-anganwadi-worker-roles'] = n(
  'AWW — ICDS field functionary.',
  ['Runs Anganwadi Centre (AWC) for 400-1500 population', 'Services: supplementary nutrition, pre-school education, growth monitoring, immunization days, health referral', 'Honorarium monthly (state-variable)'],
  'ICDS',
  'AWW identifies SAM child.',
  'Refer to NRC, start supplementary nutrition, engage mother, weekly weight monitoring, ensure immunization catch-up.'
);

NOTE_CONTENT_C['chn-41-asha-worker-roles'] = n(
  'Accredited Social Health Activist — NRHM frontline worker.',
  ['1 per 1000 rural population', 'Functions: IEC, immunization escort, JSY registration, home-based newborn care, DOTS provider, IFA distribution', 'Performance-based incentives via Nikshay/JSY', 'HBNC: 6 visits in first 42 d after delivery'],
  'NHM ASHA scheme 2005',
  'ASHA home visit on day 1 postpartum.',
  'Check mother + baby, temperature, breastfeeding, lochia, danger signs; record in HBNC register.'
);

NOTE_CONTENT_C['chn-42-chc-population-coverage'] = n(
  'Community Health Centre under IPHS.',
  ['1 CHC per 80,000 plains / 30,000 hilly population', '30-bed with 4 specialists (MD, Surgeon, Gynae, Paed)', 'Services: Emergency, OPD, surgery, obstetrics, inpatient', 'First referral unit (FRU)'],
  'IPHS 2022',
  'Item on population coverage.',
  '80,000 plains, 30,000 hilly/tribal per CHC.'
);

NOTE_CONTENT_C['chn-43-phc-population-coverage'] = n(
  'Primary Health Centre — IPHS norms.',
  ['1 PHC per 30,000 plains / 20,000 hilly', '6-bed; 1 medical officer + staff', 'Services: OPD, labor room, immunization, basic lab', '24x7 PHC expanded'],
  'IPHS 2022',
  'Item on PHC population.',
  '30,000 plains, 20,000 hilly/tribal per PHC.'
);

NOTE_CONTENT_C['chn-44-rashtriya-swasthya-bima-yojana-rsby'] = n(
  'Health insurance launched 2008 for BPL workers (superseded by PMJAY 2018).',
  ['RSBY coverage 30,000 INR/family; cashless at empanelled hospitals', 'PMJAY (Ayushman Bharat 2018): 5 lakh/family/year for 50 crore people', 'Eligibility: SECC 2011 data'],
  'MoHFW',
  'Item on PMJAY coverage.',
  '5 lakh INR per family per year for empanelled secondary/tertiary hospitalization.'
);

NOTE_CONTENT_C['chn-45-mch-program'] = n(
  'Maternal and Child Health programme.',
  ['Components: ANC, intrapartum care, PNC, newborn care, immunization, nutrition, FP', 'Integrated into RCH-II and NHM', 'Indicators: MMR (India 97/100k NFHS-5), IMR (27/1000)'],
  'MoHFW',
  'Item on MMR definition.',
  'Deaths of women from pregnancy/childbirth-related causes per 100,000 live births.'
);

NOTE_CONTENT_C['chn-46-janani-shishu-suraksha-karyakram-jssk'] = n(
  'JSSK 2011 free entitlements for pregnant women and sick neonates.',
  ['Pregnant women: free delivery (including CS), drugs, diet, blood, transport', 'Sick newborns (<1 y): free treatment and transport', 'No user fees at public facilities'],
  'MoHFW JSSK',
  'Item on JSSK entitlements.',
  'Free delivery, drugs, diet, diagnostics, blood, transport for mother and sick newborn.'
);

// ============ ENT (9 topics) ============
NOTE_CONTENT_C['ent-1-presbycusis'] = n(
  'Age-related sensorineural hearing loss.',
  ['Bilateral, symmetrical, high-frequency first', 'Impaired speech discrimination especially in noise', 'Audiogram: sloping high-frequency loss', 'Treatment: hearing aids, cochlear implant if severe', 'Counsel communication strategies'],
  'Dhingra ENT 8e',
  '72-y-old with progressive hearing loss worse in crowded rooms.',
  'Refer for pure-tone audiometry, hearing-aid assessment; counsel face-to-face communication, reduced background noise.'
);

NOTE_CONTENT_C['ent-2-otoscope-examination'] = n(
  'Ear canal and tympanic membrane inspection.',
  ['Pull pinna up-back (adult), down-back (child <3 y)', 'Normal TM: pearly-grey, cone of light anteroinferior (5 o\'clock right, 7 o\'clock left)', 'AOM: red bulging TM; OME: retracted dull TM, fluid level', 'Pneumatic otoscopy: mobility assessment'],
  'Dhingra 8e',
  'Toddler with ear pain.',
  'Pull pinna down-back for straightening canal, examine for red bulging TM, assess mobility with pneumatic otoscopy.'
);

NOTE_CONTENT_C['ent-3-laryngoscope'] = n(
  'Visualization of larynx.',
  ['Indirect: mirror via oropharynx', 'Direct rigid: OT', 'Flexible fibreoptic: nasal route awake', 'Videolaryngoscope: intubation especially difficult airway', 'Blade types: Macintosh (curved), Miller (straight) — Miller for infants'],
  'Dhingra 8e',
  'Infant requiring intubation.',
  'Use Miller 0 or 1 straight blade to lift epiglottis, visualize cords, 3.5-4.0 uncuffed ETT.'
);

NOTE_CONTENT_C['ent-4-acute-epiglottitis'] = n(
  'H. influenzae type B (Hib) supraglottitis — pediatric emergency.',
  ['4 Ds: Drooling, Dysphagia, Dysphonia, Distress', 'Tripod posture, muffled hot-potato voice, stridor', 'Lateral neck X-ray: thumb sign', 'Do NOT examine throat (laryngospasm risk); avoid distressing child', 'Airway: OT intubation by anesthetist, IV ceftriaxone'],
  'Dhingra 8e',
  '4-y-old unimmunized, drooling, tripod, stridor, fever 39.',
  'Do NOT examine throat or put in supine; summon anesthetist for OT controlled intubation, IV ceftriaxone, keep child in mother\'s lap until intubated.',
  'Hib vaccine has dramatically reduced incidence.'
);

NOTE_CONTENT_C['ent-5-meniere-disease'] = n(
  'Endolymphatic hydrops — idiopathic.',
  ['Triad: vertigo + sensorineural hearing loss + tinnitus', 'Attacks last minutes to hours', 'Low-frequency hearing loss early', 'Treatment: low-salt diet, diuretics (hydrochlorothiazide), betahistine, intratympanic gentamicin for refractory'],
  'Dhingra 8e',
  '45-y-old with episodic vertigo, tinnitus, low-frequency hearing loss.',
  'Low-salt diet (<2 g/d), betahistine 16 mg TDS, prochlorperazine for acute attack, refer for audiometry.'
);

NOTE_CONTENT_C['ent-6-epistaxis-management'] = n(
  'Nose bleed from anterior (Little area, Kiesselbach plexus, 90%) or posterior (sphenopalatine artery).',
  ['First aid: lean forward, pinch cartilaginous nose 10-15 min, ice pack on bridge', 'Anterior: silver nitrate cautery, anterior nasal pack', 'Posterior: balloon (Foley) or posterior gauze pack + admit', 'Systemic: correct coagulopathy, transfuse if severe', 'Identify and treat underlying (HTN, coagulopathy)'],
  'Dhingra 8e',
  'Adult with active anterior nose bleed.',
  'Sit upright leaning forward, pinch cartilaginous nose 10-15 min, ice on bridge; if persists, anterior pack with silver nitrate after vasoconstrictor (oxymetazoline).',
  'Do NOT lean head back — aspiration risk.'
);

NOTE_CONTENT_C['ent-7-tinnitus'] = n(
  'Perception of sound without external stimulus.',
  ['Subjective (common) vs objective (vascular)', 'Causes: noise exposure, presbycusis, Meniere, drugs (aminoglycosides, loop diuretics, aspirin, quinine), acoustic neuroma', 'Treatment: masking, tinnitus retraining therapy, CBT; treat underlying'],
  'Dhingra 8e',
  'Patient on furosemide with new tinnitus.',
  'Review dose (furosemide ototoxicity especially IV bolus), slow infusion, audiology referral.'
);

NOTE_CONTENT_C['ent-8-profound-hearing-loss'] = n(
  'Hearing threshold >90 dB HL.',
  ['Classification: mild 26-40, moderate 41-55, mod-severe 56-70, severe 71-90, profound >90 dB', 'Causes: genetic (Connexin 26), TORCH, ototoxicity, trauma, noise', 'Rehabilitation: cochlear implant, sign language, lip reading'],
  'Dhingra 8e',
  '1-y-old failed OAE screen twice.',
  'Refer for BERA; if profound SNHL, evaluate for cochlear implantation (best outcome before 3 y).'
);

NOTE_CONTENT_C['ent-9-rinne-and-weber-tests'] = n(
  'Tuning-fork tests 512 Hz for hearing loss differentiation.',
  ['Rinne: AC vs BC at mastoid; normal AC>BC (positive)', 'Conductive loss: BC>AC (negative Rinne) on affected side', 'SN loss: AC>BC but reduced overall (positive Rinne but soft)', 'Weber: vibrating fork midline forehead', 'Conductive loss lateralizes to affected ear; SN loss lateralizes to normal ear'],
  'Dhingra 8e',
  'Weber lateralizes right, Rinne negative right (BC>AC).',
  'Interpret: right conductive hearing loss; ENT referral, otoscopy, audiometry.'
);

// Remainder (Medicine 111) in next chunk.
