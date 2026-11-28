import { expect, test } from "bun:test"
import {
  ballSplineShaftModelPropsSchema,
  getBallSplineShaftDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ballsplineshaft resolves 20x250mm 6-groove ball-spline shaft", () => {
  const parsed = parseModelString(
    "ballsplineshaft_od20mm_l250mm_grooves6_roundballrace_racecount6_endchamfer1mm",
  )
  expect(parsed).toEqual({
    fn: "ballsplineshaft",
    outerDiameter: 20,
    length: 250,
    grooves: 6,
    roundBallRace: true,
    raceCount: 6,
    endChamfer: 1,
  })
  expect(getBallSplineShaftDimensions().angularSpacingDeg).toBe(60)
})

test("ballsplineshaft supports 3-groove 16mm shaft and schema roundtrip", () => {
  const parsed = parseModelString("ballsplineshaft_od16mm_grooves3_racecount3")
  expect(parsed.fn).toBe("ballsplineshaft")
  if (parsed.fn !== "ballsplineshaft") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ballSplineShaftModelPropsSchema.parse({}).roundBallRace).toBe(true)
})

test("ballsplineshaft rejects legacy selectors and mismatched race counts", () => {
  expect(() =>
    parseModelString("ballsplineshaft_profile(roundballrace)"),
  ).toThrow()
  expect(() =>
    parseModelString("ballsplineshaft_grooves6_racecount4"),
  ).toThrow()
})
