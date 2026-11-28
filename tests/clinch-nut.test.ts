import { expect, test } from "bun:test"
import {
  clinchNutModelPropsSchema,
  getClinchNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("clinchnut resolves M4 8mm-flange 12-serration press-in nut", () => {
  const parsed = parseModelString(
    "clinchnut_m4_od7mm_h3mm_neckd5mm_neckh1mm_flangeod8mm_flangeh1mm_serrations12_serrationdepth0.3mm",
  )
  expect(parsed).toEqual({
    fn: "clinchnut",
    threadDiameter: 4,
    outerDiameter: 7,
    height: 3,
    neckDiameter: 5,
    neckHeight: 1,
    flangeOuterDiameter: 8,
    flangeHeight: 1,
    serrations: 12,
    serrationDepth: 0.3,
  })
  expect(getClinchNutDimensions().barrelHeight).toBe(1)
})

test("clinchnut supports M5 clinch nut variant and roundtrips", () => {
  const parsed = parseModelString(
    "clinchnut_m5_neckd6.4mm_od8mm_flangeod9.5mm_h4mm",
  )
  expect(parsed.fn).toBe("clinchnut")
  if (parsed.fn !== "clinchnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(clinchNutModelPropsSchema.parse({}).serrations).toBe(12)
})

test("clinchnut rejects inverted step diameters and legacy selectors", () => {
  expect(() => parseModelString("clinchnut_spec(custom)")).toThrow()
  expect(() => parseModelString("clinchnut_od8mm_flangeod8mm")).toThrow()
})
