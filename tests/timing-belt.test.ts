import { expect, test } from "bun:test"
import {
  getTimingBeltDimensions,
  modelDefinitionSchema,
  parseModelString,
  timingBeltModelPropsSchema,
} from "../src"

test("timingbelt resolves 500mm 100-tooth HTD 5M endless belt", () => {
  const parsed = parseModelString(
    "timingbelt_pitch5mm_teeth100_w15mm_h3.6mm_htd5m_length500mm_endless",
  )
  expect(parsed).toEqual({
    fn: "timingbelt",
    pitch: 5,
    teeth: 100,
    width: 15,
    beltHeight: 3.6,
    htd5m: true,
    pitchLength: 500,
    endless: true,
  })

  const dims = getTimingBeltDimensions()
  expect(dims.toothHeight).toBeCloseTo(2.06)
  expect(dims.backingThickness).toBeCloseTo(1.54)
  expect(dims.pitchCircleDiameter).toBeCloseTo(500 / Math.PI)
})

test("timingbelt supports 600mm 120-tooth loop and schema roundtrip", () => {
  const parsed = parseModelString("timingbelt_teeth120_length60cm")
  expect(parsed.fn).toBe("timingbelt")
  if (parsed.fn !== "timingbelt") return
  expect(parsed.pitchLength).toBeCloseTo(600)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(timingBeltModelPropsSchema.parse({}).endless).toBe(true)
})

test("timingbelt rejects legacy selectors and inconsistent pitch lengths", () => {
  expect(() =>
    parseModelString("timingbelt_profile(htd5m)_style(endless)"),
  ).toThrow()
  expect(() =>
    parseModelString("timingbelt_teeth100_pitch5mm_length450mm"),
  ).toThrow()
})
