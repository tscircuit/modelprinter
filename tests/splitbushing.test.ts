import { expect, test } from "bun:test"
import {
  getPlainBushingDimensions,
  getSplitBushingDimensions,
  modelDefinitionSchema,
  mp,
  splitBushingModelDefinitionSchema,
  splitBushingModelPropsSchema,
  type ModelDefinition,
  type SplitBushingModelDefinition,
} from "../src"

const bare = "splitbushing_id20mm_od25mm_l30mm_gap1mm"
const props = {
  innerDiameter: 20,
  outerDiameter: 25,
  length: 30,
  gap: 1,
  plainSplit: true,
  edgeChamfer: 0.5,
} as const

test("splitbushing is registered and exposed through the public definition schema", () => {
  const expected: SplitBushingModelDefinition = { fn: "splitbushing", ...props }
  const definition: ModelDefinition = mp
    .string(bare + "_plainsplit_edgechamfer0.5mm")
    .json()
  expect(definition).toEqual(expected)
  expect(modelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(splitBushingModelDefinitionSchema.parse(definition)).toEqual(expected)
  expect(mp.getModelNames().filter((name) => name === "splitbushing")).toEqual([
    "splitbushing",
  ])
})

test("splitbushing normalizes mixed units, full aliases, order, case and defaults", () => {
  expect(
    mp
      .string(
        "SPLITBUSHING_LENGTH3CM_GAP.1CM_OUTERDIAMETER2.5CM_INNERDIAMETER2CM",
      )
      .json(),
  ).toEqual({
    fn: "splitbushing",
    ...props,
    edgeChamfer: 0,
  })
  const { outerDiameter, ...mixedUnits } = splitBushingModelPropsSchema.parse({
    innerDiameter: "1in",
    outerDiameter: "1.5inch",
    length: "1feet",
    gap: "10mil",
  })
  expect(outerDiameter).toBeCloseTo(38.1, 12)
  expect(mixedUnits).toEqual({
    innerDiameter: 25.4,
    length: 304.8,
    gap: 0.254,
    plainSplit: true,
    edgeChamfer: 0,
  })
})

test("splitbushing reports bore, end walls, axial datums and slit width", () => {
  expect(getSplitBushingDimensions(props)).toEqual({
    ...props,
    wallThickness: 2.5,
    endInnerDiameter: 21,
    endOuterDiameter: 24,
    endWallThickness: 1.5,
    straightLength: 29,
    bottomZ: 0,
    topZ: 30,
  })
  expect(
    getSplitBushingDimensions({ ...props, edgeChamfer: 1.24 }).endWallThickness,
  ).toBeGreaterThan(0)
  expect(
    getSplitBushingDimensions({
      ...props,
      length: Number.MIN_VALUE,
      edgeChamfer: 0,
    }).straightLength,
  ).toBe(Number.MIN_VALUE)
})

test("splitbushing keeps the slit inside the bore and the chamfers inside the end wall and length", () => {
  for (const input of [
    { ...props, gap: 0 },
    { ...props, gap: -1 },
    { ...props, gap: 20 },
    { ...props, gap: 21 },
    { ...props, gap: Number.MIN_VALUE },
    { ...props, outerDiameter: 20 },
    { ...props, outerDiameter: 19 },
    { ...props, edgeChamfer: -1 },
    { ...props, edgeChamfer: 1.25 },
    { ...props, edgeChamfer: 1.26 },
    { ...props, length: 1 },
    {
      ...props,
      innerDiameter: 1,
      outerDiameter: 1 + 2 * Number.EPSILON,
      gap: 0.1,
      edgeChamfer: 1e-16,
    },
  ])
    expect(splitBushingModelPropsSchema.safeParse(input).success).toBe(false)
  expect(() => mp.string("splitbushing_id20_od25_l30_gap20").json()).toThrow()
})

test("splitbushing keeps the radial wall and slit distinct at the numeric limit", () => {
  const u = Number.MIN_VALUE
  for (const input of [
    { innerDiameter: 3 * u, outerDiameter: 5 * u, gap: 2 * u, length: 1 },
    { innerDiameter: 4 * u, outerDiameter: 8 * u, gap: 3 * u, length: 1 },
  ])
    expect(splitBushingModelPropsSchema.safeParse(input).success).toBe(false)
  const tiny = getSplitBushingDimensions({
    innerDiameter: 4 * u,
    outerDiameter: 12 * u,
    gap: 2 * u,
    length: 8 * u,
    edgeChamfer: u,
  })
  expect(tiny.endWallThickness).toBe(2 * u)
  expect(tiny.straightLength).toBe(6 * u)
})

test("splitbushing rejects malformed, unknown, repeated and valued selector tokens", () => {
  for (const suffix of [
    "id21",
    "innerdiameter21",
    "od26",
    "outerdiameter26",
    "l40",
    "length40",
    "gap2",
    "style(plainsplit)",
    "plainsplit1",
    "plainsplit(false)",
    "edgechamfer",
    "edgechamfer1e0mm",
    "edgechamfer1mmextra",
    "edgechamfer0_edgechamfer1",
    "plainsplit_plainsplit",
    "plainclosed",
    "constructor1",
    "",
  ])
    expect(() => mp.string(bare + "_" + suffix).json()).toThrow()
  expect(() => mp.string("splitbushing20_id20_od25_l30_gap1").json()).toThrow()
  expect(() => mp.string("splitbushing_id20_od25_l30").json()).toThrow()
})

test("splitbushing strict schemas keep closed plainbushing behavior separate", () => {
  for (const input of [
    { ...props, plainSplit: false },
    { ...props, style: "plainsplit" },
    { ...props, innerDiameter: "20mm\n" },
    { ...props, length: "1.2.3mm" },
    { ...props, length: Infinity },
    { ...props, edgeChamfer: NaN },
  ])
    expect(splitBushingModelPropsSchema.safeParse(input).success).toBe(false)
  expect(
    mp.string("plainbushing_id20_od25_l30_plainclosed").json(),
  ).toMatchObject({
    fn: "plainbushing",
    plainClosed: true,
  })
  expect(
    getPlainBushingDimensions({
      innerDiameter: 20,
      outerDiameter: 25,
      length: 30,
    }).wallThickness,
  ).toBe(2.5)
  expect(() => mp.string("plainbushing_id20_od25_l30_gap1").json()).toThrow()
})
