import { expect, test } from "bun:test"
import {
  annularBlankModelDefinitionSchema,
  annularBlankModelPropsSchema,
  getAnnularBlankDimensions,
  ModelRegistry,
  modelDefinitionSchema,
  mp,
  registerAllModels,
  type AnnularBlankModelDefinition,
  type AnnularBlankModelPropsInput,
  type ModelDefinition,
} from "../src"

const source = "annularblank_od80mm_id40mm_t10mm_rimr0mm"
const props = {
  outerDiameter: 80,
  innerDiameter: 40,
  thickness: 10,
  rimRadius: 0,
}
const expected: AnnularBlankModelDefinition = { fn: "annularblank", ...props }

test("annularblank parses the roadmap example through the public API", () => {
  expect(mp.string(source).json()).toEqual(expected)
  const definition: ModelDefinition = expected
  expect(modelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(annularBlankModelDefinitionSchema.parse(definition)).toEqual(expected)
  const registry = new ModelRegistry()
  registerAllModels(registry)
  expect(
    registry.getModelNames().filter((name) => name === "annularblank"),
  ).toEqual(["annularblank"])
})

test("annularblank normalizes units, aliases, token order and the sharp default", () => {
  for (const value of [
    source.toUpperCase(),
    "annularblank_t1cm_id4cm_od8cm",
    "annularblank_rimradius0_thickness10_innerdiameter40_outerdiameter80",
    "annularblank_id+40mm_t.01m_od80.mm",
  ])
    expect(mp.string(value).json()).toEqual(expected)
  const input: AnnularBlankModelPropsInput = {
    outerDiameter: "8CM",
    innerDiameter: 40,
    thickness: "0.01m",
  }
  expect(annularBlankModelPropsSchema.parse(input)).toEqual(props)
  expect(input).toEqual({
    outerDiameter: "8CM",
    innerDiameter: 40,
    thickness: "0.01m",
  })
  for (const [unit, scale] of [
    ["in", 25.4],
    ["inch", 25.4],
    ["mil", 0.0254],
    ["ft", 304.8],
    ["feet", 304.8],
  ] as const) {
    expect(
      annularBlankModelPropsSchema.parse({
        outerDiameter: `2${unit}`,
        innerDiameter: `1${unit}`,
        thickness: `0.5${unit}`,
        rimRadius: `0.1${unit}`,
      }),
    ).toEqual({
      outerDiameter: 2 * scale,
      innerDiameter: scale,
      thickness: 0.5 * scale,
      rimRadius: 0.1 * scale,
    })
  }
})

test("annularblank dimensions preserve the envelope and fillet tangencies", () => {
  expect(getAnnularBlankDimensions(props)).toEqual({
    ...props,
    innerRadius: 20,
    outerRadius: 40,
    radialWidth: 20,
    flatFaceInnerDiameter: 40,
    flatFaceOuterDiameter: 80,
    flatFaceWidth: 20,
    straightWallHeight: 10,
    size: [80, 80, 10],
    bottomZ: 0,
    topZ: 10,
  })
  const rounded = getAnnularBlankDimensions({ ...props, rimRadius: "0.2cm" })
  expect(rounded).toEqual({
    ...props,
    rimRadius: 2,
    innerRadius: 20,
    outerRadius: 40,
    radialWidth: 20,
    flatFaceInnerDiameter: 44,
    flatFaceOuterDiameter: 76,
    flatFaceWidth: 16,
    straightWallHeight: 6,
    size: [80, 80, 10],
    bottomZ: 0,
    topZ: 10,
  })
})

test("annularblank retains positive faces and walls near both radius limits", () => {
  for (const input of [
    { ...props, rimRadius: 4.999 },
    { ...props, thickness: 40, rimRadius: 9.999 },
    { outerDiameter: 8e-200, innerDiameter: 4e-200, thickness: 1e-200 },
    { outerDiameter: 8e200, innerDiameter: 4e200, thickness: 1e200 },
    { ...props, thickness: Number.MIN_VALUE },
  ]) {
    const dimensions = getAnnularBlankDimensions(input)
    expect(dimensions.flatFaceWidth).toBeGreaterThan(0)
    expect(dimensions.straightWallHeight).toBeGreaterThan(0)
    expect(dimensions.flatFaceOuterDiameter).toBeGreaterThan(
      dimensions.flatFaceInnerDiameter,
    )
    for (const value of Object.values(dimensions).flat())
      expect(Number.isFinite(value)).toBe(true)
  }
})

test("annularblank rejects overlapping fillets, closed bores and inverted diameters", () => {
  for (const invalid of [
    { innerDiameter: 80 },
    { innerDiameter: 81 },
    { innerDiameter: 0 },
    { rimRadius: -1 },
    { rimRadius: 5 },
    { rimRadius: 6 },
    { rimRadius: 10, thickness: 40 },
    { rimRadius: 11, thickness: 40 },
    { innerDiameter: Number.MIN_VALUE },
    { innerDiameter: Number.MIN_VALUE, outerDiameter: 2 * Number.MIN_VALUE },
    {
      innerDiameter: 1e16,
      outerDiameter: 1e16 + 4,
      thickness: 10,
      rimRadius: 0.75,
    },
  ]) {
    const input = { ...props, ...invalid }
    expect(annularBlankModelPropsSchema.safeParse(input).success).toBe(false)
    expect(
      annularBlankModelDefinitionSchema.safeParse({
        fn: "annularblank",
        ...input,
      }).success,
    ).toBe(false)
    expect(() => getAnnularBlankDimensions(input)).toThrow()
  }
  for (const value of [
    "annularblank_od80_id40_t10_rimr5",
    "annularblank_od80_id40_t40_rimr10",
    "annularblank_od40_id40_t10",
  ])
    expect(() => mp.string(value).json()).toThrow()
})

test("annularblank requires finite, complete lengths and rejects extra properties", () => {
  for (const property of [
    "outerDiameter",
    "innerDiameter",
    "thickness",
    "rimRadius",
  ] as const) {
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
        annularBlankModelPropsSchema.safeParse({ ...props, [property]: value })
          .success,
      ).toBe(false)
  }
  for (const property of [
    "outerDiameter",
    "innerDiameter",
    "thickness",
  ] as const) {
    for (const value of [undefined, 0, -1])
      expect(
        annularBlankModelPropsSchema.safeParse({ ...props, [property]: value })
          .success,
      ).toBe(false)
  }
  expect(
    annularBlankModelPropsSchema.safeParse({ ...props, unknown: true }).success,
  ).toBe(false)
  expect(
    annularBlankModelDefinitionSchema.safeParse({
      fn: "plainbushing",
      ...props,
    }).success,
  ).toBe(false)
  expect(annularBlankModelDefinitionSchema.safeParse(props).success).toBe(false)
})

