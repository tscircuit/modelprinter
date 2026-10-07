import { expect, test } from "bun:test"
import { mp, timingPulleyModelPropsSchema } from "../src"
test("timingpulley rejects malformed, duplicate and impossible contracts", () => {
  for (const source of [
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm_bore5mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm_borediameter5mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm_unknown2mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm_constructor2mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm_",
    "timingpulley2_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore1.2.3mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore0mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore-1mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore_flangeh2mm_flanget1mm",
    "timingpulley_profile(gt2)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm",
    "timingpulley_profilet5_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth20mm_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth20.1_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth0_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm",
    "timingpulley_profile(t5)_teeth9000_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm",
  ])
    expect(() => mp.string(source).json(), source).toThrow()
  const invalid: Record<string, unknown>[] = [
    { toothCount: 9 },
    { toothCount: 257 },
    { toothCount: 20.5 },
    { boreDiameter: 28 },
    { flangeHeight: 1 },
    { flangeThickness: 0 },
    { sideClearance: 0 },
    { beltWidth: "1.2.3mm" },
    { beltWidth: 1e308, sideClearance: 1e308 },
    { profile: "gt2" },
  ]
  invalid.push({ beltWidth: NaN }, { beltWidth: Infinity }, { extra: true })
  for (const change of invalid)
    expect(
      () => timingPulleyModelPropsSchema.parse(change),
      JSON.stringify(change),
    ).toThrow()
})
