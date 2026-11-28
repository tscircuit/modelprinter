import { expect, test } from "bun:test"
import {
  getWeldNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  weldNutModelPropsSchema,
} from "../src"

test("weldnut resolves DIN 928 M6 12x5mm square weld nut", () => {
  const parsed = parseModelString(
    "weldnut_m6_w12mm_h5mm_projections4_projectiond2mm_projectionh0.8mm_projectionp8mm_squarebody",
  )
  expect(parsed).toEqual({
    fn: "weldnut",
    threadDiameter: 6,
    width: 12,
    height: 5,
    projections: 4,
    projectionDiameter: 2,
    projectionHeight: 0.8,
    projectionPitch: 8,
    squareBody: true,
  })
  expect(getWeldNutDimensions().overallHeight).toBeCloseTo(5.8, 6)
})

test("weldnut supports M8 14mm square nut and roundtrips", () => {
  const parsed = parseModelString("weldnut_m8_w14mm_h6.5mm_projectionp10mm")
  expect(parsed.fn).toBe("weldnut")
  if (parsed.fn !== "weldnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(weldNutModelPropsSchema.parse({}).projections).toBe(4)
})

test("weldnut rejects legacy selectors and overhanging nibs", () => {
  expect(() => parseModelString("weldnut_body(square)")).toThrow()
  expect(() => parseModelString("weldnut_w12mm_projectionp11mm")).toThrow()
})
