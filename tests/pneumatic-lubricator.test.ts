import { expect, test } from "bun:test"
import {
  getPneumaticLubricatorDimensions,
  modelDefinitionSchema,
  parseModelString,
  pneumaticLubricatorModelPropsSchema,
} from "../src"

test("pneumaticlubricator resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "pneumaticlubricator_npt0.25in_bowlod35mm_h110mm_headw45mm_headd40mm_domeod15mm_domeh15mm_holep30mm_holes2_holed5mm_sightdome",
  )
  expect(parsed).toEqual({
    fn: "pneumaticlubricator",
    portNominal: 6.35,
    bowlOuterDiameter: 35,
    height: 110,
    headWidth: 45,
    headDepth: 40,
    domeOuterDiameter: 15,
    domeHeight: 15,
    holePitch: 30,
    holes: 2,
    holeDiameter: 5,
    sightDome: true,
  })
  expect(getPneumaticLubricatorDimensions().totalStackHeight).toBeCloseTo(
    125,
    6,
  )
})

test("pneumaticlubricator supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "pneumaticlubricator_bowlod42mm_h125mm_headw55mm_headd50mm",
  )
  expect(parsed.fn).toBe("pneumaticlubricator")
  if (parsed.fn !== "pneumaticlubricator") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pneumaticLubricatorModelPropsSchema.parse({})).toBeDefined()
})

test("pneumaticlubricator rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("pneumaticlubricator_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("pneumaticlubricator_domeod46mm_headw45mm"),
  ).toThrow()
})
