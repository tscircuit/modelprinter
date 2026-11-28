import { expect, test } from "bun:test"
import {
  fillisterHeadScrewModelPropsSchema,
  getFillisterHeadScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fillisterheadscrew resolves M3x10mm slotted fillister screw", () => {
  const parsed = parseModelString(
    "fillisterheadscrew_custom_m3_l10mm_fullthread_headod5mm_headh3mm_domeh0.5mm_slotted_slotw0.8mm_slotdepth1.2mm",
  )
  expect(parsed).toEqual({
    fn: "fillisterheadscrew",
    custom: true,
    thread: "m3",
    length: 10,
    fullThread: true,
    headOuterDiameter: 5,
    headHeight: 3,
    domeHeight: 0.5,
    slotted: true,
    slotWidth: 0.8,
    slotDepth: 1.2,
  })
  expect(getFillisterHeadScrewDimensions().overallLength).toBe(13.5)
})

test("fillisterheadscrew supports M4 variant and schema roundtrip", () => {
  const parsed = parseModelString("fillisterheadscrew_M4_l16mm_headod7mm")
  expect(parsed.fn).toBe("fillisterheadscrew")
  if (parsed.fn !== "fillisterheadscrew") return
  expect(parsed.thread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fillisterHeadScrewModelPropsSchema.parse({}).slotted).toBe(true)
})

test("fillisterheadscrew rejects legacy selectors and deep slots", () => {
  expect(() =>
    parseModelString("fillisterheadscrew_spec(custom)_drive(slotted)"),
  ).toThrow()
  expect(() => parseModelString("fillisterheadscrew_slotdepth5mm")).toThrow()
})
