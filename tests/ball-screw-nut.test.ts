import { expect, test } from "bun:test"
import {
  ballScrewNutModelPropsSchema,
  getBallScrewNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ballscrewnut resolves SFU1605 16x28x40mm flanged recirculating nut", () => {
  const parsed = parseModelString(
    "ballscrewnut_bore16mm_pitch5mm_od28mm_l40mm_flangeod48mm_gothicarch_righthand_externaltube_face4hole_pcd38mm_holed5mm",
  )
  expect(parsed).toEqual({
    fn: "ballscrewnut",
    boreDiameter: 16,
    pitch: 5,
    outerDiameter: 28,
    length: 40,
    flangeOuterDiameter: 48,
    gothicArch: true,
    handedness: "right",
    externalTube: true,
    face4Hole: true,
    pcd: 38,
    holeDiameter: 5,
  })

  const dims = getBallScrewNutDimensions()
  expect(dims.radialWallThickness).toBe(6)
  expect(dims.topZ).toBe(40)
})

test("ballscrewnut supports 20mm left-hand variant and roundtrips", () => {
  const parsed = parseModelString(
    "ballscrewnut_bore20mm_od36mm_flangeod58mm_pcd47mm_lefthand",
  )
  expect(parsed.fn).toBe("ballscrewnut")
  if (parsed.fn !== "ballscrewnut") return
  expect(parsed.handedness).toBe("left")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ballScrewNutModelPropsSchema.parse({}).externalTube).toBe(true)
})

test("ballscrewnut rejects legacy selectors and colliding bolt circles", () => {
  expect(() =>
    parseModelString("ballscrewnut_profile(gothicarch)_return(externaltube)"),
  ).toThrow()
  expect(() =>
    parseModelString("ballscrewnut_od28mm_pcd30mm_holed5mm"),
  ).toThrow()
})
