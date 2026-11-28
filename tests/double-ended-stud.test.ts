import { expect, test } from "bun:test"
import {
  doubleEndedStudModelPropsSchema,
  getDoubleEndedStudDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("doubleendedstud resolves M6x40mm stud with 12mm equal threaded ends", () => {
  const parsed = parseModelString(
    "doubleendedstud_custom_m6_l40mm_threadl12mm_equalends_smoothmiddle_chamfertip_chamfer0.5mm",
  )
  expect(parsed).toEqual({
    fn: "doubleendedstud",
    custom: true,
    thread: "m6",
    length: 40,
    threadLength: 12,
    equalEnds: true,
    smoothMiddle: true,
    chamferTip: true,
    chamfer: 0.5,
  })

  const dims = getDoubleEndedStudDimensions()
  expect(dims.smoothMiddleLength).toBe(16)
  expect(dims.majorDiameter).toBe(6)
  expect(dims.topZ).toBe(40)
})

test("doubleendedstud supports M8x60mm variant and schema roundtrip", () => {
  const parsed = parseModelString("doubleendedstud_M8_l6cm_threadl20mm")
  expect(parsed.fn).toBe("doubleendedstud")
  if (parsed.fn !== "doubleendedstud") return
  expect(parsed.thread).toBe("m8")
  expect(parsed.length).toBeCloseTo(60)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(doubleEndedStudModelPropsSchema.parse({}).equalEnds).toBe(true)
})

test("doubleendedstud rejects legacy selectors and overlapping threaded ends", () => {
  expect(() =>
    parseModelString("doubleendedstud_spec(custom)_ends(equal)_middle(smooth)"),
  ).toThrow()
  expect(() => parseModelString("doubleendedstud_l30mm_threadl16mm")).toThrow()
})
