import { expect, test } from "bun:test"
import {
  getHydraulicSpinOnFilterDimensions,
  hydraulicSpinOnFilterModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("hydraulicspinonfilter resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "hydraulicspinonfilter_canod80mm_h140mm_npt0.5in_headw100mm_headd40mm_cand20mm_canpitch1.5mm_holes2_holep50mm_holed6mm_headbolt",
  )
  expect(parsed).toEqual({
    fn: "hydraulicspinonfilter",
    canOuterDiameter: 80,
    height: 140,
    portNominal: 12.7,
    headWidth: 100,
    headDepth: 40,
    canThreadDiameter: 20,
    canThreadPitch: 1.5,
    holes: 2,
    holePitch: 50,
    holeDiameter: 6,
    headBolt: true,
  })
  expect(
    getHydraulicSpinOnFilterDimensions().canisterAnnularMargin,
  ).toBeCloseTo(30, 6)
})

test("hydraulicspinonfilter supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "hydraulicspinonfilter_canod95mm_h175mm_headw115mm_holep65mm",
  )
  expect(parsed.fn).toBe("hydraulicspinonfilter")
  if (parsed.fn !== "hydraulicspinonfilter") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(hydraulicSpinOnFilterModelPropsSchema.parse({})).toBeDefined()
})

test("hydraulicspinonfilter rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("hydraulicspinonfilter_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("hydraulicspinonfilter_canod110mm_headw100mm"),
  ).toThrow()
})
