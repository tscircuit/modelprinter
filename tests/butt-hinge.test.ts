import { expect, test } from "bun:test"
import {
  buttHingeModelPropsSchema,
  getButtHingeDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("butthinge resolves 40x50mm five-knuckle open butt hinge", () => {
  const parsed = parseModelString(
    "butthinge_w40mm_l50mm_t2mm_pin4mm_knuckles5_holes6_hole4mm_hp(24mm,18mm)_equalleaf_open180deg",
  )
  expect(parsed).toEqual({
    fn: "butthinge",
    openWidth: 40,
    length: 50,
    leafThickness: 2,
    pinDiameter: 4,
    knuckles: 5,
    holes: 6,
    holeDiameter: 4,
    holePitchX: 24,
    holePitchY: 18,
    equalLeaf: true,
    openAngle: 180,
  })

  const dims = getButtHingeDimensions()
  expect(dims.knuckleOuterDiameter).toBe(8)
  expect(dims.knuckleLength).toBe(10)
  expect(dims.holesPerLeaf).toBe(3)
  expect(dims.topZ).toBe(8)
})

test("butthinge supports 4-hole variant and schema roundtrip", () => {
  const parsed = parseModelString("butthinge_w5cm_holes4_hpx30mm_hpy24mm")
  expect(parsed.fn).toBe("butthinge")
  if (parsed.fn !== "butthinge") return
  expect(parsed.openWidth).toBeCloseTo(50)
  expect(parsed.holes).toBe(4)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(buttHingeModelPropsSchema.parse({}).equalLeaf).toBe(true)
})

test("butthinge rejects legacy leaf selectors, even knuckles and barrel-colliding holes", () => {
  expect(() =>
    parseModelString("butthinge_w40mm_leaf(equal)_open180deg"),
  ).toThrow()
  expect(() => parseModelString("butthinge_knuckles4")).toThrow()
  expect(() =>
    parseModelString("butthinge_w40mm_pin4mm_t2mm_hole4mm_hp(10mm,18mm)"),
  ).toThrow()
})
