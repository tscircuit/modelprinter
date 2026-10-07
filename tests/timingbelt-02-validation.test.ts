import { expect, test } from "bun:test"
import { mp, timingBeltModelPropsSchema } from "../src"
test("timingbelt rejects malformed, duplicate and impossible contracts", () => {
  for (const source of [
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm_w5mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm_width5mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm_unknown2mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm_constructor2mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm_",
    "timingbelt2_profile(t5)_shape(openstraight)_teeth20_w10mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w1.2.3mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w0mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w-1mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20_w",
    "timingbelt_profile(gt2)_shape(openstraight)_teeth20_w10mm",
    "timingbelt_profilet5_shape(openstraight)_teeth20_w10mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20mm_w10mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth20.1_w10mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth0_w10mm",
    "timingbelt_profile(t5)_shape(openstraight)_teeth9000_w10mm",
  ])
    expect(() => mp.string(source).json(), source).toThrow()
  const invalid: Record<string, unknown>[] = [
    { toothCount: 0 },
    { toothCount: 1025 },
    { toothCount: 20.5 },
    { width: 0 },
    { width: "1.2.3mm" },
    { profile: "gt2" },
    { shape: "closedloop" },
  ]
  invalid.push({ width: NaN }, { width: Infinity }, { extra: true })
  for (const change of invalid)
    expect(
      () => timingBeltModelPropsSchema.parse(change),
      JSON.stringify(change),
    ).toThrow()
})
