import { expect, test } from "bun:test"
import {
  getSquareHoleWasherDimensions,
  modelDefinitionSchema,
  mp,
  squareHoleWasherModelPropsSchema,
} from "../src"

const example = "squareholewasher_holew6mm_od18mm_h2mm"
const props = { holeWidth: 6, outerDiameter: 18, thickness: 2 }

test("squareholewasher registers the roadmap model and normalizes aliases", () => {
  const expected = { fn: "squareholewasher" as const, ...props }
  expect(mp.getModelNames()).toContain("squareholewasher")
  expect(mp.string(example).json()).toEqual(expected)
  expect(
    mp
      .string(
        "SQUAREHOLEWASHER_THICKNESS.2CM_OUTERDIAMETER1.8cm_HOLEWIDTH.25in",
      )
      .json(),
  ).toEqual({ ...expected, holeWidth: 6.35 })
})

test("squareholewasher normalizes the public definition and input dimensions", () => {
  expect(
    modelDefinitionSchema.parse({
      fn: "squareholewasher",
      holeWidth: ".6cm",
      outerDiameter: "1.8CM",
      thickness: "0.2cm",
    }),
  ).toEqual({ fn: "squareholewasher", ...props })
  expect(mp.string("squareholewasher_t2_od18_holew6").json()).toEqual({
    fn: "squareholewasher",
    ...props,
  })
  const washer = getSquareHoleWasherDimensions(props)
  const cornerRadius = Math.sqrt(3 ** 2 + 3 ** 2)
  expect(washer.holeDiagonal).toBeCloseTo(2 * cornerRadius)
  expect(washer.minimumWall).toBeCloseTo(9 - cornerRadius)
  expect(washer.size).toEqual([18, 18, 2])
  expect(washer.bounds).toEqual({ min: [-9, -9, 0], max: [9, 9, 2] })
})

test("squareholewasher retains material at the opening corners", () => {
  expect(
    getSquareHoleWasherDimensions({ ...props, outerDiameter: 8.49 })
      .minimumWall,
  ).toBeGreaterThan(0)
  for (const outerDiameter of [8.48, 6 * Math.SQRT2, 6, 0, Infinity]) {
    expect(
      squareHoleWasherModelPropsSchema.safeParse({ ...props, outerDiameter })
        .success,
    ).toBe(false)
  }
})

test("squareholewasher keeps the diagonal finite and requires representable radii", () => {
  const large = getSquareHoleWasherDimensions({
    ...props,
    outerDiameter: 1e308,
    holeWidth: 5e307,
  })
  expect(Number.isFinite(large.holeDiagonal)).toBe(true)
  expect(large.minimumWall).toBeGreaterThan(0)
  const unit = Number.MIN_VALUE
  const tiny = getSquareHoleWasherDimensions({
    ...props,
    outerDiameter: 8 * unit,
    holeWidth: 4 * unit,
  })
  expect(tiny.minimumWall).toBe(unit)
  expect(
    squareHoleWasherModelPropsSchema.safeParse({ ...props, holeWidth: unit })
      .success,
  ).toBe(false)
})

test("squareholewasher rejects duplicate, unknown and incomplete parameters", () => {
  for (const invalid of [
    example + "_thickness2",
    example + "_roundhole",
    example.replace("_holew6mm", "_holew6mmjunk"),
    example.replace("_holew6mm", "_holew"),
    example.replace("_h2mm", ""),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    squareHoleWasherModelPropsSchema.safeParse({ ...props, thickness: 0 })
      .success,
  ).toBe(false)
  expect(
    modelDefinitionSchema.safeParse({
      fn: "squareholewasher",
      ...props,
      radius: 1,
    }).success,
  ).toBe(false)
})
