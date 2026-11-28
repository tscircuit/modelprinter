import { expect, test } from "bun:test"
import {
  ballSplineNutModelPropsSchema,
  getBallSplineNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ballsplinenut resolves 20x40x60mm 6-race flanged spline nut", () => {
  const parsed = parseModelString(
    "ballsplinenut_bore20mm_od40mm_l60mm_flangeod60mm_racecount6_face4hole_pcd48mm_holed6mm_internalreturn",
  )
  expect(parsed).toEqual({
    fn: "ballsplinenut",
    boreDiameter: 20,
    outerDiameter: 40,
    length: 60,
    flangeOuterDiameter: 60,
    raceCount: 6,
    face4Hole: true,
    pcd: 48,
    holeDiameter: 6,
    internalReturn: true,
  })
  expect(getBallSplineNutDimensions().radialWallThickness).toBe(10)
})

test("ballsplinenut supports 16mm 3-race variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "ballsplinenut_bore16mm_od32mm_flangeod50mm_pcd40mm_holed5mm_racecount3",
  )
  expect(parsed.fn).toBe("ballsplinenut")
  if (parsed.fn !== "ballsplinenut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ballSplineNutModelPropsSchema.parse({}).internalReturn).toBe(true)
})

test("ballsplinenut rejects legacy selectors and colliding bolt circles", () => {
  expect(() =>
    parseModelString("ballsplinenut_mount(face4hole)_return(internal)"),
  ).toThrow()
  expect(() =>
    parseModelString("ballsplinenut_od40mm_pcd42mm_holed6mm"),
  ).toThrow()
})
