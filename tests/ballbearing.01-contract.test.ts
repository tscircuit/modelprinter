import { expect, test } from "bun:test"
import {
  ballBearingCodeSchema,
  ballBearingDefaults,
  ballBearingStandardSizes,
  ballBearingModelPropsSchema,
  ballBearingModelDefinitionSchema,
  getBallBearingDimensions,
  mp,
  modelDefinitionSchema,
  modelprinter,
  parseModelString,
} from "../src"

test("ball bearing preserves custom envelopes and resolves standard size/closure contracts", () => {
  expect(ballBearingDefaults).toEqual({
    innerDiameter: 8,
    outerDiameter: 22,
    width: 7,
  })
  const legacy = {
    fn: "ballbearing",
    ...ballBearingDefaults,
    closure: "open",
  } as const
  for (const source of [
    "ballbearing",
    "ballbearing_id8mm_od22mm_w7mm",
    "BALLBEARING_INNERDIAMETER0.8CM_OUTERDIAMETER2.2CM_WIDTH7MM_CLOSURE(OPEN)",
  ]) {
    expect(mp.string(source).json()).toEqual(legacy)
    expect(parseModelString(source)).toEqual(legacy)
  }
  expect(mp.string("ballbearing_id6mm_od20mm_w6mm").json()).toEqual({
    fn: "ballbearing",
    innerDiameter: 6,
    outerDiameter: 20,
    width: 6,
    closure: "open",
  } as const)
  for (const [code, envelope] of Object.entries(ballBearingStandardSizes))
    for (const closure of ["open", "shielded", "sealed"] as const) {
      const parsed = mp
        .string(`ballbearing_code${code}_closure(${closure})`)
        .json()
      if (parsed.fn !== "ballbearing") throw new Error("Expected ball bearing")
      expect(parsed).toEqual({
        fn: "ballbearing",
        code: ballBearingCodeSchema.parse(code),
        ...envelope,
        closure,
      })
      expect(ballBearingModelDefinitionSchema.parse(parsed)).toEqual(parsed)
      expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
      const d = getBallBearingDimensions(envelope)
      expect(d.boreRadius).toBeLessThan(d.innerRaceOuterRadius)
      expect(d.innerRaceOuterRadius).toBeLessThan(d.outerRaceInnerRadius)
      expect(d.outerRaceInnerRadius).toBeLessThan(d.outerRadius)
      expect(d.ballRadius * 2).toBeLessThan(d.width)
      expect(d.pitchRadius - d.ballRadius).toBeGreaterThan(d.boreRadius)
      expect(d.pitchRadius + d.ballRadius).toBeLessThan(d.outerRadius)
      expect(
        2 * d.pitchRadius * Math.sin(Math.PI / d.ballCount),
      ).toBeGreaterThan(2 * d.ballRadius)
      expect(d.cageSeparatorHalfAngle).toBeGreaterThan(0)
    }
  expect(
    ballBearingModelPropsSchema.parse({
      innerDiameter: "0.25in",
      outerDiameter: "0.5in",
      width: "100mil",
    }),
  ).toEqual({
    innerDiameter: 6.35,
    outerDiameter: 12.7,
    width: 2.54,
    closure: "open",
  })
  expect(
    mp.string("ballbearing_code608_id0.8cm_od2.2cm_w0.7cm").json(),
  ).toEqual({ ...legacy, code: "608" })
  expect(modelprinter.getModelNames()).toContain("ballbearing")
})
