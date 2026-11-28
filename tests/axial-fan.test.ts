import { expect, test } from "bun:test"
import {
  axialFanModelPropsSchema,
  getAxialFanDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("axialfan resolves 40x40x10mm seven-blade electronics cooling fan", () => {
  const parsed = parseModelString(
    "axialfan_w40mm_h40mm_d10mm_hole3.5mm_hp(32mm,32mm)_hub16mm_blades7_cwfront_fronttorear_bladepitch25deg_flatpitched",
  )
  expect(parsed).toEqual({
    fn: "axialfan",
    width: 40,
    height: 40,
    depth: 10,
    holeDiameter: 3.5,
    holePitchX: 32,
    holePitchY: 32,
    hubOuterDiameter: 16,
    blades: 7,
    cwFront: true,
    frontToRear: true,
    bladePitchAngle: 25,
    flatPitched: true,
  })

  const dims = getAxialFanDimensions()
  expect(dims.shroudBoreDiameter).toBeCloseTo(36.8)
  expect(dims.bladeSpanRadius).toBeCloseTo(10.4)
  expect(dims.frontZ).toBe(5)
  expect(dims.rearZ).toBe(-5)
})

test("axialfan supports 80mm 9-blade variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "axialfan_w80mm_h80mm_d25mm_hp(71.5mm,71.5mm)_hub32mm_blades9",
  )
  expect(parsed.fn).toBe("axialfan")
  if (parsed.fn !== "axialfan") return
  expect(parsed.blades).toBe(9)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(axialFanModelPropsSchema.parse({}).cwFront).toBe(true)
})

test("axialfan rejects legacy selectors, oversized hubs and out-of-frame holes", () => {
  expect(() =>
    parseModelString("axialfan_w40mm_rotation(cwfront)_flow(fronttorear)"),
  ).toThrow()
  expect(() => parseModelString("axialfan_w40mm_h40mm_hub35mm")).toThrow()
  expect(() =>
    parseModelString("axialfan_w40mm_hole3.5mm_hp(38mm,32mm)"),
  ).toThrow()
})
