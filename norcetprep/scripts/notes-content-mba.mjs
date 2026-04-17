// Microbiology (39) + Biochemistry (21) + Anatomy (77). Compact notes.
import { n } from './notes-helper.mjs';
export const NOTE_CONTENT_MBA = {};
const X = NOTE_CONTENT_MBA;

// ============ MICROBIOLOGY (39) ============
X['micro-1-methods-of-sterilization'] = n(
  'Complete destruction of all microbes including spores.',
  ['Physical: autoclave (121°C, 15 psi, 15-20 min — steam under pressure; commonest hospital method), dry heat (hot air oven 160°C/2 h), boiling (disinfection only), radiation (gamma for single-use), filtration (HEPA 0.22 μm)', 'Chemical: ethylene oxide (heat-sensitive), glutaraldehyde (high-level disinfection), hydrogen peroxide plasma', 'Disinfection vs sterilization vs antisepsis'],
  'Ananthanarayan',
  'Nurse prepares instruments for OT use.',
  'Load autoclave correctly (loosely packed, indicators), confirm 121°C/15 psi/15-20 min, check chemical and biological indicators (Bacillus stearothermophilus), document cycle.'
);
X['micro-2-viral-families-classification'] = n(
  'By genome and envelope.',
  ['DNA: Herpes, Pox, Adeno, Papilloma, Parvo, Hepadna (HBV)', 'RNA: Picorna (polio, hep A), Retro (HIV), Orthomyxo (flu), Paramyxo (measles, mumps), Rhabdo (rabies), Flavi (dengue, yellow fever, hep C), Filo (Ebola), Corona, Toga (rubella)', 'Enveloped vs non-enveloped (enveloped more susceptible to disinfection)'],
  'Ananthanarayan',
  'Item on enveloped RNA virus.',
  'Examples: HIV, influenza, measles, RSV, rabies, hepatitis C, corona.'
);
X['micro-3-hepatitis-viruses'] = n(
  'A-E differentiation.',
  ['A (HAV): RNA picornavirus, fecal-oral, self-limited, vaccine', 'B (HBV): DNA hepadna, blood/sex/vertical, chronic risk, vaccine (birth + 6/10/14 wk)', 'C (HCV): RNA flavi, blood, chronic, DAAs curative', 'D (HDV): defective, requires HBV', 'E (HEV): RNA hepe, fecal-oral, pregnancy high mortality'],
  'CDC',
  'Pregnant woman with acute hepatitis and jaundice.',
  'Suspect hepatitis E (high fetal/maternal mortality); supportive care, monitor PT/INR, isolate, deliver per obstetric plan.'
);
X['micro-4-epstein-barr-virus'] = n(
  'Herpesvirus causing infectious mononucleosis.',
  ['Spread: saliva ("kissing disease")', 'Symptoms: fever, exudative pharyngitis, lymphadenopathy, splenomegaly, atypical lymphocytes', 'Monospot (heterophile) antibody', 'Complications: splenic rupture (avoid contact sports 4 wk), Burkitt lymphoma, nasopharyngeal ca'],
  'Harrison',
  'Teen with sore throat, fever, huge cervical nodes, splenomegaly, monospot positive.',
  'Supportive — rest, hydration, analgesia (avoid ampicillin — rash), avoid contact sports 3-4 wk, ENT review.'
);
X['micro-5-mumps'] = n(
  'Paramyxovirus causing parotitis.',
  ['Transmission: respiratory droplet', 'Incubation 16-18 d', 'Complications: orchitis (post-puberty), meningitis, pancreatitis, deafness', 'MMR vaccine protective'],
  'MoHFW',
  'Teen with bilateral parotid swelling and fever.',
  'Isolate droplet precautions 5 d post-swelling, analgesia, cold/warm compress, hydration, observe for complications (orchitis, meningitis).'
);
X['micro-6-hiv-virus-structure'] = n(
  'RNA retrovirus; CD4 T-cell tropism.',
  ['Envelope: gp120, gp41', 'Core: p24 capsid, RNA, reverse transcriptase, integrase, protease', '2 types: HIV-1 (worldwide), HIV-2 (West Africa)', 'Targets CD4 + CCR5/CXCR4 co-receptor'],
  'NACO',
  'Item on HIV diagnostic antigen.',
  'p24 antigen (detectable earliest with RNA PCR), confirm with ELISA/Western blot; initiate ART per NACO guideline.'
);
X['micro-7-hpv'] = n(
  'Human papillomavirus DNA — cervical cancer.',
  ['High-risk: 16, 18 (70% cervical ca), 31, 33, 45', 'Low-risk: 6, 11 (warts)', 'Vaccine: quadrivalent (6/11/16/18) and 9-valent', 'Target age 9-14 y; 2-dose if <15 y', 'Screening: Pap smear, HPV DNA'],
  'WHO',
  '11-y-old girl due for HPV vaccine.',
  'HPV vaccine 2-dose schedule 0 and 6 mo (<15 y), educate about cervical cancer prevention.'
);
X['micro-8-rotavirus'] = n(
  'Major cause of pediatric severe diarrhea.',
  ['Transmission: fecal-oral', 'Watery diarrhea + vomiting in <5 y', 'Vaccine: oral rota vaccine (6, 10, 14 wk) in UIP', 'Prevention: hand hygiene, safe water, exclusive BF'],
  'MoHFW',
  '8-mo-old with severe watery diarrhea and dehydration.',
  'Assess dehydration, ORS/IV per Plan A/B/C, zinc, continue breastfeeding, ensure vaccine up to date, droplet precautions.'
);
X['micro-9-motility-tests'] = n(
  'Assessment of bacterial movement.',
  ['Hanging drop', 'Semisolid agar stab', 'Darkfield microscopy for spirochetes', 'Flagella specific: polar (Pseudomonas), lophotrichous, peritrichous (E coli)', 'Non-motile: Klebsiella, Shigella, Corynebacterium'],
  'Ananthanarayan',
  'Item on motility.',
  'Cite hanging drop or semisolid agar.'
);
X['micro-10-acid-fast-stain'] = n(
  'Ziehl-Neelsen stain for mycobacteria.',
  ['Carbol fuchsin + heat, decolorize with acid-alcohol, counterstain methylene blue', 'Acid-fast bacilli (AFB) appear red on blue background', 'MTB, M leprae, Nocardia, Cryptosporidium (modified)'],
  'Ananthanarayan',
  'Sputum for AFB.',
  '3 early morning samples, ZN stain, culture if positive, GeneXpert for rapid MTB/rifampicin resistance.'
);
X['micro-11-tyndallization'] = n(
  'Fractional sterilization by intermittent steaming.',
  ['100°C x 30 min on 3 consecutive days', 'Allows spores to germinate then kills them', 'Used for heat-labile materials (e.g. media with sugar)'],
  'Ananthanarayan',
  'Item on intermittent sterilization.',
  'Recall as Tyndallization.'
);
X['micro-12-rod-shaped-bacteria'] = n(
  'Bacillus morphology.',
  ['Gram+: Bacillus, Clostridium, Listeria, Corynebacterium, Mycobacterium (acid-fast)', 'Gram-: E coli, Klebsiella, Salmonella, Shigella, Proteus, Pseudomonas, Vibrio (curved), Helicobacter (spiral)', 'Coccobacilli: Haemophilus, Brucella, Bordetella'],
  'Ananthanarayan',
  'Item on Gram+ rod.',
  'Bacillus, Clostridium, Listeria, Corynebacterium.'
);
X['micro-13-gram-positive-organisms'] = n(
  'Thick peptidoglycan, stain purple.',
  ['Cocci: Staphylococcus, Streptococcus, Enterococcus', 'Rods: Bacillus, Clostridium, Listeria, Corynebacterium', 'Acid-fast: Mycobacterium', 'Exotoxin production common'],
  'Ananthanarayan',
  'Item on Gram-positive cocci pairs/clusters.',
  'Staphylococcus in clusters; Streptococcus in chains.'
);
X['micro-14-heterotrophs-vs-autotrophs'] = n(
  'Carbon source basis.',
  ['Autotrophs: CO2 as C source (photo- or chemo-)', 'Heterotrophs: organic compounds as C source', 'Most pathogenic bacteria are heterotrophs'],
  'Madigan',
  'Item on carbon source.',
  'Recognize heterotroph usage.'
);
X['micro-15-endotoxin-vs-exotoxin'] = n(
  'Bacterial toxin types.',
  ['Endotoxin: LPS cell wall of Gram-, heat stable, low potency, non-specific (fever, shock), no vaccine', 'Exotoxin: secreted protein, heat labile, high potency, specific effect (tetanus, diphtheria, botulinum), toxoid vaccines'],
  'Ananthanarayan',
  'Item on heat-stable LPS.',
  'Cite endotoxin (Gram-negative lipopolysaccharide).'
);
X['micro-16-bacterial-growth-curve'] = n(
  'Four phases.',
  ['Lag: adaptation', 'Log (exponential): rapid division', 'Stationary: nutrient limitation, spore formation', 'Decline/death'],
  'Madigan',
  'Item on antibiotic action phase.',
  'Most antibiotics most effective on log phase.'
);
X['micro-17-neisseria-gonorrhoeae'] = n(
  'Gram-negative diplococcus causing gonorrhea.',
  ['Intracellular in neutrophils', 'Cervicitis, urethritis, PID, septic arthritis, ophthalmia neonatorum', 'Treatment: ceftriaxone 500 mg IM + azithromycin (or doxycycline)', 'Prevent ophthalmia: erythromycin 0.5% eye ointment at birth'],
  'WHO 2021',
  'Male with purulent urethral discharge.',
  'Single IM ceftriaxone 500 mg + oral azithromycin 1 g stat, partner notification, test for other STIs (syphilis, HIV).'
);
X['micro-18-salmonella-typhi'] = n(
  'Gram-negative rod causing typhoid.',
  ['Transmission: fecal-oral via contaminated food/water', 'Incubation 7-14 d', 'Features: step-ladder fever, relative bradycardia, rose spots, hepatosplenomegaly, constipation then diarrhea', 'Diagnosis: blood culture (1st wk), stool/urine (2nd-3rd wk), Widal (less specific)', 'Treatment: ceftriaxone or azithromycin'],
  'Harrison',
  '15-y-old with 10 d of fever, relative bradycardia, rose spots.',
  'Blood culture x2 before antibiotic, start IV ceftriaxone 2 g OD, maintain hydration, monitor for complications (perforation, hemorrhage).'
);
X['micro-19-borrelia'] = n(
  'Spirochete.',
  ['B burgdorferi: Lyme disease (erythema migrans, arthritis, neuro, cardio)', 'B recurrentis: relapsing fever (louse-borne)', 'Diagnosis: ELISA + Western blot (Lyme); giemsa (relapsing)', 'Treatment: doxycycline'],
  'CDC',
  'Hiker with expanding bulls-eye rash and fever.',
  'Erythema migrans of Lyme — doxycycline 100 mg BD x14-21 d (<8 y amox), educate tick removal.'
);
X['micro-20-treponema-pallidum'] = n(
  'Spirochete causing syphilis.',
  ['Primary: painless chancre (3-90 d)', 'Secondary: maculopapular rash including palms/soles, condyloma lata (6 wk-6 mo)', 'Latent', 'Tertiary: gummas, cardiovascular, neurosyphilis (years)', 'Diagnosis: darkfield, RPR/VDRL (non-treponemal), FTA-ABS/TPHA (treponemal)', 'Treatment: benzathine penicillin G'],
  'WHO',
  'Pregnant with positive VDRL.',
  'Benzathine penicillin G 2.4 million U IM stat (early), 3 doses 1 wk apart (late/unknown); desensitize if allergy; partner treat; HIV screen.'
);
X['micro-21-vibrio-cholerae'] = n(
  'Comma-shaped Gram-negative, cholera toxin causing rice-water stool.',
  ['Transmission: contaminated water', 'Treatment: aggressive rehydration (ORS Plan A/B/C or IV RL), doxycycline shortens illness', 'Vaccine: Shanchol oral killed for outbreak'],
  'WHO',
  'Outbreak with profuse rice-water diarrhea.',
  'Isolate, aggressive IV Ringer Lactate, ORS, doxycycline 300 mg single dose adult, chlorination of water, notify public health.'
);
X['micro-22-food-poisoning'] = n(
  'Bacterial causes by onset.',
  ['Preformed toxin (1-6 h): S aureus, B cereus emetic', 'Onset 8-16 h: C perfringens, B cereus diarrheal', 'Onset 12-72 h: Salmonella, Shigella, E coli, Campylobacter', 'Botulism (12-36 h): flaccid paralysis from C botulinum'],
  'CDC',
  'Family develops vomiting 3 h after mayonnaise salad.',
  'Suspect Staph aureus preformed toxin — supportive, hydration, antiemetic, no antibiotic usually needed.'
);
X['micro-23-streptococcus'] = n(
  'Gram+ cocci in chains.',
  ['Beta-hemolytic: Group A (pyogenes, rheumatic fever, PSGN, scarlet fever, pharyngitis, impetigo)', 'Group B (agalactiae, neonatal sepsis, screen in pregnancy)', 'Alpha-hemolytic: S pneumoniae (pneumonia, meningitis), viridans (endocarditis)', 'Treatment: penicillin first-line'],
  'Harrison',
  'Child with strep throat.',
  'Oral amoxicillin 50 mg/kg/d x10 d to prevent rheumatic fever, analgesia, hydration.'
);
X['micro-24-clostridium-perfringens'] = n(
  'Gas gangrene (clostridial myonecrosis).',
  ['Anaerobic Gram+ rod with spores', 'Wound with dirt, crepitus, rapid progression, hemolysis', 'Treatment: surgical debridement, IV penicillin + clindamycin, HBO2 adjunct'],
  'IDSA',
  'Trauma patient with crepitus and rapid necrosis around wound.',
  'Emergent surgical debridement, IV penicillin G 4 MU q4 h + clindamycin, HBO2 if available, supportive care.'
);
X['micro-25-clostridium-tetani'] = n(
  'Neurotoxin tetanospasmin blocks GABA release.',
  ['Classical: trismus, risus sardonicus, opisthotonus, autonomic instability', 'Neonatal: from umbilical stump', 'Prevention: tetanus toxoid (Td/Tdap booster)', 'Treatment: HTIG, metronidazole, wound debridement, benzo for spasm'],
  'WHO',
  'Farmer with deep puncture wound, unvaccinated 10 y.',
  'Clean debride, HTIG 250 U IM + Td vaccine, metronidazole 500 mg IV, tetanus prevention education.'
);
X['micro-26-escherichia-coli'] = n(
  'Gram- rod; commensal and pathogenic strains.',
  ['ETEC: traveller diarrhea', 'EHEC (O157:H7): HUS', 'EIEC: dysentery', 'EPEC: infantile diarrhea', 'UPEC: UTI', 'Neonatal meningitis'],
  'CDC',
  'Child with bloody diarrhea, hemolytic anemia, thrombocytopenia, renal failure.',
  'Suspect EHEC HUS — supportive (no antibiotic; risk of toxin release), hydrate, dialysis if needed, do not give anti-motility agents.'
);
X['micro-27-mycoplasma'] = n(
  'Smallest free-living bacteria; no cell wall.',
  ['M pneumoniae: atypical pneumonia, walking pneumonia, bullous myringitis, cold agglutinins', 'Beta-lactams ineffective — use macrolide, doxycycline, fluoroquinolone'],
  'IDSA',
  'College student with dry cough, fever, bullous myringitis.',
  'Azithromycin 500 mg day 1 then 250 mg x4 d or doxycycline 100 mg BD; educate about prolonged cough.'
);
X['micro-28-entamoeba-histolytica'] = n(
  'Protozoa causing amoebic dysentery and liver abscess.',
  ['Cyst ingestion fecal-oral', 'Trophozoite invades colon — flask-shaped ulcer', 'Liver abscess: anchovy-sauce pus in right lobe', 'Treatment: metronidazole + luminal agent (diloxanide/paromomycin)'],
  'WHO',
  'Traveler with right upper quadrant pain and liver abscess.',
  'Metronidazole 750 mg TDS x10 d + luminal agent, drainage only if imminent rupture, avoid alcohol.'
);
X['micro-29-schick-lepromin-frei-dick-widal-tests'] = n(
  'Classical tests.',
  ['Schick: diphtheria immunity (skin test)', 'Lepromin: leprosy type (tuberculoid vs lepromatous)', 'Frei: LGV (now obsolete)', 'Dick: scarlet fever (streptococcal toxin)', 'Widal: typhoid (O and H antibodies)'],
  'Ananthanarayan',
  'Item on test matching.',
  'Memorize the table.'
);
X['micro-30-aspergillus'] = n(
  'Ubiquitous mold.',
  ['A fumigatus commonest', 'Allergic bronchopulmonary aspergillosis (ABPA)', 'Aspergilloma (fungus ball)', 'Invasive aspergillosis in neutropenic', 'Treatment: voriconazole, isavuconazole, liposomal amphotericin'],
  'IDSA',
  'Neutropenic post-transplant with fever and lung infiltrate with halo sign.',
  'Voriconazole IV (or isavuconazole), serum galactomannan, HEPA-filtered room, reverse neutropenia.'
);
X['micro-31-immunity-definition'] = n(
  'Ability to resist infection.',
  ['Innate: present at birth (skin, mucus, complement, NK)', 'Adaptive: acquired, specific (B and T cells, antibodies)', 'Active vs passive', 'Natural vs artificial'],
  'Kuby',
  'Item on innate vs adaptive.',
  'Distinguish non-specific innate from specific adaptive.'
);
X['micro-32-active-immunity'] = n(
  'Body produces own antibodies.',
  ['Natural active: post-infection (measles)', 'Artificial active: vaccination (BCG, MMR)', 'Long-lasting', 'Onset takes days-weeks'],
  'WHO',
  'Post-measles immunity.',
  'Natural active immunity — long-lasting, book UIP record.'
);
X['micro-33-passive-immunity'] = n(
  'Pre-formed antibodies given.',
  ['Natural passive: transplacental IgG, breast milk IgA', 'Artificial passive: immunoglobulin (HBIg, VZIg, rabies IG, anti-tetanus)', 'Immediate but short-lived (weeks)'],
  'WHO',
  'Neonate of HBsAg+ mother.',
  'HBIg within 12 h of birth + Hep B vaccine birth dose, complete Hep B schedule.'
);
X['micro-34-herd-immunity'] = n(
  'Indirect protection when vaccination coverage is high.',
  ['Threshold varies: measles 95%, polio 80-85%, pertussis 92%', 'Protects unvaccinated (infants, immunocompromised)', 'R0 and 1-1/R0 = threshold'],
  'WHO',
  'Measles outbreak in community with 80% coverage.',
  'Campaign to achieve >=95%, targeted catch-up immunization, trace index cases, isolate, vitamin A.'
);
X['micro-35-innate-immunity'] = n(
  'Non-specific first-line defense.',
  ['Physical: skin, mucosa, cilia', 'Chemical: stomach acid, lysozyme', 'Cellular: phagocytes (neutrophils, macrophages), NK cells', 'Humoral: complement, acute phase proteins', 'No memory'],
  'Kuby',
  'Item on first-line defense.',
  'Cite skin and mucosal barriers.'
);
X['micro-36-artificial-immunity'] = n(
  'Induced by medical intervention. See 32-33.',
  ['Artificial active: vaccine', 'Artificial passive: immunoglobulin'],
  'WHO',
  'Rabies post-exposure.',
  'Equine/human anti-rabies immunoglobulin (passive) + rabies vaccine (active) — Essen schedule.'
);
X['micro-37-hypersensitivity-reactions'] = n(
  'Gell and Coombs.',
  ['Type I: IgE immediate (anaphylaxis, atopy, allergic asthma)', 'Type II: antibody-mediated cytotoxic (hemolytic anemia, Goodpasture)', 'Type III: immune complex (SLE, PSGN, serum sickness)', 'Type IV: delayed cell-mediated (contact dermatitis, TB Mantoux)'],
  'Kuby',
  'Mantoux reading at 48 h with 15 mm induration.',
  'Type IV delayed hypersensitivity — interpret per immune status (>=10 mm positive for most).'
);
X['micro-38-immunoglobulin-classes'] = n(
  'Antibody isotypes.',
  ['IgG: 75%, crosses placenta, secondary response', 'IgM: primary response, pentamer, largest', 'IgA: secretions, mucosal (saliva, tears, breast milk)', 'IgE: allergy, parasites', 'IgD: B cell receptor'],
  'Kuby',
  'Item on breast milk antibody.',
  'Secretory IgA in breast milk (colostrum esp rich).'
);
X['micro-39-cell-mediated-immunity'] = n(
  'T cell-based immunity.',
  ['CD4 helper T cells: coordinate via cytokines', 'CD8 cytotoxic T: kill infected/cancer cells', 'TB, viral, fungal, intracellular bacteria', 'Delayed hypersensitivity'],
  'Kuby',
  'HIV patient susceptible to TB and Pneumocystis.',
  'Cell-mediated immunity impaired — prophylaxis (isoniazid, cotrimoxazole), ART initiation, monitor CD4.'
);

