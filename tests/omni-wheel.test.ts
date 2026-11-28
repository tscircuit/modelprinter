import { expect, test } from "bun:test"
import {
  getOmniWheelDimensions,
  modelDefinitionSchema,
  omniWheelModelPropsSchema,
  parseModelString,
} from "../src"

test("omniwheel resolves 60x25mm 8-roller keyed omni wheel", () => {
  const parsed = parseModelString(
    "omniwheel_od60mm_w25mm_bore8mm_rollers8_keyway_keyw3mm_tangentialrollers",
  )
  expect(parsed).toEqual({
    fn: "omniwheel",
    outerDiameter: 60,
    width: 25,
    boreDiameter: 8,
    rollers: 8,
    keyway: true,
    keyWidth: 3,
    tangentialRollers: true,
  })
  expect(getOmniWheelDimensions().rollerAngularPitchDeg).toBe(45)
})

test("omniwheel supports 100mm 12-roller variant and schema roundtrip", () => {
  const parsed = parseModelString("omniwheel_od100mm_rollers12_bore10mm")
  expect(parsed.fn).toBe("omniwheel")
  if (parsed.fn !== "omniwheel") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(omniWheelModelPropsSchema.parse({}).tangentialRollers).toBe(true)
})

test("omniwheel rejects legacy selectors and oversized hub bores", () => {
  expect(() =>
    parseModelString("omniwheel_mount(keyway)_rolleraxes(tangential)"),
  ).toThrow()
  expect(() => parseModelString("omniwheel_od60mm_bore35mm")).toThrow()
})
