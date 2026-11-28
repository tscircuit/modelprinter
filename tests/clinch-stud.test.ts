import { expect, test } from "bun:test"
import {
  clinchStudModelPropsSchema,
  getClinchStudDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("clinchstud resolves M4x15mm 12-serration press-in stud", () => {
  const parsed = parseModelString(
    "clinchstud_custom_m4_l15mm_fullthread_headod7mm_headh1.5mm_neckd3.4mm_neckl1mm_serrations12_serrationdepth0.3mm",
  )
  expect(parsed).toEqual({
    fn: "clinchstud",
    custom: true,
    thread: "m4",
    length: 15,
    fullThread: true,
    headOuterDiameter: 7,
    headHeight: 1.5,
    neckDiameter: 3.4,
    neckLength: 1,
    serrations: 12,
    serrationDepth: 0.3,
  })

  const dims = getClinchStudDimensions()
  expect(dims.overallLength).toBeCloseTo(16.5)
  expect(dims.topZ).toBe(15)
})

test("clinchstud supports M5x20mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "clinchstud_M5_l2cm_headod8.5mm_neckd4.2mm_serrations16",
  )
  expect(parsed.fn).toBe("clinchstud")
  if (parsed.fn !== "clinchstud") return
  expect(parsed.thread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(clinchStudModelPropsSchema.parse({}).serrations).toBe(12)
})

test("clinchstud rejects legacy selectors and oversized capture necks", () => {
  expect(() =>
    parseModelString("clinchstud_spec(custom)_thread(full)"),
  ).toThrow()
  expect(() => parseModelString("clinchstud_m4_neckd4.2mm")).toThrow()
})
