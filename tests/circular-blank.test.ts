import { expect, test } from "bun:test"
import {
  circularBlankModelDefinitionSchema,
  circularBlankModelPropsSchema,
  getCircularBlankDimensions,
  ModelRegistry,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  parseModelStringParams,
} from "../src"
import { register } from "../src/models/circularblank/register"

test("circular blank roadmap example resolves to its parameter contract", () => {
  const source = "circularblank_d80mm_t10mm_rimr0mm"
  const expected = {
    fn: "circularblank",
    diameter: 80,
    thickness: 10,
    rimRadius: 0,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string(source).params()).toEqual(parseModelStringParams(source))
  expect(parseModelString(source)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(circularBlankModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("circularblank")
  const registry = new ModelRegistry()
  register(registry)
  expect(registry.parse(parseModelStringParams(source))).toEqual(expected)
})

test("circular blank defaults, aliases and units normalize to millimeters", () => {
  expect(mp.string("circularblank_d80_t10").json()).toEqual({
    fn: "circularblank",
    diameter: 80,
    thickness: 10,
    rimRadius: 0,
  })
  expect(
    mp.string("CIRCULARBLANK_DIAMETER8CM_THICKNESS.01M_RIMRADIUS1MM").json(),
  ).toEqual({ fn: "circularblank", diameter: 80, thickness: 10, rimRadius: 1 })
  for (const [value, millimeters] of [
    ["1mm", 1],
    ["1cm", 10],
    ["1m", 1000],
    ["1in", 25.4],
    ["1inch", 25.4],
    ["1mil", 0.0254],
    ["1ft", 304.8],
    ["1feet", 304.8],
  ] as const) {
    const result = mp.string(`circularblank_d${value}_t${value}`).json()
    if (result.fn !== "circularblank") throw new Error("Unexpected model")
    expect(result.diameter).toBeCloseTo(millimeters)
    expect(result.thickness).toBeCloseTo(millimeters)
  }
  expect(
    circularBlankModelPropsSchema.parse({ diameter: "8cm", thickness: 10 }),
  ).toEqual({ diameter: 80, thickness: 10, rimRadius: 0 })
})

test("circular blank datums and round-over dimensions preserve the envelope", () => {
  expect(
    getCircularBlankDimensions({ diameter: 80, thickness: 10, rimRadius: 1 }),
  ).toEqual({
    diameter: 80,
    thickness: 10,
    rimRadius: 1,
    radius: 40,
    flatFaceDiameter: 78,
    straightWallHeight: 8,
    minX: -40,
    maxX: 40,
    minY: -40,
    maxY: 40,
    minZ: 0,
    maxZ: 10,
  })
  expect(
    getCircularBlankDimensions({ diameter: "1in", thickness: "0.5in" }),
  ).toMatchObject({
    diameter: 25.4,
    thickness: 12.7,
    rimRadius: 0,
    flatFaceDiameter: 25.4,
    straightWallHeight: 12.7,
    minZ: 0,
    maxZ: 12.7,
  })
})

test("circular blank rejects malformed strings and repeated properties", () => {
  const base = "circularblank_d80mm_t10mm"
  for (const suffix of [
    "d80mm",
    "diameter80mm",
    "thickness10mm",
    "rimr1mm_rimradius1mm",
    "rimr1mm_RIMR1mm",
    "rimr",
    "rimr-1mm",
    "rimr5mm",
    "rimr1e0",
    "rimr1mmjunk",
    "rimr(1mm)",
    "rimr1mm(2mm)",
    "rimrInfinity",
    "constructor1",
    "setscrew",
    "unknown1",
    "",
  ])
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  for (const source of [
    "circularblank",
    "circularblank_d80mm",
    "circularblank_t10mm",
    "circularblank80_d80mm_t10mm",
    "circularblank(80)_d80mm_t10mm",
    "circularblank_d_t10mm",
    "circularblank_d80mm_t",
    "circularblank_d0_t10mm",
    "circularblank_d80mm_t-1",
    "circularblank_d80mm_t1e1",
    "circularblank_d(80mm)_t10mm",
    "circularblank_d80mmjunk_t10mm",
    "circularblank_d80mm__t10mm",
    "circularblank_d80mm_t10mm_rimr(1mm",
  ])
    expect(() => mp.string(source).json()).toThrow()
})

test("circular blank schemas reject invalid, incomplete and extra properties", () => {
  const base = { diameter: 80, thickness: 10 }
  for (const property of ["diameter", "thickness", "rimRadius"] as const) {
    for (const value of [NaN, Infinity, -Infinity, -1, "1e2", "1mmjunk", ""]) {
      const props = { ...base, [property]: value }
      expect(() => circularBlankModelPropsSchema.parse(props)).toThrow()
      expect(() =>
        circularBlankModelDefinitionSchema.parse({
          fn: "circularblank",
          ...props,
        }),
      ).toThrow()
    }
  }
  for (const props of [
    {},
    { diameter: 80 },
    { thickness: 10 },
    { ...base, diameter: 0 },
    { ...base, thickness: 0 },
    { ...base, rimRadius: 5 },
    { ...base, extra: true },
  ]) {
    expect(() => circularBlankModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "circularblank", ...props }),
    ).toThrow()
  }
  expect(() =>
    circularBlankModelDefinitionSchema.parse({ fn: "shaft", ...base }),
  ).toThrow()
  expect(() => getCircularBlankDimensions({ ...base, rimRadius: 5 })).toThrow()
})

test("circular blank rim-radius limits consider both diameter and thickness", () => {
  for (const [diameter, thickness] of [
    [80, 10],
    [10, 80],
  ]) {
    expect(
      circularBlankModelPropsSchema.parse({
        diameter,
        thickness,
        rimRadius: 4.99,
      }).rimRadius,
    ).toBe(4.99)
    for (const rimRadius of [5, 5.01])
      expect(() =>
        circularBlankModelPropsSchema.parse({ diameter, thickness, rimRadius }),
      ).toThrow()
  }
  expect(
    mp.string("circularblank_d1mm_t0.02mm_rimr0.009mm").json(),
  ).toMatchObject({ rimRadius: 0.009 })
  expect(() =>
    circularBlankModelPropsSchema.parse({
      diameter: Number.MIN_VALUE,
      thickness: 10,
    }),
  ).toThrow("representable positive radius")
  expect(() =>
    getCircularBlankDimensions({ diameter: Number.MIN_VALUE, thickness: 10 }),
  ).toThrow("representable positive radius")
  expect(
    getCircularBlankDimensions({ diameter: 1e-323, thickness: 10 }),
  ).toMatchObject({
    radius: Number.MIN_VALUE,
    minX: -Number.MIN_VALUE,
    maxX: Number.MIN_VALUE,
  })
})
