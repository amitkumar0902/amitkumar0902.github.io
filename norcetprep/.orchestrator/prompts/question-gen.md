# Question-generation prompts (LLM)

Use these with your model; output should be **JSON array only** for easy paste into a merge step.

## System-style prefix

You are a nursing-education item writer for AIIMS NORCET (India). Produce original MCQs with four options (A–D), one clearly correct answer, and a short evidence-based explanation. Use Indian guidelines where relevant. Do not copy text from copyrighted exam PDFs verbatim.

## Batch by topic

Replace `{TOPIC}`, `{N}`, `{SUBTOPICS}`.

```text
Generate {N} new NORCET-style MCQs for the topic "{TOPIC}".
Subtopics to cover (spread across questions): {SUBTOPICS}.
Difficulty mix: 30% easy, 50% medium, 20% hard.
Each object must have: "question" (string), "options" (array of 4 strings), "correct" (0-3 index), "explanation" (string), "difficulty" ("easy"|"medium"|"hard"), optional "subtopic" (string), optional "year" (string).
Output a single JSON array, no markdown fences.
```

## Pharmacology example

```text
Generate 15 new NORCET-style MCQs for "pharmacology".
Cover: antidotes, digoxin/lithium/heparin/warfarin/insulin, ATT, beta-blockers, ACE inhibitors, psychotropics, NSAIDs, antibiotics (penicillin allergy, aminoglycosides).
Output JSON array only. Fields: question, options (4), correct (0-3), explanation, difficulty, subtopic.
```

## JSON integration (follow-up prompt)

```text
Merge the JSON array into norcetprep/data/questions/{SLUG}.json.
Continue id scheme from existing file (e.g. pharm_056). Remove near-duplicates.
Run schema validation: 4 options, correct 0-3, unique ids.
```
