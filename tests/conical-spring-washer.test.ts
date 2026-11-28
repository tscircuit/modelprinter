import { expect, test } from "bun:test"
import {
  conicalSpringWasherModelPropsSchema,
  getConicalSpringWasherDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("conicalspringwasher resolves M6 14x6.2x1mm Belleville disc spring", () => {
  const parsed = parseModelString(
    "conicalspringwasher_id6.2mm_od14mm_strip1mm_freeh2mm_conical_freestate",
  )
  expect(parsed).toEqual({
    fn: "conicalspringwasher",
    innerDiameter: 6.2,
    outerDiameter: 14,
    stripThickness: 1,
    freeHeight: 2,
    conical: true,
    freeState: true,
  })
  expect(getConicalSpringWasherDimensions().dishStroke).toBe(1)
})

test("conicalspringwasher supports M10 20mm Belleville disc and roundtrips", () => {
  const parsed = parseModelString(
    "conicalspringwasher_id10.2mm_od20mm_strip1.25mm_freeh2.4mm",
  )
  expect(parsed.fn).toBe("conicalspringwasher")
  if (parsed.fn !== "conicalspringwasher") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(conicalSpringWasherModelPropsSchema.parse({}).freeHeight).toBe(2)
})

test("conicalspringwasher rejects flat free heights and legacy selectors", () => {
  expect(() => parseModelString("conicalspringwasher_form(conical)")).toThrow()
  expect(() =>
    parseModelString("conicalspringwasher_strip2mm_freeh2mm"),
  ).toThrow()
})
