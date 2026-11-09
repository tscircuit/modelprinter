import { expect, test } from "bun:test"
import {
  getDWasherDimensions,
  dWasherModelDefinitionSchema,
  dWasherModelPropsSchema,
  modelDefinitionSchema,
  mp,
  type DWasherModelDefinition,
  type ModelDefinition,
} from "../src"

const bare = "dwasher_id6.4mm_od18mm_h2mm_flatdepth4mm"
const props = {
  innerDiameter: 6.4,
  outerDiameter: 18,
  thickness: 2,
  flatDepth: 4,
} as const

test("dwasher is available through the root registry and definition schemas", () => {
  const expected: DWasherModelDefinition = { fn: "dwasher", ...props }
  const parsed: ModelDefinition = mp
    .string("dwasher_id6.4mm_od18mm_h2mm_flatdepth4mm")
    .json()
  expect(parsed).toEqual(expected)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(dWasherModelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(mp.getModelNames().filter((name) => name === "dwasher")).toEqual([
    "dwasher",
  ])
})

test("dwasher accepts full aliases, mixed units, order and case", () => {
  expect(
    mp
      .string(
        "DWASHER_FLATDEPTH.004M_THICKNESS2MM_OUTERDIAMETER1.8CM_INNERDIAMETER.64CM",
      )
      .json(),
  ).toEqual({ fn: "dwasher", ...props })
})

test("dwasher reports the cut chord, remaining wall and actual outline bounds", () => {
  const dimensions = getDWasherDimensions(props)
  expect(dimensions.flatX).toBe(5)
  expect(dimensions.flatLength).toBeCloseTo(2 * Math.sqrt(56), 12)
  expect(dimensions.wallAtFlat).toBeCloseTo(1.8, 12)
  expect(dimensions.size).toEqual([14, 18, 2])
  expect(dimensions.bounds).toEqual({ min: [-9, -9, 0], max: [5, 9, 2] })
  expect([dimensions.bottomZ, dimensions.topZ]).toEqual([0, 2])
})

test("dwasher requires a cut that stops before the centered bore", () => {
  expect(
    getDWasherDimensions({ ...props, flatDepth: 5.799 }).wallAtFlat,
  ).toBeGreaterThan(0)
  for (const flatDepth of [0, -1, 5.8, 6, Number.MIN_VALUE])
    expect(
      dWasherModelPropsSchema.safeParse({ ...props, flatDepth }).success,
    ).toBe(false)
  expect(() => mp.string("dwasher_id6.4_od18_h2_flatdepth5.8").json()).toThrow()
})

test("dwasher rejects collapsed diameters and keeps the chord finite for large sizes", () => {
  const u = Number.MIN_VALUE
  for (const input of [
    { ...props, innerDiameter: 18 },
    { ...props, outerDiameter: 6 },
    { ...props, thickness: 0 },
    { ...props, thickness: "2mm\n" },
    { ...props, outerDiameter: Infinity },
    { ...props, centered: false },
    { ...props, innerDiameter: 3 * u, outerDiameter: 12 * u, flatDepth: 2 * u },
    { ...props, innerDiameter: 4 * u, outerDiameter: 11 * u, flatDepth: 2 * u },
  ])
    expect(dWasherModelPropsSchema.safeParse(input).success).toBe(false)
  const tiny = getDWasherDimensions({
    innerDiameter: 4 * u,
    outerDiameter: 12 * u,
    thickness: 2 * u,
    flatDepth: 2 * u,
  })
  expect(tiny.wallAtFlat).toBe(2 * u)
  const big = getDWasherDimensions({
    outerDiameter: Number.MAX_VALUE,
    innerDiameter: 6e307,
    flatDepth: 2e307,
    thickness: 2,
  })
  expect(Number.isFinite(big.flatLength)).toBe(true)
  expect(big.flatLength).toBeGreaterThan(1e308)
})

test("dwasher rejects duplicate properties, unknown tokens and incomplete strings", () => {
  for (const suffix of [
    "id7",
    "innerdiameter7",
    "od19",
    "outerdiameter19",
    "h3",
    "t3",
    "thickness3",
    "flatdepth5",
    "flatdepth",
    "flatdepth4e0",
    "flatdepth4mmextra",
    "spec(custom)",
    "hole(centered)",
    "form(d)",
    "constructor1",
    "",
  ])
    expect(() => mp.string(bare + "_" + suffix).json()).toThrow()
  expect(() =>
    mp.string("dwasher12" + bare.slice("dwasher".length)).json(),
  ).toThrow()
  expect(() => mp.string("dwasher_id6.4mm_od18mm_h2mm").json()).toThrow()
})
