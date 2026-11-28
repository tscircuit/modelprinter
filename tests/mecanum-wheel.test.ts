import { expect, test } from "bun:test"
import {
  getMecanumWheelDimensions,
  mecanumWheelModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("mecanumwheel resolves 100x50mm right-hand 8-roller Mecanum wheel", () => {
  const parsed = parseModelString(
    "mecanumwheel_od100mm_w50mm_bore10mm_rollers8_angle45deg_keyway_keyw3mm_righthand",
  )
  expect(parsed).toEqual({
    fn: "mecanumwheel",
    outerDiameter: 100,
    width: 50,
    boreDiameter: 10,
    rollers: 8,
    rollerAngleDeg: 45,
    keyway: true,
    keyWidth: 3,
    handedness: "right",
  })
  expect(getMecanumWheelDimensions().rollerAngularPitchDeg).toBe(45)
})

test("mecanumwheel supports left-hand 12-roller variant and roundtrips", () => {
  const parsed = parseModelString("mecanumwheel_od152mm_rollers12_lefthand")
  expect(parsed.fn).toBe("mecanumwheel")
  if (parsed.fn !== "mecanumwheel") return
  expect(parsed.handedness).toBe("left")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(mecanumWheelModelPropsSchema.parse({}).keyway).toBe(true)
})

test("mecanumwheel rejects legacy selectors and invalid roller skew angles", () => {
  expect(() =>
    parseModelString("mecanumwheel_mount(keyway)_hand(right)"),
  ).toThrow()
  expect(() => parseModelString("mecanumwheel_angle85deg")).toThrow()
})
