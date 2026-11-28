import { expect, test } from "bun:test"
import {
  getSanitaryClampFerruleDimensions,
  modelDefinitionSchema,
  parseModelString,
  sanitaryClampFerruleModelPropsSchema,
} from "../src"

test("sanitaryclampferrule resolves 1in 50.5mm-flange DIN 32676 C ferrule", () => {
  const parsed = parseModelString(
    "sanitaryclampferrule_tubeod25.4mm_tubeid22.1mm_flangeod50.5mm_l21.5mm_din32676_seriesc",
  )
  expect(parsed).toEqual({
    fn: "sanitaryclampferrule",
    tubeOuterDiameter: 25.4,
    tubeInnerDiameter: 22.1,
    flangeOuterDiameter: 50.5,
    length: 21.5,
    din32676: true,
    seriesC: true,
  })
  expect(getSanitaryClampFerruleDimensions().tubeWallThickness).toBeCloseTo(
    1.65,
    6,
  )
})

test("sanitaryclampferrule supports 2in 64mm-flange ferrule and roundtrips", () => {
  const parsed = parseModelString(
    "sanitaryclampferrule_tubeod50.8mm_tubeid47.5mm_flangeod64mm_l28.6mm",
  )
  expect(parsed.fn).toBe("sanitaryclampferrule")
  if (parsed.fn !== "sanitaryclampferrule") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    sanitaryClampFerruleModelPropsSchema.parse({}).flangeOuterDiameter,
  ).toBe(50.5)
})

test("sanitaryclampferrule rejects legacy selectors and inverted diameters", () => {
  expect(() =>
    parseModelString("sanitaryclampferrule_standard(din32676)"),
  ).toThrow()
  expect(() =>
    parseModelString("sanitaryclampferrule_tubeod25.4mm_flangeod30mm"),
  ).toThrow()
})
