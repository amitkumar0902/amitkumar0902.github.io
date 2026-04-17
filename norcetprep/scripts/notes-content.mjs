// High-yield note content for every syllabus ID.
// Each entry: { title?, definition, keyPoints[], pearls[], redFlags?[], sources[], videoIds?[], clinicalContext, nursingPriority }
// Title defaults to syllabus topic if omitted.

export const NOTE_CONTENT = {};

// ============ MIDWIFERY & OBSTETRICS ============

NOTE_CONTENT['midwifery-1-obstetric-score-gpal-tpal'] = {
  definition: 'Shorthand to capture obstetric history. GPAL = Gravida, Para, Abortion, Living. TPAL expands Para into Term, Preterm, Abortion, Living children.',
  keyPoints: [
    'Gravida = total pregnancies including current.',
    'Para = deliveries after 20 weeks (viable), whether live or stillborn.',
    'T = term (>=37 wk), P = preterm (20-36+6), A = abortions (<20 wk), L = living children.',
    'Twins count as one Para.',
    'Molar and ectopic pregnancies count as Gravida but not Para.'
  ],
  pearls: ['G5 P3+2 L3 means 5 pregnancies, 3 viable deliveries, 2 abortions, 3 living children.'],
  sources: ['Dutta Obstetrics 9e Ch 9'],
  clinicalContext: 'A multipara comes for booking visit stating: "2 live births at term, 1 preterm stillborn at 32 wk, 1 miscarriage at 10 wk; current pregnancy 12 wk."',
  nursingPriority: 'Document as G5 T2 P1 A1 L2 (with current pregnancy counted in Gravida only).'
};

NOTE_CONTENT['midwifery-2-calculation-of-edd-naegele-rule'] = {
  definition: 'Expected Date of Delivery = LMP + 9 months + 7 days (Naegele rule), assumes regular 28-day cycles.',
  keyPoints: [
    'Add 7 days and 9 months (or subtract 3 months and add 7 days plus a year) to LMP.',
    'Gestation from LMP = 40 weeks (280 days).',
    'For cycles >28 d, add extra days; for shorter cycles, subtract.',
    'Ultrasound dating most accurate in first trimester (CRL).',
    'Term = 37-42 weeks.'
  ],
  pearls: ['LMP 1 May 2025 → EDD 8 Feb 2026.'],
  sources: ['Dutta Obstetrics 9e Ch 6'],
  clinicalContext: 'Primigravida with regular 28-d cycles reports LMP on 10 Jan 2026.',
  nursingPriority: 'EDD = 17 Oct 2026 (add 9 months + 7 days).'
};

NOTE_CONTENT['midwifery-3-antenatal-care'] = {
  definition: 'Systematic supervision of a pregnant woman to detect deviations, promote health, and prepare for delivery and parenthood.',
  keyPoints: [
    'WHO 2016 model: 8 contacts (earlier 4-visit scheme).',
    'First visit: before 12 wk; investigations (Hb, blood group, urine, VDRL, HIV, HBsAg, USG).',
    'IFA: 60 mg elemental iron + 500 mcg folic acid daily from 2nd trimester x 6 months, continue postpartum.',
    'Calcium 500 mg BD from 14 wk until 6 mo postpartum.',
    'TT/Td: 2 doses 1 month apart; booster if previously immunized within 3 yr.'
  ],
  pearls: ['Danger signs: severe headache, blurring, convulsions, decreased fetal movements, PV bleed, fever.'],
  sources: ['MoHFW Guidelines for ANC', 'Park 26e'],
  clinicalContext: 'A 24-y-old G2P1 at 12 wk presents for first ANC visit with no prior booking.',
  nursingPriority: 'Start IFA and calcium, give Td-1, order booking investigations, counsel on danger signs.'
};

NOTE_CONTENT['midwifery-4-anemia-in-pregnancy'] = {
  definition: 'WHO: Hb <11 g/dL in pregnancy. Mild 10-10.9, moderate 7-9.9, severe <7.',
  keyPoints: [
    'Commonest type: iron deficiency (microcytic hypochromic).',
    'Treatment: oral iron 100-200 mg elemental/day; IV iron sucrose for severe or intolerance.',
    'Blood transfusion if Hb <7 and near term or in heart failure.',
    'Screen at booking, 26-28 wk, 36 wk.'
  ],
  pearls: ['Parenteral iron total dose = 2.4 x wt(kg) x (target - actual Hb) + 500 mg stores.'],
  redFlags: ['CCF, Hb <5, jaundice, GCS change → emergency.'],
  sources: ['AMB program MoHFW', 'Dutta 9e Ch 16'],
  clinicalContext: 'A 28-y-old G3P2 at 32 wk has Hb 6.8 g/dL, breathless on exertion, ankle edema.',
  nursingPriority: 'Admit, arrange packed RBC transfusion with furosemide cover, start IV iron after stabilization, monitor fetal heart.'
};

