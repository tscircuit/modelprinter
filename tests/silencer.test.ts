import { expect, test } from "bun:test"
import {
  getSilencerDimensions,
  modelDefinitionSchema,
  parseModelString,
  silencerModelPropsSchema,
} from "../src"

test("silencer resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "silencer_npt0.125in_od15mm_l30mm_hexaf12mm_porouscylinder_closedtip",
  )
  expect(parsed).toEqual({
    fn: "silencer",
    portNominal: 3.175,
    outerDiameter: 15,
    length: 30,
    hexAcrossFlats: 12,
    porousCylinder: true,
    closedTip: true,
  })
  expect(getSilencerDimensions().hexCircumscribedDiameter).toBeCloseTo(
    13.856406460551018,
    6,
  )
})

test("silencer supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString("silencer_od20mm_l42mm_hexaf17mm")
  expect(parsed.fn).toBe("silencer")
  if (parsed.fn !== "silencer") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(silencerModelPropsSchema.parse({})).toBeDefined()
})

test("silencer rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("silencer_spec(legacy)")).toThrow()
  expect(() => parseModelString("silencer_npt0.5in_hexaf10mm")).toThrow()
})
