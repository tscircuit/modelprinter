import { expect, test } from "bun:test"
import {
  externalToothWasherModelPropsSchema,
  getExternalToothWasherDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("externaltoothwasher resolves annular ring, radial teeth and twisted envelope height", () => {
  const parsed = parseModelString(
    "externaltoothwasher_custom_id6.4mm_bodyod9mm_od12mm_h0.8mm_teeth12_toothw1.2mm_twist15deg",
  )
  expect(parsed).toEqual({
    fn: "externaltoothwasher",
    custom: true,
    innerDiameter: 6.4,
    bodyOuterDiameter: 9,
    outerDiameter: 12,
    thickness: 0.8,
    teeth: 12,
    toothWidth: 1.2,
    twistAngle: 15,
  })

  const dims = getExternalToothWasherDimensions({
    innerDiameter: 6.4,
    bodyOuterDiameter: 9,
    outerDiameter: 12,
    thickness: 0.8,
    teeth: 12,
    toothWidth: 1.2,
    twistAngle: 15,
  })
  expect(dims.annularRingWidth).toBeCloseTo(1.3)
  expect(dims.toothRadialLength).toBeCloseTo(1.5)
  expect(dims.angularPitchDeg).toBeCloseTo(30)
  expect(dims.envelopeHeight).toBeGreaterThan(0.8)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBeCloseTo(dims.envelopeHeight)
})

test("externaltoothwasher normalizes units, defaults and schema roundtrips", () => {
  const parsed = parseModelString(
    "externaltoothwasher_id0.25in_bodyod9mm_od12mm_t0.8mm_toothw1.2mm",
  )
  expect(parsed.fn).toBe("externaltoothwasher")
  if (parsed.fn !== "externaltoothwasher") return
  expect(parsed.innerDiameter).toBeCloseTo(6.35)
  expect(parsed.teeth).toBe(12)
  expect(parsed.twistAngle).toBe(15)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    externalToothWasherModelPropsSchema.parse({
      innerDiameter: "6.4mm",
      bodyOuterDiameter: "9mm",
      outerDiameter: "12mm",
      thickness: "0.8mm",
      toothWidth: "1.2mm",
    }).teeth,
  ).toBe(12)
})

test("externaltoothwasher rejects legacy selectors, inverted diameters and overlapping teeth", () => {
  expect(() =>
    parseModelString(
      "externaltoothwasher_spec(custom)_id6.4mm_bodyod9mm_od12mm_h0.8mm_teeth12_toothw1.2mm_twist(15deg)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString(
      "externaltoothwasher_id9mm_bodyod9mm_od12mm_h0.8mm_toothw1.2mm",
    ),
  ).toThrow()
  expect(() =>
    parseModelString(
      "externaltoothwasher_id6.4mm_bodyod9mm_od8.5mm_h0.8mm_toothw1.2mm",
    ),
  ).toThrow()
  expect(() =>
    parseModelString(
      "externaltoothwasher_id6.4mm_bodyod9mm_od12mm_h0.8mm_teeth24_toothw1.5mm",
    ),
  ).toThrow()
})