NOTE_CONTENT['midwifery-5-anemia-mukt-bharat-program'] = {
  definition: 'Flagship MoHFW program (2018) targeting 6 beneficiary groups with 6x6x6 strategy to reduce anemia prevalence by 3 percentage points/year.',
  keyPoints: [
    'Target groups: children 6-59 mo, 5-9 y, adolescents 10-19 y, women of reproductive age, pregnant women, lactating mothers.',
    'IFA colour-coded: pink (children 6-59 mo), blue (5-9 y), pink (10-19 y non-pregnant), red (pregnant/lactating), white (prophylaxis).',
    '6 interventions: IFA, deworming, testing/treatment, IEC, fortification, addressing non-nutritional causes.'
  ],
  pearls: ['Pregnant women get IFA-red: 60 mg iron + 500 mcg folic acid.'],
  sources: ['AMB Operational Guidelines 2018'],
  clinicalContext: 'ASHA visits a family with a 3-y-old, 8-y-old, and pregnant mother.',
  nursingPriority: 'Provide IFA-pink syrup biweekly for 3-y-old, IFA-blue tablet weekly for 8-y-old, IFA-red daily for mother.'
};

NOTE_CONTENT['midwifery-6-abortion-types-and-management'] = {
  definition: 'Termination of pregnancy <20 weeks or fetal weight <500 g.',
  keyPoints: [
    'Types: threatened, inevitable, incomplete, complete, missed, septic, recurrent (>=3 consecutive).',
    'Threatened: bleeding, closed os, viable fetus — rest, avoid coitus.',
    'Inevitable/incomplete: open os, heavy bleeding → evacuation (MVA/D&C).',
    'Missed: fetus dead but retained — watchful wait or misoprostol.',
    'Septic: fever, foul discharge — broad-spectrum antibiotics + evacuation.'
  ],
  pearls: ['Rh-negative women receive anti-D 300 mcg within 72 h of abortion.'],
  sources: ['Dutta 9e Ch 13'],
  clinicalContext: 'A 26-y-old at 10 wk arrives with heavy PV bleeding, passing clots, BP 90/60, HR 110, cervical os open.',
  nursingPriority: 'Start IV fluids, cross-match blood, prepare for MVA, give anti-D if Rh-negative, monitor for shock.'
};

NOTE_CONTENT['midwifery-7-mtp-act-and-procedures'] = {
  definition: 'MTP Act 1971 amended 2021: allows termination up to 20 wk (any RMP) and 20-24 wk for special categories (rape, incest, fetal anomaly, minors, disability) by 2 doctors.',
  keyPoints: [
    'Indications: risk to mother life/health, substantial fetal anomaly, rape/incest, contraceptive failure (married/unmarried), minor/mental illness.',
    'Consent: woman alone; if minor/mentally ill → guardian.',
    'Methods: medical (mifepristone + misoprostol up to 9 wk), MVA up to 12 wk, D&E 13-20 wk.',
    '>24 wk only for fetal anomaly by Medical Board.'
  ],
  pearls: ['Record-keeping is confidential; only Form C sent to CMO.'],
  sources: ['MTP Amendment Act 2021', 'Dutta 9e'],
  clinicalContext: 'A 19-y-old unmarried woman at 14 wk requests termination due to contraceptive failure.',
  nursingPriority: 'Counsel, obtain her consent alone (no partner/guardian needed), arrange MVA/D&E with 2 RMP signatures, maintain confidentiality.'
};

NOTE_CONTENT['midwifery-8-ectopic-pregnancy-management'] = {
  definition: 'Implantation outside uterine cavity; 95% in fallopian tube (ampulla most common).',
  keyPoints: [
    'Triad: amenorrhea + PV spotting + abdominal pain (often unilateral).',
    'Rupture → hemoperitoneum, shoulder tip pain (Kehr), shock.',
    'Diagnosis: serum β-hCG + TVS (empty uterus, adnexal mass).',
    'Management: methotrexate (stable, β-hCG <5000, size <3.5 cm, no cardiac activity); salpingectomy/salpingostomy if ruptured or large.',
    'Anti-D if Rh-negative.'
  ],
  pearls: ['Discriminatory zone: β-hCG >1500-2000 with empty uterus on TVS → strongly suspect ectopic.'],
  redFlags: ['Sudden severe abdominal pain + fainting = ruptured ectopic → emergency laparotomy.'],
  sources: ['Dutta 9e Ch 14'],
  clinicalContext: 'A 27-y-old with 7-wk amenorrhea presents with sudden right iliac fossa pain, BP 80/50, HR 124, shoulder tip pain.',
  nursingPriority: 'Two large-bore IV lines with crystalloid, cross-match 2 units, notify on-call surgeon for emergency laparotomy, give oxygen, NPO.'
};

NOTE_CONTENT['midwifery-9-hydatidiform-mole-snowstorm-appearance'] = {
  definition: 'Gestational trophoblastic disease — abnormal proliferation of trophoblasts. Complete mole: diploid paternal (46XX), no fetus. Partial: triploid (69XXX/XXY), some fetal parts.',
  keyPoints: [
    'Clinical: vaginal bleeding in 1st trimester, uterus larger than dates, hyperemesis, early PIH.',
    'USG: "snowstorm" (cluster of grapes) with theca-lutein cysts.',
    'β-hCG extremely high (>100,000 mIU/mL).',
    'Management: suction evacuation + weekly β-hCG until negative x3 then monthly x6-12 mo.',
    'Risk of choriocarcinoma ~2% (complete mole).'
  ],
  pearls: ['Avoid pregnancy x1 year post-evacuation to allow β-hCG monitoring.'],
  sources: ['Dutta 9e Ch 17'],
  clinicalContext: 'A 29-y-old G1 at 14 wk by dates has fundal height of 20 wk, PV bleed with grape-like tissue, BP 150/100, β-hCG 250,000.',
  nursingPriority: 'Prepare for urgent suction evacuation, control BP, save tissue for histopathology, start post-evacuation β-hCG surveillance.'
};

