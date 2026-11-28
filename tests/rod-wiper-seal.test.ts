import { expect, test } from "bun:test"
import {
  getRodWiperSealDimensions,
  modelDefinitionSchema,
  parseModelString,
  rodWiperSealModelPropsSchema,
} from "../src"

test("rodwiperseal resolves 12x20x5mm inward-lip cylinder wiper", () => {
  const parsed = parseModelString(
    "rodwiperseal_rodod12mm_od20mm_h5mm_singlelip_inwardlip_bodyid13mm_lipt1mm_baset3mm",
  )
  expect(parsed).toEqual({
    fn: "rodwiperseal",
    rodOuterDiameter: 12,
    outerDiameter: 20,
    height: 5,
    singleLip: true,
    inwardLip: true,
    bodyInnerDiameter: 13,
    lipThickness: 1,
    baseThickness: 3,
  })
  expect(getRodWiperSealDimensions().scraperLipHeight).toBe(2)
})

test("rodwiperseal supports 20x28x6mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "rodwiperseal_rodod20mm_od28mm_h6mm_bodyid21.5mm",
  )
  expect(parsed.fn).toBe("rodwiperseal")
  if (parsed.fn !== "rodwiperseal") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(rodWiperSealModelPropsSchema.parse({}).singleLip).toBe(true)
})

test("rodwiperseal rejects legacy selectors and inverted lip diameters", () => {
  expect(() =>
    parseModelString("rodwiperseal_profile(singlelip)_lip(inward)"),
  ).toThrow()
  expect(() => parseModelString("rodwiperseal_rodod14mm_bodyid13mm")).toThrow()
})
