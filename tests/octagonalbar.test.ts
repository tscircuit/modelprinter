import { expect, test } from "bun:test"
import {
  getOctagonalBarDimensions,
  modelDefinitionSchema,
  mp,
  octagonalBarModelDefinitionSchema,
  octagonalBarModelPropsSchema,
  type ModelDefinition,
  type OctagonalBarModelDefinition,
} from "../src"

const bare = "octagonalbar_af20mm_l100mm"
const props = {
  acrossFlats: 20,
  length: 100,
  regular: true,
  cornerRadius: 0,
} as const

test("octagonalbar is registered and exposed through the public definition schema", () => {
  const expected: OctagonalBarModelDefinition = { fn: "octagonalbar", ...props }
  const definition: ModelDefinition = mp
    .string(bare + "_regular_cornerr0mm")
    .json()
  expect(definition).toEqual(expected)
  expect(modelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(octagonalBarModelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(mp.getModelNames().filter((name) => name === "octagonalbar")).toEqual([
    "octagonalbar",
  ])
})

test("octagonalbar normalizes units, full aliases, order, case and defaults", () => {
  expect(mp.string("OCTAGONALBAR_LENGTH.1M_ACROSSFLATS2CM").json()).toEqual({
    fn: "octagonalbar",
    ...props,
  })
  expect(
    octagonalBarModelPropsSchema.parse({
      acrossFlats: "1IN",
      length: "1feet",
      cornerRadius: "1mil",
    }),
  ).toEqual({
    acrossFlats: 25.4,
    length: 304.8,
    regular: true,
    cornerRadius: 0.0254,
  })
})

test("octagonalbar fillets preserve the axis-aligned flats and shrink the corner envelope", () => {
  const sharp = getOctagonalBarDimensions(props)
  const rounded = getOctagonalBarDimensions({ ...props, cornerRadius: 2 })
  expect(sharp.flatLength).toBeCloseTo(20 * (Math.SQRT2 - 1), 12)
  expect(rounded.flatLength).toBeCloseTo(16 * (Math.SQRT2 - 1), 12)
  expect(rounded.circumradius).toBeCloseTo(
    2 + 8 * Math.sqrt(4 - 2 * Math.SQRT2),
    12,
  )
  expect(rounded.circumradius).toBeLessThan(sharp.circumradius)
  expect(rounded.apothem).toBe(10)
  expect(rounded.size).toEqual([20, 20, 100])
  expect(rounded.bounds).toEqual({ min: [-10, -10, 0], max: [10, 10, 100] })
  expect([rounded.bottomZ, rounded.topZ]).toEqual([0, 100])
})

test("octagonalbar rejects a radius that consumes the flat faces", () => {
  expect(
    getOctagonalBarDimensions({ ...props, cornerRadius: 9.999 }).flatLength,
  ).toBeGreaterThan(0)
  for (const cornerRadius of [-1, 10, 11])
    expect(
      octagonalBarModelPropsSchema.safeParse({ ...props, cornerRadius })
        .success,
    ).toBe(false)
  expect(() => mp.string(bare + "_cornerr10mm").json()).toThrow()
})

test("octagonalbar rejects malformed, unknown, repeated and valued selector tokens", () => {
  for (const suffix of [
    "af22mm",
    "acrossflats22mm",
    "l5mm",
    "length5mm",
    "shape(regular)",
    "regular1",
    "regular(false)",
    "cornerr",
    "cornerr1e0mm",
    "cornerr1mmextra",
    "cornerr1mm_cornerradius2mm",
    "regular_regular",
    "constructor1",
    "",
    "equilateral",
  ])
    expect(() => mp.string(bare + "_" + suffix).json()).toThrow()
  expect(() => mp.string("octagonalbar20_af20mm_l100mm").json()).toThrow()
  expect(() => mp.string("octagonalbar_af20mm").json()).toThrow()
})

test("octagonalbar validates strict public properties and keeps finite derived dimensions", () => {
  for (const input of [
    { ...props, regular: false },
    { ...props, shape: "regular" },
    { ...props, acrossFlats: " 20mm" },
    { ...props, acrossFlats: "20mm\n" },
    { ...props, length: 0 },
    { ...props, length: Infinity },
    { ...props, cornerRadius: NaN },
    { ...props, acrossFlats: Number.MIN_VALUE },
    { ...props, acrossFlats: 3 * Number.MIN_VALUE },
  ])
    expect(octagonalBarModelPropsSchema.safeParse(input).success).toBe(false)
  const tiny = getOctagonalBarDimensions({
    acrossFlats: 4 * Number.MIN_VALUE,
    length: 1,
  })
  expect(tiny.bounds.max[0] - tiny.bounds.min[0]).toBe(tiny.size[0])
  const big = getOctagonalBarDimensions({
    acrossFlats: Number.MAX_VALUE,
    length: 1,
  })
  expect(Number.isFinite(big.circumradius)).toBe(true)
  expect(Number.isFinite(big.flatLength)).toBe(true)
})
