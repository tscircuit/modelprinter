import { expect, test } from "bun:test"
import {
  finishingWasherModelPropsSchema,
  getFinishingWasherDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("finishingwasher resolves M4 4.5x12x3mm 90-deg cup washer", () => {
  const parsed = parseModelString(
    "finishingwasher_custom_id4.5mm_od12mm_h3mm_strip0.8mm_cup_seatangle90deg_rimw1mm",
  )
  expect(parsed).toEqual({
    fn: "finishingwasher",
    custom: true,
    innerDiameter: 4.5,
    outerDiameter: 12,
    height: 3,
    stripThickness: 0.8,
    cup: true,
    seatAngleDeg: 90,
    rimWidth: 1,
  })

  const dims = getFinishingWasherDimensions()
  expect(dims.cupInnerSpan).toBe(10)
  expect(dims.topZ).toBe(3)
})

test("finishingwasher supports 82-deg imperial seat angle and roundtrips", () => {
  const parsed = parseModelString(
    "finishingwasher_id5.3mm_od14mm_seatangle82deg",
  )
  expect(parsed.fn).toBe("finishingwasher")
  if (parsed.fn !== "finishingwasher") return
  expect(parsed.seatAngleDeg).toBe(82)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(finishingWasherModelPropsSchema.parse({}).cup).toBe(true)
})

test("finishingwasher rejects parenthesized selectors and overflowing rims", () => {
  expect(() =>
    parseModelString("finishingwasher_spec(custom)_form(cup)_seatangle(90deg)"),
  ).toThrow()
  expect(() =>
    parseModelString("finishingwasher_id8mm_od12mm_rimw2.5mm"),
  ).toThrow()
})
