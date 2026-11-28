import { expect, test } from "bun:test"
import {
  getHeatShrinkDimensions,
  heatShrinkModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("heatshrink resolves 8x9x30mm unshrunk insulation sleeve", () => {
  const parsed = parseModelString(
    "heatshrink_id8mm_od9mm_l30mm_squareends_unshrunk",
  )
  expect(parsed).toEqual({
    fn: "heatshrink",
    innerDiameter: 8,
    outerDiameter: 9,
    length: 30,
    squareEnds: true,
    unshrunk: true,
  })
  expect(getHeatShrinkDimensions().wallThickness).toBeCloseTo(0.5, 5)
})

test("heatshrink supports 12mm sleeve variant and schema roundtrip", () => {
  const parsed = parseModelString("heatshrink_id12mm_od13.2mm_l50mm")
  expect(parsed.fn).toBe("heatshrink")
  if (parsed.fn !== "heatshrink") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(heatShrinkModelPropsSchema.parse({}).unshrunk).toBe(true)
})

test("heatshrink rejects legacy selectors and inverted diameters", () => {
  expect(() => parseModelString("heatshrink_state(unshrunk)")).toThrow()
  expect(() => parseModelString("heatshrink_id10mm_od9mm")).toThrow()
})
