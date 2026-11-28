import { expect, test } from "bun:test"
import {
  getWormWheelDimensions,
  modelDefinitionSchema,
  parseModelString,
  wormWheelModelPropsSchema,
} from "../src"

test("wormwheel resolves 30-tooth module-2 right-hand worm wheel", () => {
  const parsed = parseModelString(
    "wormwheel_teeth30_axialmodule2mm_bore10mm_w15mm_axialpa20deg_righthand_starts1_wormpd20mm_keyway_keyw3mm",
  )
  expect(parsed).toEqual({
    fn: "wormwheel",
    teeth: 30,
    axialModule: 2,
    boreDiameter: 10,
    width: 15,
    axialPressureAngle: 20,
    rightHand: true,
    starts: 1,
    wormPitchDiameter: 20,
    keyway: true,
    keyWidth: 3,
  })

  const dims = getWormWheelDimensions()
  expect(dims.pitchDiameter).toBe(60)
  expect(dims.throatDiameter).toBe(64)
  expect(dims.centerDistance).toBe(40)
  expect(dims.gearRatio).toBe(30)
})

test("wormwheel supports left-hand 2-start wheel and schema roundtrip", () => {
  const parsed = parseModelString("wormwheel_teeth40_lefthand_starts2")
  expect(parsed.fn).toBe("wormwheel")
  if (parsed.fn !== "wormwheel") return
  expect(parsed.rightHand).toBe(false)
  expect(parsed.starts).toBe(2)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wormWheelModelPropsSchema.parse({}).keyway).toBe(true)
})

test("wormwheel rejects legacy selectors and oversized keyed bores", () => {
  expect(() =>
    parseModelString("wormwheel_teeth30_hand(right)_mount(keyway)"),
  ).toThrow()
  expect(() =>
    parseModelString("wormwheel_teeth12_axialmodule1mm_bore10mm_keyw3mm"),
  ).toThrow()
})
