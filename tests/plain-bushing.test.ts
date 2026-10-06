import { expect, test } from "bun:test"
import {
  getPlainBushingDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  plainBushingModelDefinitionSchema,
  plainBushingModelPropsSchema,
} from "../src"

test("plain bushing roadmap example, dimensions and public registry", () => {
  const source =
    "plainbushing_id8mm_od12mm_l20mm_style(plainclosed)_edgechamfer0.5mm"
  const builder = mp.string(source)
  expect(builder.params()).toMatchObject({
    id: "8mm",
    od: "12mm",
    style: "(plainclosed)",
  })
  const expected = {
    fn: "plainbushing",
    innerDiameter: 8,
    outerDiameter: 12,
    length: 20,
    style: "plainclosed",
    edgeChamfer: 0.5,
  } as const
  expect(builder.json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(plainBushingModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("plainbushing")
  expect(
    getPlainBushingDimensions({
      innerDiameter: 8,
      outerDiameter: 12,
      length: 20,
      edgeChamfer: 0.5,
    }),
  ).toEqual({
    innerDiameter: 8,
    outerDiameter: 12,
    length: 20,
    wallThickness: 2,
    endInnerDiameter: 9,
    endOuterDiameter: 11,
    straightLength: 19,
  })
})

test("plain bushing defaults, length units and uppercase aliases", () => {
  expect(
    plainBushingModelPropsSchema.parse({
      innerDiameter: "0.8cm",
      outerDiameter: "12mm",
      length: "2cm",
    }),
  ).toEqual({
    innerDiameter: 8,
    outerDiameter: 12,
    length: 20,
    style: "plainclosed",
    edgeChamfer: 0,
  })
  expect(
    mp
      .string(
        "PLAINBUSHING_innerdiameter0.8CM_outerdiameter1.2cm_length20MM_STYLE(PLAINCLOSED)",
      )
      .json(),
  ).toEqual({
    fn: "plainbushing",
    innerDiameter: 8,
    outerDiameter: 12,
    length: 20,
    style: "plainclosed",
    edgeChamfer: 0,
  })
  expect(
    getPlainBushingDimensions({
      innerDiameter: "0.25in",
      outerDiameter: "0.5in",
      length: "1in",
    }).innerDiameter,
  ).toBeCloseTo(6.35)
})

test("plain bushing rejects malformed tokens, duplicates and unknown styles", () => {
  const base = "plainbushing_id8mm_od12mm_l20mm"
  for (const suffix of [
    "id8mm",
    "innerdiameter8mm",
    "od12mm",
    "outerdiameter12mm",
    "l20mm",
    "length20mm",
    "edgechamfer0.1mm_edgechamfer0.1mm",
    "style(plainclosed)_style(plainclosed)",
    "style(open)",
    "style(ball)",
    "style",
    "stylePLAINCLOSED",
    "style(plainclosed)junk",
    "style(plainclosed)(plainclosed)",
    "edgechamfer1mm",
    "edgechamfer-1mm",
    "edgechamfer",
    "edgechamfer0.5mmjunk",
    "edgechamfer(0.5mm)",
    "constructor1",
    "typo1",
    "",
  ])
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  for (const source of [
    "plainbushing",
    "plainbushing_id8mm_od12mm",
    "plainbushing_id8mm_l20mm",
    "plainbushing_od12mm_l20mm",
    "plainbushing8_id8mm_od12mm_l20mm",
    "plainbushing(8)_id8mm_od12mm_l20mm",
    "plainbushing_id12mm_od8mm_l20mm",
    "plainbushing_id8mm_od8mm_l20mm",
    "plainbushing_id0_od12mm_l20mm",
    "plainbushing_id8mm_od12mm_l1mm_edgechamfer0.5mm",
    "plainbushing_id8mm_od12mm_l0",
    "plainbushing_id8mmjunk_od12mm_l20mm",
    "plainbushing_id8mm_od12mm_l1e2",
    "plainbushing_id(8mm)_od12mm_l20mm",
    `${base}_style(plainclosed`,
    `${base}__style(plainclosed)`,
  ])
    expect(() => mp.string(source).json()).toThrow()
})

test("plain bushing direct schemas reject invalid dimensions and incomplete length values", () => {
  const base = { innerDiameter: 8, outerDiameter: 12, length: 20 }
  for (const extra of [
    { innerDiameter: 0 },
    { innerDiameter: -1 },
    { outerDiameter: 8 },
    { outerDiameter: 7 },
    { length: 0 },
    { length: Infinity },
    { length: NaN },
    { length: "20mmjunk" },
    { length: "1e2" },
    { innerDiameter: "nonsense" },
    { edgeChamfer: -1 },
    { edgeChamfer: 1 },
    { edgeChamfer: Infinity },
    { length: 1, edgeChamfer: 0.5 },
    { style: "split" },
    { extra: true },
  ]) {
    const props = { ...base, ...extra }
    expect(() => plainBushingModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      plainBushingModelDefinitionSchema.parse({ fn: "plainbushing", ...props }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "plainbushing", ...props }),
    ).toThrow()
  }
  expect(() => getPlainBushingDimensions({ ...base, edgeChamfer: 1 })).toThrow()
})
