import { expect, test } from "bun:test"
import {
  linearBallBearingDefaults,
  linearBallBearingCommonSizes,
  linearBallBearingModelPropsSchema,
  linearBallBearingModelDefinitionSchema,
  getLinearBallBearingDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("generic linear bearing dimensions, unit normalization and nominal running clearances", () => {
  expect(
    mp.string("linearballbearing_bore8mm_od15mm_l24mm_seals(both)").json(),
  ).toEqual({ fn: "linearballbearing", ...linearBallBearingDefaults })
  expect(mp.string("linearballbearing").json()).toEqual({
    fn: "linearballbearing",
    ...linearBallBearingDefaults,
  })
  for (const [bore, envelope] of Object.entries(linearBallBearingCommonSizes)) {
    const d = getLinearBallBearingDimensions({ boreDiameter: Number(bore) })
    expect(d.outerDiameter).toBe(envelope.outerDiameter)
    expect(d.length).toBe(envelope.length)
    expect(d.loadedRadius - d.ballRadius).toBeCloseTo(d.boreRadius)
    expect(d.returnRadius + d.grooveRadius).toBeLessThan(d.outerRadius)
    expect(d.returnRadius - d.ballRadius).toBeGreaterThan(d.boreRadius)
    expect(d.returnRadius).toBeLessThan(d.straightSleeveInnerRadius)
    expect(d.returnCageOuterRadius).toBeLessThan(d.returnRadius - d.ballRadius)
    expect(d.returnCageOuterRadius).toBeGreaterThan(d.cageInnerRadius)
    expect(d.endChamberRadius).toBeLessThan(d.outerRadius)
    expect(d.cageInnerRadius).toBeGreaterThan(d.boreRadius)
    expect(d.cageOuterRadius).toBeLessThan(d.straightSleeveInnerRadius)
    expect(d.rowEnd - d.rowStart).toBeGreaterThan(4 * d.ballRadius)
    expect(d.rowStart - d.turnRadius - d.ballRadius).toBeCloseTo(
      d.sealThickness,
    )
    const definition = mp.string(`linearballbearing_bore${bore}`).json()
    if (definition.fn !== "linearballbearing")
      throw new Error("Expected linear bearing")
    expect(linearBallBearingModelDefinitionSchema.parse(definition)).toEqual(
      definition,
    )
    expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  }
  expect(
    mp
      .string(
        "LINEARBALLBEARING_BORE0.8CM_OUTERDIAMETER1.5CM_LENGTH2.4CM_SEALS(BOTH)",
      )
      .json(),
  ).toEqual({ fn: "linearballbearing", ...linearBallBearingDefaults })
  expect(
    linearBallBearingModelPropsSchema.parse({
      boreDiameter: "0.25in",
      outerDiameter: "0.5in",
      length: "1in",
    }),
  ).toEqual({
    boreDiameter: 6.35,
    outerDiameter: 12.7,
    length: 25.4,
    seals: "both",
  })
  expect(modelprinter.getModelNames()).toContain("linearballbearing")
})
