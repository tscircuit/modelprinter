import { expect, test } from "bun:test"
import {
  getLagScrewDimensions,
  lagScrewModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("lagscrew resolves 6x40mm hex-head coarse lag screw", () => {
  const parsed = parseModelString(
    "lagscrew_custom_d6mm_core4.2mm_l40mm_threadl26mm_threadpitch2.6mm_righthanded_af10mm_headh4mm_hexhead_hexdrive_conetip",
  )
  expect(parsed).toEqual({
    fn: "lagscrew",
    custom: true,
    diameter: 6,
    coreDiameter: 4.2,
    length: 40,
    threadLength: 26,
    threadPitch: 2.6,
    rightHanded: true,
    acrossFlats: 10,
    headHeight: 4,
    hexHead: true,
    hexDrive: true,
    coneTip: true,
  })

  const dims = getLagScrewDimensions()
  expect(dims.unthreadedShankLength).toBe(14)
  expect(dims.overallLength).toBe(44)
  expect(dims.headCornerDiameter).toBeCloseTo(20 / Math.sqrt(3))
})

test("lagscrew supports 8x60mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "lagscrew_d8mm_core5.6mm_l6cm_threadl40mm_af13mm",
  )
  expect(parsed.fn).toBe("lagscrew")
  if (parsed.fn !== "lagscrew") return
  expect(parsed.length).toBeCloseTo(60)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(lagScrewModelPropsSchema.parse({}).hexHead).toBe(true)
})

test("lagscrew rejects legacy selectors and overflowing thread lengths", () => {
  expect(() =>
    parseModelString("lagscrew_spec(custom)_head(hex)_drive(hex)"),
  ).toThrow()
  expect(() => parseModelString("lagscrew_l30mm_threadl35mm")).toThrow()
})
