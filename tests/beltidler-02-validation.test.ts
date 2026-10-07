import { expect, test } from "bun:test"
import { mp, beltIdlerModelPropsSchema } from "../src"
test("beltidler rejects malformed, duplicate and impossible contracts", () => {
  for (const source of [
    "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm_bore5mm",
    "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm_borediameter5mm",
    "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm_unknown2mm",
    "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm_constructor2mm",
    "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm_",
    "beltidler2_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    "beltidler_shape(smooth)_od20mm_bore1.2.3mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    "beltidler_shape(smooth)_od20mm_bore0mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    "beltidler_shape(smooth)_od20mm_bore-1mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    "beltidler_shape(smooth)_od20mm_bore_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    "beltidler_shape(toothed)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    "beltidler_shapesmooth_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
  ])
    expect(() => mp.string(source).json(), source).toThrow()
  const invalid: Record<string, unknown>[] = [
    { boreDiameter: 20 },
    { boreDiameter: 21 },
    { flangeHeight: 2.2 },
    { flangeHeight: 2 },
    { sideClearance: 0 },
    { flangeThickness: 0 },
    { outerDiameter: "20oops" },
    { outerDiameter: 1e308, flangeHeight: 1e308 },
    { shape: "toothed" },
  ]
  invalid.push({ beltWidth: NaN }, { beltWidth: Infinity }, { extra: true })
  for (const change of invalid)
    expect(
      () => beltIdlerModelPropsSchema.parse(change),
      JSON.stringify(change),
    ).toThrow()
})
