import { expect, test } from "bun:test"
import {
  getWaveSpringWasherDimensions,
  modelDefinitionSchema,
  parseModelString,
  waveSpringWasherModelPropsSchema,
} from "../src"

test("wavespringwasher resolves DIN 137B 6x12mm 3-wave washer", () => {
  const parsed = parseModelString(
    "wavespringwasher_id6mm_od12mm_strip0.5mm_freeh1.5mm_waves3_sinusoidal_freestate",
  )
  expect(parsed).toEqual({
    fn: "wavespringwasher",
    innerDiameter: 6,
    outerDiameter: 12,
    stripThickness: 0.5,
    freeHeight: 1.5,
    waves: 3,
    sinusoidal: true,
    freeState: true,
  })
  expect(getWaveSpringWasherDimensions().waveAmplitude).toBe(0.5)
})

test("wavespringwasher supports 4-wave bearing preload washer and roundtrips", () => {
  const parsed = parseModelString("wavespringwasher_id16mm_od22mm_waves4")
  expect(parsed.fn).toBe("wavespringwasher")
  if (parsed.fn !== "wavespringwasher") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(waveSpringWasherModelPropsSchema.parse({}).waves).toBe(3)
})

test("wavespringwasher rejects legacy selectors and zero-stroke free heights", () => {
  expect(() => parseModelString("wavespringwasher_form(sinusoidal)")).toThrow()
  expect(() => parseModelString("wavespringwasher_strip1mm_freeh1mm")).toThrow()
})