NOTE_CONTENT['midwifery-10-chorionic-villi-sampling'] = {
  definition: 'Prenatal diagnostic procedure at 10-13 wk sampling chorionic villi for karyotyping, DNA, enzyme studies.',
  keyPoints: [
    'Done transabdominally or transcervically under USG guidance.',
    'Results in 1-2 wk (faster than amniocentesis).',
    'Miscarriage risk ~0.5-1%.',
    'Indications: advanced maternal age, previous aneuploidy, carrier parents.'
  ],
  pearls: ['Cannot detect neural tube defects (no amniotic fluid analysis).'],
  sources: ['Dutta 9e'],
  clinicalContext: 'A 38-y-old G2 at 12 wk wants early karyotyping for Down risk.',
  nursingPriority: 'Prepare for transabdominal CVS under USG, obtain consent, counsel about 0.5-1% miscarriage risk, instruct to report cramping/bleeding.'
};

NOTE_CONTENT['midwifery-11-amniocentesis'] = {
  definition: 'Aspiration of amniotic fluid at 15-20 wk for genetic/biochemical testing; late amnio assesses fetal lung maturity.',
  keyPoints: [
    'USG-guided transabdominal approach.',
    'L/S ratio >=2 = lung maturity.',
    'AFP elevated in neural tube defects, decreased in Down.',
    'Miscarriage risk ~0.1-0.3%.'
  ],
  pearls: ['Maternal RhoGAM if Rh-negative.'],
  sources: ['Dutta 9e'],
  clinicalContext: 'G3 at 16 wk with abnormal triple marker screen.',
  nursingPriority: 'Assist with USG-guided amnio, empty bladder, send fluid for karyotype and AFP, give anti-D if Rh-negative, monitor for leakage/cramping.'
};

NOTE_CONTENT['midwifery-12-cord-prolapse'] = {
  definition: 'Umbilical cord descends alongside (occult) or past (overt) the presenting part through a ruptured membrane — obstetric emergency.',
  keyPoints: [
    'Risks: malpresentation, polyhydramnios, multiple gestation, long cord, unengaged head.',
    'Sign: palpable pulsating cord in vagina; fetal bradycardia.',
    'Immediate action: place woman in knee-chest or left lateral with hip elevated; manually elevate presenting part off the cord.',
    'Oxygen to mother, stop oxytocin, tocolytic if needed.',
    'Definitive: category 1 cesarean.'
  ],
  pearls: ['Do not handle cord excessively — vasospasm.'],
  redFlags: ['Loss of cord pulsation → fetal demise imminent; proceed to CS.'],
  sources: ['Dutta 9e Ch 28', 'NICE CG190'],
  clinicalContext: 'A multigravida at 38 wk with ruptured membranes, transverse lie, has a pulsating cord felt at introitus and FHR drops to 80/min.',
  nursingPriority: 'Knee-chest position, manually elevate presenting part, summon obstetric team, prepare for stat cesarean, oxygen by mask.'
};

NOTE_CONTENT['midwifery-13-shoulder-dystocia-mcroberts-maneuver'] = {
  definition: 'Failure of shoulders to deliver after head due to anterior shoulder impacted behind pubic symphysis.',
  keyPoints: [
    'HELPERR mnemonic: Help, Episiotomy consider, Legs (McRoberts), suPrapubic pressure, Enter maneuvers (Rubin, Woods corkscrew), Remove posterior arm, Roll (Gaskin).',
    'McRoberts: hyperflex maternal thighs onto abdomen — straightens sacrum.',
    'Suprapubic pressure (Rubin I): pushes anterior shoulder to oblique.',
    'Avoid fundal pressure — worsens impaction.',
    'Complications: Erb palsy, clavicle fracture, fetal hypoxia.'
  ],
  pearls: ['Turtle sign = retracted head after crowning — pathognomonic.'],
  sources: ['ACOG practice bulletin', 'Dutta 9e'],
  clinicalContext: 'A 32-y-old GDM mother pushes head out but shoulders retract, "turtle sign" present.',
  nursingPriority: 'Call for help, initiate McRoberts hyperflexion, apply suprapubic pressure (Rubin I), avoid fundal pressure, prepare for internal maneuvers.'
};

NOTE_CONTENT['midwifery-14-postpartum-hemorrhage-management-and-risk-factors'] = {
  definition: 'Blood loss >=500 mL after vaginal birth or >=1000 mL after CS within 24 h (primary PPH). Secondary PPH: 24 h to 6 wk.',
  keyPoints: [
    '4 Ts: Tone (atony 70-80%), Trauma (lacerations), Tissue (retained products), Thrombin (coagulopathy).',
    'First-line: uterine massage + IV oxytocin 10 IU bolus then 20-40 IU in 1 L NS @125 mL/h.',
    'Second-line: carboprost (hemabate) 250 mcg IM q15 min, max 2 mg — avoid in asthma.',
    'Methylergometrine 0.2 mg IM — avoid in hypertension.',
    'Misoprostol 800-1000 mcg per-rectal.',
    'Tranexamic acid 1 g IV within 3 h of onset.',
    'Balloon tamponade, B-Lynch suture, uterine artery ligation, hysterectomy — escalate.'
  ],
  pearls: ['Shock index (HR/SBP) >=1 → activate massive transfusion protocol.'],
  redFlags: ['Ongoing bleeding despite 4 uterotonics → operating theatre.'],
  sources: ['FIGO PPH 2022', 'WHO LCG 2020', 'Dutta 9e Ch 27'],
  videoIds: ['QNQK5gccmkM'],
  clinicalContext: 'Postpartum day 1, 28-y-old G3P3 soaks pad in 10 min, fundus boggy above umbilicus, BP 90/60, HR 118.',
  nursingPriority: 'Fundal massage first, then IV oxytocin 10 IU bolus, crystalloid bolus, cross-match 2 units, call obstetric team, monitor vitals q5 min.'
};

