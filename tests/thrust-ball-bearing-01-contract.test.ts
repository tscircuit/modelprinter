import { expect, test } from "bun:test"
import {
  getThrustBallBearingDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  thrustBallBearingDefaults,
  thrustBallBearingModelDefinitionSchema,
  thrustBallBearingModelPropsSchema,
} from "../src"

test("thrust ball bearing preserves the roadmap API and registered defaults", () => {
  const source = "thrustballbearing_id10mm_od24mm_h9mm"
  const expected = {
    fn: "thrustballbearing",
    innerDiameter: 10,
    outerDiameter: 24,
    height: 9,
  } as const
  expect(thrustBallBearingDefaults).toEqual({
    innerDiameter: 10,
    outerDiameter: 24,
    height: 9,
  })
  expect(mp.string(source).params()).toMatchObject({
    id: "10mm",
    od: "24mm",
    h: "9mm",
  })
  expect(mp.string(source).json()).toEqual(expected)
  expect(parseModelString("thrustballbearing")).toEqual(expected)
  expect(thrustBallBearingModelPropsSchema.parse({})).toEqual(
    thrustBallBearingDefaults,
  )
  expect(
    thrustBallBearingModelDefinitionSchema.parse({ fn: "thrustballbearing" }),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("thrustballbearing")
  expect(
    parseModelString(
      " THRUSTBALLBEARING_INNERDIAMETER0.5in_OUTERDIAMETER2in_HEIGHT0.25in ",
    ),
  ).toEqual({
    fn: "thrustballbearing",
    innerDiameter: 12.7,
    outerDiameter: 50.8,
    height: 6.35,
  })
  expect(parseModelString("thrustballbearing_id0.01m_od2.4cm_h9MM")).toEqual(
    expected,
  )
  const d = getThrustBallBearingDimensions()
  expect(d.ballCenterZ).toBe(4.5)
  expect(d.ballRadius).toBeCloseTo(1.96, 8)
  expect(d.pitchRadius).toBe(8.5)
  expect(d.ballCount).toBe(9)
  expect(d.washerThickness).toBeCloseTo(2.8928, 8)
})
