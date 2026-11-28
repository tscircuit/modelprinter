import { expect, test } from "bun:test"
import {
  checkerPlateModelPropsSchema,
  getCheckerPlateDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("checkerplate resolves 200x100x3mm 1mm-rise diamond tread plate", () => {
  const parsed = parseModelString(
    "checkerplate_l200mm_w100mm_t3mm_rise1mm_treadl12mm_treadw3mm_pitchx20mm_pitchy20mm_angle45deg",
  )
  expect(parsed).toEqual({
    fn: "checkerplate",
    length: 200,
    width: 100,
    thickness: 3,
    rise: 1,
    treadLength: 12,
    treadWidth: 3,
    pitchX: 20,
    pitchY: 20,
    treadAngle: 45,
  })
  expect(getCheckerPlateDimensions().overallThickness).toBe(4)
})

test("checkerplate supports 5mm heavy floor plate and roundtrips", () => {
  const parsed = parseModelString("checkerplate_t5mm_rise1.5mm")
  expect(parsed.fn).toBe("checkerplate")
  if (parsed.fn !== "checkerplate") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(checkerPlateModelPropsSchema.parse({}).treadAngle).toBe(45)
})

test("checkerplate rejects colliding lugs and parenthesized tokens", () => {
  expect(() => parseModelString("checkerplate_pattern(teardrop)")).toThrow()
  expect(() => parseModelString("checkerplate_treadl19mm_pitchx20mm")).toThrow()
})
