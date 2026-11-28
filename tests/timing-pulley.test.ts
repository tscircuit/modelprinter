import { expect, test } from "bun:test"
import {
  getTimingPulleyDimensions,
  modelDefinitionSchema,
  parseModelString,
  timingPulleyModelPropsSchema,
} from "../src"

test("timingpulley resolves 20-tooth HTD 5M pulley diameters", () => {
  const parsed = parseModelString(
    "timingpulley_teeth20_pitch5mm_bore5mm_w17mm_htd5m_setscrew_m3",
  )
  expect(parsed).toEqual({
    fn: "timingpulley",
    teeth: 20,
    pitch: 5,
    boreDiameter: 5,
    width: 17,
    htd5m: true,
    setScrew: true,
    thread: "m3",
  })

  const dims = getTimingPulleyDimensions()
  expect(dims.pitchDiameter).toBeCloseTo(100 / Math.PI)
  expect(dims.outerDiameter).toBeCloseTo(100 / Math.PI - 1.14)
  expect(dims.setScrewDiameter).toBe(3)
})

test("timingpulley supports 36-tooth variant and schema roundtrip", () => {
  const parsed = parseModelString("timingpulley_teeth36_bore8mm_M4")
  expect(parsed.fn).toBe("timingpulley")
  if (parsed.fn !== "timingpulley") return
  expect(parsed.teeth).toBe(36)
  expect(parsed.thread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(timingPulleyModelPropsSchema.parse({}).htd5m).toBe(true)
})

test("timingpulley rejects legacy selectors, wrong pitch and oversized bores", () => {
  expect(() =>
    parseModelString("timingpulley_teeth20_profile(htd5m)_mount(setscrew)"),
  ).toThrow()
  expect(() => parseModelString("timingpulley_teeth20_pitch3mm")).toThrow()
  expect(() => parseModelString("timingpulley_teeth20_bore28mm")).toThrow()
})
