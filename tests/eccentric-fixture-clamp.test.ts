import { expect, test } from "bun:test"
import {
  eccentricFixtureClampModelPropsSchema,
  getEccentricFixtureClampDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("eccentricfixtureclamp resolves 30x10mm M6 eccentric cam clamp", () => {
  const parsed = parseModelString(
    "eccentricfixtureclamp_od30mm_h10mm_bore6.6mm_offset3mm_toothdepth1mm_toothpitch3mm_tophex5mm",
  )
  expect(parsed).toEqual({
    fn: "eccentricfixtureclamp",
    outerDiameter: 30,
    height: 10,
    boreDiameter: 6.6,
    offset: 3,
    toothDepth: 1,
    toothPitch: 3,
    topHexAcrossFlats: 5,
  })
  expect(getEccentricFixtureClampDimensions().clampingThrow).toBe(6)
})

test("eccentricfixtureclamp supports 40mm M8 variant and roundtrips", () => {
  const parsed = parseModelString(
    "eccentricfixtureclamp_od40mm_bore9mm_offset4mm_tophex6mm",
  )
  expect(parsed.fn).toBe("eccentricfixtureclamp")
  if (parsed.fn !== "eccentricfixtureclamp") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(eccentricFixtureClampModelPropsSchema.parse({}).offset).toBe(3)
})

test("eccentricfixtureclamp rejects rim-breaking offsets and parenthesized tokens", () => {
  expect(() => parseModelString("eccentricfixtureclamp_rim(smooth)")).toThrow()
  expect(() =>
    parseModelString("eccentricfixtureclamp_od30mm_offset11mm"),
  ).toThrow()
})
