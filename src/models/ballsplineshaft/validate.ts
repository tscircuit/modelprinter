import type { z } from "zod"

export interface BallSplineShaftShape {
  outerDiameter: number
  length: number
  grooves: number
  roundBallRace: true
  raceCount: number
  endChamfer: number
}

export function validateBallSplineShaftProps(
  p: BallSplineShaftShape,
  ctx: z.RefinementCtx,
): void {
  if (p.raceCount !== p.grooves) {
    ctx.addIssue({
      code: "custom",
      path: ["raceCount"],
      message: "raceCount must match longitudinal groove count",
    })
  }
  if (2 * p.endChamfer >= Math.min(p.outerDiameter / 2, p.length / 4)) {
    ctx.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfer exceeds shaft radius or length margin",
    })
  }
}
