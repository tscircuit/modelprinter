import { expect, test } from "bun:test"
import {
  getRoundHeadScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  roundHeadScrewModelPropsSchema,
} from "../src"

test("roundheadscrew resolves M3x10mm hemispherical slotted screw", () => {
  const parsed = parseModelString(
    "roundheadscrew_custom_m3_l10mm_fullthread_hemisphere_headod5.5mm_headh2.75mm_slotted_slotw0.8mm_slotdepth1mm",
  )
  expect(parsed).toEqual({
    fn: "roundheadscrew",
    custom: true,
    thread: "m3",
    length: 10,
    fullThread: true,
    hemisphere: true,
    headOuterDiameter: 5.5,
    headHeight: 2.75,
    slotted: true,
    slotWidth: 0.8,
    slotDepth: 1,
  })

  const dims = getRoundHeadScrewDimensions()
  expect(dims.domeRadius).toBeCloseTo(2.75)
  expect(dims.overallLength).toBeCloseTo(12.75)
})

test("roundheadscrew supports M4x16mm hemisphere and schema roundtrip", () => {
  const parsed = parseModelString(
    "roundheadscrew_M4_l16mm_headod7mm_headh3.5mm",
  )
  expect(parsed.fn).toBe("roundheadscrew")
  if (parsed.fn !== "roundheadscrew") return
  expect(parsed.thread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(roundHeadScrewModelPropsSchema.parse({}).hemisphere).toBe(true)
})

test("roundheadscrew rejects legacy selectors and non-hemispherical head heights", () => {
  expect(() =>
    parseModelString("roundheadscrew_spec(custom)_head(hemisphere)"),
  ).toThrow()
  expect(() => parseModelString("roundheadscrew_headod6mm_headh2mm")).toThrow()
})