NOTE_CONTENT['midwifery-15-active-management-of-third-stage-of-labor-amtsl'] = {
  definition: 'Evidence-based bundle to reduce PPH risk during 3rd stage.',
  keyPoints: [
    'Oxytocin 10 IU IM within 1 minute of delivery of baby.',
    'Controlled cord traction (Brandt-Andrews) with counter-pressure on uterus.',
    'Uterine massage after placenta delivery; check fundus q15 min for 2 h.',
    'Reduces PPH incidence by ~60% vs physiological management.'
  ],
  pearls: ['Do not perform CCT without uterine contraction — risk of inversion.'],
  sources: ['WHO recommendations on PPH prevention 2012, reaffirmed 2018'],
  clinicalContext: 'Baby just delivered; placenta in situ.',
  nursingPriority: 'Administer oxytocin 10 IU IM within 1 min, await uterine contraction, apply controlled cord traction with counter-pressure, massage fundus once placenta delivered.'
};

NOTE_CONTENT['midwifery-16-partogram-and-who-labor-care-guide'] = {
  definition: 'Graphic record of labor progress and maternal/fetal observations; WHO Labor Care Guide (2020) replaces classic partogram with a more nuanced tool.',
  keyPoints: [
    'Plots cervical dilation, descent, contractions, FHR, maternal vitals over time.',
    'Alert line: expected dilation 1 cm/h from 4 cm onwards.',
    'Action line: 4 h right of alert line — intervention needed (augment or CS).',
    'LCG 2020: thresholds adjusted for nulliparous vs multiparous.',
    'Start recording in active phase (>=5 cm per WHO 2018).'
  ],
  pearls: ['Latent phase no longer plotted on LCG — only active phase.'],
  sources: ['WHO LCG 2020', 'MoHFW Dakshata'],
  clinicalContext: 'Primigravida in active labor at 5 cm; next check 4 h later shows 6 cm only.',
  nursingPriority: 'Cervicogram crossed alert line — notify clinician, assess contractions, hydration, bladder, consider augmentation with oxytocin if no contraindication.'
};

NOTE_CONTENT['midwifery-17-antepartum-hemorrhage-placenta-previa-and-abruptio'] = {
  definition: 'Vaginal bleeding after 20 wk. Previa: placenta over or near internal os. Abruptio: premature separation of normally implanted placenta.',
  keyPoints: [
    'Previa: painless, bright-red bleeding; soft non-tender uterus; normal FHR.',
    'Abruptio: painful, dark bleeding (may be concealed); woody/tender uterus; fetal distress.',
    'Do NOT do a PV exam in suspected previa until USG rules it out.',
    'Management: USG, fetal monitoring, IV access, cross-match; CS if term or distress.'
  ],
  pearls: ['Couvelaire uterus = placental abruption with myometrial extravasation.'],
  redFlags: ['DIC in severe abruption — monitor coags.'],
  sources: ['Dutta 9e Ch 18-19'],
  clinicalContext: 'A G2 at 32 wk presents with sudden severe abdominal pain, dark PV bleed, woody hard uterus, FHR 90.',
  nursingPriority: 'No vaginal exam, two large-bore IVs, oxygen, cross-match 2 units, urgent USG, prepare for emergent CS — this is abruption with fetal distress.'
};

NOTE_CONTENT['midwifery-18-placenta-accreta-types'] = {
  definition: 'Abnormally adherent placenta invading myometrium due to deficient decidua.',
  keyPoints: [
    'Accreta: attached to myometrium (commonest).',
    'Increta: invades into myometrium.',
    'Percreta: through myometrium, may involve bladder.',
    'Risk: prior CS, previa, curettage, advanced maternal age.',
    'Management: planned CS-hysterectomy at 34-36 wk; avoid forced removal.'
  ],
  sources: ['Dutta 9e'],
  clinicalContext: 'G4P3 with 2 prior CS; anterior low placenta on USG, MRI shows invasion to bladder.',
  nursingPriority: 'Plan hospital delivery with urology backup, avoid manual removal, arrange blood products, anticipate hysterectomy.'
};

NOTE_CONTENT['midwifery-19-breech-maneuvers-lovset-burns-marshall'] = {
  definition: 'Assisted techniques to deliver a breech-presenting fetus.',
  keyPoints: [
    'Lovset: rotate body 180° to deliver shoulders under pubic arch.',
    'Burns-Marshall: body suspended, allowing head to flex via gravity, then delivered by traction.',
    'Mauriceau-Smellie-Veit: for after-coming head — two fingers in mouth, traction on shoulders.',
    'Pinard maneuver: deliver extended legs.',
    'Always a skilled operator; assisted not spontaneous.'
  ],
  pearls: ['External cephalic version preferred >36 wk if no contraindication.'],
  sources: ['Dutta 9e Ch 23'],
  clinicalContext: 'Footling breech in a multipara with advanced cervical dilation.',
  nursingPriority: 'Summon obstetrician, prepare for assisted breech or emergency CS, assist with Lovset for shoulders and Mauriceau for head.'
};

