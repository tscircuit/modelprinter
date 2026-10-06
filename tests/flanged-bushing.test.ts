import { expect, test } from "bun:test"
import {
  flangedBushingModelDefinitionSchema,
  flangedBushingModelPropsSchema,
  getFlangedBushingDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
} from "../src"

test("flanged bushing roadmap example, public registry and overall length convention", () => {
  const source =
    "flangedbushing_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm_style(plainclosed)"
  const builder = mp.string(source)
  expect(builder.params()).toMatchObject({
    id: "8mm",
    flangeod: "18mm",
    flangethickness: "2mm",
    style: "(plainclosed)",
  })
  const expected = {
    fn: "flangedbushing",
    innerDiameter: 8,
    outerDiameter: 12,
    flangeDiameter: 18,
    length: 15,
    flangeThickness: 2,
    style: "plainclosed",
  } as const
  expect(builder.json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(flangedBushingModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("flangedbushing")
  expect(
    getFlangedBushingDimensions({
      innerDiameter: 8,
      outerDiameter: 12,
      flangeDiameter: 18,
      length: 15,
      flangeThickness: 2,
    }),
  ).toEqual({
    innerDiameter: 8,
    outerDiameter: 12,
    flangeDiameter: 18,
    length: 15,
    flangeThickness: 2,
    sleeveLength: 13,
    wallThickness: 2,
    flangeProjection: 3,
    shoulderZ: 2,
  })
})

test("flanged bushing default style and normalized length aliases", () => {
  expect(
    flangedBushingModelPropsSchema.parse({
      innerDiameter: "0.8cm",
      outerDiameter: "12mm",
      flangeDiameter: "1.8cm",
      length: "1.5cm",
      flangeThickness: "2mm",
    }),
  ).toEqual({
    innerDiameter: 8,
    outerDiameter: 12,
    flangeDiameter: 18,
    length: 15,
    flangeThickness: 2,
    style: "plainclosed",
  })
  expect(
    mp
      .string(
        "FLANGEDBUSHING_innerdiameter8MM_outerdiameter1.2CM_flangediameter18mm_length15mm_flangethickness0.2cm_STYLE(PLAINCLOSED)",
      )
      .json(),
  ).toMatchObject({
    innerDiameter: 8,
    outerDiameter: 12,
    flangeDiameter: 18,
    length: 15,
    flangeThickness: 2,
    style: "plainclosed",
  })
  expect(
    getFlangedBushingDimensions({
      innerDiameter: "0.25in",
      outerDiameter: "0.5in",
      flangeDiameter: "0.75in",
      length: "1in",
      flangeThickness: "0.125in",
    }).sleeveLength,
  ).toBeCloseTo(22.225)
})

test("flanged bushing rejects duplicate aliases, malformed tokens and unsupported styles", () => {
  const base =
    "flangedbushing_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm"
  for (const suffix of [
    "id8mm",
    "innerdiameter8mm",
    "od12mm",
    "outerdiameter12mm",
    "flangeod18mm",
    "flangediameter18mm",
    "l15mm",
    "length15mm",
    "flangethickness2mm",
    "style(plainclosed)_style(plainclosed)",
    "style(open)",
    "style(ball)",
    "style",
    "stylePLAINCLOSED",
    "style(plainclosed)junk",
    "style(plainclosed)(plainclosed)",
    "edgechamfer0.5mm",
    "flangethickness(2mm)",
    "flangethickness2mmjunk",
    "constructor1",
    "typo1",
    "",
  ])
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  for (const source of [
    "flangedbushing",
    "flangedbushing_id8mm_od12mm_l15mm_flangethickness2mm",
    "flangedbushing_id8mm_od12mm_flangeod18mm_l15mm",
    "flangedbushing8_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm",
    "flangedbushing(8)_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm",
    "flangedbushing_id12mm_od8mm_flangeod18mm_l15mm_flangethickness2mm",
    "flangedbushing_id8mm_od8mm_flangeod18mm_l15mm_flangethickness2mm",
    "flangedbushing_id8mm_od12mm_flangeod12mm_l15mm_flangethickness2mm",
    "flangedbushing_id8mm_od12mm_flangeod10mm_l15mm_flangethickness2mm",
    "flangedbushing_id8mm_od12mm_flangeod18mm_l2mm_flangethickness2mm",
    "flangedbushing_id8mm_od12mm_flangeod18mm_l1mm_flangethickness2mm",
    "flangedbushing_id0_od12mm_flangeod18mm_l15mm_flangethickness2mm",
    "flangedbushing_id8mmjunk_od12mm_flangeod18mm_l15mm_flangethickness2mm",
    "flangedbushing_id8mm_od12mm_flangeod18mm_l1e2_flangethickness2mm",
    `${base}_style(plainclosed`,
    `${base}__style(plainclosed)`,
  ])
    expect(() => mp.string(source).json()).toThrow()
})

test("flanged bushing direct schema compatibility and complete finite lengths", () => {
  const base = {
    innerDiameter: 8,
    outerDiameter: 12,
    flangeDiameter: 18,
    length: 15,
    flangeThickness: 2,
  }
  for (const extra of [
    { innerDiameter: 0 },
    { innerDiameter: -1 },
    { outerDiameter: 8 },
    { outerDiameter: 7 },
    { flangeDiameter: 12 },
    { flangeDiameter: 10 },
    { flangeThickness: 15 },
    { flangeThickness: 16 },
    { flangeThickness: 0 },
    { length: 0 },
    { length: Infinity },
    { length: NaN },
    { length: "15mmjunk" },
    { length: "1e2" },
    { innerDiameter: "nonsense" },
    { flangeThickness: "2mmjunk" },
    { style: "split" },
    { extra: true },
  ]) {
    const props = { ...base, ...extra }
    expect(() => flangedBushingModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      flangedBushingModelDefinitionSchema.parse({
        fn: "flangedbushing",
        ...props,
      }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "flangedbushing", ...props }),
    ).toThrow()
  }
  expect(() =>
    getFlangedBushingDimensions({ ...base, flangeThickness: 15 }),
  ).toThrow()
})
