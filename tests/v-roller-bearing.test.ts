import { expect, test } from "bun:test"
import {
  getVRollerBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
  vRollerBearingModelPropsSchema,
} from "../src"

test("vrollerbearing resolves 5x24x10mm 90deg V-groove guide wheel", () => {
  const parsed = parseModelString(
    "vrollerbearing_bore5mm_od24mm_w10mm_angle90deg_groovedepth3mm_vgroove_boremount",
  )
  expect(parsed).toEqual({
    fn: "vrollerbearing",
    boreDiameter: 5,
    outerDiameter: 24,
    width: 10,
    grooveAngle: 90,
    grooveDepth: 3,
    vGroove: true,
    boreMount: true,
  })
  expect(getVRollerBearingDimensions().rootDiameter).toBe(18)
})

test("vrollerbearing supports 8mm bore 30mm OD guide roller and roundtrips", () => {
  const parsed = parseModelString("vrollerbearing_bore8mm_od30mm_w12mm")
  expect(parsed.fn).toBe("vrollerbearing")
  if (parsed.fn !== "vrollerbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(vRollerBearingModelPropsSchema.parse({}).grooveAngle).toBe(90)
})

test("vrollerbearing rejects legacy selectors and overflowing groove mouths", () => {
  expect(() => parseModelString("vrollerbearing_profile(vgroove)")).toThrow()
  expect(() => parseModelString("vrollerbearing_w8mm_groovedepth4mm")).toThrow()
})