NOTE_CONTENT['midwifery-20-leopold-maneuvers'] = {
  definition: 'Four systematic palpations to determine fetal presentation, lie, position, engagement.',
  keyPoints: [
    'First (fundal grip): what occupies fundus — breech vs head.',
    'Second (lateral/umbilical): locate fetal back.',
    'Third (Pawlik): presenting part above pubis — head vs breech, mobility.',
    'Fourth (pelvic grip): engagement depth — facing feet.',
    'Perform after 26 wk when parts are distinguishable.'
  ],
  pearls: ['Head feels hard, round, ballotable; breech feels soft, irregular, nodular.'],
  sources: ['Dutta 9e Ch 9'],
  clinicalContext: 'A 28-y-old G2 at 34 wk comes for ANC; nurse performs abdominal exam.',
  nursingPriority: 'Empty bladder, supine with knees slightly flexed, perform Leopold 1-4 sequentially, document lie, presentation, position, engagement.'
};

NOTE_CONTENT['midwifery-21-fetal-skull-diameters'] = {
  definition: 'Diameters through which the fetal head passes the pelvis.',
  keyPoints: [
    'Suboccipito-bregmatic (SOB) 9.5 cm — flexed head, vertex presentation.',
    'Occipito-frontal 11.5 cm — deflexed.',
    'Mento-vertical 14 cm — brow (worst).',
    'Submento-bregmatic 9.5 cm — face.',
    'Biparietal 9.5 cm (transverse).'
  ],
  pearls: ['SOB = smallest; vertex presentation is most favorable.'],
  sources: ['Dutta 9e'],
  clinicalContext: 'OSCE-style item on presenting diameters.',
  nursingPriority: 'Identify vertex as SOB 9.5 cm — favorable for vaginal delivery.'
};

NOTE_CONTENT['midwifery-22-instruments-for-curettage-and-cesarean-section'] = {
  definition: 'Surgical instruments commonly identified in NORCET image-based questions.',
  keyPoints: [
    'D&C tray: Sims speculum, Hegar dilators (4-16 mm), Karman cannula/curette, sponge forceps, anterior vulsellum.',
    'CS tray: Balfour/Doyen retractor, Green-Armytage haemostatic forceps (uterine edge), Allis, Babcock, umbilical cord clamp.',
    'Sponge counts before and after; protect bladder with retractor.'
  ],
  sources: ['Dutta 9e'],
  clinicalContext: 'OSCE image of Green-Armytage forceps.',
  nursingPriority: 'Identify Green-Armytage — haemostatic clamp used on uterine incision edges during CS.'
};

NOTE_CONTENT['midwifery-23-episiotomy'] = {
  definition: 'Surgical incision of perineum at crowning to enlarge vaginal outlet.',
  keyPoints: [
    'Types: median (midline), mediolateral (45° most common), lateral, J-shaped.',
    'Mediolateral preferred for lower extension risk.',
    'Timing: at crowning when 3-4 cm of head visible.',
    'Repair layers: vaginal mucosa (continuous), muscle (interrupted), skin (subcuticular).',
    'Not routine — selective use per WHO.'
  ],
  pearls: ['Extension risk: median > mediolateral.'],
  sources: ['Dutta 9e'],
  clinicalContext: 'Primigravida crowning, rigid perineum, head not advancing.',
  nursingPriority: 'Perform mediolateral episiotomy at 45° after local infiltration, wait for next contraction, deliver head in flexion.'
};

NOTE_CONTENT['midwifery-24-diabetes-in-pregnancy-gdm'] = {
  definition: 'Glucose intolerance with onset or first recognition in pregnancy.',
  keyPoints: [
    'Screening: DIPSI — 75 g oral glucose, 2-h venous ≥140 mg/dL = GDM.',
    'Target: FBS <95, 1-h <140, 2-h <120 mg/dL.',
    'First-line: diet (25-30 kcal/kg) + exercise; insulin if not controlled.',
    'Metformin alternative.',
    'Risks: macrosomia, shoulder dystocia, hypoglycemia of newborn, polyhydramnios.'
  ],
  pearls: ['Rescreen postpartum at 6 wk with 75 g OGTT for overt DM.'],
  sources: ['DIPSI 2014', 'Dutta 9e'],
  clinicalContext: 'G1 at 26 wk has DIPSI 2-h 168 mg/dL; FBS 112 next day.',
  nursingPriority: 'Start MNT with dietitian, initiate insulin (basal-bolus), self-monitor glucose 4x/day, counsel about hypoglycemia signs, plan growth USG.'
};

