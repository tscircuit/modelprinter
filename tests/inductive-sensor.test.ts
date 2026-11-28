import { expect, test } from "bun:test"
import {
  getInductiveSensorDimensions,
  inductiveSensorModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("inductivesensor resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "inductivesensor_threadod12mm_threadpitch1mm_l50mm_faceod10mm_cableod5mm_cablel20mm_nuts2_flushfront",
  )
  expect(parsed).toEqual({
    fn: "inductivesensor",
    threadOuterDiameter: 12,
    threadPitch: 1,
    length: 50,
    faceOuterDiameter: 10,
    cableOuterDiameter: 5,
    cableLength: 20,
    nuts: 2,
    flushFront: true,
  })
  expect(getInductiveSensorDimensions().overallEnvelopeLength).toBeCloseTo(
    70,
    6,
  )
})

test("inductivesensor supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "inductivesensor_threadod18mm_faceod15mm_l65mm",
  )
  expect(parsed.fn).toBe("inductivesensor")
  if (parsed.fn !== "inductivesensor") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(inductiveSensorModelPropsSchema.parse({})).toBeDefined()
})

test("inductivesensor rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("inductivesensor_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("inductivesensor_threadod12mm_faceod14mm"),
  ).toThrow()
})
