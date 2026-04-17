// Child Health (78 topics).
import { n } from './notes-helper.mjs';
export const NOTE_CONTENT_CHILD = {};
const C = NOTE_CONTENT_CHILD;

C['child-1-weech-formula-birth-weight-and-height'] = n(
  'Formulas for estimating pediatric weight and height.',
  ['Weech (weight kg): age(y)x2+8 for 3-12 y; (age mo+9)/2 for 3-12 mo; age(y)x7-5)/2 for 1-6', 'Height: 2.5 cm/mo 0-6 mo; 1.25 cm/mo 6-12; age(y)x6+77 for >2 y', 'Double birth weight by 5 mo, triple by 1 y, quadruple by 2.5 y'],
  'Ghai 10e',
  '5-y-old emergency resuscitation, weight unknown.',
  'Weech: 5x2+8 = 18 kg; calculate drug doses.',
  'Broselow tape preferred in real emergencies.'
);
C['child-2-gomez-classification-of-malnutrition'] = n(
  'Weight-for-age classification (pre-WHO).',
  ['Grade I (mild): 75-90% expected weight', 'Grade II (moderate): 60-75%', 'Grade III (severe): <60%', 'WHO Z-score now standard'],
  'Ghai',
  '2-y-old at 60% expected weight.',
  'Gomez grade III severe malnutrition; refer NRC, evaluate for complications, feeding plan.'
);
C['child-3-fetal-weight-johnson-shepard-hadlock-formulas'] = n(
  'Estimated fetal weight formulas.',
  ['Johnson (clinical): EFW (g) = (SFH in cm - n) x 155; n=12 if vertex above ischial spine, 11 if at/below', 'Hadlock: USG BPD + HC + AC + FL — most accurate', 'Shepard: BPD + AC'],
  'Dutta',
  'SFH 36 cm, station -2.',
  'Johnson EFW = (36-12)x155 = 3720 g.'
);
C['child-4-teeth-eruption-timeline'] = n(
  'Primary and permanent dentition.',
  ['Primary: lower central incisors 6-10 mo, first molars 13-19 mo, canines 16-22, 2nd molars 23-33 mo; complete 20 teeth by 3 y', 'Permanent 1st molars at 6 y, wisdom teeth 17-21 y', 'Eruption delay: hypothyroidism, rickets, Down'],
  'Ghai',
  '7-mo-old has first tooth eruption.',
  'Lower central incisor — reassure, teach gentle cleaning with cloth, cold teething ring.'
);
C['child-5-fontanel-closure'] = n(
  'Membranous gaps at skull suture junctions.',
  ['Anterior fontanel (bregma): 4-6 cm, closes 18 mo', 'Posterior (lambda): 1 cm, closes 2-3 mo', 'Delayed closure: rickets, hypothyroidism, hydrocephalus, Down', 'Bulging: raised ICP, meningitis, dehydration can sink'],
  'Ghai',
  '2-mo-old post-viral illness has sunken fontanel.',
  'Sign of dehydration — assess hydration, feeding, IV fluids if severe.'
);
C['child-6-integrated-child-development-services-icds'] = n(
  'See chn-5. ICDS services at AWC.',
  ['6 services: supplementary nutrition, immunization, health check-up, referral, pre-school education, nutrition-health education', 'Anganwadi Worker (AWW) is functionary', 'Target 0-6, PW, LM'],
  'ICDS',
  'AWW at AWC.',
  'Deliver 6 ICDS services; conduct growth monitoring monthly.'
);
C['child-7-height-measurement-technique'] = n(
  'Age-dependent technique.',
  ['<2 y: supine length with infantometer', '>=2 y: standing with stadiometer', 'Head in Frankfort plane; heels, buttocks, scapula touch board', 'Plot on WHO growth chart'],
  'WHO',
  '3-y-old for routine check.',
  'Measure standing height with stadiometer in Frankfort plane, plot on growth chart.'
);
C['child-8-developmental-milestones'] = n(
  'Denver/IAP milestones.',
  ['Social smile: 6-8 wk; head hold: 3 mo', 'Roll over: 5 mo; sit with support: 6 mo, without 8', 'Crawl 9 mo, stand with support 9, cruise 10-11, walk 12-15', 'First word: 1 y; 2-word sentence: 2 y; pedal tricycle: 3 y'],
  'Ghai',
  '9-mo-old not sitting independently.',
  'Developmental delay concern — detailed history, physical exam, refer for intervention if delay confirmed.'
);
C['child-9-trisomy-21-down-syndrome'] = n(
  'Most common aneuploidy; 1:600-800 live births.',
  ['Features: upslanting palpebral fissures, Brushfield spots, simian crease, sandal gap, hypotonia, short neck', 'Associations: AV canal defect (40%), duodenal atresia, hypothyroidism, ALL risk, Alzheimer early', 'Screening: quad marker (low AFP, low uE3, high hCG, high inhibin)'],
  'Ghai',
  'Newborn with facial dysmorphism and poor tone.',
  'Karyotype to confirm, echocardiogram for AV canal, TSH screen, early intervention, parental counseling.'
);
C['child-10-cystic-fibrosis'] = n(
  'Autosomal recessive CFTR mutation.',
  ['Affects lungs (recurrent pneumonia, bronchiectasis), pancreas (malabsorption), sweat glands (salty)', 'Sweat chloride >60 mmol/L diagnostic', 'Treatment: airway clearance, pancreatic enzymes, fat-soluble vitamins, CFTR modulators', 'Newborn screening: IRT'],
  'CFF',
  'Recurrent pneumonia + failure to thrive + salty sweat.',
  'Sweat chloride test to confirm; pulmonology referral, airway clearance, pancreatic enzymes, fat-soluble vit supplementation.'
);
C['child-11-patau-syndrome-trisomy-13'] = n(
  'Trisomy 13 — severe anomalies, most die in infancy.',
  ['Holoprosencephaly, midline cleft lip/palate, polydactyly, cardiac defects, cutis aplasia', '>80% mortality <1 y', 'Palliative + comfort care'],
  'Ghai',
  'Newborn with cleft lip, cardiac defect, polydactyly.',
  'Karyotype, genetic counseling, discuss with family about goals of care, supportive care.'
);
C['child-12-malnutrition-sam-and-mam'] = n(
  'WHO classification.',
  ['SAM: W/H <-3 Z OR MUAC <11.5 cm OR bilateral pitting edema', 'MAM: W/H -3 to -2 Z OR MUAC 11.5-12.5', 'SAM with complications → inpatient (F-75, F-100)', 'SAM without complications → outpatient RUTF', 'Check appetite test for decision'],
  'IAP, WHO, NRC guidelines',
  '2-y-old MUAC 10.8 cm, bilateral pitting edema, anorexia.',
  'SAM with complications — admit to NRC/SNCU, start F-75 (stabilization), treat infections, electrolytes (K, Mg), vit A, gradual transition to F-100.'
);
C['child-13-indicators-of-malnutrition'] = n(
  'Anthropometric indicators.',
  ['Weight-for-age: underweight (chronic or acute)', 'Height-for-age: stunting (chronic)', 'Weight-for-height: wasting (acute)', 'MUAC 6-59 mo: <11.5 cm SAM', 'BMI-for-age in older children'],
  'WHO growth standards',
  '5-y-old with W/H -3 Z.',
  'Severe wasting — acute malnutrition management, MUAC check, nutrition support.'
);
C['child-14-calorie-intake-of-1-year-old'] = n(
  'Age-based caloric requirements.',
  ['1 y: ~900-1000 kcal/d', 'RDA ICMR: 0-6 mo 550 kcal, 6-12 mo 670, 1-3 y 1010, 4-6 y 1360', 'Formula: 100 kcal/kg first 10 kg, 50/kg next 10, 20/kg thereafter'],
  'ICMR RDA 2020',
  '10 kg 1-y-old.',
  'Needs ~1000 kcal/day; balanced IYCF: continued breastfeeding, 3 meals + 2 snacks of family food.'
);
C['child-15-nutritional-status-assessment'] = n(
  'Methods.',
  ['Anthropometry (W, H, MUAC, skinfold)', 'Clinical: pallor, edema, Bitot spots, hair changes', 'Biochemical: Hb, albumin, prealbumin, vit levels', 'Dietary: 24 h recall, FFQ', 'Growth chart plotting'],
  'WHO',
  'OPD child screening.',
  'Plot W/H on growth chart, measure MUAC, clinical exam for pallor/edema, review dietary intake.'
);
C['child-16-kwashiorkor'] = n(
  'Protein deficiency (calories adequate) — severe malnutrition.',
  ['Bilateral pitting edema, flag-sign hair, moon facies, hepatomegaly, irritable-apathetic mood', 'Skin peeling, dermatoses', 'Albumin low', 'Treatment: F-75 stabilization → F-100, monitor refeeding syndrome'],
  'IAP',
  '3-y-old with pitting edema, hair depigmentation, distended abdomen.',
  'SAM-kwashiorkor — admit, F-75 cautious feeding, monitor for refeeding (P, Mg, K drop), vit A, zinc, deworm.'
);
C['child-17-vitamin-a-prophylaxis'] = n(
  'Mass prophylaxis to prevent blindness.',
  ['6-11 mo: 100,000 IU single dose', '12-59 mo: 200,000 IU q6 mo (first dose with 1st MR dose)', 'Maternal (first 6 wk postpartum): 200,000 IU', 'Signs of deficiency: night blindness, Bitot spots, xerosis, keratomalacia'],
  'MoHFW',
  '2-y-old at Vit A day.',
  'Administer 200,000 IU oral single dose, document card, next dose 6 mo.'
);
C['child-18-rickets'] = n(
  'See Surgery-33.',
  ['Vit D deficiency in growing bone', 'Bowed legs, rachitic rosary', 'Vit D3 60,000 IU weekly x6-8 wk + Ca'],
  'Ghai',
  '18-mo breastfed child on vegetarian mother with bowed legs.',
  'Vit D3 60,000 IU weekly + calcium; sunlight; diet.'
);
C['child-19-neonatal-period'] = n(
  'First 28 days of life.',
  ['Early: 0-7 d (highest mortality)', 'Late: 8-28 d', 'IMR = <1 y; NMR = <28 d', 'Components of mortality: prematurity, birth asphyxia, sepsis'],
  'NHM',
  'Item on neonatal period definition.',
  'First 28 days of life — classify mortality as NMR.'
);
C['child-20-kangaroo-mother-care-kmc'] = n(
  'Skin-to-skin contact for preterm/LBW.',
  ['Criteria: stable LBW, no severe illness', 'Upright chest-to-chest position, diapered only, head turned', 'Continuous or intermittent; aim >=1 h at a time', 'Benefits: thermoregulation, breastfeeding, weight gain, decreased mortality'],
  'WHO 2015',
  '1.4 kg preterm stable.',
  'Initiate KMC — baby skin-to-skin on mother\'s chest, upright, covered with blanket, continuous as tolerated, monitor vitals initially.'
);
C['child-21-breastfeeding'] = n(
  'Exclusive BF 0-6 mo, continue to 2 y with complementary.',
  ['Positions: cradle, cross-cradle, football, side-lying', 'LATCH score', 'Good attachment: chin touching breast, wide mouth, areola more visible above', '10 Steps to Successful BF (WHO-UNICEF BFHI)'],
  'WHO-UNICEF BFHI',
  '2-day-old baby with poor attachment and sore maternal nipples.',
  'Teach cross-cradle position, assess latch, chin touches breast with lower lip everted and mouth wide; correct attachment; check for tongue-tie.'
);
C['child-22-regurgitation-vs-vomiting'] = n(
  'Effortless passage (regurgitation/posset) vs forceful (vomiting).',
  ['Regurgitation: small amount, effortless, common in infants', 'Vomiting: forceful expulsion', 'Projectile non-bilious: pyloric stenosis', 'Bilious: obstruction distal to ampulla'],
  'Ghai',
  '6-wk-old with projectile non-bilious vomiting after feeds.',
  'Pyloric stenosis — USG pyloric muscle, correct hypochloremic alkalosis, plan Ramstedt pyloromyotomy.'
);
C['child-23-thermoregulation-in-neonates'] = n(
  'Newborns cold-stress prone — large SA, low fat.',
  ['Normal axillary 36.5-37.5°C', 'Mechanisms of loss: evaporation, conduction, convection, radiation', '4 warm chain: WHO — delivery room warm, immediate dry, skin-to-skin, warm transport', 'Hypothermia: <36.5°C; cold stress 36-36.4; moderate 32-35.9; severe <32'],
  'WHO',
  'Newborn axillary T 35.8°C.',
  'Moderate hypothermia — dry, skin-to-skin with mother under warm blanket, monitor T q30 min, check blood sugar.'
);
C['child-24-temperature-regulation-in-neonates'] = n(
  'See child-23. Same concept.',
  ['Warm chain', 'KMC for sustained warmth', 'Non-shivering thermogenesis via brown fat'],
  'WHO',
  'Item on brown fat.',
  'Brown fat (interscapular, axillae, around kidneys) is primary heat source via non-shivering thermogenesis.'
);
C['child-25-dehydration-signs-of-severe'] = n(
  'IMNCI severity criteria.',
  ['Severe (any 2): lethargy/unconscious, sunken eyes, unable to drink, skin pinch goes back very slowly (>2 s)', 'Some dehydration (any 2): restless/irritable, sunken eyes, drinks eagerly, skin pinch slow', 'No dehydration: none of above'],
  'IMNCI',
  '14-mo with diarrhea, lethargic, sunken eyes, unable to drink.',
  'Severe dehydration — Plan C IV RL 100 mL/kg (30 in 30 min then 70 in 2.5 h), reassess q15-30 min.'
);
C['child-26-hypoxia-signs'] = n(
  'Clinical indicators.',
  ['Restlessness early', 'Tachycardia, tachypnea', 'Cyanosis late (peripheral vs central)', 'Confusion, agitation, decreased LOC', 'SpO2 <94% on pulse oximetry'],
  'AHA',
  'Child with SpO2 88%, restless.',
  'Apply O2 via appropriate device (nasal cannula 1-2 L, mask 5-10 L as needed), reassess SpO2 target >=94%, investigate cause.'
);
C['child-27-cleft-lip-and-palate'] = n(
  'Congenital facial clefts.',
  ['Feeding: upright, special bottle (Haberman, Mead Johnson)', 'Repair: CL at 3 mo (rule of 10s — 10 wk, 10 g Hb, 10 lb wt); CP at 9-18 mo before speech', 'Post-op: elbow restraints, no pacifier/suction in mouth, logan bow for CL, upright feeds'],
  'AAP',
  'Newborn with cleft lip and palate.',
  'Upright feeding with special bottle, genetic counseling, refer to cleft team, plan surgery per rule of 10s, MDT approach.'
);
C['child-28-hyperthermia-normal-room-set-up'] = n(
  'Radiant warmer and neonatal room setup.',
  ['Room 25-28°C, no drafts', 'Radiant warmer temperature 36.5-37°C servo-controlled', 'Weighing scale pre-warmed', 'Humidification 40-60%', 'Monitor axillary T q1-4 h'],
  'WHO',
  'Newborn in radiant warmer with T 37.8.',
  'Reduce warmer set point, check for overheating, rule out infection (sepsis fever).'
);
C['child-29-meconium-aspiration-syndrome'] = n(
  'Aspiration of meconium-stained liquor causing respiratory distress.',
  ['Risk: post-dates, IUGR, fetal distress', 'CXR: patchy infiltrates, hyperinflation, atelectasis', 'Management: NRP updates: do NOT routinely intubate/suction vigorous meconium-stained babies; intubate only if airway obstruction apparent', 'Pulmonary hypertension risk; surfactant may help'],
  'NRP 8e',
  'Term baby born through thick meconium, not vigorous.',
  'Resuscitate per NRP: if not breathing/limp, intubate and suction below cords only if airway obstructed; otherwise, standard resuscitation; monitor in NICU.'
);
C['child-30-respiratory-distress-syndrome'] = n(
  'Surfactant deficiency in preterm.',
  ['Usually <34 wk; grunting, retractions, tachypnea, nasal flaring', 'CXR: ground-glass + air bronchograms', 'Treatment: antenatal steroids (betamethasone 12 mg IM q24 h x2) if PTL; postnatal: CPAP, surfactant via ETT, avoid oxygen toxicity'],
  'NICE CG',
  '30-wk preterm with tachypnea and grunting.',
  'CPAP 5-8 cm, surfactant via INSURE if requirements rising, avoid high FiO2, thermoregulation, IV fluids.'
);
C['child-31-neonatal-resuscitation'] = n(
  'NRP 8th edition algorithm.',
  ['Initial steps <30 s: warm, dry, stimulate, position, clear airway, assess', 'If HR <100, breathing, crying — assess color, observe', 'If apnea/gasping or HR <100 — PPV with bag-mask (rate 40-60/min, PIP 20-25 H2O initial)', 'If HR <60 after 30 s effective PPV — intubate + compressions 3:1 with PPV; 100% O2', 'HR <60 despite — IV epi 0.01-0.03 mg/kg (1:10000)'],
  'NRP 8e, AHA 2020',
  'Term baby born apneic, HR 80 at 30 s after initial steps.',
  'Start PPV at 40-60/min with 21% O2 (term) or 21-30% preterm via bag-mask, reassess in 15 s; escalate if no improvement.'
);
C['child-32-bag-valve-mask'] = n(
  'BVM technique.',
  ['Size: mask covers mouth + nose, not eyes', 'C-E grip: thumb + index on mask (C), other 3 fingers on mandible (E)', 'Rate 40-60/min newborn; volume till chest rises', 'Avoid over-inflation (pneumothorax)', 'If not working: MR SOPA — Mask reseal, Reposition airway, Suction, Open mouth, Pressure increase, Airway alternative'],
  'NRP',
  'Apneic baby during resuscitation.',
  'Apply mask with C-E grip, deliver PPV 40-60/min at PIP 20; if chest not rising, run MR SOPA.'
);
C['child-33-neonatal-moro-reflexes'] = n(
  'Primitive reflexes.',
  ['Moro: disappears 4-6 mo', 'Palmar grasp: 3-4 mo', 'Plantar grasp: 9-10 mo', 'Rooting: 4 mo', 'Tonic neck (fencer): 4-6 mo', 'Babinski: up to 1-2 y', 'Parachute reflex: 8-9 mo and persists'],
  'Ghai',
  '6-mo-old still has strong Moro.',
  'Persistent primitive reflex — red flag, refer for detailed neurodevelopmental assessment (cerebral palsy risk).'
);
C['child-34-hemorrhagic-disease'] = n(
  'Vitamin K deficiency bleeding of newborn.',
  ['Early: 0-24 h (maternal drugs: warfarin, phenytoin)', 'Classic: 2-7 d', 'Late: 2 wk - 6 mo (exclusive BF without vit K, malabsorption)', 'Prevention: vit K 1 mg IM at birth; low-dose risk late HDN'],
  'AAP',
  'Newborn 4 d with umbilical bleeding.',
  'Suspect classic HDN — vit K 1 mg IM, send PT/INR, fresh frozen plasma if severe bleed, verify vit K was given at birth.'
);
C['child-35-cardio-pulmonary-function'] = n(
  'Signs of good perfusion.',
  ['Pink skin, warm periphery, capillary refill <2 s', 'Strong central and peripheral pulses', 'Normal RR, clear breath sounds', 'UO >=1 mL/kg/h'],
  'AHA PALS',
  'Child post-sepsis recovery.',
  'Assess capillary refill, peripheral warmth, pulses, urine output as markers of recovery.'
);
C['child-36-pulse-rate-child'] = n(
  'Age-based pulse.',
  ['Newborn: 100-160', 'Infant: 100-160', 'Toddler: 80-130', 'Preschool: 80-120', 'School-age: 70-110', 'Adolescent: 60-100'],
  'PALS',
  '3-y-old with HR 180, fever 40.',
  'Sinus tachycardia in fever; treat fever with paracetamol, hydration, reassess.'
);
C['child-37-cyanotic-heart-disease'] = n(
  '5 Ts of cyanotic CHD.',
  ['TOF (commonest cyanotic >1 y)', 'Transposition of great arteries', 'Truncus arteriosus', 'Tricuspid atresia', 'TAPVR', 'Newborn cyanosis → prostaglandin E1 to keep ductus patent until surgery'],
  'Ghai',
  'Newborn with central cyanosis, murmur, no response to O2.',
  'Suspect cyanotic CHD — start PGE1 infusion 0.05-0.1 mcg/kg/min, urgent echo, avoid hyperoxia.'
);
C['child-38-pda'] = n(
  'Patent ductus arteriosus — L-to-R shunt.',
  ['Machinery murmur, bounding pulses, wide pulse pressure', 'Closure normal <72 h term', 'Indomethacin/ibuprofen closes medically', 'PDA ligation if persistent', 'Congenital rubella association'],
  'Ghai',
  'Preterm with continuous murmur and bounding pulses.',
  'Echo to confirm, start ibuprofen closure dose, fluid restriction; if fails, ligation.'
);
C['child-39-cyanosis'] = n(
  'Central vs peripheral.',
  ['Central: tongue/buccal mucosa; >=5 g/dL deoxyhemoglobin', 'Peripheral: distal limbs; cold, poor perfusion', 'Hyperoxia test: central CHD doesn\'t improve on 100% O2'],
  'Ghai',
  'Newborn with bluish tongue and lips.',
  'Central cyanosis — hyperoxia test, echo, rule out cyanotic CHD, start PGE1 if suspected.'
);
C['child-40-tof'] = n(
  'Tetralogy of Fallot — 4 features.',
  ['Pulmonary stenosis, RVH, VSD, overriding aorta', 'Tet spells: cyanosis, crying — knee-chest position + O2 + morphine + phenylephrine', 'Boot-shaped heart on CXR', 'Complete surgical repair'],
  'Ghai',
  '18-mo with sudden deep cyanosis and crying.',
  'Tet spell — knee-chest position, 100% O2, morphine 0.1 mg/kg IV, phenylephrine, fluids; plan for early surgical repair.'
);
C['child-41-mitral-stenosis'] = n(
  'Most often rheumatic.',
  ['Diastolic rumble, loud S1, opening snap', 'Left atrial enlargement, AF, systemic embolism', 'Pulmonary edema, hemoptysis', 'Treatment: balloon valvuloplasty, valve replacement, anticoagulation for AF'],
  'AHA',
  'Young female with history of RF, DOE, hemoptysis, AF.',
  'Mitral stenosis likely; echo, anticoagulate for AF, diuretics for congestion, refer for valvuloplasty.'
);
C['child-42-coarctation'] = n(
  'Narrowing of aorta — post-ductal usually.',
  ['Upper extremity HTN, lower extremity hypotension', 'Radiofemoral delay', 'Rib notching on CXR (children)', 'Associations: bicuspid aortic valve, Turner syndrome', 'Treatment: surgical repair or balloon angioplasty'],
  'AHA',
  'Child with HTN in arms, normal BP in legs, rib notching.',
  'Coarctation — echo, plan surgical or interventional repair, control BP.'
);
C['child-43-hematopoiesis'] = n(
  'Sites change with age.',
  ['Yolk sac: 3-8 wk gestation', 'Liver/spleen: 8-28 wk', 'Bone marrow: 28 wk onward', 'At birth: all bones', 'Adult: axial skeleton + proximal long bones'],
  'Harrison',
  'Adult with marrow reserve query.',
  'Adult hematopoiesis: vertebrae, sternum, ribs, pelvis, proximal long bones.'
);
C['child-44-hemophilia'] = n(
  'X-linked recessive coagulation factor deficiency.',
  ['A: factor VIII deficiency (85%)', 'B: factor IX (Christmas)', 'Hemarthrosis, deep muscle bleeds, easy bruising', 'Prolonged aPTT, normal PT, normal platelets, normal BT', 'Treatment: factor replacement (recombinant), desmopressin for mild A, avoid aspirin/IM injections'],
  'WFH',
  'Boy with recurrent knee hemarthrosis.',
  'Suspect hemophilia — factor VIII/IX assays, avoid IM injections and aspirin, factor replacement, multi-d care, immunize subcutaneously.'
);
C['child-45-leukemia'] = n(
  'See Medicine-31. Child leukemia typically ALL.',
  ['Fatigue, fever, bruising, bone pain, lymphadenopathy, hepatosplenomegaly', 'Bone marrow >20% blasts', 'Tumor lysis syndrome risk during induction', 'Long-term survival ALL ~85% with modern protocols'],
  'NCCN',
  'Pale irritable 4-y-old with bruises, WBC 100k, blasts 80%.',
  'Refer pediatric hem-onc, tumor lysis prevention (hydration, allopurinol/rasburicase), infection prophylaxis, central line for induction chemo.'
);
C['child-46-sequestration-crisis'] = n(
  'Sickle cell — massive splenic pooling of blood — hypovolemic shock.',
  ['Children <5 y with sickle cell disease', 'Rapid splenic enlargement, pallor, shock', 'Treatment: IV fluids, transfusion, splenectomy for recurrent'],
  'ASH',
  'Sickle cell 2-y-old with sudden pallor and huge spleen.',
  'Emergency — IV crystalloid, transfuse packed RBCs, admit to PICU, monitor for splenic recovery; discuss elective splenectomy.'
);
C['child-47-thalassemia'] = n(
  'See Medicine-30.',
  ['Beta thal major: lifelong transfusions', 'Iron chelation mandatory', 'HSCT curative in matched donor'],
  'TIF',
  'Beta thal major child on transfusion.',
  'Target pre-transfusion Hb 9-10, iron chelation deferasirox, monitor ferritin, HSCT evaluation.'
);
C['child-48-aplastic-anemia'] = n(
  'Pancytopenia from bone marrow failure.',
  ['Causes: idiopathic (most), drugs (chloramphenicol), radiation, viral (parvo B19, hepatitis)', 'Hypocellular marrow', 'Treatment: supportive (transfusion, antibiotics), immunosuppression (ATG + cyclosporine), HSCT'],
  'BCSH',
  'Adolescent with pancytopenia and hypocellular marrow.',
  'Protective isolation, transfusions as needed, refer for HSCT evaluation, immunosuppressive therapy.'
);
C['child-49-neutropenia'] = n(
  'ANC <1500.',
  ['Severe: ANC <500 — neutropenic fever emergency', 'Causes: post-chemo, viral, drugs, cyclic, Kostmann, autoimmune', 'Febrile neutropenia: blood cultures x2, start broad-spectrum within 1 h (pip-tazo or cefepime)'],
  'IDSA',
  'Post-chemo patient with ANC 200 and T 38.5.',
  'Blood cultures from CVC and peripheral, urine, CXR, start IV piperacillin-tazobactam within 1 h, isolate, avoid rectal temp/meds.'
);
C['child-50-meningitidis'] = n(
  'Pediatric meningitis.',
  ['<3 mo: GBS, E coli, Listeria', '3 mo-50 y: S pneumoniae, N meningitidis', '>50 y: + Listeria', 'Empiric <3 mo: ampicillin + cefotaxime; >3 mo: ceftriaxone + vancomycin ± dexamethasone'],
  'IDSA',
  '4-y-old with fever, neck stiffness, petechiae.',
  'Suspect meningococcal — LP urgent, ceftriaxone 80-100 mg/kg/day, droplet isolation, notify, chemoprophylaxis contacts (rifampicin).'
);
C['child-51-spina-bifida-occulta'] = n(
  'Mildest form — vertebral arch defect without herniation.',
  ['Usually asymptomatic; tuft of hair, dimple, lipoma over lumbosacral region', 'Tethered cord: bladder/bowel dysfunction', 'Imaging if symptoms'],
  'AAP',
  'Child with hairy patch on low back.',
  'Document, refer for spine MRI if any bladder/bowel symptoms, neurosurgical evaluation if tethering.'
);
C['child-52-babinski-sign'] = n(
  'Plantar reflex.',
  ['Normal infant to 2 y: extensor (upgoing)', 'After 2 y: flexor (downgoing) is normal; extensor = UMN lesion', 'Stroke lateral sole curving medially'],
  'Bates',
  '6-mo baby with upgoing Babinski.',
  'Normal finding; document.'
);
C['child-53-hydrocephalus'] = n(
  'CSF accumulation causing ventricular dilation and raised ICP.',
  ['Communicating vs non-communicating', 'Signs infant: bulging fontanel, sunset eyes, increasing head circumference', 'Cushing triad: HTN + bradycardia + irregular respiration (late)', 'Treatment: VP shunt, ETV; ensure normal position', 'Shunt infection: fever + irritability — urgent'],
  'AAP',
  'Infant with VP shunt and fever + vomiting.',
  'Suspect shunt infection/blockage — neurosurgery urgent, CT head, blood/CSF cultures, start empiric antibiotics.'
);
C['child-54-seizures'] = n(
  'See Medicine-64. Pediatric considerations.',
  ['Febrile seizure: 6 mo - 5 y with fever, usually <15 min, generalized; simple vs complex', 'Status: lorazepam 0.1 mg/kg (max 4 mg)', 'Avoid sodium valproate in girls of reproductive age'],
  'ILAE',
  '18-mo with 3-min generalized seizure during fever.',
  'Simple febrile seizure — reassure, antipyretic, identify infection source; no need for EEG/neuroimaging; educate parents about recurrence.'
);
C['child-55-post-natal-findings'] = n(
  'Normal newborn exam findings.',
  ['Vernix caseosa, lanugo, Mongolian spot, milia, erythema toxicum — all normal', 'Physiological jaundice 2-5 d', 'Breast engorgement, pseudomenses — maternal hormones', 'Brick-red urine from urate', 'Edema of scrotum/labia — transient'],
  'Ghai',
  '2-d-old with slate-gray patches on back.',
  'Mongolian spots — benign, reassure parents, document to avoid later abuse concerns.'
);
C['child-56-neural-tube-defect'] = n(
  'Incomplete closure of neural tube.',
  ['Anencephaly, spina bifida, meningocele, myelomeningocele', 'Maternal AFP elevated', 'Prevention: folic acid 400 mcg preconception to 12 wk (4 mg if prior NTD)', 'USG prenatal', 'Covering with sterile saline dressing if open at birth'],
  'AAP',
  'Prenatal USG shows myelomeningocele.',
  'MFM referral, genetic counseling, plan CS, prepare for neurosurgical repair in first 24-48 h of life.'
);
C['child-57-cerebral-palsy'] = n(
  'Static encephalopathy from perinatal brain insult.',
  ['Spastic (most common), dyskinetic, ataxic, mixed', 'Causes: hypoxia, prematurity, kernicterus, infection', 'Comorbidities: seizures, intellectual disability, hearing/vision loss, feeding difficulty, contractures', 'Management: MDT — PT, OT, speech, orthotics, botulinum toxin, baclofen, selective dorsal rhizotomy'],
  'AAP',
  '2-y-old preterm survivor with spastic diplegia.',
  'MDT referral — PT, OT, speech; orthotics; treat spasticity (oral baclofen/botox); manage comorbidities, caregiver support.'
);
C['child-58-brain-tumor'] = n(
  'Second commonest pediatric cancer after leukemia.',
  ['Mostly infratentorial: medulloblastoma, astrocytoma, ependymoma, brainstem glioma', 'Morning headache with vomiting, ataxia, focal deficits, cranial nerve palsy', 'MRI diagnostic', 'Treatment: surgery, radiation (>3 y), chemo'],
  'NCCN',
  'Child with morning vomiting, ataxia, papilledema.',
  'Urgent MRI — suspect infratentorial tumor; admit, dexamethasone for edema, neurosurgery referral.'
);
C['child-59-craniosynostosis'] = n(
  'Premature fusion of cranial sutures.',
  ['Sagittal: scaphocephaly (commonest)', 'Coronal: brachycephaly or plagiocephaly', 'Metopic: trigonocephaly', 'Lambdoid: posterior plagiocephaly', 'Syndromes: Crouzon, Apert', 'Surgical correction'],
  'AAP',
  'Infant with elongated head, palpable ridge.',
  'Refer for imaging and pediatric neurosurgery; plan cranial remodeling surgery before 1 y.'
);
C['child-60-pyloric-stenosis'] = n(
  'See Surgery-44.',
  ['Projectile non-bilious vomiting 4-6 wk', 'Hypochloremic hypokalemic metabolic alkalosis', 'USG pylorus; Ramstedt pyloromyotomy'],
  'Ghai',
  'Same as surgery entry.',
  'Correct electrolytes with NS + KCl before surgery; plan pyloromyotomy once corrected.'
);
C['child-61-hirschsprung'] = n(
  'Congenital absence of ganglion cells in distal bowel.',
  ['Failure to pass meconium within 48 h, abdominal distention, bilious vomiting', 'Rectal biopsy — diagnostic (absence of ganglion cells)', 'Treatment: definitive pull-through surgery (Duhamel, Soave, Swenson)', 'Complication: Hirschsprung enterocolitis — fever, distention, explosive stool'],
  'Ghai',
  'Newborn did not pass meconium in 24 h, distended abdomen.',
  'Nasogastric decompression, rectal exam reveals explosive decompression (classic), refer pediatric surgery, contrast enema, plan biopsy.'
);
C['child-62-tracheoesophageal-fistula'] = n(
  'Abnormal connection trachea-esophagus.',
  ['Type C (85%): proximal EA + distal TEF', 'VACTERL association', 'NG tube coils in upper pouch on X-ray', 'Copious frothy secretions, coughing-choking with feeds', 'Treatment: suction pouch, surgical repair'],
  'Ghai',
  'Newborn with excessive drooling and coughing on feeding.',
  'Stop feeds, nasal/oral suction, Replogle tube continuous low-pressure suction of upper pouch, head up 30°, IV fluids, urgent pediatric surgery referral.'
);
C['child-63-normal-respiratory-rate'] = n(
  'See Medicine-72.',
  ['Newborn 30-60, infant 30-50, toddler 24-40, preschool 22-34, school 18-30, adolescent 12-20'],
  'Ghai',
  'Newborn RR 50.',
  'Within normal — document and continue routine care.'
);
C['child-64-primary-apnea'] = n(
  'Stage of perinatal asphyxia where stimulation restores breathing.',
  ['Primary: responds to stimulation', 'Secondary: PPV needed, no response to stimulation', 'Clinically indistinguishable at birth; treat all as secondary'],
  'NRP',
  'Newborn not breathing after drying and stimulation.',
  'Assume secondary apnea — start PPV within 60 s of birth, monitor HR, continue algorithm.'
);
C['child-65-croup'] = n(
  'Laryngotracheobronchitis — parainfluenza virus.',
  ['6 mo - 3 y, barking cough, inspiratory stridor, hoarseness', 'Westley croup score', 'Steeple sign on AP neck X-ray', 'Treatment: humidified O2, dexamethasone 0.6 mg/kg single dose, nebulized epinephrine for severe'],
  'AAP',
  '2-y-old with barking cough and stridor at rest.',
  'Keep calm in parent\'s lap, humidified O2 if hypoxic, dexamethasone 0.6 mg/kg PO/IM single dose, nebulized epinephrine if severe, observe 4 h after epinephrine.'
);
C['child-66-asthma'] = n(
  'See Medicine-106. Pediatric additions.',
  ['Rule of 5 for PEFR monitoring', 'Trigger avoidance (dust, smoke, pets)', 'Inhaler technique with spacer <5 y', 'Avoid NSAIDs if sensitive'],
  'GINA',
  '5-y-old with acute wheeze.',
  'O2 if SpO2 <94%, salbutamol MDI via spacer 2-4 puffs q20 min x3, oral prednisolone 1-2 mg/kg, reassess, admit if incomplete response.'
);
C['child-67-pulmonary-atelectasis'] = n(
  'Collapse of lung tissue — decreased gas volume.',
  ['Obstructive (mucus plug), compressive, contraction, adhesive', 'Signs: diminished breath sounds, dullness, tracheal shift toward collapse', 'CXR: opacity + volume loss', 'Treatment: incentive spirometry, chest physiotherapy, bronchoscopy if mucus plug'],
  'Brunner',
  'Post-op day 2 with dullness right lower zone.',
  'Incentive spirometry, early ambulation, chest PT, pain control (to aid deep breathing), reassess with CXR.'
);
C['child-68-bronchopulmonary-dysplasia'] = n(
  'Chronic lung disease of preterm (O2 requirement >=28 d at 36 wk PMA).',
  ['Pathogenesis: baro/volutrauma + hyperoxia + inflammation', 'Prevention: antenatal steroids, gentle ventilation, surfactant, vit A, caffeine', 'Treatment: diuretics, bronchodilators, steroids (late), O2 at home'],
  'NICHD',
  '10-mo ex-28-wk preterm on home O2.',
  'Continue home O2, monitor growth, RSV prophylaxis palivizumab, feeding support, gradual wean of O2.'
);
C['child-69-sle'] = n(
  'Juvenile SLE.',
  ['ACR criteria: SOAP BRAIN MD', 'ANA, anti-dsDNA, anti-Sm', 'Lupus nephritis worse in JSLE', 'Treatment: hydroxychloroquine, steroids, immunosuppressants, belimumab'],
  'EULAR',
  'Teen girl with malar rash, arthralgia, proteinuria.',
  'Rheumatology referral, ANA/dsDNA/C3/C4/UA, hydroxychloroquine + prednisolone, sun protection, renal biopsy if nephritis.'
);
C['child-70-skin-variations'] = n(
  'Normal pediatric skin findings.',
  ['Mongolian spots: slate-gray lumbosacral', 'Milia: white pearly papules on nose', 'Erythema toxicum: benign 2-3 d', 'Stork bite (nevus simplex): nape/eyelid', 'Cradle cap (seborrhoeic): scalp scale'],
  'AAP',
  'Newborn with erythematous papules 48 h old.',
  'Erythema toxicum — benign, self-resolves, no treatment.'
);
C['child-71-cradle-cap'] = n(
  'Seborrheic dermatitis in infants.',
  ['Yellow greasy scales on scalp', 'Self-resolves by 6-12 mo', 'Treatment: mild shampoo, emollient, gentle brushing, topical antifungal if severe'],
  'AAP',
  '3-mo with thick yellow scales on scalp.',
  'Reassure; apply baby oil, massage, gentle shampoo; selenium shampoo if persistent.'
);
C['child-72-glomerulonephritis'] = n(
  'Post-streptococcal GN — commonest in children.',
  ['1-3 wk after GAS pharyngitis/impetigo', 'Hematuria (tea-colored), HTN, edema, proteinuria, oliguria', 'Low C3 (returns in 6-8 wk)', 'ASO titer elevated', 'Treatment: supportive — salt + fluid restriction, antihypertensives, penicillin for strep, usually self-limited'],
  'Ghai',
  '7-y-old with tea-colored urine, puffy face, HTN 2 wk after throat infection.',
  'PSGN — salt and fluid restriction, penicillin course to eradicate strep, BP control, monitor for renal failure, usually resolves.'
);
C['child-73-nephrotic-syndrome'] = n(
  'See Medicine-44.',
  ['MCD most common in kids', 'Steroid responsive', 'Complications: thrombosis, infection'],
  'Ghai',
  'Same as Medicine-44.',
  'Prednisolone 60 mg/m2/d, salt restriction, monitor for peritonitis/thrombosis.'
);
C['child-74-ophthalmic-neonatorum'] = n(
  'Neonatal conjunctivitis within 28 d.',
  ['Chemical (silver nitrate) day 1', 'Gonococcal day 2-5 (severe, hyperacute, risk of perforation)', 'Chlamydial 5-14 d (mucopurulent, mild)', 'HSV: vesicles', 'Prophylaxis: erythromycin ointment at birth', 'Gonococcal: ceftriaxone IV'],
  'AAP',
  '3-d-old with hyperacute purulent conjunctivitis.',
  'Suspect gonococcal — ceftriaxone 25-50 mg/kg single IV/IM, saline eye irrigation, isolate; test/treat mother and partner.'
);
C['child-75-adhd'] = n(
  'Attention-deficit hyperactivity disorder.',
  ['Inattention, hyperactivity, impulsivity for >=6 mo in >=2 settings before age 12', 'Types: predominantly inattentive, hyperactive/impulsive, combined', 'Treatment: behavioral therapy, parent training; methylphenidate/atomoxetine'],
  'DSM-5-TR',
  '7-y-old failing in school, cannot sit still.',
  'Vanderbilt/Conners assessment, rule out hearing/vision/learning disability, behavioral interventions first-line; stimulants if severe.'
);
C['child-76-kramers-index'] = n(
  'Kramer rule for clinical estimation of neonatal jaundice severity.',
  ['Zone 1 (face): ~5 mg/dL', 'Zone 2 (upper trunk): ~10', 'Zone 3 (lower trunk + thighs): ~12', 'Zone 4 (arms + legs): ~15', 'Zone 5 (palms + soles): >=15-20', 'Blanch skin over bony prominence with finger pressure'],
  'Ghai',
  'Day 3 newborn jaundice up to thighs.',
  'Kramer zone 3 (~12 mg/dL) — plot on Bhutani nomogram for hours of life, consider phototherapy if above threshold, encourage feeding.'
);
C['child-77-apgar-scoring'] = n(
  'Assessment of newborn at 1 and 5 min.',
  ['Appearance, Pulse, Grimace, Activity, Respiration: 0-2 each, total 0-10', '>=7 good; 4-6 moderate; <=3 severe', 'Does NOT dictate resuscitation (that is clinical)', 'Repeat q5 min until >=7 or 20 min'],
  'AAP',
  'Newborn with HR 90, weak cry, some flexion, grimace, pink body blue extremities.',
  'Score A1 P1 G1 A1 R1 = 5 (moderately depressed); continue PPV/suctioning per NRP, reassess q5 min.'
);
// EPI schedule intentionally duplicated with chn-1 for the syllabus id child-78
C['child-78-expanded-programme-on-immunization-epi-schedule'] = n(
  'Global EPI / India UIP schedule — see chn-1 for details.',
  ['Birth: BCG, OPV-0, HepB', '6, 10, 14 wk: OPV, Penta, Rota, fIPV, PCV', '9 mo: MR-1, JE-1, Vit A', '16-24 mo: DPT-B1, OPV-B, MR-2, PCV-B', '5 y DPT-B2, 10/16 y Td'],
  'MoHFW',
  'Item on EPI structure.',
  'Cite India UIP as described, including birth, 6/10/14 wk, 9 mo, and boosters.'
);
