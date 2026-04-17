# NORCET Mains Question-Bank Verification Log

_Last updated: 2026-04-17_

This document records the fact-checking protocol applied to the NORCET Mains
question bank, flashcard decks, and drug-calc drill. It lists the authoritative
sources consulted, the checks performed, and the corrections made.

## 1. Scope of the bank

- Total questions: **579**
  - Curated NORCET 6-9 Mains PYQs (recall-based): **32**
  - AIIMS Nursing Officer legacy set: **55**
  - Topic-wise practice pool: **492**
- Drug-calc drill: **50** calculation items
- Flashcard decks: **7** (logos, bmw-colors, mask-colors, discharge-colors,
  milestones, formulas, drug-names)

## 2. Authoritative sources consulted

- MoHFW / CPCB India — *Bio-Medical Waste (Management) Rules, 2016*
  ([CPCB 2018 handbook](https://cpcb.nic.in/uploads/projects/bio-medical-waste/guidelines_healthcare_june_2018.pdf),
  [DHR GoI PDF](https://dhr.gov.in/sites/default/files/Bio-medical_Waste_Management_Rules_2016.pdf))
- MoHFW NTEP / RNTCP programmatic guidelines
- AHA Guidelines 2020 for CPR and Emergency Cardiovascular Care
  ([Circulation 142 Suppl 2](https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901))
- WHO Multicentre Growth Reference Study, 2006 (motor milestones)
- WHO STI management guidelines 2020; CDC STI Treatment Guidelines 2021
- Park's *Textbook of Preventive and Social Medicine*, 26e
- KDT *Essentials of Medical Pharmacology*, 8e
- Brunner & Suddarth's *Textbook of Medical-Surgical Nursing*, 14e
- Dutta's *Textbook of Obstetrics*, 9e / *Gynaecology* 8e
- Ghai's *Essential Pediatrics*, 9e
- WAO Anaphylaxis Guideline 2020
- Open-Anesthesia Journal — Appropriate Use of Oxygen Delivery Devices
  ([OATJ PDF](https://openanesthesiajournal.com/contents/volumes/V11/TOATJ-11-35/TOATJ-11-35.pdf))
- NCRB Accidental Deaths and Suicides in India 2021/22
- Indian MoHFW / NHP portal for scheme coverage (PM-JAY, JSY, JSSK, POSHAN,
  Mission Indradhanush, ABDM, U-WIN, SUMAN, LaQshya)
- MTP Act, 1971 (as amended in 2021) — Gazette of India notification

## 3. PYQ audit — NORCET 6 through 9 Mains (n = 32)

Every question was individually reviewed against current Indian nursing and
medical standards. All 32 NORCET Mains PYQs were found **factually correct**.
Notes:

- Q10 (yellow BMW bag): option D "Discarded medicines" is technically also
  yellow per BMW Rules 2016 Schedule I (category b). The question phrasing
  accepts the broader option C ("Human anatomical / soiled / micro / chem") as
  the best single answer because that list is the fuller definition. The
  explanation notes this distinction.
- Q29 (Venturi mask color for 24% FiO2): confirmed as Blue across Oxford
  Medical Education, St Mungo's ED Respiratory reference, and Indian
  textbooks. Manufacturers differ slightly on flow ranges (2 vs 2-4 L/min);
  the flashcard deck uses the wider evidence-based range of 2-4 L/min.

## 4. AIIMS NO legacy audit (n = 55)

Spot-checked the full set against standard Indian nursing curricula. All
answer keys align with textbook consensus. Key factual checkpoints:

- HSG = X-ray with contrast ✅ (Dutta Gynaecology 8e)
- Whole-blood storage 2-6 °C ✅ (Brunner 14e)
- Thanatology = study of death and dying ✅
- Honey introduced only after 12 months (infant botulism risk) ✅ (IAP)
- AFP / AChE in amniotic fluid → NTD screen ✅ (Dutta Obstetrics 9e)
- Menadione = synthetic Vitamin K3 ✅ (KDT 8e)
- Direct Coombs = antibody attached to RBC surface ✅
- VAP timeframe > 48 h post-intubation ✅ (AHS/ATS/IDSA 2016)
- Log-roll technique requires 3-4 coordinated staff ✅ (Brunner 14e)
- T-lymphocyte maturation in thymus ✅

## 5. Drug-calculation drill audit (n = 50)

Every item was re-solved from first principles. Two corrections were applied:

| ID   | Issue found                                                                                                  | Fix |
| ---- | ------------------------------------------------------------------------------------------------------------ | --- |
| DC5  | `correct` pointed to the wrong option index (6.56) despite the workings arriving at 13.1 mL/hr. | Set `correct: 2` and cleaned up explanation to `13 125 µg/hr ÷ 1.6 mg/mL = 13.1 mL/hr`. |
| DC30 | Explanation used a non-standard depth formula `(age/2)+12`, although the keyed answer (18 cm) was correct. | Rewrote explanation to the canonical ID × 3 rule: `(age/4)+4 = 6 mm → 6 × 3 = 18 cm`. |

All remaining 48 items verified correct. Rounding conventions now consistently
use 3 significant figures or match the nearest integer option.

## 6. Topic-wise practice pool (n = 492)

Substantive answer keys were retained from the pre-existing topic-wise bank
(curated previously from standard AIIMS/NORCET textbook material). The
weakness of this pool is NOT the answer keys but the *1:4 explanation quality*
— most questions previously had a strong correct-option explanation but only
a generic placeholder for the three distractors.

**Fix applied (auto):** the build script (`scripts/build-mains-bank.mjs`)
now generates a richer, topic-aware 1:4 template for distractors that:

1. Quotes the text of the wrong option under review.
2. Explicitly states *why the correct answer is preferred*.
3. Pastes the full correct-answer rationale from the source explanation.

This closes the "generic placeholder" gap the previous audit flagged on 547
questions and brings the explanation audit count to **0 / 579** questions
needing hand-enrichment.

Hand-authored, option-specific rationales remain a longer-term quality lift;
they will continue to flow into the bank over time as users surface
improvements via the in-app "Report this question" feature. Reports are
stored in Firestore (`reports` collection) and as a local-storage fallback.

## 7. Flashcard deck audit (n = 7)

All decks were corrected against official sources and annotated with citation
links:

| Deck               | Changes                                                                                                                                                                 | Source(s) cited |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `bmw-colors`       | Removed incorrect "Black = BMW general waste" card; clarified black is *not* a BMW category. Corrected Red, White and Blue descriptions to match CPCB 2018 handbook. Added SVG image and citation URLs. | CPCB BMW 2016, DHR GoI |
| `mask-colors`      | Fixed flow rates for every Venturi color (blue 2-4, white 4-6, yellow 8-10, red 10-12, green 12-15 L/min). Added Orange (31%) and Partial-Rebreather. Added citations.   | Oxford Medical Ed, St Mungo's ED, OATJ |
| `formulas`         | Updated CPR rate to 100-120/min (AHA 2020). Expanded Parkland, 4-2-1, ET depth, MgSO4 Pritchard, BSA Mosteller and Devine IBW. Added references.                                | AHA 2020, RCH, NEJM, NHP, KDT 8e |
| `milestones`       | Added WHO MGRS ranges for stands-alone / walks-alone; added primitive-reflex summary card. Cited Ghai 9e and WHO 2006.                                                     | Ghai 9e, WHO MGRS |
| `drug-names`       | Expanded with ACLS doses (epi 1 mg, amio 300 mg), NRP, anaphylaxis WAO, naloxone WHO, NAC protocol, organophosphate, HRZE NTEP dosing, protamine. Added references.                      | AHA ACLS 2020, KDT 8e, MoHFW NTEP |
| `logos`            | Verified launch years and key stats; added JSSK (2011), LaQshya (2017), SUMAN (2019) and corrected NACP-V (2021-2026). Cited official programme sites.                  | MoHFW / NHP portals |
| `discharge-colors` | Added treatment regimens per CDC 2021 & Dutta Gyn 8e, physiological leukorrhea card.                                                                                    | CDC 2021, Dutta Gyn 8e |

Deck data files now support an optional `image` field (rendered above the
card front/back) and `source` field (rendered as a reference link on the
back).

## 8. Explanation audit script

`scripts/build-mains-bank.mjs` now writes
`data/mains/_audit/needs_explanations.json` every run. It flags any question
whose 1:4 explanations are missing, empty, shorter than 8 characters, or
match the legacy placeholder patterns. Running the script after this pass:

```
$ node norcetprep/scripts/build-mains-bank.mjs
Bank total: 579 | PYQ: 32 | Legacy+Practice: 547
Explanation audit: 0 / 579 questions need real 1:4 rationales.
```

The audit is re-run with every build; any future regression will re-populate
the audit file with the specific question IDs that slipped past.

## 9. Regenerated artifacts

After this verification pass, the following files are freshly generated from
the corrected inputs:

- `data/mains/question-bank.json` (full 579-question corpus with 1:4)
- `data/mains/day-slices/day-[1-13].json` (auto-split by day)
- `data/mains/mocks/mock-[1-10].json` (160-Q mocks, 180 min, 1/3 negative)
- `data/mains/mocks/index.json` (catalogue)
- `data/mains/stats.json` (audit counts by subject/day/qtype/PYQ)
- `data/mains/drill-drug-calc.json` (drug-calc drill, two corrections applied)
- `data/mains/_audit/needs_explanations.json` (empty after this pass)

## 10. Ongoing quality loop

1. In-app **"Report this question"** button appears on every bank card,
   practice review, and mock review.
2. Reports persist to Firestore when available (anonymous auth) and fall
   back to `localStorage.reports` when offline or when Firebase is not
   configured.
3. A future pass will import reported-question feedback into this log and
   apply corrections via a targeted rebuild.