NOTE_CONTENT['midwifery-25-pregnancy-induced-hypertension-pih'] = {
  definition: 'BP >=140/90 after 20 wk in a previously normotensive woman.',
  keyPoints: [
    'Gestational HTN: no proteinuria.',
    'Preeclampsia: HTN + proteinuria >=300 mg/24h or symptoms (headache, visual, epigastric, pulmonary edema).',
    'Severe features: BP >=160/110, platelets <100k, creatinine >1.1, LFT 2x, pulmonary edema.',
    'Eclampsia: preeclampsia + seizures.',
    'Treatment: labetalol/nifedipine, MgSO4 for seizure prophylaxis, delivery is cure.'
  ],
  pearls: ['MgSO4 Pritchard regimen: 4 g IV + 10 g IM loading; 5 g IM q4h maintenance.'],
  redFlags: ['HELLP = Hemolysis, Elevated LFT, Low Platelets.'],
  sources: ['ACOG 2020', 'Dutta 9e'],
  clinicalContext: 'G1 at 34 wk with BP 170/115, urine 3+, headache, epigastric pain.',
  nursingPriority: 'Admit, start MgSO4 loading 4 g IV over 20 min, labetalol IV for BP, urinary catheter, DTR q1h, deep tendon reflexes, plan delivery.'
};

NOTE_CONTENT['midwifery-26-anti-d-dose-and-indication'] = {
  definition: 'Rh(D) immunoglobulin prevents alloimmunization in Rh-negative mothers.',
  keyPoints: [
    'Dose: 300 mcg (1500 IU) IM; mini 50 mcg (250 IU) for <12 wk events.',
    'Timing: within 72 h of sensitizing event.',
    'Indications: 28 wk antenatal prophylaxis, delivery of Rh+ baby, abortion, ectopic, CVS/amnio, abdominal trauma, APH.',
    'Kleihauer-Betke test for fetomaternal hemorrhage if large bleed suspected.'
  ],
  pearls: ['Postpartum dose given even if antenatal dose received.'],
  sources: ['Dutta 9e', 'FOGSI GCPR'],
  clinicalContext: 'Rh-negative G2 delivers Rh-positive baby.',
  nursingPriority: 'Administer anti-D 300 mcg IM within 72 h postpartum, send cord blood for Coombs, document.'
};

NOTE_CONTENT['midwifery-27-twins-types-superfecundation-superfetation'] = {
  definition: 'Multiple gestation variations.',
  keyPoints: [
    'Dizygotic (2 ova, 2 sperm) — dichorionic diamniotic.',
    'Monozygotic: split <72 h → DCDA; 4-8 d → MCDA (commonest MZ); 8-13 d → MCMA; >13 d → conjoined.',
    'Superfecundation: 2 ova fertilized in same cycle by different acts of intercourse (may be different fathers).',
    'Superfetation: 2nd ovum fertilized during existing pregnancy — very rare.'
  ],
  sources: ['Dutta 9e Ch 16'],
  clinicalContext: 'USG at 9 wk shows 2 sacs, 2 yolk sacs, thick membrane.',
  nursingPriority: 'Identify DCDA twins; schedule growth scans q4 wk from 24 wk.'
};

NOTE_CONTENT['midwifery-28-lochia-types-rubra-serosa-alba'] = {
  definition: 'Uterine discharge after childbirth consisting of blood, decidua, and tissue debris.',
  keyPoints: [
    'Lochia rubra: dark/bright red, days 0-3/4 — RBCs + decidua.',
    'Lochia serosa: brownish-pink, days 4-10/11 — decreasing RBCs, increased leukocytes.',
    'Lochia alba: yellow-white, day 11 to ~6 weeks — leukocytes, mucus, epithelial cells.',
    'Amount scale: scant <2.5 cm, light <10 cm, moderate >10 cm, heavy saturates pad <1 h, excessive pad saturated in 15 min.',
    'Odor fleshy not foul; foul = infection.'
  ],
  pearls: ['Persistent rubra beyond day 4 or return of rubra suggests retained products.'],
  redFlags: ['Saturated pad in 15 min → PPH protocol.'],
  sources: ['Dutta 9e Ch 10', 'Myles Midwifery 17e'],
  videoIds: ['QNQK5gccmkM'],
  clinicalContext: 'Postpartum day 6, fundus 2 finger below umbilicus, lochia pinkish-brown, no odor.',
  nursingPriority: 'Document as lochia serosa — normal finding; continue perineal care, monitor for return of bright red bleed.'
};

NOTE_CONTENT['midwifery-29-labor-stages-and-cardinal-movements'] = {
  definition: 'Labor divided into 4 stages; fetus undergoes 7 cardinal movements.',
  keyPoints: [
    'Stage 1: onset of regular contractions to full dilation. Latent <6 cm, active 6-10 cm.',
    'Stage 2: full dilation to delivery of baby. Passive + active.',
    'Stage 3: delivery of placenta (usually within 30 min).',
    'Stage 4: first 1-2 h postpartum — risk period for PPH.',
    'Cardinal movements: Engagement, Descent, Flexion, Internal rotation, Extension, External rotation, Expulsion.'
  ],
  pearls: ['Duration: nullipara stage 1 ~12-14 h, stage 2 up to 2 h.'],
  sources: ['Dutta 9e Ch 20'],
  clinicalContext: 'Primigravida 6 cm dilated, contractions q3-4 min, head at 0 station.',
  nursingPriority: 'Document as active phase stage 1; continuous FHR monitoring, encourage position changes, oral fluids, partogram.'
};

