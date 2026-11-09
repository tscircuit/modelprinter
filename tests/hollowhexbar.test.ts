import { expect, test } from "bun:test"
import {
  getHollowHexBarDimensions,
  hollowHexBarModelDefinitionSchema,
  hollowHexBarModelPropsSchema,
  modelDefinitionSchema,
  mp,
  type HollowHexBarModelDefinition,
  type ModelDefinition,
} from "../src"

const bare = "hollowhexbar_outeraf25mm_inneraf21mm_l100mm"
const props = {
  outerAcrossFlats: 25,
  innerAcrossFlats: 21,
  length: 100,
  regular: true,
  cornerRadius: 0,
} as const

test("hollowhexbar is available through the root registry and definition schemas", () => {
  const expected: HollowHexBarModelDefinition = { fn: "hollowhexbar", ...props }
  const parsed: ModelDefinition = mp
    .string("hollowhexbar_outeraf25mm_inneraf21mm_l100mm_regular_cornerr0mm")
    .json()
  expect(parsed).toEqual(expected)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(hollowHexBarModelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(mp.getModelNames().filter((name) => name === "hollowhexbar")).toEqual([
    "hollowhexbar",
  ])
})

test("hollowhexbar accepts full aliases, mixed units, order and case", () => {
  expect(
    mp
      .string(
        "HOLLOWHEXBAR_LENGTH.1M_INNERACROSSFLATS2.1CM_OUTERACROSSFLATS2.5CM",
      )
      .json(),
  ).toEqual({ fn: "hollowhexbar", ...props })
})

test("hollowhexbar reports the flat wall and the actual rounded corner envelope", () => {
  const sharp = getHollowHexBarDimensions(props)
  const rounded = getHollowHexBarDimensions({ ...props, cornerRadius: 2 })
  expect(sharp.wallThickness).toBe(2)
  expect(sharp.outerFlatLength).toBeCloseTo(25 / Math.sqrt(3), 12)
  expect(sharp.innerCornerDistance).toBeCloseTo(21 / Math.sqrt(3), 12)
  expect(rounded.outerFlatLength).toBeCloseTo(21 / Math.sqrt(3), 12)
  expect(rounded.outerCornerDistance).toBeCloseTo(2 + 21 / Math.sqrt(3), 12)
  expect(rounded.cornerClearance).toBeCloseTo(2, 12)
  expect(rounded.outerCornerDistance).toBeLessThan(sharp.outerCornerDistance)
  expect(rounded.size[0]).toBe(25)
  expect(rounded.size[1]).toBeCloseTo(4 + 42 / Math.sqrt(3), 12)
  expect(rounded.size[2]).toBe(100)
  expect(rounded.bounds.min[0]).toBe(-12.5)
  expect(rounded.bounds.max[0]).toBe(12.5)
  expect([rounded.bottomZ, rounded.topZ]).toEqual([0, 100])
})

test("hollowhexbar rejects a sharp opening corner that reaches the outer fillet", () => {
  const narrow = { ...props, innerAcrossFlats: 24.5 }
  expect(
    getHollowHexBarDimensions({ ...narrow, cornerRadius: 1 }).cornerClearance,
  ).toBeGreaterThan(0)
  expect(
    hollowHexBarModelPropsSchema.safeParse({ ...narrow, cornerRadius: 2 })
      .success,
  ).toBe(false)
  expect(
    hollowHexBarModelPropsSchema.safeParse({ ...props, cornerRadius: 12.5 })
      .success,
  ).toBe(false)
  expect(() =>
    mp.string("hollowhexbar_outeraf25_inneraf24.5_l100_cornerr2").json(),
  ).toThrow()
})

test("hollowhexbar validates its apothems and finite corner-to-corner extent", () => {
  const u = Number.MIN_VALUE
  for (const input of [
    { ...props, innerAcrossFlats: 0 },
    { ...props, innerAcrossFlats: 25 },
    { ...props, innerAcrossFlats: 26 },
    { ...props, regular: false },
    { ...props, shape: "regular" },
    { ...props, cornerRadius: -1 },
    { ...props, outerAcrossFlats: "25mm\n" },
    { ...props, outerAcrossFlats: Number.MAX_VALUE },
    { ...props, innerAcrossFlats: 3 * u, outerAcrossFlats: 8 * u },
    { ...props, innerAcrossFlats: 4 * u, outerAcrossFlats: 7 * u },
  ])
    expect(hollowHexBarModelPropsSchema.safeParse(input).success).toBe(false)
  const tiny = getHollowHexBarDimensions({
    outerAcrossFlats: 8 * u,
    innerAcrossFlats: 4 * u,
    length: 1,
  })
  expect(tiny.wallThickness).toBe(2 * u)
  const big = getHollowHexBarDimensions({
    outerAcrossFlats: 1e308,
    innerAcrossFlats: 8e307,
    length: 1,
  })
  expect(Number.isFinite(big.size[1])).toBe(true)
})

test("hollowhexbar rejects duplicate properties, unknown tokens and incomplete strings", () => {
  for (const suffix of [
    "outeraf26",
    "outeracrossflats26",
    "inneraf22",
    "inneracrossflats22",
    "length2",
    "cornerr",
    "cornerr1e0",
    "cornerr1mmextra",
    "regular0",
    "regular(false)",
    "regular_regular",
    "shape(regular)",
    "constructor1",
    "",
  ])
    expect(() => mp.string(bare + "_" + suffix).json()).toThrow()
  expect(() =>
    mp.string("hollowhexbar12" + bare.slice("hollowhexbar".length)).json(),
  ).toThrow()
  expect(() =>
    mp.string("hollowhexbar_outeraf25mm_inneraf21mm").json(),
  ).toThrow()
})
