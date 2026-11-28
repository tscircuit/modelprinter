import { expect, test } from "bun:test"
import {
  getPneumaticFilterDimensions,
  modelDefinitionSchema,
  parseModelString,
  pneumaticFilterModelPropsSchema,
} from "../src"

test("pneumaticfilter resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "pneumaticfilter_npt0.25in_bowlod35mm_h100mm_headw45mm_headd40mm_holep30mm_holes2_holed5mm_bottomdrain",
  )
  expect(parsed).toEqual({
    fn: "pneumaticfilter",
    portNominal: 6.35,
    bowlOuterDiameter: 35,
    height: 100,
    headWidth: 45,
    headDepth: 40,
    holePitch: 30,
    holes: 2,
    holeDiameter: 5,
    bottomDrain: true,
  })
  expect(getPneumaticFilterDimensions().headOverBowlMargin).toBeCloseTo(5, 6)
})

test("pneumaticfilter supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "pneumaticfilter_bowlod42mm_h120mm_headw55mm_headd50mm",
  )
  expect(parsed.fn).toBe("pneumaticfilter")
  if (parsed.fn !== "pneumaticfilter") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pneumaticFilterModelPropsSchema.parse({})).toBeDefined()
})

test("pneumaticfilter rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("pneumaticfilter_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("pneumaticfilter_bowlod50mm_headw45mm"),
  ).toThrow()
})
