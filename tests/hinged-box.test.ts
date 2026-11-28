import { expect, test } from "bun:test"
import {
  getHingedBoxDimensions,
  hingedBoxModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("hingedbox resolves 150x100x70 five-knuckle hinged lid enclosure", () => {
  const parsed = parseModelString(
    "hingedbox_w150mm_d100mm_h70mm_wall3mm_corner4mm_lidt3mm_lefthinge_pin4mm_knuckles5_rightlatch",
  )
  expect(parsed).toEqual({
    fn: "hingedbox",
    width: 150,
    depth: 100,
    height: 70,
    wallThickness: 3,
    cornerRadius: 4,
    lidThickness: 3,
    leftHinge: true,
    hingePinDiameter: 4,
    knuckles: 5,
    rightLatch: true,
  })

  const dims = getHingedBoxDimensions()
  expect(dims.seamZ).toBe(67)
  expect(dims.hingeSpanY).toBe(92)
  expect(dims.knuckleLength).toBeCloseTo(18.4)
  expect(dims.hingeAxisX).toBe(-77)
})

test("hingedbox supports 7-knuckle variant and schema roundtrip", () => {
  const parsed = parseModelString("hingedbox_w12cm_knuckles7")
  expect(parsed.fn).toBe("hingedbox")
  if (parsed.fn !== "hingedbox") return
  expect(parsed.width).toBeCloseTo(120)
  expect(parsed.knuckles).toBe(7)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(hingedBoxModelPropsSchema.parse({}).leftHinge).toBe(true)
})

test("hingedbox rejects legacy selectors, even knuckle counts and oversized pins", () => {
  expect(() =>
    parseModelString("hingedbox_w150mm_hinge(left)_latch(right)"),
  ).toThrow()
  expect(() => parseModelString("hingedbox_knuckles4")).toThrow()
  expect(() => parseModelString("hingedbox_d40mm_knuckles5_pin10mm")).toThrow()
})
