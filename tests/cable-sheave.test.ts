import { expect, test } from "bun:test"
import {
  cableSheaveModelPropsSchema,
  getCableSheaveDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("cablesheave resolves 80x20mm R4mm deep U-groove wire-rope sheave", () => {
  const parsed = parseModelString(
    "cablesheave_od80mm_bore12mm_w20mm_groover4mm_ugroove_bearingbore_groovedepth6mm",
  )
  expect(parsed).toEqual({
    fn: "cablesheave",
    outerDiameter: 80,
    boreDiameter: 12,
    width: 20,
    grooveRadius: 4,
    uGroove: true,
    bearingBore: true,
    grooveDepth: 6,
  })
  expect(getCableSheaveDimensions().treadRootDiameter).toBe(68)
})

test("cablesheave supports 100mm R5mm sheave variant and roundtrips", () => {
  const parsed = parseModelString(
    "cablesheave_od100mm_w25mm_groover5mm_groovedepth8mm",
  )
  expect(parsed.fn).toBe("cablesheave")
  if (parsed.fn !== "cablesheave") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(cableSheaveModelPropsSchema.parse({}).uGroove).toBe(true)
})

test("cablesheave rejects legacy selectors and shallow grooves", () => {
  expect(() =>
    parseModelString("cablesheave_profile(ugroove)_mount(bearingbore)"),
  ).toThrow()
  expect(() =>
    parseModelString("cablesheave_groover4mm_groovedepth2mm"),
  ).toThrow()
})
