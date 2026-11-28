import { expect, test } from "bun:test"
import {
  corrugatedSheetModelPropsSchema,
  getCorrugatedSheetDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("corrugatedsheet resolves 300x200x1mm 20mm-pitch sinusoidal panel", () => {
  const parsed = parseModelString(
    "corrugatedsheet_l300mm_w200mm_t1mm_pitch20mm_peaktopeak5mm_phase0deg_sinewave",
  )
  expect(parsed).toEqual({
    fn: "corrugatedsheet",
    length: 300,
    width: 200,
    thickness: 1,
    pitch: 20,
    peakToPeak: 5,
    phaseAngle: 0,
    sineWave: true,
  })
  expect(getCorrugatedSheetDimensions().envelopeHeight).toBe(6)
})

test("corrugatedsheet supports 90deg phase-shifted panel and roundtrips", () => {
  const parsed = parseModelString("corrugatedsheet_phase90deg_peaktopeak8mm")
  expect(parsed.fn).toBe("corrugatedsheet")
  if (parsed.fn !== "corrugatedsheet") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(corrugatedSheetModelPropsSchema.parse({}).pitch).toBe(20)
})

test("corrugatedsheet rejects legacy selectors and oversized thicknesses", () => {
  expect(() => parseModelString("corrugatedsheet_wave(sine)")).toThrow()
  expect(() => parseModelString("corrugatedsheet_t6mm_peaktopeak5mm")).toThrow()
})
