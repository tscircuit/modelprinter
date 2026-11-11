import { expect, test } from "bun:test"
import {
  type SaddleWasherModelDefinition,
  getSaddleWasherDimensions,
  modelDefinitionSchema,
  mp,
  saddleWasherModelPropsSchema,
} from "../src"

const roadmap =
  "saddlewasher_spec(custom)_id6.4mm_od18mm_h8mm_radius12mm_seat(cylindrical)_top(flat)"
const input = {
  innerDiameter: 6.4,
  outerDiameter: 18,
  height: 8,
  seatRadius: 12,
}
const expected = {
  fn: "saddlewasher",
  ...input,
  custom: true,
  cylindricalSeat: true,
  flatTop: true,
} satisfies SaddleWasherModelDefinition

test("saddlewasher parses the roadmap string, defaults, aliases and mixed units", () => {
  expect(mp.getModelNames()).toContain("saddlewasher")
  expect(mp.string(roadmap).json()).toEqual(expected)
  expect(
    mp.string("saddlewasher_id6.4mm_od18mm_h8mm_radius12mm").json(),
  ).toEqual(expected)
  expect(
    mp
      .string(
        "SADDLEWASHER_SEATRADIUS1.2CM_HEIGHT.8cm_OUTERDIAMETER1.8cm_INNERDIAMETER.64cm_CUSTOM_CYLINDRICALSEAT_FLATTOP",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
})

test("saddlewasher derives the seat depth and remaining top material", () => {
  const dimensions = getSaddleWasherDimensions(input)
  const seatDepth = 12 - Math.sqrt(12 ** 2 - 9 ** 2)
  expect(dimensions.innerRadius).toBe(3.2)
  expect(dimensions.outerRadius).toBe(9)
  expect(dimensions.seatDepth).toBeCloseTo(seatDepth, 12)
  expect(dimensions.minThickness).toBeCloseTo(8 - seatDepth, 12)
  expect(
    getSaddleWasherDimensions({ ...input, height: 9.1, seatRadius: 9 })
      .minThickness,
  ).toBeCloseTo(0.1, 12)
  const shallow = getSaddleWasherDimensions({ ...input, seatRadius: 1e20 })
  expect(shallow.seatDepth / 4.05e-19).toBeCloseTo(1, 12)
})

test("saddlewasher rejects a seat that fails to span the washer or breaks through", () => {
  for (const invalid of [
    { innerDiameter: 18 },
    { outerDiameter: 6 },
    { seatRadius: 8.99 },
    { height: 4 },
    { seatRadius: 9, height: 9 },
    { seatRadius: Infinity },
    { height: 0 },
    { flatTop: false },
    { cylindricalSeat: false },
  ]) {
    expect(
      saddleWasherModelPropsSchema.safeParse({ ...input, ...invalid }).success,
    ).toBe(false)
  }
})

test("saddlewasher rejects breakthrough at an exact 3-4-5 triangle boundary", () => {
  const boundary = { outerDiameter: 6, innerDiameter: 2, seatRadius: 5 }
  for (const height of [1, 1 + Number.EPSILON]) {
    expect(
      saddleWasherModelPropsSchema.safeParse({ ...boundary, height }).success,
    ).toBe(false)
  }
  expect(
    getSaddleWasherDimensions({ ...boundary, height: 1.001 }).minThickness,
  ).toBeCloseTo(0.001, 12)
})

test("saddlewasher keeps the breakthrough check at subnormal scales", () => {
  // The triangle has legs 30504 and 247 and hypotenuse 30505.
  const scale = 18454350218 * Number.MIN_VALUE
  const outerRadius = 30504 * scale
  const boundary = {
    innerDiameter: outerRadius,
    outerDiameter: 2 * outerRadius,
    height: (30505 - 247) * scale,
    seatRadius: 30505 * scale,
  }
  expect(saddleWasherModelPropsSchema.safeParse(boundary).success).toBe(false)
  expect(
    getSaddleWasherDimensions({
      ...boundary,
      height: boundary.height + 16 * Number.MIN_VALUE,
    }).minThickness,
  ).toBeGreaterThan(0)
})

test("saddlewasher rejects duplicate aliases, invalid selectors and malformed tokens", () => {
  for (const invalid of [
    roadmap + "_seatradius12mm",
    roadmap + "_flattop",
    roadmap + "_cylindricalseat",
    roadmap + "_custom",
    roadmap.replace("seat(cylindrical)", "seat(spherical)"),
    roadmap.replace("top(flat)", "top(domed)"),
    roadmap.replace("_radius12mm", "_radius12mmjunk"),
    roadmap.replace("_h8mm", ""),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    modelDefinitionSchema.safeParse({ ...expected, tilt: 5 }).success,
  ).toBe(false)
})
