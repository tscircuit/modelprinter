import { expect, test } from "bun:test"
import {
  filterRegulatorModelPropsSchema,
  getFilterRegulatorDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("filterregulator resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "filterregulator_npt0.25in_w45mm_h160mm_depth40mm_knobod30mm_paneld30mm_panelpitch1.5mm_bottomdrain_panelnut",
  )
  expect(parsed).toEqual({
    fn: "filterregulator",
    portNominal: 6.35,
    width: 45,
    height: 160,
    depth: 40,
    knobOuterDiameter: 30,
    panelThreadDiameter: 30,
    panelThreadPitch: 1.5,
    bottomDrain: true,
    panelNut: true,
  })
  expect(getFilterRegulatorDimensions().knobSideClearance).toBeCloseTo(7.5, 6)
})

test("filterregulator supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "filterregulator_w55mm_h185mm_depth50mm_knobod36mm",
  )
  expect(parsed.fn).toBe("filterregulator")
  if (parsed.fn !== "filterregulator") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(filterRegulatorModelPropsSchema.parse({})).toBeDefined()
})

test("filterregulator rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("filterregulator_spec(legacy)")).toThrow()
  expect(() => parseModelString("filterregulator_w45mm_knobod50mm")).toThrow()
})
