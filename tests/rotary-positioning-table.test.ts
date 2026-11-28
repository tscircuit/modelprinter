import { expect, test } from "bun:test"
import {
  getRotaryPositioningTableDimensions,
  modelDefinitionSchema,
  parseModelString,
  rotaryPositioningTableModelPropsSchema,
} from "../src"

test("rotarypositioningtable resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "rotarypositioningtable_od100mm_h40mm_bore20mm_boltpcd60mm_basepcd80mm_holed5mm_tabled5mm_baseholes4",
  )
  expect(parsed).toEqual({
    fn: "rotarypositioningtable",
    outerDiameter: 100,
    height: 40,
    boreDiameter: 20,
    tableBoltPcd: 60,
    baseBoltPcd: 80,
    holeDiameter: 5,
    tableThreadDiameter: 5,
    baseHoles: 4,
  })
  expect(getRotaryPositioningTableDimensions().platterRadialWeb).toBeCloseTo(
    40,
    6,
  )
})

test("rotarypositioningtable supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "rotarypositioningtable_od125mm_h45mm_bore25mm_boltpcd75mm_basepcd100mm",
  )
  expect(parsed.fn).toBe("rotarypositioningtable")
  if (parsed.fn !== "rotarypositioningtable") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(rotaryPositioningTableModelPropsSchema.parse({})).toBeDefined()
})

test("rotarypositioningtable rejects parenthesized selectors and invalid geometry", () => {
  expect(() =>
    parseModelString("rotarypositioningtable_spec(legacy)"),
  ).toThrow()
  expect(() =>
    parseModelString("rotarypositioningtable_od100mm_bore65mm_boltpcd60mm"),
  ).toThrow()
})
