import { expect, test } from "bun:test"
import {
  getSpacerDimensions,
  modelDefinitionSchema,
  mp,
  parseModelString,
  spacerModelDefinitionSchema,
  spacerModelPropsSchema,
} from "../src"

const source = "spacer_id3.2mm_od6mm_l10mm_round_chamfer0.3mm"
const expected = {
  fn: "spacer",
  innerDiameter: 3.2,
  outerDiameter: 6,
  length: 10,
  round: true,
  chamfer: 0.3,
} as const
test("round spacer contract, registry, dimensions and schema roundtrip", () => {
  expect(mp.getModelNames()).toContain("spacer")
  expect(mp.string(source).json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(spacerModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  const dimensions = getSpacerDimensions(props)
  expect(dimensions.endInnerDiameter).toBeCloseTo(3.8, 12)
  expect(dimensions).toMatchObject({
    bottomZ: 0,
    topZ: 10,
    endOuterDiameter: 5.4,
    straightLength: 9.4,
    wallThickness: 1.4,
  })
})
test("spacer defaults, uppercase aliases and independent inch normalization", () => {
  expect(
    mp.string("SPACER_innerdiameter0.32CM_outerdiameter6MM_length1cm").json(),
  ).toEqual({ ...expected, chamfer: 0 })
  expect(
    spacerModelPropsSchema.parse({
      innerDiameter: "0.125in",
      outerDiameter: "0.25in",
      length: "0.5in",
    }),
  ).toEqual({
    innerDiameter: 3.175,
    outerDiameter: 6.35,
    length: 12.7,
    round: true,
    chamfer: 0,
  })
})
test("spacer rejects conflicting aliases, selectors and incomplete strings", () => {
  for (const suffix of [
    "id3.2mm",
    "innerdiameter3.2mm",
    "od6mm",
    "length10mm",
    "round",
    "round1",
    "hex",
    "round(false)",
    "chamfer0.1mm",
    "edgechamfer0.1mm",
    "typo1",
    "constructor1",
    "",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  for (const value of [
    "spacer",
    "spacer3_id3.2mm_od6mm_l10mm",
    "spacer_id3.2mm_od6mm",
    "spacer_id3.2mm_od6mm_l10mmjunk",
    "spacer_id3.2mm_od6mm_l1e2",
    "spacer_id(3.2mm)_od6mm_l10mm",
  ])
    expect(() => mp.string(value).json()).toThrow()
})
test("spacer validates the open bore and positive residual geometry", () => {
  const base = { innerDiameter: 3.2, outerDiameter: 6, length: 10 }
  for (const invalid of [
    { innerDiameter: 0 },
    { outerDiameter: 3.2 },
    { outerDiameter: 2 },
    { length: 0 },
    { length: Infinity },
    { chamfer: -1 },
    { chamfer: 0.7 },
    { length: 0.6, chamfer: 0.3 },
    { round: false },
    { length: "10mmjunk" },
    { extra: true },
  ])
    expect(() =>
      spacerModelPropsSchema.parse({ ...base, ...invalid }),
    ).toThrow()
  expect(() =>
    mp.string("spacer_id3.2mm_od6mm_l10mm_chamfer0.7mm").json(),
  ).toThrow()
})