NOTE_CONTENT['midwifery-30-normal-puerperium'] = {
  definition: '6-week period after delivery during which reproductive organs return to pre-pregnant state.',
  keyPoints: [
    'Uterus involutes ~1 cm/day; reaches pelvis by day 10.',
    'Lochia rubra → serosa → alba.',
    'Menstruation returns ~6 wk (non-lactating) or later if breastfeeding.',
    'Breast: colostrum days 1-3 → mature milk; lactational amenorrhea if exclusive.'
  ],
  sources: ['Dutta 9e Ch 10'],
  clinicalContext: 'Postnatal day 3, fundus 3 fingers below umbilicus, lochia rubra moderate.',
  nursingPriority: 'Document normal involution, reinforce breastfeeding, perineal care, early ambulation, contraception counselling.'
};

// ============ GYNECOLOGY ============
NOTE_CONTENT['gyn-1-vaginitis'] = {
  definition: 'Inflammation of vagina due to infection, irritation, or atrophy.',
  keyPoints: [
    'BV (Gardnerella): gray fishy discharge, pH >4.5, clue cells — metronidazole.',
    'Candidiasis: white curdy, itchy, pH normal — fluconazole.',
    'Trichomoniasis: frothy yellow-green, strawberry cervix — metronidazole + treat partner.'
  ],
  pearls: ['Amsel criteria (3/4): homogeneous discharge, pH >4.5, +whiff test, clue cells.'],
  sources: ['CDC STI 2021', 'Dutta Gyne 7e'],
  clinicalContext: '25-y-old with frothy yellow-green discharge, strawberry cervix on speculum.',
  nursingPriority: 'Wet mount for trichomonads, start metronidazole 2 g PO stat for patient AND partner, screen for other STIs.'
};

NOTE_CONTENT['gyn-2-pelvic-inflammatory-disease-pid'] = {
  definition: 'Infection of upper genital tract — endometritis, salpingitis, tubo-ovarian abscess.',
  keyPoints: [
    'Organisms: N. gonorrhoeae, C. trachomatis, anaerobes.',
    'Clinical: lower abdominal pain, fever, cervical motion tenderness, adnexal tenderness.',
    'Treatment (CDC): ceftriaxone 500 mg IM + doxy 100 mg BD x14d + metronidazole 500 mg BD x14d.',
    'Complications: infertility, ectopic, chronic pelvic pain, Fitz-Hugh-Curtis (perihepatitis).'
  ],
  sources: ['CDC STI 2021'],
  clinicalContext: '22-y-old with lower abdominal pain, fever 38.5, purulent cervical discharge, cervical motion tenderness.',
  nursingPriority: 'NAAT for GC/CT, start ceftriaxone IM + oral doxy + metronidazole, counsel about partner treatment and condom use.'
};

NOTE_CONTENT['gyn-3-syndromic-management-of-pid-and-vaginitis'] = {
  definition: 'NACO kit-based syndromic approach in primary care without lab confirmation.',
  keyPoints: [
    'Kit 1 (urethral/anorectal discharge): kanamycin + doxycycline.',
    'Kit 2 (vaginitis): secnidazole + fluconazole.',
    'Kit 6 (PID): cefixime + doxycycline + metronidazole.',
    'Treat partner, advise condom, HIV/VDRL screening.'
  ],
  sources: ['NACO STI/RTI guidelines'],
  clinicalContext: 'PHC: 24-y-old with lower abdominal pain and discharge.',
  nursingPriority: 'Use NACO Kit 6 for PID, counsel both partners, schedule follow-up in 7 days.'
};

NOTE_CONTENT['gyn-4-emergency-contraceptives'] = {
  definition: 'Prevent pregnancy after unprotected intercourse.',
  keyPoints: [
    'Levonorgestrel 1.5 mg single dose within 72 h (best <24 h).',
    'Ulipristal 30 mg within 120 h.',
    'Copper IUD within 5 days — most effective (>99%).',
    'Yuzpe: combined OC — high-dose estrogen + progestin (less preferred).'
  ],
  pearls: ['Not abortifacient — prevents ovulation/implantation.'],
  sources: ['WHO EC guideline 2018', 'NFHS-5'],
  clinicalContext: '20-y-old student 18 h after unprotected sex.',
  nursingPriority: 'Administer LNG 1.5 mg stat, counsel about mild nausea, advise repeat if vomits within 2 h, offer ongoing contraception.'
};

NOTE_CONTENT['gyn-5-intrauterine-device-cu-t'] = {
  definition: 'Long-acting reversible contraceptive (LARC).',
  keyPoints: [
    'Cu-T 380A: 10 years; Cu-T 375: 5 years.',
    'Mechanism: spermicidal + endometrial change.',
    'Insertion within 7 days of menses or immediately post-abortal/postpartum.',
    'Side effects: heavier bleeding, cramping first months.',
    'Contraindications: pregnancy, active PID, distorted uterus, Wilson disease.'
  ],
  pearls: ['Check threads monthly; PID risk highest first 3 weeks.'],
  sources: ['MoHFW FP Guidelines'],
  clinicalContext: 'P2 wants long-term reversible contraception.',
  nursingPriority: 'Rule out pregnancy/PID, insert Cu-T 380A in lithotomy with sponge forceps, teach thread check, follow up at 6 weeks.'
};

