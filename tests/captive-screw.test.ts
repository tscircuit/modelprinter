import { expect, test } from "bun:test"
import {
  captiveScrewModelPropsSchema,
  getCaptiveScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("captivescrew resolves M3x12mm pan-head captive panel screw", () => {
  const parsed = parseModelString(
    "captivescrew_custom_m3_l12mm_threadl9mm_neckd2.4mm_neckl3mm_panhead_headod5.5mm_headh2mm_phillips",
  )
  expect(parsed).toEqual({
    fn: "captivescrew",
    custom: true,
    thread: "m3",
    length: 12,
    threadLength: 9,
    neckDiameter: 2.4,
    neckLength: 3,
    panHead: true,
    headOuterDiameter: 5.5,
    headHeight: 2,
    phillips: true,
  })

  const dims = getCaptiveScrewDimensions()
  expect(dims.overallLength).toBe(14)
  expect(dims.majorDiameter).toBe(3)
})

test("captivescrew supports M4x16mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "captivescrew_M4_l16mm_threadl11mm_neckd3.1mm_neckl5mm_headod8mm",
  )
  expect(parsed.fn).toBe("captivescrew")
  if (parsed.fn !== "captivescrew") return
  expect(parsed.thread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(captiveScrewModelPropsSchema.parse({}).panHead).toBe(true)
})

test("captivescrew rejects legacy selectors and unreduced retention necks", () => {
  expect(() =>
    parseModelString("captivescrew_spec(custom)_head(pan)_drive(phillips)"),
  ).toThrow()
  expect(() => parseModelString("captivescrew_m3_neckd3.2mm")).toThrow()
})
