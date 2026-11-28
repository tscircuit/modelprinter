import { expect, test } from "bun:test"
import {
  getJawCouplerSpiderDimensions,
  jawCouplerSpiderModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("jawcouplerspider resolves 30x10mm 6-lobe plum coupling spider", () => {
  const parsed = parseModelString(
    "jawcouplerspider_od30mm_id10mm_w10mm_lobes6_hubclearance10mm_curvedlobe",
  )
  expect(parsed).toEqual({
    fn: "jawcouplerspider",
    outerDiameter: 30,
    innerDiameter: 10,
    width: 10,
    lobes: 6,
    hubClearance: 10,
    curvedLobe: true,
  })
  expect(getJawCouplerSpiderDimensions().lobeRadialSpan).toBe(10)
})

test("jawcouplerspider supports 40mm 8-lobe spider and roundtrips", () => {
  const parsed = parseModelString("jawcouplerspider_od40mm_w12mm_lobes8")
  expect(parsed.fn).toBe("jawcouplerspider")
  if (parsed.fn !== "jawcouplerspider") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(jawCouplerSpiderModelPropsSchema.parse({}).lobes).toBe(6)
})

test("jawcouplerspider rejects odd lobe counts and legacy selectors", () => {
  expect(() =>
    parseModelString("jawcouplerspider_profile(curvedlobe)"),
  ).toThrow()
  expect(() => parseModelString("jawcouplerspider_lobes5")).toThrow()
})
