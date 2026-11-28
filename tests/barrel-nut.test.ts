import { expect, test } from "bun:test"
import {
  barrelNutModelPropsSchema,
  getBarrelNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("barrelnut resolves M6 10x14mm slotted cross-dowel nut", () => {
  const parsed = parseModelString(
    "barrelnut_m6_d10mm_l14mm_holeoffset7mm_slotw1mm_slotdepth2mm_transverse_slotted",
  )
  expect(parsed).toEqual({
    fn: "barrelnut",
    threadDiameter: 6,
    outerDiameter: 10,
    length: 14,
    holeOffset: 7,
    slotWidth: 1,
    slotDepth: 2,
    transverse: true,
    slotted: true,
  })
  expect(getBarrelNutDimensions().slottedEndClearance).toBe(2)
})

test("barrelnut supports 20mm dowel variant and roundtrips", () => {
  const parsed = parseModelString("barrelnut_m6_d12mm_l20mm_holeoffset10mm")
  expect(parsed.fn).toBe("barrelnut")
  if (parsed.fn !== "barrelnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(barrelNutModelPropsSchema.parse({}).outerDiameter).toBe(10)
})

test("barrelnut rejects slot-bore collisions and legacy selectors", () => {
  expect(() => parseModelString("barrelnut_axis(transverse)")).toThrow()
  expect(() => parseModelString("barrelnut_slotdepth5mm")).toThrow()
})
