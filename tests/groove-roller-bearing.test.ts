import { expect, test } from "bun:test"
import {
  getGrooveRollerBearingDimensions,
  grooveRollerBearingModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("grooverollerbearing resolves 8x30x12mm R4mm U-groove guide bearing", () => {
  const parsed = parseModelString(
    "grooverollerbearing_bore8mm_od30mm_w12mm_groover4mm_groovedepth4mm_ugroove_boremount",
  )
  expect(parsed).toEqual({
    fn: "grooverollerbearing",
    boreDiameter: 8,
    outerDiameter: 30,
    width: 12,
    grooveRadius: 4,
    grooveDepth: 4,
    uGroove: true,
    boreMount: true,
  })
  expect(getGrooveRollerBearingDimensions().rootDiameter).toBe(22)
})

test("grooverollerbearing supports 10mm bore 40mm OD roller and roundtrips", () => {
  const parsed = parseModelString(
    "grooverollerbearing_bore10mm_od40mm_w16mm_groover5mm_groovedepth5mm",
  )
  expect(parsed.fn).toBe("grooverollerbearing")
  if (parsed.fn !== "grooverollerbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(grooveRollerBearingModelPropsSchema.parse({}).grooveRadius).toBe(4)
})

test("grooverollerbearing rejects legacy selectors and overflowing grooves", () => {
  expect(() =>
    parseModelString("grooverollerbearing_profile(ugroove)"),
  ).toThrow()
  expect(() =>
    parseModelString("grooverollerbearing_w10mm_groover5mm"),
  ).toThrow()
})