// ============ BIOCHEMISTRY (21) ============
X['biochem-1-vitamin-deficiency-and-excess'] = n(
  'Fat-soluble (ADEK) and water-soluble (B, C).',
  ['A: night blindness, xerophthalmia, Bitot spots; excess — pseudotumor cerebri, teratogen', 'D: rickets/osteomalacia; excess — hypercalcemia', 'E: hemolytic anemia neonates', 'K: bleeding, neonatal HDN; excess — hemolysis in G6PD', 'B1 thiamine: beri-beri, Wernicke', 'B2 riboflavin: angular stomatitis, cheilitis', 'B3 niacin: pellagra (3 Ds)', 'B6 pyridoxine: peripheral neuropathy (INH)', 'B9 folate: megaloblastic, NTD', 'B12: pernicious anemia, SACD', 'C: scurvy'],
  'Harrison',
  'Chronic alcoholic with confusion, ataxia, ophthalmoplegia.',
  'Thiamine (B1) 500 mg IV TDS x3 d to treat Wernicke before glucose.'
);
X['biochem-2-minerals'] = n(
  'Essential minerals.',
  ['Ca: bone, clotting, muscle; deficiency — tetany, rickets; food — dairy, green leafy, fish', 'Fe: Hb; IDA — microcytic', 'Iodine: thyroxine; goiter/cretinism', 'Zn: growth, wound healing; deficiency — growth retardation', 'Mg: cofactor many enzymes; hypomag — tetany, arrhythmia', 'Fluoride: teeth; excess — fluorosis', 'Selenium: antioxidant'],
  'ICMR',
  'Child from goiter belt with neck swelling.',
  'Check thyroid function, iodized salt education, national iodine deficiency disorder program.'
);
X['biochem-3-food-related-diseases'] = n(
  'Nutritional deficiencies.',
  ['Beri-beri: B1 deficiency (polished rice)', 'Pellagra: B3 (maize diet)', 'Scurvy: C', 'Kwashiorkor: protein', 'Marasmus: calorie', 'Goiter: iodine', 'Rickets: vit D', 'Pernicious anemia: B12'],
  'ICMR',
  'Maize-only diet with dermatitis, diarrhea, dementia.',
  'Pellagra — niacin (B3) supplementation, varied diet, treat dermatitis.'
);
X['biochem-4-major-anions-and-cations'] = n(
  'Body fluids.',
  ['ECF cations: Na+ (135-145), K+ (3.5-5), Ca++, Mg++', 'ECF anions: Cl- (98-106), HCO3- (22-26), proteins, phosphate', 'ICF: K+ major cation, phosphate, protein', 'Anion gap = Na - (Cl + HCO3); normal 8-12'],
  'Harrison',
  'Elevated anion gap 22 in septic patient.',
  'MUDPILES differential — lactic acidosis commonest in sepsis, check lactate, resuscitate, address source.'
);
X['biochem-5-caloric-requirements-by-age'] = n(
  'RDA per ICMR.',
  ['0-6 mo: 550 kcal/d (breast milk)', '6-12 mo: 670', '1-3 y: 1010', '4-6 y: 1360', '7-10 y: 1700', 'Adolescent M: 2750', 'Adult M sedentary: 2320, F: 1900', 'Pregnancy +350, lactation +600 first 6 mo'],
  'ICMR 2020',
  'Pregnant 3rd trimester dietary counseling.',
  '+350 kcal above pre-pregnancy requirement, 23 g additional protein, iron/folate/calcium supplementation.'
);
X['biochem-6-urine-specific-gravity'] = n(
  'Measure of solute concentration.',
  ['Normal: 1.003-1.030', 'Concentrated (high): dehydration, SIADH, proteinuria, glycosuria', 'Dilute (low): overhydration, diabetes insipidus, CKD'],
  'Harrison',
  'Polyuria patient with SG 1.001.',
  'Dilute urine — suspect DI; water deprivation test + desmopressin challenge.'
);
X['biochem-7-ketone-bodies'] = n(
  'Lipolysis products.',
  ['Acetoacetate, beta-hydroxybutyrate, acetone (breath)', 'Produced in liver when glucose low (fasting, DM, starvation)', 'DKA: ketonuria + hyperglycemia + acidosis', 'Measured by urine dipstick (misses BHB) or serum BHB'],
  'ADA',
  'T1DM with fruity breath and glucose 500.',
  'Suspect DKA — ABG, serum BHB, electrolytes, IV fluids, insulin infusion, K+ replacement.'
);
X['biochem-8-omega-3-pufa'] = n(
  'Polyunsaturated fatty acid.',
  ['Sources: fish oil, flaxseed, walnut', 'EPA and DHA', 'Cardioprotective, reduce TG', 'DHA for brain and retinal development'],
  'AHA',
  'CV risk patient asks about supplements.',
  'Mediterranean diet + fatty fish 2x/wk; omega-3 supplement 1 g/d for secondary prevention in some patients.'
);
X['biochem-9-triglyceride-transport'] = n(
  'Dietary lipid transport.',
  ['Chylomicrons: dietary TG from gut', 'VLDL: endogenous TG from liver', 'LDL: cholesterol delivery', 'HDL: reverse cholesterol transport'],
  'Harrison',
  'Item on endogenous TG carrier.',
  'VLDL.'
);
X['biochem-10-prokaryotic-vs-eukaryotic'] = n(
  'Cell types.',
  ['Prokaryote: no nucleus, 70S ribosome, single circular DNA, bacteria/archaea', 'Eukaryote: nucleus, 80S ribosome, membrane organelles, animals/plants/fungi/protists'],
  'Alberts',
  'Item on prokaryote.',
  'Bacteria have no nucleus.'
);
X['biochem-11-sequence-of-mitosis'] = n(
  'Somatic cell division.',
  ['Prophase: chromatin condenses, centrioles separate, NE dissolves', 'Metaphase: chromosomes align on equator', 'Anaphase: sister chromatids separate', 'Telophase: 2 daughter nuclei form', 'Cytokinesis completes division', 'PMAT mnemonic'],
  'Alberts',
  'Item on chromosome alignment.',
  'Metaphase.'
);
X['biochem-12-mitochondria'] = n(
  'ATP powerhouse of the cell.',
  ['Double membrane', 'Own circular DNA (maternal inheritance)', 'TCA cycle in matrix', 'Electron transport chain on inner membrane', 'Site of oxidative phosphorylation'],
  'Alberts',
  'Item on energy source.',
  'Mitochondrial oxidative phosphorylation generates ATP.'
);
X['biochem-13-protein-synthesis-translation'] = n(
  'mRNA → protein via ribosome.',
  ['Initiation: mRNA binds small ribosomal subunit at AUG', 'Elongation: tRNA brings amino acids, peptide bond forms', 'Termination: stop codon, release factor', 'Antibiotics target bacterial 30S/50S (aminoglycosides, tetracyclines, macrolides)'],
  'Harper',
  'Item on antibiotic target.',
  'Bacterial 70S ribosome (30S aminoglycoside, 50S macrolide).'
);
X['biochem-14-cytoskeleton'] = n(
  'Cell shape and movement.',
  ['Microfilaments (actin): muscle, cell division', 'Microtubules (tubulin): mitotic spindle, cilia, flagella', 'Intermediate filaments: cytokeratin, desmin, vimentin — structural'],
  'Alberts',
  'Item on mitotic spindle.',
  'Microtubules (tubulin dimers).'
);
X['biochem-15-tca-cycle'] = n(
  'Krebs/Citric acid cycle in mitochondrial matrix.',
  ['Acetyl-CoA enters → citrate', '8 steps', 'Per turn: 3 NADH, 1 FADH2, 1 GTP, 2 CO2', 'Rate-limiting: isocitrate dehydrogenase'],
  'Harper',
  'Item on Krebs cycle location.',
  'Mitochondrial matrix.'
);
X['biochem-16-lactose'] = n(
  'Disaccharide: glucose + galactose.',
  ['Lactase in intestine', 'Lactose intolerance common in Asians (adult-onset hypolactasia)', 'Diagnosis: lactose tolerance test, breath hydrogen', 'Management: lactose-free diet, lactase supplement'],
  'IAP',
  'Bloating and diarrhea after milk.',
  'Empiric lactose-free trial, lactase enzyme supplement, alternative Ca sources.'
);
X['biochem-17-dna-structure'] = n(
  'Double helix.',
  ['Watson-Crick: antiparallel, sugar-phosphate backbone, complementary base pairing (A=T, G=C)', 'Deoxyribose sugar', 'Nucleus and mitochondria', 'Chargaff rule'],
  'Alberts',
  'Item on base pairing.',
  'A with T (2 H bonds); G with C (3 H bonds).'
);
X['biochem-18-chromosome-number'] = n(
  'Human chromosomes.',
  ['46 total: 22 autosome pairs + 2 sex (XX or XY)', 'Gamete: 23 (haploid)', 'Aneuploidies: trisomy 21 (Down), 18 (Edward), 13 (Patau), XXY (Klinefelter), XO (Turner)'],
  'Ghai',
  'Item on normal human chromosomes.',
  '46 (23 pairs).'
);
X['biochem-19-mutation-types'] = n(
  'DNA changes.',
  ['Point: silent, missense, nonsense', 'Frameshift: insertion/deletion', 'Chromosomal: translocation, deletion, duplication, inversion', 'Spontaneous or induced'],
  'Alberts',
  'Item on premature stop codon.',
  'Nonsense mutation.'
);
X['biochem-20-keratin'] = n(
  'Structural protein in skin, hair, nails.',
  ['Alpha-keratin: hair, nail', 'Beta-keratin: reptile', 'Fibrous protein', 'Intermediate filament'],
  'Alberts',
  'Item on nail/hair protein.',
  'Keratin.'
);
X['biochem-21-essential-amino-acids'] = n(
  '9 amino acids body cannot synthesize.',
  ['Phenylalanine, Valine, Threonine, Tryptophan, Isoleucine, Methionine, Histidine, Leucine, Lysine (PVT TIM HaLL)', 'Must come from diet', 'Complete proteins: meat, eggs, soy', 'Incomplete: combine (dal + rice)'],
  'ICMR',
  'Vegetarian diet planning.',
  'Combine cereal (rice/wheat) with pulse (dal) — complementary protein to ensure all essential amino acids.'
);