NOTE_CONTENT['gyn-6-ocp-mala-d-mala-n-absolute-contraindications'] = {
  definition: 'Combined or progestin-only oral contraceptives.',
  keyPoints: [
    'MALA-D: subsidized COC — levonorgestrel 0.15 mg + ethinyl estradiol 0.03 mg (7 Fe tabs).',
    'MALA-N: free COC distributed via sub-centres.',
    'Absolute contraindications: pregnancy, breast cancer, migraine with aura, smoker >=35 y, DVT/PE, CAD, active liver disease, uncontrolled HTN.',
    'Start: day 1-5 of cycle, back-up x7 days if started later.'
  ],
  pearls: ['Break-through bleeding common first 3 cycles.'],
  sources: ['MoHFW FP Guidelines', 'WHO MEC'],
  clinicalContext: '32-y-old smoker requests OCP.',
  nursingPriority: 'Assess: age 32 + smoker is MEC category 3 if <15 cig, category 4 if >=15 — counsel alternative (DMPA, IUD); avoid COC.'
};

NOTE_CONTENT['gyn-7-pap-smear'] = {
  definition: 'Cervical cancer screening via Papanicolaou stain of cervical cells.',
  keyPoints: [
    'Start at 21 y (USA); India: every 5 y from 30-65 y per screening program.',
    'HPV co-testing preferred >30 y.',
    'Bethesda system: ASCUS, LSIL, HSIL, AGC, AIS.',
    'Sample from transformation zone using Ayre spatula + cytobrush.',
    'No douche, tampons, intercourse 48 h prior; not during menses.'
  ],
  pearls: ['VIA (visual inspection with acetic acid) alternative in resource-limited settings.'],
  sources: ['ICMR 2016', 'ACOG 2020'],
  clinicalContext: '35-y-old for routine screening.',
  nursingPriority: 'Prepare speculum, obtain sample from transformation zone with brush + spatula, send in fixative or liquid-based cytology, schedule next in 5 y if normal.'
};

NOTE_CONTENT['gyn-8-vasectomy-and-tubectomy'] = {
  definition: 'Permanent sterilization procedures.',
  keyPoints: [
    'Vasectomy: bilateral vas deferens ligation under LA, 15-30 min; back-up method x3 months until azoospermia confirmed.',
    'Tubectomy: Pomeroy, Parkland, Irving, Kroener techniques; interval or post-partum.',
    'Failure: tubectomy ~1/200; vasectomy ~1/2000.',
    'Counselling: irreversibility, failure rate, regret.'
  ],
  sources: ['MoHFW Sterilization Standards 2014'],
  clinicalContext: '40-y-old P3 husband consents for sterilization.',
  nursingPriority: 'Counsel on irreversibility, schedule NSV, advise back-up contraception x3 months until azoospermia, document consent.'
};

NOTE_CONTENT['gyn-9-hpv-and-vaccine'] = {
  definition: 'HPV causes >90% cervical cancer; vaccines are preventive.',
  keyPoints: [
    'Oncogenic types: 16, 18 (70%); low-risk: 6, 11 (warts).',
    'Vaccines: bivalent (16,18), quadrivalent (6,11,16,18), nonavalent (9-valent).',
    'Schedule: 9-14 y → 2 doses 6-12 mo apart; >=15 y → 3 doses (0, 1-2, 6 mo).',
    'India: CERVAVAC (indigenous quadrivalent) launched 2022.'
  ],
  pearls: ['Vaccination does not replace screening.'],
  sources: ['WHO HPV 2022', 'FOGSI'],
  clinicalContext: 'Mother of 12-y-old daughter asks about HPV vaccine.',
  nursingPriority: 'Counsel 2-dose schedule (0 and 6 mo), administer first dose IM deltoid, document, schedule 2nd.'
};

NOTE_CONTENT['gyn-10-ovarian-tumors-and-tumor-markers'] = {
  definition: 'Ovarian neoplasms classified by cell of origin.',
  keyPoints: [
    'Epithelial (most common): serous, mucinous — CA-125.',
    'Germ cell: dysgerminoma (LDH), yolk sac (AFP), choriocarcinoma (β-hCG), teratoma.',
    'Sex-cord stromal: granulosa (inhibin, estrogen), Sertoli-Leydig (androgens).',
    'Meigs syndrome: benign ovarian fibroma + ascites + right pleural effusion.'
  ],
  sources: ['Dutta Gyne 7e'],
  clinicalContext: '55-y-old with pelvic mass and CA-125 500.',
  nursingPriority: 'Refer to gyne-oncology, document tumor markers, psychological support, prep for staging laparotomy.'
};

NOTE_CONTENT['gyn-11-semen-analysis'] = {
  definition: 'WHO 2021 reference values for seminal fluid.',
  keyPoints: [
    'Volume >=1.4 mL, pH >=7.2, count >=16 million/mL.',
    'Motility: >=42% total, >=30% progressive.',
    'Morphology: >=4% normal forms.',
    'Abstinence 2-7 days; collect into sterile container; analyze within 1 h.'
  ],
  pearls: ['Azoospermia: zero sperm on 2 separate samples.'],
  sources: ['WHO Manual 2021'],
  clinicalContext: 'Couple with 2 y infertility.',
  nursingPriority: 'Instruct 3-day abstinence, sterile masturbation collection, keep sample at body temp, deliver to lab within 1 h.'
};

// Continue with Surgery, Foundation, CHN, Medicine, ENT, Child, Pharma, Mental, Micro, Biochem, Anatomy...
// Due to length, use condensed format for remaining topics — still producing required fields.
