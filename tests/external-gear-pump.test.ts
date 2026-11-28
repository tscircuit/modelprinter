import { expect, test } from "bun:test"
import {
  externalGearPumpModelPropsSchema,
  getExternalGearPumpDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("externalgearpump resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "externalgearpump_npt0.25in_w60mm_l80mm_h50mm_shaftod8mm_flangew70mm_flanget8mm_holep50mm_holed6mm_frontflange",
  )
  expect(parsed).toEqual({
    fn: "externalgearpump",
    portNominal: 6.35,
    width: 60,
    length: 80,
    height: 50,
    shaftOuterDiameter: 8,
    flangeWidth: 70,
    flangeThickness: 8,
    holePitch: 50,
    holeDiameter: 6,
    frontFlange: true,
  })
  expect(getExternalGearPumpDimensions().bodyLengthBehindFlange).toBeCloseTo(
    72,
    6,
  )
})

test("externalgearpump supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "externalgearpump_w70mm_l95mm_flangew85mm_holep62mm",
  )
  expect(parsed.fn).toBe("externalgearpump")
  if (parsed.fn !== "externalgearpump") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(externalGearPumpModelPropsSchema.parse({})).toBeDefined()
})

test("externalgearpump rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("externalgearpump_spec(legacy)")).toThrow()
  expect(() => parseModelString("externalgearpump_w75mm_flangew70mm")).toThrow()
})
