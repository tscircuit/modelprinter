import { expect, test } from "bun:test"
import {
  getThreadCuttingScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  threadCuttingScrewModelPropsSchema,
} from "../src"

test("threadcuttingscrew resolves M4x16mm 4-flute pan-head screw", () => {
  const parsed = parseModelString(
    "threadcuttingscrew_custom_m4_l16mm_fullthread_panhead_headod8mm_headh3mm_phillips_flutes4_flutel4mm_flutew0.8mm_flutedepth0.6mm",
  )
  expect(parsed).toEqual({
    fn: "threadcuttingscrew",
    custom: true,
    thread: "m4",
    length: 16,
    fullThread: true,
    panHead: true,
    headOuterDiameter: 8,
    headHeight: 3,
    phillips: true,
    flutes: 4,
    fluteLength: 4,
    fluteWidth: 0.8,
    fluteDepth: 0.6,
  })

  const dims = getThreadCuttingScrewDimensions()
  expect(dims.overallLength).toBe(19)
  expect(dims.majorDiameter).toBe(4)
})

test("threadcuttingscrew supports M5x20mm 2-flute variant and roundtrips", () => {
  const parsed = parseModelString(
    "threadcuttingscrew_M5_l2cm_headod9.5mm_flutes2",
  )
  expect(parsed.fn).toBe("threadcuttingscrew")
  if (parsed.fn !== "threadcuttingscrew") return
  expect(parsed.thread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(threadCuttingScrewModelPropsSchema.parse({}).panHead).toBe(true)
})

test("threadcuttingscrew rejects legacy selectors and excessive flute depths", () => {
  expect(() =>
    parseModelString("threadcuttingscrew_spec(custom)_head(pan)"),
  ).toThrow()
  expect(() =>
    parseModelString("threadcuttingscrew_m4_flutedepth2mm"),
  ).toThrow()
})
