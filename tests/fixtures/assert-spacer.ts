import { expect } from "bun:test"
import {
  modelDefinitionSchema,
  modelprinter,
  mp,
  spacerModelDefinitionSchema,
  spacerModelPropsSchema,
  type SpacerModelDefinition,
  type SpacerModelPropsInput,
} from "../../src"

export function assertSpacers() {
  const source = "spacer_id3.2mm_od6mm_l10mm"
  const expected: SpacerModelDefinition = {
    fn: "spacer",
    innerDiameter: 3.2,
    outerDiameter: 6,
    length: 10,
  }
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("spacer").json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("spacer")
  expect(mp.string(source).params()).toMatchObject({
    fn: "spacer",
    id: "3.2mm",
    od: "6mm",
    l: "10mm",
  })

  const unitInput: SpacerModelPropsInput = {
    innerDiameter: "0.125in",
    outerDiameter: "0.25in",
    length: "2cm",
  }
  const normalized = spacerModelPropsSchema.parse(unitInput)
  expect(normalized.innerDiameter).toBeCloseTo(3.175)
  expect(normalized.outerDiameter).toBeCloseTo(6.35)
  expect(normalized.length).toBe(20)
  expect(
    mp
      .string("SPACER_INNERDIAMETER0.125in_OUTERDIAMETER0.25in_LENGTH2cm")
      .json(),
  ).toEqual({ fn: "spacer", ...normalized })
  expect(mp.string("spacer_l25mm").json()).toEqual({ ...expected, length: 25 })

  for (const source of [
    "spacer_id6mm_od6mm",
    "spacer_id7mm_od6mm",
    "spacer_id0",
    "spacer_od-6mm",
    "spacer_l0mm",
    "spacer_id",
    "spacer_od",
    "spacer_l",
    "spacer_typo2mm",
    "spacer_id3mm_id4mm",
    "spacer_id3mm_innerdiameter4mm",
    "spacer_od6mm_outerdiameter7mm",
    "spacer_l10mm_length20mm",
    "spacer3_id3mm",
    "spacer(3)_id3mm",
    "spacer__l10mm",
  ]) {
    expect(() => mp.string(source).json()).toThrow()
  }

  for (const property of ["innerDiameter", "outerDiameter", "length"]) {
    for (const invalid of [NaN, Infinity, -1, 0, "nonsense"]) {
      expect(() =>
        spacerModelPropsSchema.parse({ [property]: invalid }),
      ).toThrow()
    }
  }
  for (const schema of [spacerModelPropsSchema, spacerModelDefinitionSchema]) {
    const base = schema === spacerModelDefinitionSchema ? { fn: "spacer" } : {}
    expect(() =>
      schema.parse({ ...base, innerDiameter: 6, outerDiameter: 6 }),
    ).toThrow()
    expect(() =>
      schema.parse({ ...base, innerDiameter: "1in", outerDiameter: "2cm" }),
    ).toThrow()
    expect(() => schema.parse({ ...base, typo: true })).toThrow()
  }
}
