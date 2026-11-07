import { expect, test } from "bun:test"
import {
  getTriangularBarDimensions,
  ModelRegistry,
  modelDefinitionSchema,
  mp,
  registerAllModels,
  triangularBarModelDefinitionSchema,
  triangularBarModelPropsSchema,
  type ModelDefinition,
  type TriangularBarModelDefinition,
  type TriangularBarModelPropsInput,
} from "../src"

const source = "triangularbar_side20mm_l100mm_equilateral_cornerr0mm"
const props = {
  sideLength: 20,
  length: 100,
  equilateral: true,
  cornerRadius: 0,
} as const
const expected: TriangularBarModelDefinition = { fn: "triangularbar", ...props }

test("triangularbar parses the public equilateral stock contract", () => {
  expect(mp.string(source).json()).toEqual(expected)
  const definition: ModelDefinition = expected
  expect(modelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(triangularBarModelDefinitionSchema.parse(definition)).toEqual(expected)
  const registry = new ModelRegistry()
  registerAllModels(registry)
  expect(
    registry.getModelNames().filter((name) => name === "triangularbar"),
  ).toEqual(["triangularbar"])
})

test("triangularbar normalizes units, aliases, order, case and defaults", () => {
  for (const value of [
    source.toUpperCase(),
    "triangularbar_l10cm_side2cm",
    "triangularbar_cornerradius0_equilateral_length100_sidelength20",
    "triangularbar_side+20.mm_length.1m",
  ])
    expect(mp.string(value).json()).toEqual(expected)
  const input: TriangularBarModelPropsInput = { sideLength: "2CM", length: 100 }
  expect(triangularBarModelPropsSchema.parse(input)).toEqual(props)
  expect(input).toEqual({ sideLength: "2CM", length: 100 })
  for (const [unit, scale] of [
    ["in", 25.4],
    ["inch", 25.4],
    ["mil", 0.0254],
    ["ft", 304.8],
    ["feet", 304.8],
  ] as const)
    expect(
      triangularBarModelPropsSchema.parse({
        sideLength: `2${unit}`,
        length: `4${unit}`,
        cornerRadius: `0.1${unit}`,
      }),
    ).toEqual({
      sideLength: 2 * scale,
      length: 4 * scale,
      cornerRadius: 0.1 * scale,
      equilateral: true,
    })
})

test("triangularbar sharp dimensions use the nominal centroid and flat end datums", () => {
  const dimensions = getTriangularBarDimensions(props)
  const height = 10 * Math.sqrt(3)
  expect(dimensions).toMatchObject({
    ...props,
    profileWidth: 20,
    straightSideLength: 20,
    bottomZ: 0,
    topZ: 100,
  })
  expect(dimensions.nominalHeight).toBeCloseTo(height, 12)
  expect(dimensions.inradius).toBeCloseTo(height / 3, 12)
  expect(dimensions.circumradius).toBeCloseTo((2 * height) / 3, 12)
  expect(dimensions.profileHeight).toBeCloseTo(height, 12)
  expect(dimensions.size[0]).toBe(20)
  expect(dimensions.size[1]).toBeCloseTo(height, 12)
  expect(dimensions.size[2]).toBe(100)
  expect(dimensions.bounds.min).toEqual([-10, -dimensions.inradius, 0])
  expect(dimensions.bounds.max[0]).toBe(10)
  expect(dimensions.bounds.max[1]).toBeCloseTo((2 * height) / 3, 12)
  expect(dimensions.bounds.max[2]).toBe(100)
})

test("triangularbar rounded envelope matches independent corner-arc support points", () => {
  const dimensions = getTriangularBarDimensions({
    sideLength: 12,
    length: 100,
    cornerRadius: 1,
  })
  const root3 = Math.sqrt(3)
  expect(dimensions.sideLength).toBe(12)
  expect(dimensions.straightSideLength).toBeCloseTo(12 - 2 * root3, 12)
  expect(dimensions.profileWidth).toBeCloseTo(14 - 2 * root3, 12)
  expect(dimensions.profileHeight).toBeCloseTo(6 * root3 - 1, 12)
  expect(dimensions.circumradius).toBeCloseTo(4 * root3 - 1, 12)
  expect(dimensions.bounds.min[1]).toBeCloseTo(-2 * root3, 12)
  expect(dimensions.bounds.max[1]).toBeCloseTo(4 * root3 - 1, 12)

  // Each r=1 center lies 2 units toward the nominal centroid from its vertex.
  // These arc ranges include every X/Y support direction and their tangencies.
  const arcs = [
    { center: [-6 + root3, -2 * root3 + 1], start: 150, end: 270 },
    { center: [6 - root3, -2 * root3 + 1], start: 270, end: 390 },
    { center: [0, 4 * root3 - 2], start: 30, end: 150 },
  ] as const
  const points: [number, number][] = []
  for (const arc of arcs)
    for (let degrees = arc.start; degrees <= arc.end; degrees += 15) {
      const angle = (degrees * Math.PI) / 180
      points.push([
        arc.center[0] + Math.cos(angle),
        arc.center[1] + Math.sin(angle),
      ])
    }
  for (const axis of [0, 1] as const) {
    const values = points.map((point) => point[axis])
    expect(dimensions.bounds.min[axis]).toBeCloseTo(Math.min(...values), 12)
    expect(dimensions.bounds.max[axis]).toBeCloseTo(Math.max(...values), 12)
    expect(dimensions.size[axis]).toBeCloseTo(
      Math.max(...values) - Math.min(...values),
      12,
    )
  }
  expect(Math.max(...points.map(([x, y]) => Math.hypot(x, y)))).toBeCloseTo(
    dimensions.circumradius,
    12,
  )
  expect(dimensions.bounds.min[1] + dimensions.bounds.max[1]).toBeCloseTo(
    2 * root3 - 1,
    12,
  )
  expect(dimensions.bounds.min[2]).toBe(0)
  expect(dimensions.bounds.max[2]).toBe(100)
})

test("triangularbar preserves all three flat faces only below the inradius", () => {
  const inradius = (12 * Math.sqrt(3)) / 6
  for (const cornerRadius of [0, 1, inradius * (1 - 1e-8)]) {
    const dimensions = getTriangularBarDimensions({
      sideLength: 12,
      length: 100,
      cornerRadius,
    })
    expect(dimensions.straightSideLength).toBeGreaterThan(0)
    expect(dimensions.profileWidth).toBeGreaterThan(0)
    expect(dimensions.profileHeight).toBeGreaterThan(0)
  }
  for (const cornerRadius of [-1, inradius, inradius * (1 + 1e-8), 12]) {
    const input = { sideLength: 12, length: 100, cornerRadius }
    expect(triangularBarModelPropsSchema.safeParse(input).success).toBe(false)
    expect(
      triangularBarModelDefinitionSchema.safeParse({
        fn: "triangularbar",
        ...input,
      }).success,
    ).toBe(false)
    expect(() => getTriangularBarDimensions(input)).toThrow()
  }
  expect(() => mp.string("triangularbar_side12_l100_cornerr4").json()).toThrow()
})

test("triangularbar keeps derived dimensions finite at small and large scales", () => {
  for (const sideLength of [1e-200, 1e200, Number.MAX_VALUE]) {
    const dimensions = getTriangularBarDimensions({
      sideLength,
      length: sideLength,
      cornerRadius: sideLength * 0.1,
    })
    for (const value of [
      dimensions.nominalHeight,
      dimensions.inradius,
      dimensions.circumradius,
      dimensions.straightSideLength,
      ...dimensions.size,
      ...dimensions.bounds.min,
      ...dimensions.bounds.max,
    ])
      expect(Number.isFinite(value)).toBe(true)
    expect(dimensions.profileWidth / sideLength).toBeCloseTo(
      1 - 0.2 * (Math.sqrt(3) - 1),
      12,
    )
    expect(dimensions.profileHeight / sideLength).toBeCloseTo(
      Math.sqrt(3) / 2 - 0.1,
      12,
    )
  }
  expect(
    triangularBarModelPropsSchema.safeParse({
      sideLength: Number.MIN_VALUE,
      length: 1,
    }).success,
  ).toBe(false)
})

test("triangularbar requires strict finite dimensions and rejects unknown props", () => {
  for (const property of ["sideLength", "length", "cornerRadius"] as const)
    for (const value of [
      Infinity,
      -Infinity,
      NaN,
      "1e2",
      "12mmjunk",
      "(12mm)",
      "1 mm",
      "",
      true,
      null,
    ])
      expect(
        triangularBarModelPropsSchema.safeParse({ ...props, [property]: value })
          .success,
      ).toBe(false)
  for (const property of ["sideLength", "length"] as const)
    for (const value of [0, -1, undefined])
      expect(
        triangularBarModelPropsSchema.safeParse({ ...props, [property]: value })
          .success,
      ).toBe(false)
  for (const extra of [
    { unknown: true },
    { shape: "equilateral" },
    { equilateral: false },
    { equilateral: "true" },
  ])
    expect(
      triangularBarModelPropsSchema.safeParse({ ...props, ...extra }).success,
    ).toBe(false)
  expect(
    triangularBarModelDefinitionSchema.safeParse({
      ...expected,
      fn: "rectangularbar",
    }).success,
  ).toBe(false)
  expect(triangularBarModelDefinitionSchema.safeParse(props).success).toBe(
    false,
  )
})

test("triangularbar rejects malformed tokens, unsupported shapes and valued flags", () => {
  for (const value of [
    "triangularbar",
    "triangularbar_side20",
    "triangularbar_l100",
    "triangularbar20_side20_l100",
    "triangularbar_side20_l100_",
    "triangularbar__side20_l100",
    "triangularbar_side_l100",
    "triangularbar_side(20mm)_l100",
    "triangularbar_side20mmjunk_l100",
    "triangularbar_side2e1_l100",
    "triangularbar_side20_l100_cornerr",
    "triangularbar_side20_l100_equilateral1",
    "triangularbar_side20_l100_equilateral(true)",
    "triangularbar_side20_l100_shape(equilateral)",
    "triangularbar_side20_l100_isosceles",
    "triangularbar_side20_l100_typo1",
    "triangularbar_side20_l100_constructor1",
    "triangularbar_side20_l100_toString1",
  ])
    expect(() => mp.string(value).json()).toThrow()
})

test("triangularbar rejects repeated aliases and flags before raw-token overwrite", () => {
  for (const token of [
    "side20",
    "sidelength20",
    "l100",
    "length100",
    "cornerr0",
    "cornerradius0",
    "equilateral",
    "EQUILATERAL",
  ])
    expect(() => mp.string(`${source}_${token}`).json()).toThrow(
      "Duplicate triangularbar property",
    )
  expect(() => mp.string("triangularbar_side20_side30_l100").json()).toThrow(
    "Duplicate triangularbar property",
  )
  expect(() =>
    mp.string("triangularbar_sidelength20_side30_l100").json(),
  ).toThrow("Duplicate triangularbar property")
})