// ============ ANATOMY & PHYSIOLOGY (77) ============
X['anatomy-1-types-of-solutions'] = n(
  'Tonicity of IV fluids.',
  ['Isotonic (270-310 mOsm): NS 0.9%, RL, D5W (after glucose metabolized becomes hypotonic free water)', 'Hypertonic: 3% NaCl, D10W, D50W — draws water from cells', 'Hypotonic: 0.45% NaCl, D5W (post-metabolism) — expands cells, caution in brain injury'],
  'Harrison',
  'Hyponatremia with seizure Na 115.',
  '3% hypertonic saline 100 mL over 10 min, repeat if seizures persist, raise Na ~1-2 mEq/L/h for symptomatic only, careful monitoring to avoid osmotic demyelination.'
);
X['anatomy-2-body-fluid-compartments'] = n(
  'Distribution of body water.',
  ['Total body water: 60% body weight adult (infants 75%, elderly 50%)', 'ICF: 2/3 (40% BW)', 'ECF: 1/3 (20% BW) — interstitial 15%, plasma 5%', '3rd space: pathologic (ascites, edema, pleural effusion)'],
  'Guyton',
  'Item on ICF volume.',
  '2/3 of total body water.'
);
X['anatomy-3-diffusion'] = n(
  'Passive movement along concentration gradient.',
  ['Simple: lipid-soluble, small molecules (O2, CO2)', 'Facilitated: via protein channels (glucose)', 'Factors: gradient, surface area, membrane thickness, molecular size', 'Ficks law'],
  'Guyton',
  'Item on O2 exchange in alveoli.',
  'Simple diffusion across alveolar-capillary membrane.'
);
X['anatomy-4-plasma-composition'] = n(
  'Liquid blood component ~55%.',
  ['Water 92%', 'Proteins 7% (albumin 60%, globulin, fibrinogen)', 'Electrolytes, nutrients, hormones, waste', 'Serum = plasma without clotting factors'],
  'Guyton',
  'Item on major plasma protein.',
  'Albumin (maintains oncotic pressure).'
);
X['anatomy-5-osmosis'] = n(
  'Water movement across semi-permeable membrane.',
  ['From low to high solute concentration', 'Osmotic pressure', 'Crucial for fluid balance', 'Osmolarity/osmolality'],
  'Guyton',
  'Item on water shift direction.',
  'Toward higher solute (from dilute to concentrated).'
);
X['anatomy-6-lower-limb-osteology'] = n(
  'Bones of lower limb.',
  ['Pelvic girdle: ilium, ischium, pubis', 'Femur (largest), patella, tibia, fibula, tarsals (7), metatarsals (5), phalanges (14)', 'Knee: largest synovial joint'],
  'Gray',
  'Item on largest bone.',
  'Femur.'
);
X['anatomy-7-longest-vein-great-saphenous'] = n(
  'Great saphenous vein — longest in body.',
  ['From medial foot to femoral vein at saphenofemoral junction', 'Used for CABG graft, varicose vein stripping', 'Accompanied by saphenous nerve'],
  'Gray',
  'Item on longest vein.',
  'Great saphenous.'
);
X['anatomy-8-plantar-flexion'] = n(
  'Pointing toes down (gastrocnemius, soleus via tibial nerve).',
  ['Opposite to dorsiflexion', 'Used in gait and jumping'],
  'Gray',
  'Item on ankle movement.',
  'Plantar flexion — toes down, calf muscles.'
);
X['anatomy-9-upper-limb-nerve-supply'] = n(
  'Brachial plexus nerves.',
  ['Axillary: deltoid (shoulder abduction)', 'Musculocutaneous: biceps (elbow flexion)', 'Radial: extensors (wrist drop if injured)', 'Median: thenar (ape hand, pregnant nurse sign)', 'Ulnar: intrinsics (claw hand)'],
  'Gray',
  'Patient with wrist drop post-crutch injury.',
  'Radial nerve palsy — splint, PT, EMG, usually recovers 2-3 mo.'
);
X['anatomy-10-muscle-origin-and-insertion'] = n(
  'Muscle attachments.',
  ['Origin: fixed attachment', 'Insertion: moving attachment', 'Action: brings insertion toward origin'],
  'Gray',
  'Item on biceps.',
  'Origin: scapula; insertion: radial tuberosity; flexes and supinates.'
);
X['anatomy-11-mouth-muscles'] = n(
  'Orofacial muscles.',
  ['Orbicularis oris: lip closure', 'Buccinator: cheek compression', 'Masseter, temporalis, pterygoids: mastication', 'Innervation: facial (VII) for expression; trigeminal (V) for mastication'],
  'Gray',
  'Item on facial expression muscle.',
  'Orbicularis oris (facial nerve VII).'
);
X['anatomy-12-anterior-thoracic-wall'] = n(
  'Structures.',
  ['Sternum: manubrium, body, xiphoid', 'Ribs: 12 pairs (true 1-7, false 8-10, floating 11-12)', 'Intercostal muscles 3 layers', 'Pectoralis major/minor'],
  'Gray',
  'Item on landmark at sternal angle.',
  'Angle of Louis = T4/T5 disc, 2nd costal cartilage.'
);
X['anatomy-13-abduction-adduction-eversion'] = n(
  'Movements.',
  ['Abduction: away from midline', 'Adduction: toward midline', 'Flexion/extension', 'Eversion: sole outward', 'Inversion: sole inward', 'Circumduction: combined'],
  'Gray',
  'Item on moving leg away from body.',
  'Abduction.'
);
X['anatomy-14-boxer-muscle'] = n(
  'Serratus anterior — "boxer muscle".',
  ['Long thoracic nerve innervation', 'Injury → winging of scapula', 'Protracts scapula (punching)'],
  'Gray',
  'Winged scapula after radical mastectomy.',
  'Long thoracic nerve injury — physical therapy, shoulder support, usually recovers.'
);
X['anatomy-15-retroperitoneal-structures'] = n(
  'SAD PUCKER.',
  ['Suprarenal gland, Aorta/IVC, Duodenum (2nd, 3rd, 4th), Pancreas (except tail), Ureters, Colon (ascending, descending), Kidneys, Esophagus (lower), Rectum'],
  'Gray',
  'Item on retroperitoneal organ.',
  'Kidneys, pancreas (head/body), duodenum.'
);
X['anatomy-16-adrenal-gland'] = n(
  'Suprarenal — cortex and medulla.',
  ['Cortex (GFR) — Glomerulosa (aldosterone), Fasciculata (cortisol), Reticularis (androgens)', 'Medulla: chromaffin cells, catecholamines (epi, NE)', 'Pheochromocytoma — medulla tumor', 'Addison disease — adrenal insufficiency'],
  'Harrison',
  'Young patient with BP swings, headache, sweating, palpitations.',
  'Pheochromocytoma workup — plasma/urinary metanephrines, imaging; alpha-block first, then beta.'
);
X['anatomy-17-growth-hormone'] = n(
  'Somatotropin from anterior pituitary.',
  ['Excess childhood: gigantism', 'Excess adult: acromegaly', 'Deficiency: short stature', 'Stimulates IGF-1 from liver', 'Stress, sleep, exercise stimulate'],
  'Williams',
  'Adult with prominent jaw, enlarged hands, ring size change.',
  'Acromegaly — IGF-1, OGTT with GH, pituitary MRI; trans-sphenoidal surgery.'
);
X['anatomy-18-pituitary-anterior-vs-posterior'] = n(
  'Hypophysis.',
  ['Anterior (adenohypophysis): GH, ACTH, TSH, LH/FSH, prolactin, MSH — glandular', 'Posterior (neurohypophysis): ADH, oxytocin — neural (stored, not synthesized)', 'Hypothalamic control via portal system'],
  'Harrison',
  'Item on ADH source.',
  'Synthesized in hypothalamus, stored/released from posterior pituitary.'
);
X['anatomy-19-thyroid-hormones'] = n(
  'T3/T4 and calcitonin.',
  ['T4 (thyroxine) most secreted; T3 more active', 'Peripheral conversion T4→T3', 'Follicular cells make T3/T4; parafollicular (C) cells make calcitonin', 'TRH → TSH → T3/T4 feedback'],
  'Harrison',
  'Hypothyroid with TSH high T4 low.',
  'Primary hypothyroidism — levothyroxine 1.6 mcg/kg/d empty stomach, recheck TSH 6 wk.'
);
X['anatomy-20-reproductive-hormones'] = n(
  'HPG axis.',
  ['GnRH → LH/FSH → ovary (E2, progesterone) / testis (testosterone)', 'Menstrual cycle: follicular (FSH/E2), ovulation (LH surge), luteal (progesterone)', 'HCG: maintains CL in pregnancy'],
  'Williams',
  'Item on ovulation trigger.',
  'LH surge mid-cycle.'
);
X['anatomy-21-embryonic-testis-descent'] = n(
  'Testis migrates from abdominal to scrotum.',
  ['8th month gestation reaches scrotum', 'Gubernaculum guides descent', 'Undescended (cryptorchidism): infertility, testicular cancer risk; orchiopexy by 1 y'],
  'Ghai',
  '1-y-old with absent right testis in scrotum.',
  'Ultrasound to locate, refer surgery for orchiopexy before 18 mo; educate parents on malignancy risk.'
);
X['anatomy-22-motilin'] = n(
  'GI hormone stimulating MMC.',
  ['From M cells of duodenum', 'Peaks during fasting', 'Erythromycin is a motilin agonist — used for gastroparesis'],
  'Guyton',
  'Gastroparesis patient.',
  'Low-dose erythromycin (motilin agonist) 3 mg/kg PO TDS, dietary modification, metoclopramide.'
);
X['anatomy-23-intrinsic-factor-of-castle'] = n(
  'From gastric parietal cells; binds B12 for ileal absorption.',
  ['Pernicious anemia: autoimmune destruction of parietal cells → IF deficiency → B12 deficiency', 'Schilling test (historical)', 'Treatment: IM B12 lifelong'],
  'Harrison',
  'Post-gastrectomy with megaloblastic anemia.',
  'Monthly IM B12 (hydroxocobalamin 1000 mcg) lifelong, diet counseling.'
);
X['anatomy-24-hcl-secretion'] = n(
  'Parietal cells secrete HCl.',
  ['Stimulated by: gastrin (G cells), histamine (ECL, H2), ACh (vagus)', 'H-K ATPase proton pump', 'PPIs block pump; H2 blockers compete at H2 receptor'],
  'Guyton',
  'Item on PPI target.',
  'H-K ATPase (proton pump) on parietal cell.'
);
X['anatomy-25-mineral-absorption-sites'] = n(
  'GI sites.',
  ['Fe: duodenum + proximal jejunum', 'Ca: duodenum (vit D-dependent)', 'B12: terminal ileum (needs IF)', 'Bile acids: terminal ileum', 'Folate: jejunum', 'Water: SI + colon'],
  'Harrison',
  'Ileal resection patient.',
  'B12 deficiency likely — monthly IM B12, check bile salt diarrhea, fat-soluble vitamin status.'
);
X['anatomy-26-gi-enzymes'] = n(
  'Major enzymes.',
  ['Saliva: amylase (starch)', 'Stomach: pepsin (protein)', 'Pancreas: amylase, lipase, trypsin, chymotrypsin', 'Brush border: lactase, sucrase, maltase, peptidases', 'Bile: emulsifies fat (not enzyme)'],
  'Guyton',
  'Item on fat digestion.',
  'Pancreatic lipase with bile salt emulsification.'
);
X['anatomy-27-large-intestine-functions'] = n(
  'Colon.',
  ['Water and electrolyte absorption', 'Bacterial fermentation', 'Vit K and B synthesis', 'Stool formation', 'Mucus for lubrication'],
  'Guyton',
  'Item on water absorption site.',
  'Colon (majority in SI but colon final concentration).'
);
X['anatomy-28-islets-of-langerhans'] = n(
  'Pancreatic endocrine.',
  ['Alpha (20%): glucagon', 'Beta (70%): insulin', 'Delta: somatostatin', 'PP cells: pancreatic polypeptide', 'Insulin autoantibodies in T1DM'],
  'Harrison',
  'Item on insulin source.',
  'Beta cells of islets of Langerhans.'
);
X['anatomy-29-cervical-vertebrae'] = n(
  '7 cervical.',
  ['C1 atlas: no body, supports skull', 'C2 axis: dens (odontoid)', 'C7 vertebra prominens', 'Transverse foramen for vertebral artery', 'Lordotic curve'],
  'Gray',
  'Item on atlas.',
  'C1 — has no vertebral body.'
);
X['anatomy-30-csf'] = n(
  'Cerebrospinal fluid.',
  ['Production: choroid plexus (500 mL/d)', 'Volume: 150 mL adult', 'Circulation: lateral → 3rd → 4th → central canal / subarachnoid', 'Absorption: arachnoid villi', 'Pressure: 7-18 cm H2O normal adult'],
  'Guyton',
  'LP opening pressure 30 cm H2O in headache.',
  'Elevated ICP — consider IIH or meningitis workup, MRI, ophthalmology for papilledema, manage carefully.'
);
X['anatomy-31-parasympathetic-nervous-system'] = n(
  'Rest and digest.',
  ['Craniosacral origin: CN III, VII, IX, X and S2-S4', 'Neurotransmitter: ACh (pre and post)', 'Effects: pupil constrict, bradycardia, bronchoconstrict, increased GI, bladder contract, sexual arousal', 'Blocked by atropine'],
  'Guyton',
  'Item on dominant tone at rest.',
  'Parasympathetic tone.'
);
X['anatomy-32-nerve-physiology'] = n(
  'Action potential.',
  ['Resting -70 mV (K+ leak)', 'Depolarization: Na+ influx', 'Repolarization: K+ efflux', 'Refractory period', 'Myelination speeds conduction (saltatory)'],
  'Guyton',
  'Item on Na channel role.',
  'Voltage-gated Na+ channels initiate depolarization.'
);
X['anatomy-33-brain-physiological-functions'] = n(
  'Major regions.',
  ['Frontal: motor, personality, executive, Broca (dominant)', 'Parietal: sensory, spatial', 'Temporal: hearing, memory, Wernicke', 'Occipital: vision', 'Cerebellum: coordination, balance', 'Brainstem: autonomic, cardiorespiratory'],
  'Gray',
  'Item on motor cortex.',
  'Frontal lobe precentral gyrus (Brodmann area 4).'
);
X['anatomy-34-broca-vs-wernicke'] = n(
  'Language areas.',
  ['Broca (inferior frontal, dominant hemisphere): expressive aphasia, non-fluent, understanding preserved', 'Wernicke (superior temporal, dominant): receptive aphasia, fluent but nonsensical, impaired understanding'],
  'Gray',
  'Patient with fluent but meaningless speech and poor comprehension.',
  'Wernicke aphasia — speech therapy, stroke workup (temporal lobe), caregiver education on comprehension strategies.'
);
X['anatomy-35-sympathetic-nervous-system'] = n(
  'Fight or flight.',
  ['Thoracolumbar T1-L2', 'NT: ACh pre, NE post (except sweat glands ACh)', 'Effects: pupil dilate, tachycardia, bronchodilate, decreased GI, sweat, vasoconstrict', 'Adrenal medulla = modified sympathetic ganglion'],
  'Guyton',
  'Item on fight-or-flight NT.',
  'Norepinephrine (post-ganglionic).'
);
X['anatomy-36-root-values-of-reflexes'] = n(
  'Deep tendon reflexes.',
  ['Knee jerk (patellar): L3-L4', 'Ankle jerk (Achilles): S1-S2', 'Biceps: C5-C6', 'Triceps: C7-C8', 'Plantar: L5-S1'],
  'Gray',
  'Item on knee jerk root.',
  'L3-L4.'
);
X['anatomy-37-brachial-and-cervical-plexus'] = n(
  'Plexuses.',
  ['Cervical plexus: C1-C4, phrenic nerve (C3-C5 keeps diaphragm alive)', 'Brachial plexus: C5-T1, roots-trunks-divisions-cords-branches (Real Teenagers Drink Cold Beer)', 'Terminal branches: axillary, radial, musculocutaneous, median, ulnar'],
  'Gray',
  'Item on phrenic nerve root.',
  'C3-C5.'
);
X['anatomy-38-thermoregulatory-center'] = n(
  'Hypothalamus.',
  ['Anterior hypothalamus: heat loss', 'Posterior: heat conservation/generation', 'Set point can be elevated by pyrogens (fever)', 'Heat stroke when failed'],
  'Guyton',
  'Item on temperature control center.',
  'Hypothalamus.'
);
X['anatomy-39-cervical-nerves'] = n(
  'Cervical spinal nerves 8.',
  ['C1-C7 exit above corresponding vertebra', 'C8 below C7 vertebra', 'Innervate neck, upper limb, diaphragm (C3-C5)'],
  'Gray',
  'Item on diaphragm innervation.',
  'Phrenic nerve C3, C4, C5.'
);
X['anatomy-40-cranial-nerves'] = n(
  '12 pairs — Old Olympus Towering Tops...',
  ['I olfactory, II optic, III oculomotor, IV trochlear, V trigeminal, VI abducens, VII facial, VIII vestibulocochlear, IX glossopharyngeal, X vagus, XI accessory, XII hypoglossal', 'Mnemonic: Some Say Marry Money But My Brother Says Big Brains Matter More (sensory/motor/both)'],
  'Gray',
  'Facial droop sparing forehead.',
  'Central (UMN) VII lesion (stroke) — forehead spared due to bilateral cortical input; workup stroke.'
);
X['anatomy-41-plantar-reflex'] = n(
  'Stroking sole.',
  ['Normal: toe flexion', 'Babinski positive: big toe dorsiflexion + fanning — UMN lesion', 'Normal in infants <1-2 y', 'Adults: UMN lesion (stroke, MS, SCI)'],
  'Gray',
  'Post-stroke patient with big toe dorsiflexion on sole stimulation.',
  'Babinski sign (UMN lesion) — consistent with stroke; document, rehabilitation.'
);
X['anatomy-42-openings-in-the-diaphragm'] = n(
  'Diaphragmatic hiatuses.',
  ['T8: IVC (I ate 10 apples)', 'T10: esophagus + vagus', 'T12: aorta + thoracic duct + azygos', 'Central tendon'],
  'Gray',
  'Item on IVC hiatus.',
  'T8.'
);
X['anatomy-43-arterial-supply-of-lung'] = n(
  'Dual supply.',
  ['Pulmonary artery: deoxygenated from RV — gas exchange', 'Bronchial artery: oxygenated from aorta — nutrient supply to bronchi'],
  'Gray',
  'Item on nutrient artery of lung.',
  'Bronchial artery from descending aorta.'
);
X['anatomy-44-diaphragm-physiology'] = n(
  'Primary muscle of inspiration.',
  ['Phrenic nerve C3-C5', 'Contracts → flattens → increased thoracic volume → inspiration', 'Relaxes passively for expiration', 'Quiet breathing mostly diaphragm; forced uses accessory muscles'],
  'Guyton',
  'Item on quiet inspiration.',
  'Diaphragm (primary) with some external intercostal activity.'
);
X['anatomy-45-visceral-pleura'] = n(
  'Serous membrane covering lungs.',
  ['Inner (visceral) covers lung surface', 'Outer (parietal) lines chest wall', 'Between: potential pleural space', 'Sensory innervation: visceral autonomic (pain not felt), parietal somatic (sharp pain)'],
  'Gray',
  'Item on pleural pain.',
  'Parietal pleura — somatic, sharp.'
);
X['anatomy-46-cricoid-cartilage'] = n(
  'Only complete cartilaginous ring in airway.',
  ['C6 level', 'Landmark for trachea', 'Sellick maneuver (cricoid pressure) in RSI (no longer routine)', 'Narrowest pediatric airway (<8 y)'],
  'Gray',
  'Item on narrowest airway in child.',
  'Cricoid ring (subglottic) — implications for uncuffed ETT.'
);
X['anatomy-47-lung-volumes-and-capacities'] = n(
  'Pulmonary function.',
  ['TV: 500 mL', 'IRV: 3000', 'ERV: 1100', 'RV: 1200 (cant measure with spirometry)', 'IC = TV+IRV = 3500', 'FRC = ERV+RV = 2300', 'VC = TV+IRV+ERV = 4600', 'TLC = VC+RV = 5800'],
  'Guyton',
  'Item on FRC.',
  'Functional Residual Capacity = ERV + RV (air after quiet expiration).'
);
X['anatomy-48-larynx-anatomy'] = n(
  'Voice box C3-C6.',
  ['Cartilages: thyroid, cricoid, epiglottis (single), arytenoid, corniculate, cuneiform (paired)', 'Vocal cords between thyroid and arytenoid', 'Innervation: recurrent laryngeal (all intrinsic except cricothyroid)'],
  'Gray',
  'Post-thyroidectomy hoarse voice.',
  'Recurrent laryngeal nerve injury — voice rest, speech therapy, scope to assess cord movement.'
);
X['anatomy-49-lung-epithelium-lining'] = n(
  'Respiratory epithelium.',
  ['Upper airways: pseudostratified ciliated columnar', 'Terminal bronchiole: simple cuboidal', 'Alveoli: type I (gas exchange), type II (surfactant)'],
  'Gray',
  'Item on surfactant source.',
  'Type II pneumocyte.'
);
X['anatomy-50-respiratory-center-stimulants'] = n(
  'Central and peripheral chemoreceptors.',
  ['Central medullary: CO2 via H+ in CSF', 'Peripheral carotid/aortic: O2, CO2, H+', 'Hypercapnia is main drive; in COPD, hypoxia becomes drive (careful O2)'],
  'Guyton',
  'COPD patient on high-flow O2 with rising CO2.',
  'Titrate O2 to SpO2 88-92% to avoid loss of hypoxic drive, ABG, consider NIV if CO2 rising with acidosis.'
);
X['anatomy-51-joints'] = n(
  'Classification.',
  ['Fibrous (sutures skull) — immovable', 'Cartilaginous (pubic symphysis, IV disc) — slight', 'Synovial (knee, hip, shoulder) — freely movable', 'Synovial subtypes: hinge, pivot, ball-and-socket, saddle, plane, condyloid'],
  'Gray',
  'Item on ball-and-socket.',
  'Hip and shoulder.'
);
X['anatomy-52-types-and-number-of-bones'] = n(
  '206 total adult bones.',
  ['Axial 80: skull 22, hyoid 1, ossicles 6, vertebrae 26, ribs 24, sternum 1', 'Appendicular 126: upper limb 64, lower limb 62', 'Newborn has ~270 (some fuse)'],
  'Gray',
  'Item on bone count.',
  '206 in adult.'
);
X['anatomy-53-bone-coverings'] = n(
  'Periosteum.',
  ['Fibrous outer + osteogenic inner', 'Sharpey fibers anchor tendons', 'Blood supply to bone', 'Endosteum lines marrow cavity'],
  'Gray',
  'Item on bone covering.',
  'Periosteum.'
);
X['anatomy-54-bone-cells'] = n(
  'Osteoblast, osteocyte, osteoclast, osteogenic stem cell.',
  ['Osteoblast: build bone matrix', 'Osteocyte: mature mineralized cell in lacunae', 'Osteoclast: resorb bone (multinucleated, hematopoietic origin)', 'Bisphosphonate inhibits osteoclast'],
  'Gray',
  'Item on bone resorption cell.',
  'Osteoclast.'
);
X['anatomy-55-largest-bone'] = n(
  'Femur.',
  ['Longest and strongest', 'Head articulates with acetabulum (hip)', 'Distal femur + tibia = knee', 'Common site of fracture in elderly'],
  'Gray',
  'Item on longest bone.',
  'Femur.'
);
X['anatomy-56-heart-anatomy'] = n(
  '4 chambers in middle mediastinum.',
  ['RA, RV (pulmonary circulation), LA, LV (systemic)', 'Coronary arteries: LAD (LCA), circumflex (LCA), RCA', 'Valves: tricuspid, pulmonary, mitral, aortic', 'Pericardium: fibrous + serous'],
  'Gray',
  'Item on widow-maker artery.',
  'LAD (left anterior descending).'
);
X['anatomy-57-clotting-factors'] = n(
  'Coagulation cascade.',
  ['Factors I-XIII (no VI)', 'Intrinsic: XII→XI→IX→VIII→X', 'Extrinsic: VII + TF→X', 'Common: X→V→II(prothrombin)→I(fibrinogen)', 'Vit K dependent: II, VII, IX, X + proteins C, S'],
  'Harrison',
  'Item on factor VII assessment.',
  'PT (extrinsic) — INR monitors warfarin via vit K-dependent factors.'
);
X['anatomy-58-minerals-required-for-clotting'] = n(
  'Calcium + vitamin K.',
  ['Ca++ is factor IV', 'Vit K for gamma-carboxylation of factors II, VII, IX, X', 'Citrate chelates Ca to prevent clotting (blood bag)'],
  'Harrison',
  'Item on minerals for clotting.',
  'Calcium + vitamin K.'
);
X['anatomy-59-normal-blood-parameters'] = n(
  'Standard ranges.',
  ['Hb: M 13.5-17.5, F 12-15.5', 'WBC: 4-11 x10^3', 'Platelets: 150-400 x10^3', 'Hct: M 40-52%, F 36-46%', 'RBC: M 4.5-5.9, F 4.1-5.1 x10^6'],
  'Harrison',
  'Item on normal Hb adult male.',
  '13.5-17.5 g/dL.'
);
X['anatomy-60-hemopoiesis'] = n(
  'Blood cell formation.',
  ['Embryo: yolk sac → liver (mid-trimester) → spleen → bone marrow (by birth)', 'Child: all bones', 'Adult: axial skeleton (vertebrae, pelvis, sternum, ribs, proximal femur)', 'HSC gives all lineages'],
  'Harrison',
  'Item on adult hemopoiesis.',
  'Bone marrow of axial skeleton.'
);
X['anatomy-61-heart-sounds-s1-s4'] = n(
  'Cardiac sounds.',
  ['S1: mitral + tricuspid closure (lub) — start of systole', 'S2: aortic + pulmonary closure (dub) — end of systole', 'S3: early diastolic gallop (volume overload, normal in young)', 'S4: late diastolic (stiff ventricle, never normal)'],
  'Harrison',
  'Item on S1.',
  'AV valve closure at start of systole.'
);
X['anatomy-62-cardiac-output'] = n(
  'CO = HR x SV (L/min).',
  ['Normal: 5 L/min', 'SV normal: 70 mL', 'HR normal: 60-100', 'Cardiac index: CO/BSA', 'Affected by preload, afterload, contractility, HR'],
  'Guyton',
  'Item on CO formula.',
  'HR x SV.'
);
X['anatomy-63-blood-pressure-regulation'] = n(
  'Short vs long term.',
  ['Short: baroreceptor (aortic arch, carotid sinus)', 'Long: RAAS, ADH, ANP, sympathetic tone, kidney Na/water handling'],
  'Guyton',
  'Item on long-term BP control.',
  'Kidney via RAAS and pressure natriuresis.'
);
X['anatomy-64-sa-node'] = n(
  'Pacemaker of the heart.',
  ['Location: junction of SVC and RA', 'Rate: 60-100 bpm intrinsic', 'AV node 40-60, Purkinje 20-40 escape', 'Vagal innervation slows it'],
  'Guyton',
  'Item on heart pacemaker.',
  'SA node.'
);
X['anatomy-65-stroke-volume'] = n(
  'Blood ejected per beat.',
  ['SV = EDV - ESV', 'Normal 70 mL', 'Preload (Frank-Starling), contractility, afterload', 'EF = SV/EDV (normal 55-70%)'],
  'Guyton',
  'Item on determinants of SV.',
  'Preload, afterload, contractility.'
);
X['anatomy-66-oxygenated-vs-deoxygenated-blood'] = n(
  'Circulation.',
  ['Oxygenated: pulmonary vein → LA → LV → aorta → systemic arteries', 'Deoxygenated: systemic veins → RA → RV → pulmonary artery (ONLY artery with deoxy blood)'],
  'Guyton',
  'Item on deoxygenated artery.',
  'Pulmonary artery.'
);
X['anatomy-67-arterioles-vs-veins'] = n(
  'Vessel properties.',
  ['Arterioles: highest resistance, regulate BP', 'Capillaries: exchange', 'Venules: post-capillary', 'Veins: capacitance, hold 70% blood volume, have valves (except cranial, pulmonary)'],
  'Guyton',
  'Item on highest resistance vessel.',
  'Arterioles.'
);
X['anatomy-68-eye'] = n(
  'Anatomy and refraction.',
  ['Layers: sclera (outer), choroid (middle), retina (inner)', 'Cornea + lens focus image', 'Retina contains rods (night) and cones (color)', 'Fovea: highest visual acuity', 'Optic disc: blind spot'],
  'Gray',
  'Item on color vision.',
  'Cones (3 types — R, G, B).'
);
X['anatomy-69-agnosia'] = n(
  'Failure to recognize despite intact senses.',
  ['Visual agnosia', 'Prosopagnosia: face recognition', 'Astereognosis: by touch', 'Lesion in association cortex (parieto-occipital)'],
  'Harrison',
  'Stroke patient cannot recognize familiar faces.',
  'Prosopagnosia — inferior temporal/occipital lesion; OT for compensatory strategies, family education.'
);
X['anatomy-70-ear'] = n(
  'Hearing and balance.',
  ['External: pinna, canal, TM', 'Middle: ossicles (malleus, incus, stapes) + Eustachian tube', 'Inner: cochlea (hearing), vestibule + semicircular canals (balance)', 'Stapes: smallest bone'],
  'Gray',
  'Item on smallest bone.',
  'Stapes (middle ear).'
);
X['anatomy-71-anosmia'] = n(
  'Loss of smell.',
  ['Causes: viral URI, COVID, head trauma (ethmoid fracture), Parkinson, Alzheimer early sign', 'CN I olfactory', 'Kallmann syndrome: anosmia + hypogonadism'],
  'Harrison',
  'Patient with COVID presenting with loss of smell.',
  'Expected post-viral — usually recovers; educate; olfactory training may help.'
);
X['anatomy-72-auditory-pathway'] = n(
  'Sound to cortex.',
  ['Cochlea → CN VIII → cochlear nuclei → superior olivary complex → lateral lemniscus → inferior colliculus → medial geniculate body (thalamus) → primary auditory cortex (temporal)'],
  'Gray',
  'Item on auditory cortex.',
  'Temporal lobe (Brodmann 41-42).'
);
X['anatomy-73-glomerular-filtration-rate'] = n(
  'GFR — key kidney function.',
  ['Normal: 90-120 mL/min/1.73 m2', 'Estimated: Cockcroft-Gault, MDRD, CKD-EPI', 'Cr clearance approximates', 'CKD staging: stage 1 (>=90), 2 (60-89), 3a (45-59), 3b (30-44), 4 (15-29), 5 (<15)'],
  'KDIGO',
  'Patient with eGFR 25.',
  'CKD stage 4 — nephrology referral, avoid nephrotoxins, dose-adjust drugs, prepare for RRT.'
);
X['anatomy-74-renal-tubular-absorption'] = n(
  'Along nephron.',
  ['PCT: 65% Na, H2O, all glucose, amino acids, HCO3', 'Loop of Henle descending: water; ascending: Na/K/2Cl', 'DCT: Na/Cl, thiazide site', 'Collecting duct: ADH (water), aldosterone (Na/K)'],
  'Guyton',
  'Item on thiazide site of action.',
  'DCT.'
);
X['anatomy-75-carpal-tunnel-syndrome'] = n(
  'Median nerve compression at wrist.',
  ['Symptoms: paresthesia lateral 3.5 fingers, thenar atrophy (late), worse at night', 'Positive Tinel, Phalen', 'Risk: pregnancy, DM, hypothyroid, repetitive', 'Treatment: splint, NSAIDs, steroid injection, decompression surgery'],
  'Harrison',
  'Middle-aged typist with nocturnal hand numbness.',
  'Wrist splint night-time, ergonomic modification, NSAIDs, steroid injection if refractory, EMG, surgery.'
);
X['anatomy-76-foot-drop'] = n(
  'Weak ankle dorsiflexion.',
  ['Common peroneal nerve (L4-S1) most common — at fibular head (crossing legs, prolonged squat)', 'Steppage gait', 'AFO brace, PT, cause-specific treatment'],
  'Gray',
  'Patient with foot drop after prolonged squatting.',
  'Peroneal nerve palsy — AFO brace, avoid pressure at fibular head, PT, usually recovers.'
);
X['anatomy-77-winging-of-scapula'] = n(
  'Weak serratus anterior (long thoracic nerve).',
  ['Prominent vertebral border on arm push', 'Causes: radical mastectomy, blunt trauma, idiopathic', 'Treatment: PT for scapular stabilization'],
  'Gray',
  'Post-mastectomy with scapular prominence when pushing wall.',
  'Long thoracic nerve injury — physical therapy to strengthen remaining muscles, usually recovers.'
);
