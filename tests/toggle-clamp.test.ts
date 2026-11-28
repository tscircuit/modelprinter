import { expect, test } from "bun:test"
import {
  getToggleClampDimensions,
  modelDefinitionSchema,
  parseModelString,
  toggleClampModelPropsSchema,
} from "../src"

test("toggleclamp resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "toggleclamp_basew30mm_basel50mm_baseh3mm_holes4_hole5mm_px20mm_py40mm_arml60mm_armw10mm_armh4mm_pivoth25mm_handlel70mm_padod15mm_vertical_closed",
  )
  expect(parsed).toEqual({
    fn: "toggleclamp",
    baseWidth: 30,
    baseLength: 50,
    baseThickness: 3,
    holes: 4,
    holeDiameter: 5,
    pitchX: 20,
    pitchY: 40,
    armLength: 60,
    armWidth: 10,
    armHeight: 4,
    pivotHeight: 25,
    handleLength: 70,
    padOuterDiameter: 15,
    vertical: true,
    closed: true,
  })
  expect(getToggleClampDimensions().closedOverallHeight).toBeCloseTo(95, 6)
})

test("toggleclamp supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "toggleclamp_basew40mm_basel60mm_px26mm_py46mm_arml75mm",
  )
  expect(parsed.fn).toBe("toggleclamp")
  if (parsed.fn !== "toggleclamp") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(toggleClampModelPropsSchema.parse({})).toBeDefined()
})

test("toggleclamp rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("toggleclamp_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("toggleclamp_basew30mm_px28mm_hole5mm"),
  ).toThrow()
})
