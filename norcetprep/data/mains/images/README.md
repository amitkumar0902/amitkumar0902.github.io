# Image-based questions

Drop PNG or SVG assets here and reference them in the question JSON via the `image` field:

```json
{
  "id": 123,
  "question": "Interpret the ECG strip shown above:",
  "image": "ecg-vt.svg",
  "options": ["Sinus tachycardia", "Ventricular tachycardia", "A.Fib", "WPW"],
  "correct": 1,
  "explanations": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "subject": "Medical-Surgical",
  "topic": "ECG",
  "qtype": "image",
  "day": 1,
  "source": "Practice"
}
```

The practice.js and mock-test.js runners automatically render `data/mains/images/<filename>` above the question stem.

## Suggested high-yield image set (~30)

- **ECG strips (12)**: NSR, sinus brady, sinus tachy, AFib, AFlutter, 1° AV block, Mobitz I, Mobitz II, 3° block, VT, VF, WPW, PVC
- **BMW bags (4)**: yellow, red, blue, white translucent
- **O2 devices (4)**: Venturi (colors), nasal cannula, simple mask, NRB
- **Programme logos (10)**: POSHAN, ICDS, Polio, NACP, NHM, JSY, PMJAY, U-WIN, ABDM, Indradhanush
- **OBG (3)**: placenta previa vs abruptio, Leopold maneuvers, presentation/station
- **Ped (2)**: APGAR table card, primitive reflex timeline

## Example SVG assets

The files `sample-ecg-nsr.svg` and `sample-bmw-bags.svg` in this folder demonstrate the wiring.
