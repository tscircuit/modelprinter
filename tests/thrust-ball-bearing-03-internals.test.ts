import { expect, test } from "bun:test"
import { getThrustBallBearingDimensions } from "../src"

test("nominal thrust internals have separated balls, pockets and positive washer walls", () => {
  for (const input of [
    {},
    { innerDiameter: 1, outerDiameter: 2, height: 30 },
    { innerDiameter: 25, outerDiameter: 80, height: 0.2 },
    { innerDiameter: 12.7, outerDiameter: 50.8, height: 6.35 },
  ]) {
    const d = getThrustBallBearingDimensions(input)
    expect(d.ballCenterZ - d.grooveRadius).toBeGreaterThan(0)
    expect(d.cageInnerRadius).toBeGreaterThan(d.innerRadius)
    expect(d.cageOuterRadius).toBeLessThan(d.outerRadius)
    expect(d.pitchRadius - d.grooveHalfWidth).toBeGreaterThan(d.innerRadius)
    expect(d.pitchRadius + d.grooveHalfWidth).toBeLessThan(d.outerRadius)
    const adjacentDistance = 2 * d.pitchRadius * Math.sin(Math.PI / d.ballCount)
    expect(adjacentDistance).toBeGreaterThan(2 * d.cagePocketRadius)
    expect(d.ballCenterZ - d.cageThickness / 2).toBeGreaterThan(
      d.washerThickness,
    )
    expect(d.grooveRadius).toBeGreaterThan(d.ballRadius)
    expect(d.ballCount).toBeGreaterThanOrEqual(3)
    expect(d.ballCount).toBeLessThanOrEqual(24)
  }
})
