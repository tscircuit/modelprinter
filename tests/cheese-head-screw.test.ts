import { expect, test } from "bun:test"
import {
  cheeseHeadScrewModelPropsSchema,
  getCheeseHeadScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("cheeseheadscrew resolves ISO 1207 M3x10 slotted screw", () => {
  const parsed = parseModelString("cheeseheadscrew_iso1207_m3_l10mm_slotted")
  expect(parsed).toEqual({
    fn: "cheeseheadscrew",
    iso1207: true,
    thread: "m3",
    length: 10,
    slotted: true,
  })

  const dims = getCheeseHeadScrewDimensions({ thread: "m3", length: 10 })
  expect(dims.headDiameter).toBeCloseTo(5.5)
  expect(dims.headHeight).toBeCloseTo(2.0)
  expect(dims.slotWidth).toBeCloseTo(0.8)
  expect(dims.overallLength).toBeCloseTo(12.0)
})

test("cheeseheadscrew supports M2.5x8mm screw and schema roundtrip", () => {
  const parsed = parseModelString("cheeseheadscrew_M2.5_l8mm")
  expect(parsed.fn).toBe("cheeseheadscrew")
  if (parsed.fn !== "cheeseheadscrew") return
  expect(parsed.thread).toBe("m2.5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    cheeseHeadScrewModelPropsSchema.parse({ thread: "m4", length: 12 }).slotted,
  ).toBe(true)
})

test("cheeseheadscrew rejects legacy selectors and non-table threads", () => {
  expect(() =>
    parseModelString(
      "cheeseheadscrew_standard(iso1207)_m3_l10mm_drive(slotted)",
    ),
  ).toThrow()
  expect(() => parseModelString("cheeseheadscrew_m7_l10mm")).toThrow()
})
