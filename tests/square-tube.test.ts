import { expect, test } from "bun:test"
import {
  getSquareTubeDimensions,
  modelDefinitionSchema,
  mp,
  squareTubeModelDefinitionSchema,
  squareTubeModelPropsSchema,
} from "../src"

test("square tube roadmap example resolves through public schemas and registry", () => {
  const model = mp
    .string("squaretube_w25mm_wall2mm_l200mm_outerr4mm_innerr2mm")
    .json()
  if (model.fn !== "squaretube") throw new Error("Expected a square tube")
  expect(model).toEqual({
    fn: "squaretube",
    width: 25,
    wallThickness: 2,
    length: 200,
    outerRadius: 4,
    innerRadius: 2,
  })
  expect(squareTubeModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(mp.getModelNames()).toContain("squaretube")
  const section = getSquareTubeDimensions({
    width: 25,
    wallThickness: 2,
    length: 200,
    outerRadius: 4,
    innerRadius: 2,
  })
  expect(section.innerWidth).toBe(21)
  expect(section.minimumWallThickness).toBeCloseTo(2)
  expect(section.crossSectionArea).toBeCloseTo(136 + 12 * Math.PI)
})

test("square tube supports units, aliases and sharp-corner defaults", () => {
  const model = mp
    .string("SQUARETUBE_WIDTH1IN_WALLTHICKNESS0.1IN_LENGTH10CM")
    .json()
  expect(model).toEqual({
    fn: "squaretube",
    width: 25.4,
    wallThickness: 2.54,
    length: 100,
    outerRadius: 0,
    innerRadius: 0,
  })
  expect(
    squareTubeModelPropsSchema.parse({
      width: "1in",
      wallThickness: "0.1in",
      length: "10cm",
    }),
  ).toEqual({
    width: 25.4,
    wallThickness: 2.54,
    length: 100,
    outerRadius: 0,
    innerRadius: 0,
  })
  const square = getSquareTubeDimensions({
    width: 10,
    wallThickness: 1,
    length: 20,
  })
  expect(square.crossSectionArea).toBe(36)
  expect(square.minimumWallThickness).toBe(1)
})

test("square tube rejects corner breakout and accepts a thinner corner wall", () => {
  const base = { width: 10, wallThickness: 1, length: 20, innerRadius: 0 }
  const section = getSquareTubeDimensions({ ...base, outerRadius: 3 })
  expect(section.minimumWallThickness).toBeCloseTo(3 - 2 * Math.SQRT2)
  // At 45 degrees, this bore corner is outside the rounded outer profile.
  expect(() =>
    squareTubeModelPropsSchema.parse({ ...base, outerRadius: 4 }),
  ).toThrow()
  // Larger inside radii add corner material and preserve the flat-wall minimum.
  expect(
    getSquareTubeDimensions({ ...base, innerRadius: 2 }).minimumWallThickness,
  ).toBe(1)
})

test("square tube rejects invalid dimensions, aliases, and malformed strings", () => {
  const base = { width: 25, wallThickness: 2, length: 200 }
  for (const override of [
    { width: 0 },
    { wallThickness: 0 },
    { wallThickness: 12.5 },
    { length: -1 },
    { length: Infinity },
    { width: NaN },
    { width: Number.MAX_VALUE },
    { outerRadius: -1 },
    { outerRadius: 13 },
    { innerRadius: 11 },
    { outerRadius: 10, innerRadius: 0 },
    { width: "25mmjunk" },
    { unexpected: true },
  ]) {
    const props = { ...base, ...override }
    expect(() => squareTubeModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      squareTubeModelDefinitionSchema.parse({ fn: "squaretube", ...props }),
    ).toThrow()
  }
  for (const source of [
    "squaretube",
    "squaretube_w25mm_wall2mm",
    "squaretube25_wall2mm_l200mm",
    "squaretube_w25mm_wall2mm_l200mm_width25mm",
    "squaretube_w25mm_wall2mm_l200mm_outerr1mm_outerradius1mm",
    "squaretube_w25mm_wall2mm_l200mm_outerr",
    "squaretube_w25mm_wall2mm_l200mm_constructor1",
    "squaretube_w25mm_wall2mm_l200mm_",
  ])
    expect(() => mp.string(source).json()).toThrow()
})
