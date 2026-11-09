import { expect, test } from "bun:test"
import {
  getHalfRoundBarDimensions,
  halfRoundBarModelDefinitionSchema,
  halfRoundBarModelPropsSchema,
  modelDefinitionSchema,
  mp,
  type HalfRoundBarModelDefinition,
  type ModelDefinition,
} from "../src"

const bare = "halfroundbar_d20mm_l100mm"
const props = {
  diameter: 20,
  length: 100,
  diametral: true,
  edgeRadius: 0,
} as const

test("halfroundbar is registered and exposed through the public definition schema", () => {
  const expected: HalfRoundBarModelDefinition = { fn: "halfroundbar", ...props }
  const definition: ModelDefinition = mp
    .string(bare + "_diametral_edger0mm")
    .json()
  expect(definition).toEqual(expected)
  expect(modelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(halfRoundBarModelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(mp.getModelNames().filter((name) => name === "halfroundbar")).toEqual([
    "halfroundbar",
  ])
})

test("halfroundbar normalizes units, full aliases, order, case and defaults", () => {
  expect(mp.string("HALFROUNDBAR_LENGTH.1M_DIAMETER2CM").json()).toEqual({
    fn: "halfroundbar",
    ...props,
  })
  expect(
    halfRoundBarModelPropsSchema.parse({
      diameter: "1IN",
      length: "1feet",
      edgeRadius: "1mil",
    }),
  ).toEqual({
    diameter: 25.4,
    length: 304.8,
    diametral: true,
    edgeRadius: 0.0254,
  })
})

test("halfroundbar reports the actual rounded width and keeps the flat datum", () => {
  expect(getHalfRoundBarDimensions(props).size).toEqual([20, 10, 100])
  const rounded = getHalfRoundBarDimensions({ ...props, edgeRadius: "1.8mm" })
  // With R=10 and r=1.8, the corner center (8,1.8) is 8.2 from the origin.
  expect(Math.hypot(8, 1.8)).toBeCloseTo(8.2, 12)
  expect(rounded.flatWidth).toBeCloseTo(16, 12)
  expect(rounded.profileWidth).toBeCloseTo(19.6, 12)
  expect(rounded.profileHeight).toBe(10)
  expect(rounded.size[0]).toBeCloseTo(19.6, 12)
  expect(rounded.bounds.min[0]).toBeCloseTo(-9.8, 12)
  expect(rounded.bounds.max[0]).toBeCloseTo(9.8, 12)
  expect(rounded.bounds.min.slice(1)).toEqual([0, 0])
  expect(rounded.bounds.max.slice(1)).toEqual([10, 100])
  expect([rounded.bottomZ, rounded.topZ]).toEqual([0, 100])
})

test("halfroundbar rejects a radius that removes the flat face", () => {
  expect(
    getHalfRoundBarDimensions({ ...props, edgeRadius: 4.999 }).flatWidth,
  ).toBeGreaterThan(0)
  for (const edgeRadius of [-1, 5, 6])
    expect(
      halfRoundBarModelPropsSchema.safeParse({ ...props, edgeRadius }).success,
    ).toBe(false)
  expect(() => mp.string(bare + "_edger5mm").json()).toThrow()
})

test("halfroundbar rejects malformed, unknown, repeated and valued selector tokens", () => {
  for (const suffix of [
    "d22mm",
    "diameter22mm",
    "l5mm",
    "length5mm",
    "cut(diametral)",
    "diametral1",
    "diametral(false)",
    "edger",
    "edger1e0mm",
    "edger1mmextra",
    "edger1mm_edgeradius2mm",
    "diametral_diametral",
    "constructor1",
    "",
    "regular",
  ])
    expect(() => mp.string(bare + "_" + suffix).json()).toThrow()
  expect(() => mp.string("halfroundbar20_d20mm_l100mm").json()).toThrow()
  expect(() => mp.string("halfroundbar_l100mm").json()).toThrow()
})

test("halfroundbar rejects invalid public properties and avoids squaring large lengths", () => {
  for (const input of [
    { ...props, diametral: false },
    { ...props, cut: "diametral" },
    { ...props, diameter: "20mm\n" },
    { ...props, length: "1.2.3mm" },
    { ...props, length: 0 },
    { ...props, length: Infinity },
    { ...props, edgeRadius: NaN },
    { ...props, diameter: Number.MIN_VALUE },
    { ...props, diameter: 3 * Number.MIN_VALUE },
  ])
    expect(halfRoundBarModelPropsSchema.safeParse(input).success).toBe(false)
  const tiny = getHalfRoundBarDimensions({
    diameter: 4 * Number.MIN_VALUE,
    length: 1,
  })
  expect(tiny.profileWidth).toBe(tiny.diameter)
  const big = getHalfRoundBarDimensions({
    diameter: 1e200,
    length: 1,
    edgeRadius: 1e199,
  })
  expect(big.flatWidth / 1e200).toBeCloseTo(Math.sqrt(0.6), 12)
  expect(big.profileWidth).toBeLessThan(1e200)
  expect(Number.isFinite(big.profileWidth)).toBe(true)
})
