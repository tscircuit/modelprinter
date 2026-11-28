import { expect, test } from "bun:test"
import {
  clipNutModelPropsSchema,
  getClipNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("clipnut resolves M4 12x18mm U-folded panel clip nut", () => {
  const parsed = parseModelString(
    "clipnut_m4_w12mm_l18mm_gap2mm_strip0.8mm_holeoffset12mm_barrelod6mm_barrelh3mm_uform",
  )
  expect(parsed).toEqual({
    fn: "clipnut",
    threadDiameter: 4,
    width: 12,
    length: 18,
    panelGap: 2,
    stripThickness: 0.8,
    holeOffset: 12,
    barrelOuterDiameter: 6,
    barrelHeight: 3,
    uForm: true,
  })
  expect(getClipNutDimensions().overallStackHeight).toBeCloseTo(6.6, 6)
})

test("clipnut supports M5 15mm-wide clip nut and roundtrips", () => {
  const parsed = parseModelString("clipnut_m5_w15mm_barrelod8mm")
  expect(parsed.fn).toBe("clipnut")
  if (parsed.fn !== "clipnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(clipNutModelPropsSchema.parse({}).panelGap).toBe(2)
})

test("clipnut rejects overflowing hole offsets and legacy selectors", () => {
  expect(() => parseModelString("clipnut_form(u)")).toThrow()
  expect(() => parseModelString("clipnut_l18mm_holeoffset17mm")).toThrow()
})
