import { expect, test } from "bun:test"
import {
  getSphericalPlainBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
  sphericalPlainBearingModelPropsSchema,
} from "../src"

test("sphericalplainbearing resolves GE20E 20x35x16mm radial bearing", () => {
  const parsed = parseModelString(
    "sphericalplainbearing_id20mm_od35mm_w16mm_misalignment8deg_radial_open",
  )
  expect(parsed).toEqual({
    fn: "sphericalplainbearing",
    innerDiameter: 20,
    outerDiameter: 35,
    width: 16,
    misalignmentAngle: 8,
    radial: true,
    closure: "open",
  })
  expect(getSphericalPlainBearingDimensions().sphereDiameter).toBe(27.5)
})

test("sphericalplainbearing supports sealed GE25 variant and roundtrips", () => {
  const parsed = parseModelString(
    "sphericalplainbearing_id25mm_od42mm_w20mm_sealed",
  )
  expect(parsed.fn).toBe("sphericalplainbearing")
  if (parsed.fn !== "sphericalplainbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    sphericalPlainBearingModelPropsSchema.parse({}).misalignmentAngle,
  ).toBe(8)
})

test("sphericalplainbearing rejects legacy selectors and inverted diameters", () => {
  expect(() =>
    parseModelString("sphericalplainbearing_style(radial)"),
  ).toThrow()
  expect(() =>
    parseModelString("sphericalplainbearing_id32mm_od35mm"),
  ).toThrow()
})
