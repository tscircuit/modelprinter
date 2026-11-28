import { expect, test } from "bun:test"
import {
  flangedTimingPulleyModelPropsSchema,
  getFlangedTimingPulleyDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flangedtimingpulley resolves 20T HTD 5M pulley with 37mm side flanges", () => {
  const parsed = parseModelString(
    "flangedtimingpulley_teeth20_pitch5mm_bore5mm_w17mm_flangeod37mm_htd5m_setscrew_m3",
  )
  expect(parsed).toEqual({
    fn: "flangedtimingpulley",
    teeth: 20,
    pitch: 5,
    boreDiameter: 5,
    width: 17,
    flangeOuterDiameter: 37,
    htd5m: true,
    setScrew: true,
    setScrewThread: "m3",
  })

  const dims = getFlangedTimingPulleyDimensions()
  expect(dims.pitchDiameter).toBeCloseTo(100 / Math.PI, 4)
  expect(dims.topZ).toBe(8.5)
})

test("flangedtimingpulley supports 24T M4 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "flangedtimingpulley_teeth24_bore8mm_flangeod43mm_M4",
  )
  expect(parsed.fn).toBe("flangedtimingpulley")
  if (parsed.fn !== "flangedtimingpulley") return
  expect(parsed.setScrewThread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flangedTimingPulleyModelPropsSchema.parse({}).htd5m).toBe(true)
})

test("flangedtimingpulley rejects legacy selectors and undersized flanges", () => {
  expect(() =>
    parseModelString("flangedtimingpulley_profile(htd5m)_mount(setscrew)"),
  ).toThrow()
  expect(() =>
    parseModelString("flangedtimingpulley_teeth20_flangeod31mm"),
  ).toThrow()
})