test("annularblank rejects missing, unknown and malformed tokens", () => {
  for (const value of [
    "annularblank",
    "annularblank_od80_id40",
    "annularblank_od80_t10",
    "annularblank_id40_t10",
    "annularblank80_od80_id40_t10",
    "annularblank_od80_id40_t10_",
    "annularblank__od80_id40_t10",
    "annularblank_od80_id40_t10_rimr",
    "annularblank_od80_id40_t10_rimr(1mm)",
    "annularblank_od80_id40_t10_rimr1mmjunk",
    "annularblank_od80_id40_t1e1",
    "annularblank_od80_id40_t10_typo1",
    "annularblank_od80_id40_t10_constructor1",
    "annularblank_od80_id40_t10_toString1",
  ])
    expect(() => mp.string(value).json()).toThrow()
})

test("annularblank rejects repeated properties before raw tokens can overwrite them", () => {
  for (const token of [
    "od80",
    "outerdiameter80",
    "id40",
    "innerdiameter40",
    "t10",
    "thickness10",
    "rimr0",
    "rimradius0",
    "OD90",
    "RIMRADIUS1",
  ])
    expect(() => mp.string(`${source}_${token}`).json()).toThrow(
      "Duplicate annularblank property",
    )
  expect(() => mp.string("annularblank_od80_od90_id40_t10").json()).toThrow(
    "Duplicate annularblank property",
  )
  expect(() =>
    mp.string("annularblank_outerdiameter80_od90_id40_t10").json(),
  ).toThrow("Duplicate annularblank property")
})
