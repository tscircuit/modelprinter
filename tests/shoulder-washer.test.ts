import { expect, test } from "bun:test"
import {
  getShoulderWasherDimensions,
  modelDefinitionSchema,
  parseModelString,
  shoulderWasherModelPropsSchema,
} from "../src"

test("shoulderwasher resolves M3 3.2x8mm top-hat insulating washer", () => {
  const parsed = parseModelString(
    "shoulderwasher_custom_id3.2mm_od8mm_flangeh1mm_bossod5mm_bossl3mm_round",
  )
  expect(parsed).toEqual({
    fn: "shoulderwasher",
    custom: true,
    innerDiameter: 3.2,
    outerDiameter: 8,
    flangeHeight: 1,
    bossOuterDiameter: 5,
    bossLength: 3,
    round: true,
  })

  const dims = getShoulderWasherDimensions()
  expect(dims.overallHeight).toBe(4)
  expect(dims.bossWallThickness).toBeCloseTo(0.9)
})

test("shoulderwasher supports M4 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "shoulderwasher_id4.3mm_bossod6mm_od10mm_bossl4mm",
  )
  expect(parsed.fn).toBe("shoulderwasher")
  if (parsed.fn !== "shoulderwasher") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(shoulderWasherModelPropsSchema.parse({}).round).toBe(true)
})

test("shoulderwasher rejects parenthesized selectors and inverted diameters", () => {
  expect(() =>
    parseModelString("shoulderwasher_spec(custom)_form(round)"),
  ).toThrow()
  expect(() =>
    parseModelString("shoulderwasher_id5mm_bossod5mm_od8mm"),
  ).toThrow()
})
